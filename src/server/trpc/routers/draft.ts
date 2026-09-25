import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import { threadDraft } from '~/server/db/schema/draft-schema'
import { protectedProcedure, router } from '~/server/trpc/init'

export const draftRouter = router({
  /**
   * Get current user's draft.
   */
  get: protectedProcedure.query(async ({ ctx }) => {
    try {
      const [draft] = await db
        .select()
        .from(threadDraft)
        .where(eq(threadDraft.authorId, ctx.user.id))
        .limit(1)

      return draft ?? null
    } catch (error) {
      console.error('[draft.get]', error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch draft' })
    }
  }),

  /**
   * Save (upsert) current user's draft.
   * Called on auto-save or manual save from the editor.
   */
  save: protectedProcedure
    .input(
      z.object({
        title: z.string().max(200).optional(),
        content: z.union([
          z.string().max(100000, 'Content is too large'),
          z.array(z.record(z.string(), z.unknown())).max(50000, 'Content is too large'),
        ]).optional(),
        categoryId: z.string().optional(),
        tags: z.array(z.string()).optional(),
        groupId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const [existing] = await db
          .select({ id: threadDraft.id })
          .from(threadDraft)
          .where(eq(threadDraft.authorId, ctx.user.id))
          .limit(1)

        if (existing) {
          const [updated] = await db
            .update(threadDraft)
            .set({
              title: input.title ?? undefined,
              content: input.content ?? undefined,
              categoryId: input.categoryId ?? undefined,
              tags: input.tags ?? undefined,
              groupId: input.groupId ?? undefined,
              updatedAt: new Date(),
            })
            .where(eq(threadDraft.id, existing.id))
            .returning()
          return updated
        } else {
          const [created] = await db
            .insert(threadDraft)
            .values({
              id: crypto.randomUUID(),
              authorId: ctx.user.id,
              title: input.title ?? null,
              content: input.content ?? null,
              categoryId: input.categoryId ?? null,
              tags: input.tags ?? null,
              groupId: input.groupId ?? null,
            })
            .returning()
          return created
        }
      } catch (error) {
        console.error('[draft.save]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to save draft' })
      }
    }),

  /**
   * Delete current user's draft (called after successful thread creation).
   */
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      await db
        .delete(threadDraft)
        .where(eq(threadDraft.authorId, ctx.user.id))

      return { success: true }
    } catch (error) {
      console.error('[draft.delete]', error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete draft' })
    }
  }),
})
