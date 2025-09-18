import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '$server/trpc/init';
import { category, thread } from '$server/db/schema/thread-schema';
import { eq, count, asc, desc } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const categoryRouter = router({
	list: publicProcedure.query(async ({ ctx }) => {
		// Return all categories with thread count
		return ctx.db
			.select({
				id: category.id,
				name: category.name,
				slug: category.slug,
				description: category.description,
				createdAt: category.createdAt,
				threadCount: count(thread.id).as('thread_count')
			})
			.from(category)
			.leftJoin(thread, eq(category.id, thread.categoryId))
			.groupBy(category.id)
			.orderBy(asc(category.name));
	}),

	bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
		const [result] = await ctx.db
			.select({
				id: category.id,
				name: category.name,
				slug: category.slug,
				description: category.description,
				createdAt: category.createdAt
			})
			.from(category)
			.where(eq(category.slug, input.slug));

		if (!result) return null;

		// Count threads in this category
		const [{ count: threadCount } = { count: 0 }] = await ctx.db
			.select({ count: count() })
			.from(thread)
			.where(eq(thread.categoryId, result.id));

		return { ...result, threadCount };
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
				description: z.string().max(500).optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			// Only admins can create categories
			if (ctx.user?.role !== 'admin') {
				throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authorized' });
			}

			// Check if slug already exists
			const [existing] = await ctx.db
				.select({ id: category.id })
				.from(category)
				.where(eq(category.slug, input.slug));

			if (existing) {
				throw new TRPCError({ code: 'CONFLICT', message: 'Category slug already exists' });
			}

			// Insert category
			const [created] = await ctx.db
				.insert(category)
				.values({
					id: crypto.randomUUID(),
					name: input.name,
					slug: input.slug,
					description: input.description
				})
				.returning();

			return created;
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
				description: z.string().max(500).optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			if (ctx.user?.role !== 'admin') {
				throw new TRPCError({ code: 'UNAUTHORIZED' });
			}

			const { id, ...updateData } = input;

			const [updated] = await ctx.db
				.update(category)
				.set({ ...updateData })
				.where(eq(category.id, id))
				.returning();

			if (!updated) throw new TRPCError({ code: 'NOT_FOUND' });
			return updated;
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			if (ctx.user?.role !== 'admin') {
				throw new TRPCError({ code: 'UNAUTHORIZED' });
			}

			// ⚠️ Decide how to handle threads under this category
			await ctx.db.delete(category).where(eq(category.id, input.id));
			return { success: true };
		}),
	top: publicProcedure
		.input(z.object({ limit: z.number().default(5) }))
		.query(async ({ input, ctx }) => {
			const threadCount = count(thread.id).as('thread_count');

			return ctx.db
				.select({
					id: category.id,
					name: category.name,
					slug: category.slug,
					count: threadCount
				})
				.from(category)
				.leftJoin(thread, eq(category.id, thread.categoryId))
				.groupBy(category.id)
				.orderBy(desc(threadCount)) // ✅ correct
				.limit(input.limit);
		})
});
