import crypto from 'crypto';
import { and, asc, count,desc, eq, like } from 'drizzle-orm';
import { z } from 'zod';

import { user } from '$server/db/schema/auth-schema';
import { threadTag } from '$server/db/schema/tag-schema';
import { category, reply,thread } from '$server/db/schema/thread-schema';
import { protectedProcedure,publicProcedure, router } from '$server/trpc/init';

export const threadRouter = router({
	list: publicProcedure
		.input(
			z.object({
				search: z.string().optional(),
				category: z.string().optional(),
				tagId: z.string().optional(),
				sortBy: z.enum(['recent', 'popular', 'oldest']).optional(), // removed "best"
				limit: z.number().min(1).max(100).default(20),
				offset: z.number().min(0).default(0)
			})
		)

		.query(async ({ ctx, input }) => {
			const conditions = [];

			if (input.search) {
				conditions.push(like(thread.title, `%${input.search}%`));
			}

			if (input.category) {
				conditions.push(eq(thread.categoryId, input.category));
			}

			if (input.tagId) {
				const taggedThreadIds = ctx.db
					.select({ threadId: threadTag.threadId })
					.from(threadTag)
					.where(eq(threadTag.tagId, input.tagId));
				conditions.push(inArray(thread.id, taggedThreadIds));
			}

			const orderBy =
				input.sortBy === 'oldest'
					? asc(thread.createdAt)
					: input.sortBy === 'popular'
						? desc(thread.replyCount) // Using stored replyCount for performance
						: desc(thread.createdAt);

			return ctx.db
				.select({
					id: thread.id,
					title: thread.title,
					content: thread.content,
					pinned: thread.pinned,
					locked: thread.locked,
					createdAt: thread.createdAt,
					updatedAt: thread.updatedAt,
					author: {
						id: user.id,
						name: user.name,
						image: user.image
					},
					category: {
						id: category.id,
						name: category.name,
						slug: category.slug
					},
					replyCount: thread.replyCount
				})
				.from(thread)
				.leftJoin(user, eq(thread.authorId, user.id))
				.leftJoin(category, eq(thread.categoryId, category.id))
				.where(conditions.length ? and(...conditions) : undefined)
				.orderBy(orderBy)
				.limit(input.limit)
				.offset(input.offset);
		}),

	byId: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
		const result = await ctx.db
			.select({
				id: thread.id,
				title: thread.title,
				content: thread.content,
				pinned: thread.pinned,
				locked: thread.locked,
				createdAt: thread.createdAt,
				updatedAt: thread.updatedAt,
				author: {
					id: user.id,
					name: user.name,
					image: user.image
				},
				category: {
					id: category.id,
					name: category.name,
					slug: category.slug
				},
				replyCount: count(reply.id)
			})
			.from(thread)
			.leftJoin(user, eq(thread.authorId, user.id))
			.leftJoin(category, eq(thread.categoryId, category.id))
			.leftJoin(reply, eq(thread.id, reply.threadId))
			.where(eq(thread.id, input.id))
			.groupBy(thread.id, user.id, category.id);

		return result[0] ?? null;
	}),
	byUser: publicProcedure
		.input(z.object({ userId: z.string(), limit: z.number().optional() }))
		.query(async ({ ctx, input }) => {
			return ctx.db
				.select()
				.from(thread)
				.where(eq(thread.authorId, input.userId))
				.limit(input.limit ?? 20);
		}),

	create: protectedProcedure
		.input(
			z.object({
				title: z.string().min(1).max(200),
				content: z.string().min(1),
				categoryId: z.string(),
				tags: z.array(z.string()).optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.db
				.insert(thread)
				.values({
					id: crypto.randomUUID(),
					title: input.title,
					content: input.content,
					categoryId: input.categoryId,
					authorId: ctx.user!.id
				})
				.returning()
				.then((r) => r[0]);
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				title: z.string().min(1).max(200).optional(),
				content: z.string().min(1).optional(),
				categoryId: z.string().optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { id, ...updateData } = input;

			const existingThread = await ctx.db
				.select({ authorId: thread.authorId })
				.from(thread)
				.where(eq(thread.id, id))
				.then((r) => r[0]);

			if (
				!existingThread ||
				(existingThread.authorId !== ctx.user!.id && ctx.user!.role !== 'admin')
			) {
				throw new Error('Unauthorized');
			}

			return ctx.db
				.update(thread)
				.set({ ...updateData, updatedAt: new Date() })
				.where(eq(thread.id, id))
				.returning()
				.then((r) => r[0]);
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const existingThread = await ctx.db
				.select({ authorId: thread.authorId })
				.from(thread)
				.where(eq(thread.id, input.id))
				.then((r) => r[0]);

			if (
				!existingThread ||
				(existingThread.authorId !== ctx.user!.id && ctx.user!.role !== 'admin')
			) {
				throw new Error('Unauthorized');
			}

			return ctx.db.delete(thread).where(eq(thread.id, input.id));
		}),

	togglePin: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			if (ctx.user!.role !== 'admin') throw new Error('Unauthorized');

			const existingThread = await ctx.db
				.select({ pinned: thread.pinned })
				.from(thread)
				.where(eq(thread.id, input.id))
				.then((r) => r[0]);

			if (!existingThread) throw new Error('Thread not found');

			return ctx.db
				.update(thread)
				.set({ pinned: !existingThread.pinned })
				.where(eq(thread.id, input.id))
				.returning()
				.then((r) => r[0]);
		}),

	toggleLock: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			if (ctx.user!.role !== 'admin') throw new Error('Unauthorized');

			const existingThread = await ctx.db
				.select({ locked: thread.locked })
				.from(thread)
				.where(eq(thread.id, input.id))
				.then((r) => r[0]);

			if (!existingThread) throw new Error('Thread not found');

			return ctx.db
				.update(thread)
				.set({ locked: !existingThread.locked })
				.where(eq(thread.id, input.id))
				.returning()
				.then((r) => r[0]);
		}),
	recent: publicProcedure
		.input(z.object({ limit: z.number().min(1).max(10).default(5) }))
		.query(async ({ ctx, input }) => {
			return ctx.db
				.select({
					id: thread.id,
					title: thread.title,
					createdAt: thread.createdAt,
					author: {
						id: user.id,
						name: user.displayUsername,
						image: user.image
					}
				})
				.from(thread)
				.leftJoin(user, eq(thread.authorId, user.id))
				.orderBy(desc(thread.createdAt))
				.limit(input.limit);
		}),

	active: publicProcedure
		.input(z.object({ limit: z.number().default(5) }))
		.query(async ({ input, ctx }) => {
			return ctx.db
				.select({
					id: thread.id,
					title: thread.title,
					replyCount: thread.replyCount
				})
				.from(thread)
				.orderBy(desc(thread.replyCount))
				.limit(input.limit);
		}),
	popular: publicProcedure
		.input(z.object({ limit: z.number().default(5) }))
		.query(async ({ input, ctx }) => {
			return ctx.db
				.select({
					id: thread.id,
					title: thread.title,
					replyCount: thread.replyCount
				})
				.from(thread)
				.orderBy(desc(thread.replyCount))
				.limit(input.limit);
		})
});
