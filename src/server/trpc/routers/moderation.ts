import { TRPCError } from '@trpc/server';
import { and, count,desc, eq } from 'drizzle-orm';
import { z } from 'zod';

import { user } from '$server/db/schema/auth-schema';
import { report } from '$server/db/schema/moderation-schema';
import { protectedProcedure,router } from '$server/trpc/init';

export const moderationRouter = router({
	createReport: protectedProcedure
		.input(
			z.object({
				type: z.enum(['thread', 'reply']),
				reason: z.string().min(1).max(500),
				threadId: z.string().optional(),
				replyId: z.string().optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			if (input.type === 'thread' && !input.threadId) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Thread ID required for thread reports'
				});
			}
			if (input.type === 'reply' && !input.replyId) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Reply ID required for reply reports'
				});
			}

			const [created] = await ctx.db
				.insert(report)
				.values({
					id: crypto.randomUUID(),
					type: input.type,
					reason: input.reason,
					threadId: input.threadId,
					replyId: input.replyId,
					reportedById: ctx.user!.id
				})
				.returning();

			return created;
		}),

	listReports: protectedProcedure
		.input(
			z.object({
				resolved: z.boolean().optional(),
				type: z.enum(['thread', 'reply']).optional(),
				limit: z.number().min(1).max(100).default(20),
				offset: z.number().min(0).default(0)
			})
		)
		.query(async ({ ctx, input }) => {
			if (ctx.user!.role !== 'admin') {
				throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authorized' });
			}

			const conditions = [];

			if (input.resolved !== undefined) {
				conditions.push(eq(report.resolved, input.resolved));
			}

			if (input.type) {
				conditions.push(eq(report.type, input.type));
			}

			return ctx.db
				.select({
					id: report.id,
					type: report.type,
					reason: report.reason,
					threadId: report.threadId,
					replyId: report.replyId,
					resolved: report.resolved,
					createdAt: report.createdAt,
					reportedBy: {
						id: user.id,
						name: user.name,
						image: user.image
					}
				})
				.from(report)
				.leftJoin(user, eq(report.reportedById, user.id))
				.where(conditions.length ? and(...conditions) : undefined)
				.orderBy(desc(report.createdAt))
				.limit(input.limit)
				.offset(input.offset);
		}),

	resolveReport: protectedProcedure
		.input(z.object({ reportId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			if (ctx.user!.role !== 'admin') {
				throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authorized' });
			}

			const [updated] = await ctx.db
				.update(report)
				.set({ resolved: true })
				.where(eq(report.id, input.reportId))
				.returning();

			return updated;
		}),

	getStats: protectedProcedure.query(async ({ ctx }) => {
		if (ctx.user!.role !== 'admin') {
			throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authorized' });
		}

		const [{ count: pendingReports } = { count: 0 }] = await ctx.db
			.select({ count: count() })
			.from(report)
			.where(eq(report.resolved, false));

		const [{ count: totalReports } = { count: 0 }] = await ctx.db
			.select({ count: count() })
			.from(report);

		return {
			pendingReports,
			totalReports
		};
	})
});
