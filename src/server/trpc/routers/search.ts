import { ilike, or } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '$server/db';
import { user } from '$server/db/schema/auth-schema';
import { groups } from '$server/db/schema/groups-schema';
import { thread } from '$server/db/schema/thread-schema';
import { publicProcedure, router } from '$server/trpc/init';

export const searchRouter = router({
	global: publicProcedure
		.input(
			z.object({
				query: z.string().min(1),
				limit: z.number().optional().default(5)
			})
		)
		.query(async ({ input }) => {
			const q = `%${input.query}%`;

			const [threadResults, userResults, groupResults] = await Promise.all([
				db
					.select({
						id: thread.id,
						title: thread.title,
						type: db.raw(`'thread'`).as('type')
					})
					.from(thread)
					.where(ilike(thread.title, q))
					.limit(input.limit),

				db
					.select({
						id: user.id,
						title: user.username,
						type: db.raw(`'user'`).as('type')
					})
					.from(user)
					.where(or(ilike(user.username, q), ilike(user.name, q)))
					.limit(input.limit),

				db
					.select({
						id: groups.id,
						title: groups.name,
						type: db.raw(`'group'`).as('type')
					})
					.from(groups)
					.where(ilike(groups.name, q))
					.limit(input.limit)
			]);

			return [...threadResults, ...userResults, ...groupResults];
		})
});
