import { TRPCError } from '@trpc/server'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import { announcement } from '~/server/db/schema/announcement-schema'
import { protectedProcedure, router } from '~/server/trpc/init'
import crypto from 'crypto'

export const announcementRouter = router({
  list: protectedProcedure
    .query(async () => {
      try {
        return await db
          .select()
          .from(announcement)
          .orderBy(desc(announcement.createdAt))
      } catch (error) {
        console.error('[announcement.list]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch announcements',
        })
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx.user.role === 'admin'
      
      if (!isAdmin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only admins can create announcements',
        })
      }

      try {
        const [created] = await db
          .insert(announcement)
          .values({
            id: crypto.randomUUID(),
            title: input.title,
            content: input.content,
            active: true,
          })
          .returning()

        return created
      } catch (error) {
        console.error('[announcement.create]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create announcement',
        })
      }
    }),

  toggleActive: protectedProcedure
    .input(z.object({ id: z.string(), active: z.boolean() }))
    .mutation(async ({ input }) => {
      try {
        const [updated] = await db
          .update(announcement)
          .set({ active: input.active, updatedAt: new Date() })
          .where(eq(announcement.id, input.id))
          .returning()

        if (!updated) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Announcement not found',
          })
        }

        return updated
      } catch (error) {
        console.error('[announcement.toggleActive]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update announcement',
        })
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await db.delete(announcement).where(eq(announcement.id, input.id))
        return { success: true }
      } catch (error) {
        console.error('[announcement.delete]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete announcement',
        })
      }
    }),
})
