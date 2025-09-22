// server/trpc/routers/notifications.ts
import { and, desc,eq, lt } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '$server/db';
import { notification } from '$server/db/schema/notification-schema';
import { protectedProcedure,publicProcedure, router } from '$server/trpc/init';

export const notificationsRouter = router({
	getAll: protectedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(50).default(10),
				cursor: z.string().optional()
			})
		)
		.query(async ({ ctx, input }) => {
			const { limit, cursor } = input;

			const results = await db
				.select()
				.from(notification)
				.where(
					and(
						eq(notification.userId, ctx.user.id),
						cursor ? lt(notification.id, cursor) : undefined
					)
				)
				.orderBy(desc(notification.createdAt))
				.limit(limit + 1);

			let nextCursor: string | null = null;
			if (results.length > limit) {
				const nextItem = results.pop();
				nextCursor = nextItem?.id ?? null;
			}

			return {
				items: results,
				nextCursor
			};
		}),

	markAsRead: publicProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.mutation(async ({ input }) => {
			await db.update(notification).set({ read: 'true' }).where(eq(notification.id, input.id));
			return { success: true };
		}),

	markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
		const userId = ctx.user.id;
		await db.update(notification).set({ read: 'true' }).where(eq(notification.userId, userId));
		return { success: true };
	}),

	create: publicProcedure
		.input(
			z.object({
				userId: z.string(),
				type: z.string(),
				title: z.string(),
				message: z.string(),
				link: z.string()
			})
		)
		.mutation(async ({ input }) => {
			await db.insert(notification).values({
				id: crypto.randomUUID(),
				...input
			});
			return { success: true };
		})
	// countUnread: protectedProcedure.query(async ({ ctx }) => {
	// 	const userId = ctx.user.id;
	// 	const result = await db.query.notification.findMany({
	// 		where: eq(notification.userId, userId)
	// 	});
	// 	const count = result.filter((n) => !n.read).length;
	// 	return { count };
	// })
});
