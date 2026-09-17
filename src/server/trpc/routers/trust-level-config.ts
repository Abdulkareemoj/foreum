import { TRPCError } from '@trpc/server'
import { asc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import { trustLevelConfig } from '~/server/db/schema/trust-level-schema'
import { adminProcedure, publicProcedure, router } from '~/server/trpc/init'
import { invalidateTrustLevelCache } from '~/server/lib/trust-levels'

export const trustLevelConfigRouter = router({
  /**
   * Get all trust level configs (public for profile display).
   */
  list: publicProcedure.query(async () => {
    try {
      return db
        .select()
        .from(trustLevelConfig)
        .orderBy(asc(trustLevelConfig.level))
    } catch (error) {
      console.error('[trustLevelConfig.list]', error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch trust level config' })
    }
  }),

  /**
   * Get a single trust level config by level number.
   */
  byLevel: publicProcedure
    .input(z.object({ level: z.number().min(0).max(4) }))
    .query(async ({ input }) => {
      try {
        const [result] = await db
          .select()
          .from(trustLevelConfig)
          .where(eq(trustLevelConfig.level, input.level))
          .limit(1)

        if (!result) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Trust level config not found' })
        }

        return result
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[trustLevelConfig.byLevel]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch trust level config' })
      }
    }),

  /**
   * Update a trust level config. Admin only.
   */
  update: adminProcedure
    .input(
      z.object({
        level: z.number().min(0).max(4),
        name: z.string().min(1).max(50).optional(),
        minDays: z.number().min(0).optional(),
        minPosts: z.number().min(0).optional(),
        permissions: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { level, ...updateData } = input

        const [updated] = await db
          .update(trustLevelConfig)
          .set({ ...updateData, updatedAt: new Date() })
          .where(eq(trustLevelConfig.level, level))
          .returning()

        if (!updated) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Trust level config not found' })
        }

        invalidateTrustLevelCache()
        return updated
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[trustLevelConfig.update]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update trust level config' })
      }
    }),

  /**
   * Bulk update all 5 trust level configs. Admin only.
   */
  bulkUpdate: adminProcedure
    .input(
      z.array(
        z.object({
          level: z.number().min(0).max(4),
          name: z.string().min(1).max(50),
          minDays: z.number().min(0),
          minPosts: z.number().min(0),
          permissions: z.array(z.string()),
        })
      )
    )
    .mutation(async ({ input }) => {
      try {
        const results = []
        for (const item of input) {
          const [upserted] = await db
            .insert(trustLevelConfig)
            .values({
              id: `tl-${item.level}`,
              level: item.level,
              name: item.name,
              minDays: item.minDays,
              minPosts: item.minPosts,
              permissions: item.permissions,
              updatedAt: new Date(),
            })
            .onConflictDoUpdate({
              target: trustLevelConfig.level,
              set: {
                name: item.name,
                minDays: item.minDays,
                minPosts: item.minPosts,
                permissions: item.permissions,
                updatedAt: new Date(),
              },
            })
            .returning()
          results.push(upserted)
        }
        invalidateTrustLevelCache()
        return results
      } catch (error) {
        console.error('[trustLevelConfig.bulkUpdate]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update trust level configs' })
      }
    }),

  /**
   * Seed default trust level configs. Admin only.
   */
  seed: adminProcedure.mutation(async () => {
    try {
      const defaults = [
        { level: 0, name: 'New User', minDays: 0, minPosts: 0, permissions: ['thread.create', 'reply.create'] },
        { level: 1, name: 'Basic', minDays: 14, minPosts: 5, permissions: ['thread.create', 'reply.create', 'link.post', 'file.upload'] },
        { level: 2, name: 'Member', minDays: 30, minPosts: 20, permissions: ['thread.create', 'reply.create', 'link.post', 'file.upload', 'poll.create', 'own_post.edit'] },
        { level: 3, name: 'Regular', minDays: 100, minPosts: 100, permissions: ['thread.create', 'reply.create', 'link.post', 'file.upload', 'poll.create', 'own_post.edit', 'own_post.delete', 'own_thread.pin'] },
        { level: 4, name: 'Leader', minDays: 200, minPosts: 500, permissions: ['thread.create', 'reply.create', 'link.post', 'file.upload', 'poll.create', 'own_post.edit', 'own_post.delete', 'own_thread.pin', 'extended_upload'] },
      ]

      const results = []
      for (const item of defaults) {
        const [upserted] = await db
          .insert(trustLevelConfig)
          .values({
            id: `tl-${item.level}`,
            ...item,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: trustLevelConfig.level,
            set: {
              name: item.name,
              minDays: item.minDays,
              minPosts: item.minPosts,
              permissions: item.permissions,
              updatedAt: new Date(),
            },
          })
          .returning()
        results.push(upserted)
      }
      invalidateTrustLevelCache()
      return results
    } catch (error) {
      console.error('[trustLevelConfig.seed]', error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to seed trust level configs' })
    }
  }),
})
