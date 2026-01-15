import { TRPCError } from '@trpc/server';
import crypto from 'crypto';
import { and, asc, count, desc, eq, inArray, like } from 'drizzle-orm';
import { z } from 'zod';

import { user } from '$server/db/schema/auth-schema';
import { threadTag } from '$server/db/schema/tag-schema';
import { category, reply, thread } from '$server/db/schema/thread-schema';
import { protectedProcedure, publicProcedure, router } from '$server/trpc/init';

export const threadRouter = router({
	list: publicProcedure
		.input(
			z.object({
				search: z.string().optional(),
				category: z.string().optional(),
				tagId: z.string().optional(),
				sortBy: z.enum(['recent', 'popular', 'oldest']).optional(),
				limit: z.number().min(1).max(100).default(20),
				offset: z.number().min(0).default(0)
			})
		)
		.query(async ({ ctx, input }) => {
			try {
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
							? desc(thread.replyCount)
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
							image: user.image,
							username: user.username
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
			} catch (error) {
				console.error('[thread.list]', error);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch threads' });
			}
		}),

	byId: publicProcedure.input(z.object({ id: z.string().min(1) })).query(async ({ ctx, input }) => {
		try {
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

			if (!result || result.length === 0) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Thread not found' });
			}

			return result[0];
		} catch (error) {
			if (error instanceof TRPCError) throw error;
			console.error('[thread.byId]', error);
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch thread' });
		}
	}),

	byUser: publicProcedure
		.input(z.object({ userId: z.string().min(1), limit: z.number().optional() }))
		.query(async ({ ctx, input }) => {
			try {
				return ctx.db
					.select()
					.from(thread)
					.where(eq(thread.authorId, input.userId))
					.limit(input.limit ?? 20);
			} catch (error) {
				console.error('[thread.byUser]', error);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to fetch user threads'
				});
			}
		}),

	create: protectedProcedure
		.input(
			z.object({
				title: z
					.string()
					.min(1, 'Title is required')
					.max(200, 'Title must be less than 200 characters'),
				content: z.string().min(1, 'Content is required'),
				categoryId: z.string().min(1, 'Category is required'),
				tags: z.array(z.string()).optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const categoryExists = await ctx.db
					.select({ id: category.id })
					.from(category)
					.where(eq(category.id, input.categoryId))
					.then((r) => r[0]);

				if (!categoryExists) {
					throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found' });
				}

				const [newThread] = await ctx.db
					.insert(thread)
					.values({
						id: crypto.randomUUID(),
						title: input.title,
						content: input.content,
						categoryId: input.categoryId,
						authorId: ctx.user!.id
					})
					.returning();

				return newThread;
			} catch (error) {
				if (error instanceof TRPCError) throw error;
				console.error('[thread.create]', error);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create thread' });
			}
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string().min(1),
				title: z.string().min(1).max(200).optional(),
				content: z.string().min(1).optional(),
				categoryId: z.string().optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const { id, ...updateData } = input;

				const existingThread = await ctx.db
					.select({ authorId: thread.authorId })
					.from(thread)
					.where(eq(thread.id, id))
					.then((r) => r[0]);

				if (!existingThread) {
					throw new TRPCError({ code: 'NOT_FOUND', message: 'Thread not found' });
				}

				if (existingThread.authorId !== ctx.user!.id && ctx.user!.role !== 'admin') {
					throw new TRPCError({
						code: 'FORBIDDEN',
						message: 'Not authorized to update this thread'
					});
				}

				const [updated] = await ctx.db
					.update(thread)
					.set({ ...updateData, updatedAt: new Date() })
					.where(eq(thread.id, id))
					.returning();

				return updated;
			} catch (error) {
				if (error instanceof TRPCError) throw error;
				console.error('[thread.update]', error);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update thread' });
			}
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			try {
				const existingThread = await ctx.db
					.select({ authorId: thread.authorId })
					.from(thread)
					.where(eq(thread.id, input.id))
					.then((r) => r[0]);

				if (!existingThread) {
					throw new TRPCError({ code: 'NOT_FOUND', message: 'Thread not found' });
				}

				if (existingThread.authorId !== ctx.user!.id && ctx.user!.role !== 'admin') {
					throw new TRPCError({
						code: 'FORBIDDEN',
						message: 'Not authorized to delete this thread'
					});
				}

				await ctx.db.delete(thread).where(eq(thread.id, input.id));
				return { success: true };
			} catch (error) {
				if (error instanceof TRPCError) throw error;
				console.error('[thread.delete]', error);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete thread' });
			}
		}),

	togglePin: protectedProcedure
		.input(z.object({ id: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			try {
				if (ctx.user!.role !== 'admin') {
					throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can pin threads' });
				}

				const existingThread = await ctx.db
					.select({ pinned: thread.pinned })
					.from(thread)
					.where(eq(thread.id, input.id))
					.then((r) => r[0]);

				if (!existingThread) {
					throw new TRPCError({ code: 'NOT_FOUND', message: 'Thread not found' });
				}

				const [updated] = await ctx.db
					.update(thread)
					.set({ pinned: !existingThread.pinned })
					.where(eq(thread.id, input.id))
					.returning();

				return updated;
			} catch (error) {
				if (error instanceof TRPCError) throw error;
				console.error('[thread.togglePin]', error);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to toggle pin' });
			}
		}),

	toggleLock: protectedProcedure
		.input(z.object({ id: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			try {
				if (ctx.user!.role !== 'admin') {
					throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can lock threads' });
				}

				const existingThread = await ctx.db
					.select({ locked: thread.locked })
					.from(thread)
					.where(eq(thread.id, input.id))
					.then((r) => r[0]);

				if (!existingThread) {
					throw new TRPCError({ code: 'NOT_FOUND', message: 'Thread not found' });
				}

				const [updated] = await ctx.db
					.update(thread)
					.set({ locked: !existingThread.locked })
					.where(eq(thread.id, input.id))
					.returning();

				return updated;
			} catch (error) {
				if (error instanceof TRPCError) throw error;
				console.error('[thread.toggleLock]', error);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to toggle lock' });
			}
		}),
	recent: publicProcedure
		.input(z.object({ limit: z.number().min(1).max(10).default(5) }))
		.query(async ({ ctx, input }) => {
			try {
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
			} catch (error) {
				console.error('[thread.recent]', error);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to fetch recent threads'
				});
			}
		}),

	active: publicProcedure
		.input(z.object({ limit: z.number().default(5) }))
		.query(async ({ input, ctx }) => {
			try {
				return ctx.db
					.select({
						id: thread.id,
						title: thread.title,
						replyCount: thread.replyCount
					})
					.from(thread)
					.orderBy(desc(thread.replyCount))
					.limit(input.limit);
			} catch (error) {
				console.error('[thread.active]', error);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to fetch active threads'
				});
			}
		}),
	popular: publicProcedure
		.input(z.object({ limit: z.number().default(5) }))
		.query(async ({ input, ctx }) => {
			try {
				return ctx.db
					.select({
						id: thread.id,
						title: thread.title,
						replyCount: thread.replyCount
					})
					.from(thread)
					.orderBy(desc(thread.replyCount))
					.limit(input.limit);
			} catch (error) {
				console.error('[thread.popular]', error);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to fetch popular threads'
				});
			}
		})
});
