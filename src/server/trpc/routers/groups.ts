// server/trpc/routers/groups.ts
import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '$server/trpc/init';
import { db } from '$server/db';
import { groups, groupMembers } from '$server/db/schema/groups-schema';
import { eq } from 'drizzle-orm';

export const groupsRouter = router({
	list: publicProcedure.query(() => db.select().from(groups)),

	create: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1).max(100),
				slug: z
					.string()
					.min(1)
					.regex(/^[a-z0-9-]+$/),
				description: z.string().optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const [g] = await db
				.insert(groups)
				.values({
					id: crypto.randomUUID(),
					name: input.name,
					slug: input.slug,
					description: input.description,
					createdBy: ctx.user.id
				})
				.returning();

			await db.insert(groupMembers).values({
				groupId: g.id,
				userId: ctx.user.id,
				role: 'owner'
			});

			return g;
		}),

	join: protectedProcedure.input(z.object({ groupId: z.string() })).mutation(({ ctx, input }) =>
		db.insert(groupMembers).values({
			groupId: input.groupId,
			userId: ctx.user.id,
			role: 'member'
		})
	)
});
