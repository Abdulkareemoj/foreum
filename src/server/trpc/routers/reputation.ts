// server/trpc/routers/gamification.ts
import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '$server/trpc/init';
import { db } from '$server/db';
import { reputation, badges, userBadges } from '$server/db/schema/reputations-schema';
import { eq } from 'drizzle-orm';

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
