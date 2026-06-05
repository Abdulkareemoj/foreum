import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import type { Context } from '~/server/trpc/context'
import { createLogger } from '~/server/lib/logger'

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

export const publicProcedure = baseProcedure.use(logMiddleware)

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