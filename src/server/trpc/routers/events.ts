import { TRPCError } from '@trpc/server'
import crypto from 'crypto'
import { and, desc, eq, gt, ilike, lt } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import { eventAttendees, events } from '~/server/db/schema/events-schema'
import { user } from '~/server/db/schema/auth-schema'
import { protectedProcedure, publicProcedure, router } from '~/server/trpc/init'

export const eventsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        groupId: z.string().optional(),
        query: z.string().optional(),
        upcoming: z.boolean().optional(),
        past: z.boolean().optional(),
        visibility: z.enum(['public', 'private', 'unlisted']).optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const now = new Date()

        const conditions = []

        if (input.groupId) {
          conditions.push(eq(events.groupId, input.groupId))
        }

        if (input.visibility) {
          conditions.push(eq(events.visibility, input.visibility))
        }

        if (input.query) {
          conditions.push(ilike(events.title, `%${input.query}%`))
        }

        if (input.upcoming) {
          conditions.push(gt(events.startsAt, now))
        }

        if (input.past) {
          conditions.push(lt(events.endsAt, now))
        }

        if (input.cursor) {
          conditions.push(lt(events.startsAt, new Date(input.cursor)))
        }

        const items = await db
          .select({
            id: events.id,
            title: events.title,
            description: events.description,
            eventType: events.eventType,
            physicalLocation: events.physicalLocation,
            virtualUrl: events.virtualUrl,
            startsAt: events.startsAt,
            endsAt: events.endsAt,
            visibility: events.visibility,
            coverImage: events.coverImage,
            maxAttendees: events.maxAttendees,
            createdAt: events.createdAt,
            creator: {
              id: user.id,
              name: user.name,
              image: user.image,
            },
          })
          .from(events)
          .leftJoin(user, eq(events.createdBy, user.id))
          .where(conditions.length ? and(...conditions) : undefined)
          .orderBy(desc(events.startsAt))
          .limit(input.limit + 1)

        let nextCursor: string | undefined = undefined
        if (items.length > input.limit) {
          const nextItem = items.pop()
          nextCursor = nextItem?.startsAt?.toISOString()
        }

        return {
          items,
          nextCursor,
        }
      } catch (error) {
        console.error('[events.list]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch events' })
      }
    }),

  getById: publicProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      try {
        const [event] = await db
          .select({
            id: events.id,
            title: events.title,
            description: events.description,
            eventType: events.eventType,
            physicalLocation: events.physicalLocation,
            virtualUrl: events.virtualUrl,
            startsAt: events.startsAt,
            endsAt: events.endsAt,
            visibility: events.visibility,
            coverImage: events.coverImage,
            maxAttendees: events.maxAttendees,
            createdAt: events.createdAt,
            creator: {
              id: user.id,
              name: user.name,
              image: user.image,
            },
          })
          .from(events)
          .leftJoin(user, eq(events.createdBy, user.id))
          .where(eq(events.id, input.eventId))
          .limit(1)

        if (!event) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
        }

        const attendees = await db
          .select()
          .from(eventAttendees)
          .where(eq(eventAttendees.eventId, input.eventId))

        return {
          ...event,
          attendees,
          counts: {
            going: attendees.filter((a) => a.status === 'going').length,
            maybe: attendees.filter((a) => a.status === 'maybe').length,
            notGoing: attendees.filter((a) => a.status === 'not_going').length,
          },
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[events.getById]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch event' })
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, 'Title is required').max(200),
        description: z.string().optional(),
        eventType: z.enum(['physical', 'virtual', 'hybrid', 'other']),
        physicalLocation: z.string().optional(),
        virtualUrl: z.string().url().optional(),
        startsAt: z.string().or(z.date()),
        endsAt: z.string().or(z.date()),
        maxAttendees: z.number().min(1).optional(),
        visibility: z.enum(['public', 'private', 'unlisted']).default('public'),
        coverImage: z.string().url().optional(),
        groupId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Convert string dates to Date objects if needed
        const startsAt = typeof input.startsAt === 'string' ? new Date(input.startsAt) : input.startsAt
        const endsAt = typeof input.endsAt === 'string' ? new Date(input.endsAt) : input.endsAt

        const [result] = await db
          .insert(events)
          .values({
            id: crypto.randomUUID(),
            createdBy: ctx.user.id,
            title: input.title,
            description: input.description,
            eventType: input.eventType,
            physicalLocation: input.physicalLocation,
            virtualUrl: input.virtualUrl,
            startsAt,
            endsAt,
            maxAttendees: input.maxAttendees,
            visibility: input.visibility,
            coverImage: input.coverImage,
            groupId: input.groupId,
          })
          .returning()

        return result
      } catch (error) {
        console.error('[events.create]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create event' })
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(200).optional(),
        description: z.string().optional(),
        eventType: z.enum(['physical', 'virtual', 'hybrid', 'other']).optional(),
        physicalLocation: z.string().optional(),
        virtualUrl: z.string().url().optional(),
        startsAt: z.string().or(z.date()).optional(),
        endsAt: z.string().or(z.date()).optional(),
        maxAttendees: z.number().min(1).optional(),
        visibility: z.enum(['public', 'private', 'unlisted']).optional(),
        coverImage: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input

        const [existing] = await db
          .select({ createdBy: events.createdBy })
          .from(events)
          .where(eq(events.id, id))

        if (!existing) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
        }

        if (existing.createdBy !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to update this event' })
        }

        const [updated] = await db
          .update(events)
          .set({ ...updateData, updatedAt: new Date() })
          .where(eq(events.id, id))
          .returning()

        return updated
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[events.update]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update event' })
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const [existing] = await db
          .select({ createdBy: events.createdBy })
          .from(events)
          .where(eq(events.id, input.id))

        if (!existing) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
        }

        if (existing.createdBy !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to delete this event' })
        }

        await db.delete(events).where(eq(events.id, input.id))
        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[events.delete]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete event' })
      }
    }),

  rsvp: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        status: z.enum(['going', 'maybe', 'not_going']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await db
          .insert(eventAttendees)
          .values({
            eventId: input.eventId,
            userId: ctx.user.id,
            status: input.status,
          })
          .onConflictDoUpdate({
            target: [eventAttendees.eventId, eventAttendees.userId],
            set: { status: input.status },
          })

        return { success: true }
      } catch (error) {
        console.error('[events.rsvp]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update RSVP' })
      }
    }),

  attendees: publicProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      try {
        return db
          .select({
            userId: eventAttendees.userId,
            status: eventAttendees.status,
            user: {
              id: user.id,
              name: user.name,
              image: user.image,
            },
          })
          .from(eventAttendees)
          .leftJoin(user, eq(eventAttendees.userId, user.id))
          .where(eq(eventAttendees.eventId, input.eventId))
      } catch (error) {
        console.error('[events.attendees]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch attendees' })
      }
    }),
})