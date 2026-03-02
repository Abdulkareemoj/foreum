import { TRPCError } from '@trpc/server'
import crypto from 'crypto'
import { asc, count, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import { category, thread } from '~/server/db/schema/thread-schema'
import { protectedProcedure, publicProcedure, router } from '~/server/trpc/init'

export const categoryRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    try {
      return db
        .select({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          createdAt: category.createdAt,
          threadCount: count(thread.id),
        })
        .from(category)
        .leftJoin(thread, eq(category.id, thread.categoryId))
        .groupBy(category.id)
        .orderBy(asc(category.name))
    } catch (error) {
      console.error('[category.list]', error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch categories' })
    }
  }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const [result] = await db
          .select({
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            createdAt: category.createdAt,
          })
          .from(category)
          .where(eq(category.slug, input.slug))

        if (!result) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found' })
        }

        // Count threads in this category
        const [{ count: threadCount } = { count: 0 }] = await db
          .select({ count: count() })
          .from(thread)
          .where(eq(thread.categoryId, result.id))

        return { ...result, threadCount }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[category.bySlug]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch category' })
      }
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const [result] = await db
          .select({
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            createdAt: category.createdAt,
          })
          .from(category)
          .where(eq(category.id, input.id))

        if (!result) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found' })
        }

        return result
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[category.byId]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch category' })
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        slug: z
          .string()
          .min(1)
          .max(100)
          .regex(/^[a-z0-9-]+$/),
        description: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can create categories' })
      }

      try {
        // Check if slug already exists
        const [existing] = await db
          .select({ id: category.id })
          .from(category)
          .where(eq(category.slug, input.slug))

        if (existing) {
          throw new TRPCError({ code: 'CONFLICT', message: 'Category slug already exists' })
        }

        const [created] = await db
          .insert(category)
          .values({
            id: crypto.randomUUID(),
            name: input.name,
            slug: input.slug,
            description: input.description,
          })
          .returning()

        return created
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[category.create]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create category' })
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        slug: z
          .string()
          .regex(/^[a-z0-9-]+$/)
          .optional(),
        description: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can update categories' })
      }

      try {
        const { id, ...updateData } = input

        const [updated] = await db
          .update(category)
          .set({ ...updateData })
          .where(eq(category.id, id))
          .returning()

        if (!updated) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found' })
        }

        return updated
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[category.update]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update category' })
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can delete categories' })
      }

      try {
        await db.delete(category).where(eq(category.id, input.id))
        return { success: true }
      } catch (error) {
        console.error('[category.delete]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete category' })
      }
    }),

  top: publicProcedure
    .input(z.object({ limit: z.number().default(5) }))
    .query(async ({ input, ctx }) => {
      try {
        const threadCount = count(thread.id)

        return db
          .select({
            id: category.id,
            name: category.name,
            slug: category.slug,
            threadCount,
          })
          .from(category)
          .leftJoin(thread, eq(category.id, thread.categoryId))
          .groupBy(category.id)
          .orderBy(desc(threadCount))
          .limit(input.limit)
      } catch (error) {
        console.error('[category.top]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch top categories' })
      }
    }),
})