import { TRPCError } from '@trpc/server';
import crypto from 'crypto';
import { asc, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '~/server/db';
import { user } from '~/server/db/schema/auth-schema';
import { reply, thread } from '~/server/db/schema/thread-schema';
import { threadSubscription } from '~/server/db/schema/subscription-schema';
import { notification } from '~/server/db/schema/notification-schema';
import { hasTrustPermission, type TrustLevel } from '~/server/lib/trust-levels';
import { checkModeration } from '~/server/lib/moderation';
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

				return db
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
				// Trust level check: must have reply.create permission
				const trustLevel = ((ctx.user as any).trustLevel ?? 0) as TrustLevel
				if (!hasTrustPermission(trustLevel, 'reply.create')) {
					throw new TRPCError({
						code: 'FORBIDDEN',
						message: 'Your trust level does not allow replying yet. Keep participating to earn more permissions!',
					})
				}

				// Auto-moderation check
				const contentStr = typeof input.content === 'string' ? input.content : JSON.stringify(input.content)
				const modResult = await checkModeration(contentStr, undefined, 'content')
				if (modResult.blocked) {
					throw new TRPCError({
						code: 'FORBIDDEN',
						message: modResult.message ?? 'Your content was blocked by moderation rules',
					})
				}

				const threadExists = await db
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

				const [newReply] = await db
					.insert(reply)
					.values({
						id: crypto.randomUUID(),
						threadId: input.threadId,
						content: input.content,
						authorId: ctx.user!.id
					})
					.returning();

				// Run plugin hooks
				try {
					const { runHooks } = await import('~/server/lib/plugin')
					await runHooks('reply:afterCreate', {
						reply: newReply,
						threadId: input.threadId,
						content: input.content,
					}, { user: ctx.user as any, db })
				} catch {
					// Don't fail reply creation if hooks fail
				}

				// Increment replyCount
				await db
					.update(thread)
					.set({ replyCount: sql`${thread.replyCount} + 1` })
					.where(eq(thread.id, input.threadId));

				// Notify subscribers (except the reply author)
				try {
					const subscribers = await db
						.select({ userId: threadSubscription.userId })
						.from(threadSubscription)
						.where(eq(threadSubscription.threadId, input.threadId))

					const [threadData] = await db
						.select({ title: thread.title })
						.from(thread)
						.where(eq(thread.id, input.threadId))
						.limit(1)

					const [replyAuthor] = await db
						.select({ name: user.name })
						.from(user)
						.where(eq(user.id, ctx.user!.id))
						.limit(1)

					const authorName = replyAuthor?.name ?? 'Someone'
					const threadTitle = threadData?.title ?? 'a thread'

					for (const sub of subscribers) {
						if (sub.userId === ctx.user!.id) continue // Don't notify self
						await db.insert(notification).values({
							id: crypto.randomUUID(),
							userId: sub.userId,
							type: 'reply',
							title: `New reply in "${threadTitle}"`,
							message: `${authorName} replied to the thread you're following.`,
							link: `/threads/${input.threadId}`,
						})
					}
				} catch {
					// Don't fail the reply if notification fails
				}

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
				const existingReply = await db
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

				await db.update(reply).set({ content: input.content }).where(eq(reply.id, input.id));

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
			const existingReply = await db
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

			await db.delete(reply).where(eq(reply.id, input.id));

			// Decrement replyCount (avoid negative numbers)
			await db
				.update(thread)
				.set({ replyCount: sql`GREATEST(${thread.replyCount} - 1, 0)` })
				.where(eq(thread.id, existingReply.threadId));

			return { success: true };
		}),
	getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
		const [result] = await db
			.select()
			.from(reply)
			.where(eq(reply.id, input.id))
			.limit(1);
		return result;
	}),
});
