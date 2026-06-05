import { count, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '~/server/db';
import { user } from '~/server/db/schema/auth-schema';
import { category, reply, thread } from '~/server/db/schema/thread-schema';
import { reactionSummary } from '~/server/db/schema/reaction-schema';
import { adminProcedure, router } from '~/server/trpc/init';

export const analyticsRouter = router({
	getOverview: adminProcedure.query(async () => {
		const [{ count: totalUsers } = { count: 0 }] = await db
			.select({ count: count() })
			.from(user);

		const [{ count: totalThreads } = { count: 0 }] = await db
			.select({ count: count() })
			.from(thread);

		const [{ count: totalReplies } = { count: 0 }] = await db
			.select({ count: count() })
			.from(reply);

		const [{ total: totalReactions } = { total: 0 }] = await db
			.select({ total: sql<number>`COALESCE(SUM(${reactionSummary.totalReactions}), 0)::int` })
			.from(reactionSummary);

		const [threadAuthors, replyAuthors] = await Promise.all([
			db.select({ authorId: thread.authorId }).from(thread),
			db.select({ authorId: reply.authorId }).from(reply),
		]);
		const uniqueAuthors = new Set([
			...threadAuthors.map(r => r.authorId),
			...replyAuthors.map(r => r.authorId),
		]);

		return {
			totalUsers: Number(totalUsers),
			totalThreads: Number(totalThreads),
			totalReplies: Number(totalReplies),
			totalReactions,
			activeUsers: uniqueAuthors.size,
		};
	}),

	getUserGrowth: adminProcedure.query(async () => {
		const result = await db
			.select({
				monthKey: sql<string>`to_char(created_at, 'YYYY-MM')`,
				monthLabel: sql<string>`to_char(created_at, 'Mon')`,
				year: sql<string>`to_char(created_at, 'YYYY')`,
				count: sql<number>`COUNT(*)::int`,
			})
			.from(user)
			.where(sql`created_at >= NOW() - INTERVAL '12 months'`)
			.groupBy(sql`monthKey, monthLabel, year`)
			.orderBy(sql`monthKey`);

		return result.map((row) => ({
			month: `${row.monthLabel} ${row.year}`,
			users: Number(row.count),
		}));
	}),

	getContentVolume: adminProcedure.query(async () => {
		const [threadsResult, repliesResult] = await Promise.all([
			db
				.select({
					monthKey: sql<string>`to_char(created_at, 'YYYY-MM')`,
					monthLabel: sql<string>`to_char(created_at, 'Mon')`,
					year: sql<string>`to_char(created_at, 'YYYY')`,
					count: sql<number>`COUNT(*)::int`,
				})
				.from(thread)
				.where(sql`created_at >= NOW() - INTERVAL '12 months'`)
				.groupBy(sql`monthKey, monthLabel, year`)
				.orderBy(sql`monthKey`),
			db
				.select({
					monthKey: sql<string>`to_char(created_at, 'YYYY-MM')`,
					count: sql<number>`COUNT(*)::int`,
				})
				.from(reply)
				.where(sql`created_at >= NOW() - INTERVAL '12 months'`)
				.groupBy(sql`monthKey`)
				.orderBy(sql`monthKey`),
		]);

		const replyMap = new Map<string, number>();
		for (const row of repliesResult) {
			replyMap.set(row.monthKey, Number(row.count));
		}

		return threadsResult.map((row) => ({
			month: `${row.monthLabel} ${row.year}`,
			threads: Number(row.count),
			replies: replyMap.get(row.monthKey) ?? 0,
		}));
	}),

	getCategoryDistribution: adminProcedure.query(async () => {
		const result = await db
			.select({
				name: category.name,
				count: count(),
			})
			.from(category)
			.leftJoin(thread, eq(thread.categoryId, category.id))
			.groupBy(category.id, category.name)
			.orderBy(sql`count DESC`);

		return result.map((r) => ({
			category: r.name,
			threads: Number(r.count),
		}));
	}),

	getEngagement: adminProcedure.query(async () => {
		const [avgResult] = await db
			.select({
				avgReplies: sql<number>`COALESCE(AVG(reply_count), 0)::numeric(10,1)`,
			})
			.from(thread)
			.where(sql`reply_count > 0`);

		const [reactionsResult] = await db
			.select({
				total: sql<number>`COALESCE(SUM(total_reactions), 0)::int`,
				threadCount: count(),
			})
			.from(reactionSummary);

		const [{ count: totalThreads } = { count: 0 }] = await db
			.select({ count: count() })
			.from(thread);

		const avgReplies = Number(avgResult?.avgReplies ?? 0);
		const totalReacted = Number(reactionsResult?.total ?? 0);
		const reactedThreads = Number(reactionsResult?.threadCount ?? 0);

		return {
			avgRepliesPerThread: avgReplies,
			totalReactions: totalReacted,
			threadsWithReactions: reactedThreads,
			totalThreads: Number(totalThreads),
			reactionRate: totalThreads > 0
				? Math.round((reactedThreads / totalThreads) * 100)
				: 0,
		};
	}),

	getTopContributors: adminProcedure
		.input(z.object({ limit: z.number().min(1).max(50).default(10) }))
		.query(async ({ input }) => {
			const [threadCounts, replyCounts] = await Promise.all([
				db
					.select({ authorId: thread.authorId, threadCount: count() })
					.from(thread)
					.groupBy(thread.authorId),
				db
					.select({ authorId: reply.authorId, replyCount: count() })
					.from(reply)
					.groupBy(reply.authorId),
			]);

			const contributionMap = new Map<string, { threadCount: number; replyCount: number }>();
			for (const t of threadCounts) {
				contributionMap.set(t.authorId, { threadCount: Number(t.threadCount), replyCount: 0 });
			}
			for (const r of replyCounts) {
				const existing = contributionMap.get(r.authorId) ?? { threadCount: 0, replyCount: 0 };
				existing.replyCount += Number(r.replyCount);
				contributionMap.set(r.authorId, existing);
			}

			const sorted = [...contributionMap.entries()]
				.map(([id, c]) => ({ id, total: c.threadCount + c.replyCount, ...c }))
				.sort((a, b) => b.total - a.total)
				.slice(0, input.limit);

			if (sorted.length === 0) return [];

			const users = await db
				.select({ id: user.id, name: user.name, username: user.username, image: user.image })
				.from(user)
				.where(sql`${user.id} IN (${sorted.map(s => s.id)})`);

			const userMap = new Map(users.map((u) => [u.id, u]));

			return sorted.map((s) => {
				const u = userMap.get(s.id);
				return {
					id: s.id,
					name: u?.name ?? 'Unknown',
					username: u?.username ?? null,
					image: u?.image ?? null,
					threadCount: s.threadCount,
					replyCount: s.replyCount,
					total: s.total,
				};
			});
		}),
});
