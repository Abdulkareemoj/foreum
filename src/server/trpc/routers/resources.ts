import { TRPCError } from '@trpc/server'
import { and, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import { resourceTags, resources } from '~/server/db/schema/resources-schema'
import { adminProcedure, protectedProcedure, publicProcedure, router } from '~/server/trpc/init'

export const resourcesRouter = router({
  /**
   * List all resources (public).
   */
  list: publicProcedure.query(async () => {
    try {
      return db
        .select()
        .from(resources)
        .orderBy(desc(resources.createdAt))
    } catch (error) {
      console.error('[resources.list]', error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch resources' })
    }
  }),

  /**
   * Get a resource by ID (public).
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const [resource] = await db
          .select()
          .from(resources)
          .where(eq(resources.id, input.id))
          .limit(1)

        if (!resource) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Resource not found' })
        }

        const tags = await db
          .select({ tagId: resourceTags.tagId })
          .from(resourceTags)
          .where(eq(resourceTags.resourceId, input.id))

        return { ...resource, tagIds: tags.map((t) => t.tagId) }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[resources.getById]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch resource' })
      }
    }),

  /**
   * Create a new resource (authenticated users).
   */
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(200),
        url: z.string().url(),
        description: z.string().max(2000).optional(),
        tagIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const [res] = await db
          .insert(resources)
          .values({
            id: crypto.randomUUID(),
            title: input.title,
            url: input.url,
            description: input.description,
            createdBy: ctx.user.id,
          })
          .returning()

        if (input.tagIds && input.tagIds.length > 0) {
          await db
            .insert(resourceTags)
            .values(input.tagIds.map((t) => ({ resourceId: res.id, tagId: t })))
        }

        return res
      } catch (error) {
        console.error('[resources.create]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create resource' })
      }
    }),

  /**
   * Update a resource (owner or admin).
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(200).optional(),
        url: z.string().url().optional(),
        description: z.string().max(2000).optional(),
        tagIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existing = await db
          .select({ createdBy: resources.createdBy })
          .from(resources)
          .where(eq(resources.id, input.id))
          .then((r) => r[0])

        if (!existing) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Resource not found' })
        }

        if (existing.createdBy !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to update this resource' })
        }

        const { id, tagIds, ...updateData } = input

        await db
          .update(resources)
          .set({ ...updateData, updatedAt: new Date() })
          .where(eq(resources.id, id))

        if (tagIds !== undefined) {
          // Delete existing tags and re-insert
          await db.delete(resourceTags).where(eq(resourceTags.resourceId, id))
          if (tagIds.length > 0) {
            await db
              .insert(resourceTags)
              .values(tagIds.map((t) => ({ resourceId: id, tagId: t })))
          }
        }

        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[resources.update]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update resource' })
      }
    }),

  /**
   * Delete a resource (owner or admin).
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const existing = await db
          .select({ createdBy: resources.createdBy })
          .from(resources)
          .where(eq(resources.id, input.id))
          .then((r) => r[0])

        if (!existing) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Resource not found' })
        }

        if (existing.createdBy !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to delete this resource' })
        }

        await db.delete(resourceTags).where(eq(resourceTags.resourceId, input.id))
        await db.delete(resources).where(eq(resources.id, input.id))

        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[resources.delete]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete resource' })
      }
    }),

  /**
   * List resources by tag (public).
   */
  getByTag: publicProcedure
    .input(z.object({ tagId: z.string() }))
    .query(async ({ input }) => {
      try {
        const tagged = await db
          .select({ resourceId: resourceTags.resourceId })
          .from(resourceTags)
          .where(eq(resourceTags.tagId, input.tagId))

        if (tagged.length === 0) return []

        const ids = tagged.map((t) => t.resourceId)
        return db
          .select()
          .from(resources)
          .where(
            ids.length === 1
              ? eq(resources.id, ids[0])
              : undefined // Drizzle doesn't have inArray on text uuid easily, fallback to fetching all
          )
          .orderBy(desc(resources.createdAt))
      } catch (error) {
        console.error('[resources.getByTag]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch resources by tag' })
      }
    }),
})
