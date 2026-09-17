import { TRPCError } from '@trpc/server'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import { moderationRule } from '~/server/db/schema/moderation-rule-schema'
import { adminProcedure, publicProcedure, router } from '~/server/trpc/init'
import { invalidateModerationCache } from '~/server/lib/moderation'

export const moderationConfigRouter = router({
  /**
   * Get all moderation rules (admin only).
   */
  list: adminProcedure.query(async () => {
    try {
      return db
        .select()
        .from(moderationRule)
        .orderBy(desc(moderationRule.createdAt))
    } catch (error) {
      console.error('[moderationConfig.list]', error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch moderation rules' })
    }
  }),

  /**
   * Create a new moderation rule. Admin only.
   */
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        patternType: z.enum(['regex', 'contains', 'startsWith', 'endsWith']),
        pattern: z.string().min(1),
        action: z.enum(['block', 'flag', 'replace']),
        replacement: z.string().optional(),
        target: z.enum(['title', 'content', 'both']),
        message: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Validate regex pattern if applicable
        if (input.patternType === 'regex') {
          try {
            new RegExp(input.pattern)
          } catch {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid regex pattern' })
          }
        }

        const [created] = await db
          .insert(moderationRule)
          .values({
            id: crypto.randomUUID(),
            ...input,
            replacement: input.action === 'replace' ? (input.replacement ?? '***') : null,
          })
          .returning()

        invalidateModerationCache()
        return created
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[moderationConfig.create]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create moderation rule' })
      }
    }),

  /**
   * Update a moderation rule. Admin only.
   */
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        enabled: z.boolean().optional(),
        patternType: z.enum(['regex', 'contains', 'startsWith', 'endsWith']).optional(),
        pattern: z.string().min(1).optional(),
        action: z.enum(['block', 'flag', 'replace']).optional(),
        replacement: z.string().optional(),
        target: z.enum(['title', 'content', 'both']).optional(),
        message: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input

        if (input.patternType === 'regex' && input.pattern) {
          try {
            new RegExp(input.pattern)
          } catch {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid regex pattern' })
          }
        }

        const [updated] = await db
          .update(moderationRule)
          .set({ ...updateData, updatedAt: new Date() })
          .where(eq(moderationRule.id, id))
          .returning()

        if (!updated) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Rule not found' })
        }

        invalidateModerationCache()
        return updated
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[moderationConfig.update]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update moderation rule' })
      }
    }),

  /**
   * Delete a moderation rule. Admin only.
   */
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await db.delete(moderationRule).where(eq(moderationRule.id, input.id))
        invalidateModerationCache()
        return { success: true }
      } catch (error) {
        console.error('[moderationConfig.delete]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete moderation rule' })
      }
    }),

  /**
   * Test content against moderation rules (admin preview).
   */
  test: adminProcedure
    .input(
      z.object({
        content: z.string(),
        title: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { checkModeration } = await import('~/server/lib/moderation')
      return checkModeration(input.content, input.title)
    }),
})
