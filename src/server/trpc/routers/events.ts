// server/trpc/routers/events.ts
import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '$server/trpc/init';
import { db } from '$server/db';
import { events, eventAttendees } from '$server/db/schema/events-schema';
import { eq } from 'drizzle-orm';

export const eventsRouter = router({
	list: publicProcedure.query(() => db.select().from(events)),

	create: protectedProcedure
		.input(
			z.object({
				title: z.string().min(1),
				description: z.string().optional(),
				location: z.string().optional(),
				startsAt: z.date(),
				endsAt: z.date(),
				groupId: z.string().optional()
			})
		)
		.mutation(({ ctx, input }) =>
			db
				.insert(events)
				.values({
					id: crypto.randomUUID(),
					...input,
					createdBy: ctx.user.id
				})
				.returning()
		),

	rsvp: protectedProcedure
		.input(
			z.object({
				eventId: z.string(),
				status: z.enum(['going', 'maybe', 'not_going'])
			})
		)
		.mutation(({ ctx, input }) =>
			db
				.insert(eventAttendees)
				.values({
					eventId: input.eventId,
					userId: ctx.user.id,
					status: input.status
				})
				.onConflictDoUpdate({
					target: [eventAttendees.eventId, eventAttendees.userId],
					set: { status: input.status }
				})
		)
});
