import { TRPCError } from '@trpc/server';
import crypto from 'crypto';
import { asc, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '~/server/db';
import { user } from '~/server/db/schema/auth-schema';
import { reply, thread } from '~/server/db/schema/thread-schema';
import { protectedProcedure, publicProcedure, router } from '~/server/trpc/init';

export const replyRouter = router({
	list: publicProcedure
		.input(
			z.object({
				threadId: z.string(),
				limit: z.number().min(1).max(100).default(50),
				offset: z.number().min(0).default(0),
				sortBy: z.enum(['oldest', 'newest']).default('oldest')
			})
		)
		.query(async ({ ctx, input }) => {
			try {
				const orderBy = input.sortBy === 'newest' ? desc(reply.createdAt) : asc(reply.createdAt);

				return ctx.db
					.select({
						id: reply.id,
						content: reply.content,
						createdAt: reply.createdAt,
						updatedAt: reply.updatedAt,
						author: {
							id: user.id,
							name: user.name,
							image: user.image,
							role: user.role
						}
					})
					.from(reply)
					.leftJoin(user, eq(reply.authorId, user.id))
					.where(eq(reply.threadId, input.threadId))
					.orderBy(orderBy)
					.limit(input.limit)
					.offset(input.offset);
			} catch (error) {
				console.error('[reply.list]', error);
				throw new Error('Failed to fetch replies');
			}
		}),

	create: protectedProcedure
		.input(
			z.object({
				threadId: z.string(),
				content: z.any()
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const threadExists = await ctx.db
					.select({ locked: thread.locked })
					.from(thread)
					.where(eq(thread.id, input.threadId))
					.then((r) => r[0]);

				if (!threadExists) {
					throw new TRPCError({ code: 'NOT_FOUND', message: 'Thread not found' });
				}

				if (threadExists.locked && ctx.user!.role !== 'admin') {
					throw new TRPCError({ code: 'FORBIDDEN', message: 'This thread is locked' });
				}

				const [newReply] = await ctx.db
					.insert(reply)
					.values({
						id: crypto.randomUUID(),
						threadId: input.threadId,
						content: input.content,
						authorId: ctx.user!.id
					})
					.returning();

				// Increment replyCount
				await ctx.db
					.update(thread)
					.set({ replyCount: sql`${thread.replyCount} + 1` })
					.where(eq(thread.id, input.threadId));

				return newReply;
			} catch (error) {
				if (error instanceof TRPCError) throw error;
				console.error('[reply.create]', error);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create reply' });
			}
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				content: z.string().min(1).max(10000)
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const existingReply = await ctx.db
					.select({ authorId: reply.authorId })
					.from(reply)
					.where(eq(reply.id, input.id))
					.then((r) => r[0]);

				if (!existingReply) {
					throw new TRPCError({ code: 'NOT_FOUND', message: 'Reply not found' });
				}

				if (existingReply.authorId !== ctx.user!.id && ctx.user!.role !== 'admin') {
					throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only edit your own replies' });
				}

				await ctx.db.update(reply).set({ content: input.content }).where(eq(reply.id, input.id));

				return { success: true };
			} catch (error) {
				if (error instanceof TRPCError) throw error;
				console.error('[reply.update]', error);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update reply' });
			}
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const existingReply = await ctx.db
				.select({ authorId: reply.authorId, threadId: reply.threadId })
				.from(reply)
				.where(eq(reply.id, input.id))
				.then((r) => r[0]);

			if (!existingReply) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Reply not found' });
			}

			if (existingReply.authorId !== ctx.user!.id && ctx.user!.role !== 'admin') {
				throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to delete this reply' });
			}

			await ctx.db.delete(reply).where(eq(reply.id, input.id));

			// Decrement replyCount (avoid negative numbers)
			await ctx.db
				.update(thread)
				.set({ replyCount: sql`GREATEST(${thread.replyCount} - 1, 0)` })
				.where(eq(thread.id, existingReply.threadId));

			return { success: true };
		}),
	byThread: publicProcedure.input(z.object({ threadId: z.string() })).query(async ({ input }) => {
		return db
			.select()
			.from(reply)
			.where(eq(reply.threadId, input.threadId))
			.orderBy(desc(reply.createdAt));
	}),

	add: protectedProcedure
		.input(
			z.object({
				threadId: z.string(),
				content: z.any()
			})
		)
		.mutation(async ({ ctx, input }) => {
			await db.insert(reply).values({
				id: crypto.randomUUID(),
				threadId: input.threadId,
				authorId: ctx.user.id,
				content: input.content
			});
			return { success: true };
		})
});
