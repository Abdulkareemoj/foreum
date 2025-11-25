import { and, desc, eq, gt, ilike, lt } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '$server/db';
import { eventAttendees, events } from '$server/db/schema/events-schema';
import { protectedProcedure, publicProcedure, router } from '$server/trpc/init';

export const eventsRouter = router({
	list: publicProcedure
		.input(
			z
				.object({
					groupId: z.string().optional(),
					query: z.string().optional(), // search
					upcoming: z.boolean().optional(),
					past: z.boolean().optional(),
					visibility: z.enum(['public', 'private', 'unlisted']).optional()
				})
				.optional()
		)
		.query(async ({ input }) => {
			const now = new Date();

			const where = and(
				input?.groupId ? eq(events.groupId, input.groupId) : undefined,
				input?.visibility ? eq(events.visibility, input.visibility) : undefined,
				input?.query ? ilike(events.title, `%${input.query}%`) : undefined,
				input?.upcoming ? gt(events.startsAt, now) : undefined,
				input?.past ? lt(events.endsAt, now) : undefined
			);

			return db.select().from(events).where(where).orderBy(desc(events.startsAt));
		}),

	create: protectedProcedure
		.input(
			z.object({
				title: z.string().min(1),
				description: z.string().optional(),
				eventType: z.enum(['physical', 'virtual', 'hybrid', 'other']),
				physicalLocation: z.string().optional(), // For physical
				virtualUrl: z.url().optional(), // For virtual
				startsAt: z.date(),
				endsAt: z.date(),
				capacity: z.number().min(1).optional(),
				visibility: z.enum(['public', 'private', 'unlisted']).default('public'),
				coverImage: z.url().optional(),
				groupId: z.string().optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const result = await db
				.insert(events)
				.values({
					id: crypto.randomUUID(),
					createdBy: ctx.user.id,
					...input
				})
				.returning();

			return result[0]; // Return single object instead of array
		}),

	rsvp: protectedProcedure
		.input(
			z.object({
				eventId: z.string(),
				status: z.enum(['going', 'maybe', 'not_going'])
			})
		)
		.mutation(async ({ ctx, input }) => {
			return db
				.insert(eventAttendees)
				.values({
					eventId: input.eventId,
					userId: ctx.user.id,
					status: input.status
				})
				.onConflictDoUpdate({
					target: [eventAttendees.eventId, eventAttendees.userId],
					set: { status: input.status }
				});
		}),

	get: publicProcedure.input(z.object({ eventId: z.string() })).query(async ({ input }) => {
		const event = await db.select().from(events).where(eq(events.id, input.eventId)).limit(1);

		const attendees = await db
			.select()
			.from(eventAttendees)
			.where(eq(eventAttendees.eventId, input.eventId));

		return {
			event: event[0],
			attendees,
			counts: {
				going: attendees.filter((a) => a.status === 'going').length,
				maybe: attendees.filter((a) => a.status === 'maybe').length,
				notGoing: attendees.filter((a) => a.status === 'not_going').length
			}
		};
	}),
	attendees: publicProcedure.input(z.object({ eventId: z.string() })).query(async ({ input }) => {
		return db.select().from(eventAttendees).where(eq(eventAttendees.eventId, input.eventId));
	})
});
