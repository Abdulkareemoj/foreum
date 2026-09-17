import { TRPCError } from '@trpc/server'
import { count, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import { user } from '~/server/db/schema/auth-schema'
import { reply, thread } from '~/server/db/schema/thread-schema'
import {
  getTrustLevelDefinitions,
  getTrustLevelProgress,
  loadTrustLevelConfig,
  type TrustLevel,
} from '~/server/lib/trust-levels'
import { protectedProcedure, publicProcedure, router } from '~/server/trpc/init'

export const trustLevelRouter = router({
  /**
   * Get trust level info for a user (public profile display).
   */
  byUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        const config = await loadTrustLevelConfig()

        const [result] = await db
          .select({
            trustLevel: user.trustLevel,
            createdAt: user.createdAt,
          })
          .from(user)
          .where(eq(user.id, input.userId))

        if (!result) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
        }

        const level = (result.trustLevel ?? 0) as TrustLevel
        const createdAt = result.createdAt instanceof Date
          ? result.createdAt
          : new Date(result.createdAt as string)

        const [threadCount] = await db
          .select({ count: count() })
          .from(thread)
          .where(eq(thread.authorId, input.userId))

        const [replyCount] = await db
          .select({ count: count() })
          .from(reply)
          .where(eq(reply.authorId, input.userId))

        const totalPosts = (threadCount?.count ?? 0) + (replyCount?.count ?? 0)
        const progress = getTrustLevelProgress(level, createdAt, totalPosts, config)
        const levelConfig = config.find((l) => l.level === level)

        return {
          level,
          name: levelConfig?.name ?? 'Unknown',
          permissions: levelConfig?.permissions ?? [],
          totalPosts,
          progress,
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[trustLevel.byUserId]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch trust level' })
      }
    }),

  /**
   * Get current user's trust level with full details.
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    try {
      const config = await loadTrustLevelConfig()

      const [result] = await db
        .select({
          trustLevel: user.trustLevel,
          createdAt: user.createdAt,
        })
        .from(user)
        .where(eq(user.id, ctx.user.id))

      if (!result) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }

      const level = (result.trustLevel ?? 0) as TrustLevel
      const createdAt = result.createdAt instanceof Date
        ? result.createdAt
        : new Date(result.createdAt as string)

      const [threadCount] = await db
        .select({ count: count() })
        .from(thread)
        .where(eq(thread.authorId, ctx.user.id))

      const [replyCount] = await db
        .select({ count: count() })
        .from(reply)
        .where(eq(reply.authorId, ctx.user.id))

      const totalPosts = (threadCount?.count ?? 0) + (replyCount?.count ?? 0)
      const progress = getTrustLevelProgress(level, createdAt, totalPosts, config)
      const levelConfig = config.find((l) => l.level === level)

      return {
        level,
        name: levelConfig?.name ?? 'Unknown',
        permissions: levelConfig?.permissions ?? [],
        totalPosts,
        progress,
        requirements: config,
      }
    } catch (error) {
      if (error instanceof TRPCError) throw error
      console.error('[trustLevel.me]', error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch trust level' })
    }
  }),

  /**
   * Get all trust level definitions (for UI display).
   */
  definitions: publicProcedure.query(async () => {
    return loadTrustLevelConfig()
  }),
})
