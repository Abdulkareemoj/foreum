import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import type { Context } from '~/server/trpc/context'
import { createLogger } from '~/server/lib/logger'
import { rateLimiter, getIdentifier } from '~/server/lib/rate-limiter'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router
const baseProcedure = t.procedure

// Logging middleware - logs path, duration, and errors
const logMiddleware = t.middleware(async ({ path, next, type }) => {
  const logger = createLogger(`trpc.${path}`)
  const start = Date.now()
  try {
    const result = await next()
    const duration = Date.now() - start
    logger.debug({ type, durationMs: duration }, 'OK')
    return result
  } catch (error) {
    const duration = Date.now() - start
    logger.error({ err: error, type, durationMs: duration }, 'FAILED')
    throw error
  }
})

// Rate limit middleware — runs before auth to block early
const rateLimitMiddleware = t.middleware(async ({ ctx, next }) => {
  const identifier = getIdentifier(ctx)

  let tier: string
  if (ctx.user?.role === 'admin' || ctx.user?.role === 'superadmin') {
    tier = 'admin'
  } else if (ctx.user) {
    tier = 'protected'
  } else {
    tier = 'public'
  }

  const result = rateLimiter.check(tier, identifier)

  ctx.resHeaders?.set('x-ratelimit-remaining', String(result.remaining))
  ctx.resHeaders?.set('x-ratelimit-reset', String(Math.ceil(result.resetMs / 1000)))

  if (!result.allowed) {
    const retryAfter = Math.ceil(result.resetMs / 1000)
    ctx.resHeaders?.set('retry-after', String(retryAfter))
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Rate limit exceeded. Try again in ${retryAfter}s.`,
    })
  }

  return next()
})

export const publicProcedure = baseProcedure.use(logMiddleware).use(rateLimitMiddleware)

// Auth middleware
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user as NonNullable<typeof ctx.user>
    }
  })
})

export const protectedProcedure = publicProcedure.use(isAuthed)

// Admin middleware
const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user?.role || ctx.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required'
    })
  }
  return next()
})

export const adminProcedure = protectedProcedure.use(isAdmin)