import { TRPCError } from '@trpc/server';
import crypto from 'crypto';
import { and, count, desc, eq } from 'drizzle-orm';
import { z } from 'zod';

import { user } from '~/server/db/schema/auth-schema';
import { report } from '~/server/db/schema/moderation-schema';
import { protectedProcedure, router } from '~/server/trpc/init';

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
			try {
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
			} catch (error) {
				if (error instanceof TRPCError) throw error;
				console.error('[moderation.createReport]', error);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create report' });
			}
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
			try {
				if (ctx.user!.role !== 'admin') {
					throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Only admins can view reports' });
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
			} catch (error) {
				if (error instanceof TRPCError) throw error;
				console.error('[moderation.listReports]', error);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch reports' });
			}
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
	}),

	recentReports: protectedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(50).default(5),
				resolved: z.boolean().optional()
			})
		)
		.query(async ({ ctx, input }) => {
			try {
				if (ctx.user!.role !== 'admin') {
					throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Only admins can view reports' });
				}

				const conditions = [eq(report.resolved, input.resolved ?? false)];

				const reports = await ctx.db
					.select({
						id: report.id,
						type: report.type,
						reason: report.reason,
						reportedBy: user.username,
						createdAt: report.createdAt
					})
					.from(report)
					.leftJoin(user, eq(report.reportedById, user.id))
					.where(and(...conditions))
					.orderBy(desc(report.createdAt))
					.limit(input.limit);

				return reports;
			} catch (error) {
				if (error instanceof TRPCError) throw error;
				console.error('[moderation.recentReports]', error);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch reports' });
			}
		})
});
