import { z } from 'zod';

import { db } from '~/server/db';
import { resources, resourceTags } from '~/server/db/schema/resources-schema';
import { protectedProcedure, publicProcedure, router } from '~/server/trpc/init';

export const resourcesRouter = router({
	list: publicProcedure.query(() => db.select().from(resources)),

	create: protectedProcedure
		.input(
			z.object({
				title: z.string().min(1),
				url: z.string().url(),
				description: z.string().optional(),
				tagIds: z.array(z.string()).optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const [res] = await db
				.insert(resources)
				.values({
					id: crypto.randomUUID(),
					title: input.title,
					url: input.url,
					description: input.description,
					createdBy: ctx.user.id
				})
				.returning();

			if (input.tagIds) {
				await db
					.insert(resourceTags)
					.values(input.tagIds.map((t) => ({ resourceId: res.id, tagId: t })));
			}

			return res;
		})
});
