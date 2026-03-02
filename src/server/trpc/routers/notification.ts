import { TRPCError } from '@trpc/server'
import { and, desc, eq, lt, sql } from 'drizzle-orm'
import { z } from 'zod'
import crypto from 'crypto'
import { db } from '~/server/db'
import { notification } from '~/server/db/schema/notification-schema'
import { protectedProcedure, publicProcedure, router } from '~/server/trpc/init'

export const notificationsRouter = router({
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { limit, cursor } = input

        const results = await db
          .select()
          .from(notification)
          .where(
            and(
              eq(notification.userId, ctx.user.id),
              cursor ? lt(notification.id, cursor) : undefined
            )
          )
          .orderBy(desc(notification.createdAt))
          .limit(limit + 1)

        let nextCursor: string | null = null
        if (results.length > limit) {
          const nextItem = results.pop()
          nextCursor = nextItem?.id ?? null
        }

        return { items: results, nextCursor }
      } catch (error) {
        console.error('[notifications.getAll]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch notifications',
        })
      }
    }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Make sure user owns this notification
        const [notif] = await db
          .select()
          .from(notification)
          .where(
            and(
              eq(notification.id, input.id),
              eq(notification.userId, ctx.user.id)
            )
          )

        if (!notif) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Notification not found' })
        }

        await db
          .update(notification)
          .set({ read: true })
          .where(eq(notification.id, input.id))

        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[notifications.markAsRead]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to mark as read',
        })
      }
    }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      await db
        .update(notification)
        .set({ read: true })
        .where(eq(notification.userId, ctx.user.id))

      return { success: true }
    } catch (error) {
      console.error('[notifications.markAllAsRead]', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to mark all as read',
      })
    }
  }),

  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        type: z.string(),
        title: z.string(),
        message: z.string(),
        link: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await db.insert(notification).values({
          id: crypto.randomUUID(),
          ...input,
        })

        return { success: true }
      } catch (error) {
        console.error('[notifications.create]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create notification',
        })
      }
    }),

  countUnread: protectedProcedure.query(async ({ ctx }) => {
    try {
      const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(notification)
        .where(
          and(
            eq(notification.userId, ctx.user.id),
            eq(notification.read, false)
          )
        )

      return { count: Number(result?.count || 0) }
    } catch (error) {
      console.error('[notifications.countUnread]', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to count unread',
      })
    }
  }),
})