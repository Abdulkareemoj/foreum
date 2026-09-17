import { TRPCError } from '@trpc/server'
import { and, count, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import { threadSubscription } from '~/server/db/schema/subscription-schema'
import { protectedProcedure, publicProcedure, router } from '~/server/trpc/init'

export const subscriptionRouter = router({
  /**
   * Check if the current user is subscribed to a thread.
   */
  status: publicProcedure
    .input(z.object({ threadId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user) return { subscribed: false, count: 0 }

      try {
        const [existing] = await db
          .select()
          .from(threadSubscription)
          .where(
            and(
              eq(threadSubscription.threadId, input.threadId),
              eq(threadSubscription.userId, ctx.user.id)
            )
          )
          .limit(1)

        const [{ total }] = await db
          .select({ total: count() })
          .from(threadSubscription)
          .where(eq(threadSubscription.threadId, input.threadId))

        return { subscribed: !!existing, count: total ?? 0 }
      } catch (error) {
        console.error('[subscription.status]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to check subscription status' })
      }
    }),

  /**
   * Toggle subscription on a thread (subscribe if not subscribed, unsubscribe if subscribed).
   */
  toggle: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const [existing] = await db
          .select({ id: threadSubscription.id })
          .from(threadSubscription)
          .where(
            and(
              eq(threadSubscription.threadId, input.threadId),
              eq(threadSubscription.userId, ctx.user.id)
            )
          )
          .limit(1)

        if (existing) {
          await db
            .delete(threadSubscription)
            .where(eq(threadSubscription.id, existing.id))

          return { subscribed: false }
        } else {
          await db
            .insert(threadSubscription)
            .values({
              id: crypto.randomUUID(),
              threadId: input.threadId,
              userId: ctx.user.id,
            })

          return { subscribed: true }
        }
      } catch (error) {
        console.error('[subscription.toggle]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to toggle subscription' })
      }
    }),

  /**
   * Get all threads the current user is subscribed to.
   */
  mySubscriptions: protectedProcedure.query(async ({ ctx }) => {
    try {
      return db
        .select({
          threadId: threadSubscription.threadId,
          createdAt: threadSubscription.createdAt,
        })
        .from(threadSubscription)
        .where(eq(threadSubscription.userId, ctx.user.id))
    } catch (error) {
      console.error('[subscription.mySubscriptions]', error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch subscriptions' })
    }
  }),

  /**
   * Get all subscriber user IDs for a thread (used by reply router to send notifications).
   */
  getSubscriberIds: publicProcedure
    .input(z.object({ threadId: z.string() }))
    .query(async ({ input }) => {
      try {
        const subs = await db
          .select({ userId: threadSubscription.userId })
          .from(threadSubscription)
          .where(eq(threadSubscription.threadId, input.threadId))

        return subs.map((s) => s.userId)
      } catch (error) {
        console.error('[subscription.getSubscriberIds]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch subscriber IDs' })
      }
    }),
})
