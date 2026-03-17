import { TRPCError } from '@trpc/server'
import { count, desc, eq, ilike, or } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import { user } from '~/server/db/schema/auth-schema'
import { profile } from '~/server/db/schema/profile-schema'
import { thread, reply } from '~/server/db/schema/thread-schema'
import { protectedProcedure, publicProcedure, router } from '~/server/trpc/init'

export const userRouter = router({
  byUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      try {
        const [result] = await db
          .select({
            id: user.id,
            name: user.name,
            username: user.username,
            image: user.image,
            createdAt: user.createdAt,
            bio: profile.bio,
            location: profile.location,
            website: profile.website,
          })
          .from(user)
          .leftJoin(profile, eq(profile.id, user.id))
          .where(
            or(
              eq(user.username, input.username.toLowerCase()),
              eq(user.id, input.username)
            )
          )

        return result ?? null
      } catch (error) {
        console.error('[user.byUsername]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch user',
        })
      }
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        username: z.string().min(3).max(30).regex(/^[a-z0-9_-]+$/),
        image: z.string().url().optional(),
        bio: z.string().max(500).optional(),
        location: z.string().max(100).optional(),
        website: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check username not taken by another user
        const [existing] = await db
          .select({ id: user.id })
          .from(user)
          .where(eq(user.username, input.username))

        if (existing && existing.id !== ctx.user.id) {
          throw new TRPCError({ code: 'CONFLICT', message: 'Username already taken' })
        }

        // Update user
        await db
          .update(user)
          .set({ name: input.name, username: input.username, image: input.image })
          .where(eq(user.id, ctx.user.id))

        // Upsert profile
        await db
          .insert(profile)
          .values({
            id: ctx.user.id,
            bio: input.bio,
            location: input.location,
            website: input.website,
          })
          .onConflictDoUpdate({
            target: profile.id,
            set: {
              bio: input.bio,
              location: input.location,
              website: input.website,
              updatedAt: new Date(),
            },
          })

        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[user.updateProfile]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update profile',
        })
      }
    }),

  search: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        return db
          .select({
            id: user.id,
            name: user.name,
            username: user.username,
            image: user.image,
          })
          .from(user)
          .where(ilike(user.name, `%${input.query}%`))
          .limit(10)
      } catch (error) {
        console.error('[user.search]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to search users',
        })
      }
    }),

  getThreads: publicProcedure
    .input(z.object({ userId: z.string(), limit: z.number().default(10) }))
    .query(async ({ input }) => {
      try {
        return db
          .select({
            id: thread.id,
            title: thread.title,
            createdAt: thread.createdAt,
            replyCount: thread.replyCount,
          })
          .from(thread)
          .where(eq(thread.authorId, input.userId))
          .limit(input.limit)
      } catch (error) {
        console.error('[user.getThreads]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch user threads',
        })
      }
    }),

  topContributors: publicProcedure
    .input(z.object({ limit: z.number().default(5) }))
    .query(async ({ input }) => {
      try {
        // Aggregate thread counts per user as a proxy for "top contributor"
        // In a real app we might sum up reputation points or total posts
        const threadCount = count(thread.id)
        
        return db
          .select({
            id: user.id,
            name: user.name,
            username: user.username,
            image: user.image,
            displayUsername: user.username, // mapping for UI consistency
            threadCount: threadCount,
          })
          .from(user)
          .leftJoin(thread, eq(user.id, thread.authorId))
          .groupBy(user.id)
          .orderBy(desc(threadCount))
          .limit(input.limit)
      } catch (error) {
        console.error('[user.topContributors]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch top contributors',
        })
      }
    }),
})