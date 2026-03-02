import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import type { Context } from '~/server/trpc/context'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure

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