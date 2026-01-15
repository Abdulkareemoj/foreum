import { TRPCError } from '@trpc/server';
import { count, desc, eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '$server/db';
import { tag, tagCount, threadTag } from '$server/db/schema/tag-schema';
import { publicProcedure, router } from '$server/trpc/init';

export const tagRouter = router({
	list: publicProcedure.query(async ({ ctx }) => {
		try {
			return ctx.db
				.select({
					id: tag.id,
					name: tag.name,
					slug: tag.slug,
					threadCount: count(threadTag.threadId).as('thread_count')
				})
				.from(tag)
				.leftJoin(threadTag, eq(tag.id, threadTag.tagId))
				.groupBy(tag.id);
		} catch (error) {
			console.error('[tag.list]', error);
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch tags' });
		}
	}),

	bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
		try {
			const [t] = await ctx.db
				.select({
					id: tag.id,
					name: tag.name,
					slug: tag.slug
				})
				.from(tag)
				.where(eq(tag.slug, input.slug));

			if (!t) return null;

			const [{ count: threadCount } = { count: 0 }] = await ctx.db
				.select({ count: count() })
				.from(threadTag)
				.where(eq(threadTag.tagId, t.id));

			return { ...t, threadCount };
		} catch (error) {
			console.error('[tag.bySlug]', error);
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch tag' });
		}
	}),

	popular: publicProcedure
		.input(z.object({ limit: z.number().min(1).max(20).default(10) }))
		.query(async ({ ctx, input }) => {
			try {
				return ctx.db
					.select({
						id: tag.id,
						name: tag.name,
						slug: tag.slug,
						threadCount: count(threadTag.threadId).as('thread_count')
					})
					.from(tag)
					.leftJoin(threadTag, eq(tag.id, threadTag.tagId))
					.groupBy(tag.id)
					.orderBy(desc(count(threadTag.threadId)))
					.limit(input.limit);
			} catch (error) {
				console.error('[tag.popular]', error);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to fetch popular tags'
				});
			}
		}),

	trending: publicProcedure
		.input(z.object({ limit: z.number().default(10) }))
		.query(async ({ input }) => {
			return db
				.select({
					id: tag.id,
					name: tag.name,
					slug: tag.slug,
					threadCount: tagCount.threadCount
				})
				.from(tag)
				.leftJoin(tagCount, eq(tag.id, tagCount.tagId))
				.orderBy(desc(tagCount.threadCount))
				.limit(input.limit);
		})
});
