import { TRPCError } from '@trpc/server'
import crypto from 'crypto'
import { count, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import { tag, tagCount, threadTag } from '~/server/db/schema/tag-schema'
import { publicProcedure, protectedProcedure, router } from '~/server/trpc/init'

export const tagRouter = router({
  list: publicProcedure.query(async () => {
    try {
      return db
        .select({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
          threadCount: count(threadTag.threadId),
        })
        .from(tag)
        .leftJoin(threadTag, eq(tag.id, threadTag.tagId))
        .groupBy(tag.id)
    } catch (error) {
      console.error('[tag.list]', error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch tags' })
    }
  }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        const [t] = await db
          .select({ id: tag.id, name: tag.name, slug: tag.slug })
          .from(tag)
          .where(eq(tag.slug, input.slug))

        if (!t) return null

        const [{ count: threadCount } = { count: 0 }] = await db
          .select({ count: count() })
          .from(threadTag)
          .where(eq(threadTag.tagId, t.id))

        return { ...t, threadCount }
      } catch (error) {
        console.error('[tag.bySlug]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch tag' })
      }
    }),

  popular: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(10) }))
    .query(async ({ input }) => {
      try {
        return db
          .select({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            threadCount: count(threadTag.threadId),
          })
          .from(tag)
          .leftJoin(threadTag, eq(tag.id, threadTag.tagId))
          .groupBy(tag.id)
          .orderBy(desc(count(threadTag.threadId)))
          .limit(input.limit)
      } catch (error) {
        console.error('[tag.popular]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch popular tags' })
      }
    }),

  trending: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      try {
        return db
          .select({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            threadCount: tagCount.threadCount,
          })
          .from(tag)
          .leftJoin(tagCount, eq(tag.id, tagCount.tagId))
          .orderBy(desc(tagCount.threadCount))
          .limit(input.limit)
      } catch (error) {
        console.error('[tag.trending]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch trending tags' })
      }
    }),

  // Admin: create tag
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(50),
        slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      try {
        const [existing] = await db.select().from(tag).where(eq(tag.slug, input.slug))
        if (existing) {
          throw new TRPCError({ code: 'CONFLICT', message: 'Tag already exists' })
        }

        const [created] = await db
          .insert(tag)
          .values({ id: crypto.randomUUID(), name: input.name, slug: input.slug })
          .returning()

        return created
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[tag.create]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create tag' })
      }
    }),
})