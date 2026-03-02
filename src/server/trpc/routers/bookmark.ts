import { TRPCError } from '@trpc/server'
import { and, desc, eq, lt } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import { bookmark } from '~/server/db/schema/bookmark-schema'
import { protectedProcedure, router } from '~/server/trpc/init'

export const bookmarksRouter = router({
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { limit, cursor } = input

        const results = await db
          .select()
          .from(bookmark)
          .where(
            and(
              eq(bookmark.userId, ctx.user.id),
              cursor ? lt(bookmark.createdAt, cursor) : undefined
            )
          )
          .orderBy(desc(bookmark.createdAt))
          .limit(limit + 1)

        let nextCursor: Date | null = null
        if (results.length > limit) {
          const nextItem = results.pop()
          nextCursor = nextItem?.createdAt ?? null
        }

        return { items: results, nextCursor }
      } catch (error) {
        console.error('[bookmarks.getAll]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch bookmarks',
        })
      }
    }),

  add: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await db.insert(bookmark).values({
          userId: ctx.user.id,
          threadId: input.threadId,
        })
        return { success: true }
      } catch (error) {
        console.error('[bookmarks.add]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add bookmark',
        })
      }
    }),

  remove: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await db
          .delete(bookmark)
          .where(
            and(
              eq(bookmark.userId, ctx.user.id),
              eq(bookmark.threadId, input.threadId)
            )
          )
        return { success: true }
      } catch (error) {
        console.error('[bookmarks.remove]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to remove bookmark',
        })
      }
    }),
})