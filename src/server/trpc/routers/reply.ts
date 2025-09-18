import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '$server/trpc/init';
import { reply, thread } from '$server/db/schema/thread-schema';
import { user } from '$server/db/schema/auth-schema';
import { eq, asc, desc, sql } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import crypto from 'crypto';
import { db } from '$server/db';

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
		}),

	create: protectedProcedure
		.input(
			z.object({
				threadId: z.string(),
				content: z.string().min(1).max(10000)
			})
		)
		.mutation(async ({ ctx, input }) => {
			const threadExists = await ctx.db
				.select({ locked: thread.locked })
				.from(thread)
				.where(eq(thread.id, input.threadId))
				.then((r) => r[0]);

			if (!threadExists) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Thread not found' });
			}

			if (threadExists.locked && ctx.user!.role !== 'admin') {
				throw new TRPCError({ code: 'FORBIDDEN', message: 'Thread is locked' });
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
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				content: z.string().min(1).max(10000)
			})
		)
		.mutation(async ({ ctx, input }) => {
			const existingReply = await ctx.db
				.select({ authorId: reply.authorId })
				.from(reply)
				.where(eq(reply.id, input.id))
				.then((r) => r[0]);

			if (!existingReply) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Reply not found' });
			}

			if (existingReply.authorId !== ctx.user!.id && ctx.user!.role !== 'admin') {
				throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to edit this reply' });
			}

			const [updatedReply] = await ctx.db
				.update(reply)
				.set({
					content: input.content,
					updatedAt: new Date()
				})
				.where(eq(reply.id, input.id))
				.returning();

			return updatedReply;
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
