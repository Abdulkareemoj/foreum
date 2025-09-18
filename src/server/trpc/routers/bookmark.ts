import { z } from 'zod';
import { router, protectedProcedure } from '$server/trpc/init';
import { db } from '$server/db';
import { bookmark } from '$server/db/schema/bookmark-schema';
import { eq, and, lt, desc } from 'drizzle-orm';

export const bookmarksRouter = router({
	getAll: protectedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(50).default(10),
				cursor: z.date().optional()
			})
		)

		.query(async ({ ctx, input }) => {
			const { limit, cursor } = input;

			const results = await db
				.select()
				.from(bookmark)
				.where(
					and(eq(bookmark.userId, ctx.user.id), cursor ? lt(bookmark.createdAt, cursor) : undefined)
				)
				.orderBy(desc(bookmark.createdAt))
				.limit(limit + 1);

			let nextCursor: Date | null = null;
			if (results.length > limit) {
				const nextItem = results.pop();
				nextCursor = nextItem?.createdAt ?? null;
			}

			return { items: results, nextCursor };
		}),

	add: protectedProcedure
		.input(z.object({ threadId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await db.insert(bookmark).values({
				userId: ctx.user.id,
				threadId: input.threadId
			});
			return { success: true };
		}),

	remove: protectedProcedure
		.input(z.object({ threadId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await db
				.delete(bookmark)
				.where(and(eq(bookmark.userId, ctx.user.id), eq(bookmark.threadId, input.threadId)));
			return { success: true };
		})
});
