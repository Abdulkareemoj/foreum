import { TRPCError } from '@trpc/server'
import crypto from 'crypto'
import { and, eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import { groupMembers, groups } from '~/server/db/schema/groups-schema'
import { user } from '~/server/db/schema/auth-schema'
import { thread } from '~/server/db/schema/thread-schema'
import { protectedProcedure, publicProcedure, router } from '~/server/trpc/init'

export const groupsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const conditions = []

        if (input.cursor) {
          conditions.push(sql`${groups.id} < ${input.cursor}`)
        }

        const items = await db
          .select({
            id: groups.id,
            name: groups.name,
            slug: groups.slug,
            description: groups.description,
            createdAt: groups.createdAt,
            bannerImage: groups.bannerImage,
            avatarImage: groups.avatarImage,
            creator: {
              id: user.id,
              name: user.name,
              image: user.image,
            },
            memberCount: sql<number>`count(${groupMembers.userId})`.as('member_count'),
          })
          .from(groups)
          .leftJoin(user, eq(groups.createdBy, user.id))
          .leftJoin(groupMembers, eq(groups.id, groupMembers.groupId))
          .where(conditions.length ? and(...conditions) : undefined)
          .groupBy(groups.id, user.id)
          .limit(input.limit + 1)

        let nextCursor: string | undefined = undefined
        if (items.length > input.limit) {
          const nextItem = items.pop()
          nextCursor = nextItem?.id
        }

        return { items, nextCursor }
      } catch (error) {
        console.error('[groups.list]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch groups' })
      }
    }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const [group] = await db
          .select({
            id: groups.id,
            name: groups.name,
            slug: groups.slug,
            description: groups.description,
            createdAt: groups.createdAt,
            createdBy: groups.createdBy,
            bannerImage: groups.bannerImage,
            avatarImage: groups.avatarImage,
            creator: {
              id: user.id,
              name: user.name,
              image: user.image,
            },
          })
          .from(groups)
          .leftJoin(user, eq(groups.createdBy, user.id))
          .where(eq(groups.slug, input.slug))

        if (!group) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Group not found' })
        }

        // Get member count
        const members = await db
          .select()
          .from(groupMembers)
          .where(eq(groupMembers.groupId, group.id))

        // Check current user's membership
        let membership: { role: 'owner' | 'member' } | null = null
        if (ctx.user) {
          const [userMembership] = await db
            .select()
            .from(groupMembers)
            .where(
              and(eq(groupMembers.groupId, group.id), eq(groupMembers.userId, ctx.user.id))
            )

          if (userMembership) {
            membership = { role: userMembership.role as 'owner' | 'member' }
          }
        }

        return {
          ...group,
          memberCount: members.length,
          membership,
          isOwner: ctx.user?.id === group.createdBy,
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[groups.bySlug]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch group' })
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        slug: z
          .string()
          .min(1)
          .max(100)
          .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const [existing] = await db.select().from(groups).where(eq(groups.slug, input.slug))

        if (existing) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Slug already exists. Choose a different one.',
          })
        }

        const [g] = await db
          .insert(groups)
          .values({
            id: crypto.randomUUID(),
            name: input.name,
            slug: input.slug,
            description: input.description,
            createdBy: ctx.user.id,
          })
          .returning()

        // Creator becomes group owner
        await db.insert(groupMembers).values({
          groupId: g.id,
          userId: ctx.user.id,
          role: 'owner',
        })

        return g
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[groups.create]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create group' })
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().optional(),
        bannerImage: z.string().url().optional(),
        avatarImage: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input

        // Check ownership
        const [group] = await db.select().from(groups).where(eq(groups.id, id))

        if (!group) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Group not found' })
        }

        if (group.createdBy !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only the group owner can update this' })
        }

        const [updated] = await db
          .update(groups)
          .set(updateData)
          .where(eq(groups.id, id))
          .returning()

        return updated
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[groups.update]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update group' })
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const [group] = await db.select().from(groups).where(eq(groups.id, input.id))

        if (!group) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Group not found' })
        }

        if (group.createdBy !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only the group owner can delete this' })
        }

        await db.delete(groups).where(eq(groups.id, input.id))
        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[groups.delete]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete group' })
      }
    }),

  join: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const [existing] = await db
          .select()
          .from(groupMembers)
          .where(
            and(eq(groupMembers.groupId, input.groupId), eq(groupMembers.userId, ctx.user.id))
          )

        if (existing) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'You are already a member of this group',
          })
        }

        await db.insert(groupMembers).values({
          groupId: input.groupId,
          userId: ctx.user.id,
          role: 'member',
        })

        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[groups.join]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to join group' })
      }
    }),

  leave: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const deleted = await db
          .delete(groupMembers)
          .where(and(eq(groupMembers.groupId, input.groupId), eq(groupMembers.userId, ctx.user.id)))
          .returning()

        if (deleted.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'You are not a member of this group.',
          })
        }

        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[groups.leave]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to leave group' })
      }
    }),

  members: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ input }) => {
      try {
        return db
          .select({
            userId: groupMembers.userId,
            role: groupMembers.role,
            joinedAt: groupMembers.joinedAt,
            user: {
              id: user.id,
              name: user.name,
              image: user.image,
            },
          })
          .from(groupMembers)
          .leftJoin(user, eq(groupMembers.userId, user.id))
          .where(eq(groupMembers.groupId, input.groupId))
      } catch (error) {
        console.error('[groups.members]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch members' })
      }
    }),

  threads: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        limit: z.number().default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        // Get threads associated with this group
        // This assumes you have a groupId field in threads table
        // If not, you might need to add it or use a different approach
        const items = await db
          .select()
          .from(thread)
          .where(eq(thread.groupId as any, input.groupId)) // Add groupId to thread schema
          .limit(input.limit + 1)

        let nextCursor: string | undefined = undefined
        if (items.length > input.limit) {
          const nextItem = items.pop()
          nextCursor = nextItem?.id
        }

        return { items, nextCursor }
      } catch (error) {
        console.error('[groups.threads]', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch threads' })
      }
    }),
})