// server/trpc/routers/gamification.ts
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '$server/db';
import { badges, reputation, userBadges } from '$server/db/schema/reputations-schema';
import { protectedProcedure, publicProcedure,router } from '$server/trpc/init';

export const reputationRouter = router({
	getReputation: protectedProcedure.query(({ ctx }) =>
		db.select().from(reputation).where(eq(reputation.userId, ctx.user.id))
	),

	awardBadge: protectedProcedure
		.input(z.object({ userId: z.string(), badgeId: z.string() }))
		.mutation(({ input }) =>
			db.insert(userBadges).values({
				userId: input.userId,
				badgeId: input.badgeId
			})
		),

	listBadges: publicProcedure.query(() => db.select().from(badges))
});
