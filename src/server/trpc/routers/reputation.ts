import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import { badges, reputation, userBadges } from '~/server/db/schema/reputations-schema'
import { protectedProcedure, publicProcedure, router } from '~/server/trpc/init'

export const reputationRouter = router({
  getReputation: protectedProcedure.query(async ({ ctx }) => {
    try {
      const [rep] = await db
        .select()
        .from(reputation)
        .where(eq(reputation.userId, ctx.user.id))

      // Get earned badges with details
      const earnedBadges = await db
        .select({
          id: badges.id,
          name: badges.name,
          description: badges.description,
          icon: badges.icon,
          awardedAt: userBadges.awardedAt,
        })
        .from(userBadges)
        .leftJoin(badges, eq(userBadges.badgeId, badges.id))
        .where(eq(userBadges.userId, ctx.user.id))

      return {
        points: Number(rep?.points || 0),
        badges: earnedBadges,
      }
    } catch (error) {
      console.error('[reputation.getReputation]', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch reputation',
      })
    }
  }),

  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        const [rep] = await db
          .select()
          .from(reputation)
          .where(eq(reputation.userId, input.userId))

        const earnedBadges = await db
          .select({
            id: badges.id,
            name: badges.name,
            description: badges.description,
            icon: badges.icon,
            awardedAt: userBadges.awardedAt,
          })
          .from(userBadges)
          .leftJoin(badges, eq(userBadges.badgeId, badges.id))
          .where(eq(userBadges.userId, input.userId))

        return {
          points: Number(rep?.points || 0),
          badges: earnedBadges,
        }
      } catch (error) {
        console.error('[reputation.getByUserId]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch reputation',
        })
      }
    }),

  listBadges: publicProcedure.query(async () => {
    try {
      return db.select().from(badges)
    } catch (error) {
      console.error('[reputation.listBadges]', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch badges',
      })
    }
  }),

  awardBadge: protectedProcedure
    .input(z.object({ userId: z.string(), badgeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can award badges' })
      }

      try {
        // Check if already awarded
        const [existing] = await db
          .select()
          .from(userBadges)
          .where(
            and(eq(userBadges.userId, input.userId), eq(userBadges.badgeId, input.badgeId))
          )

        if (existing) {
          throw new TRPCError({ code: 'CONFLICT', message: 'Badge already awarded' })
        }

        await db.insert(userBadges).values({
          userId: input.userId,
          badgeId: input.badgeId,
        })

        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[reputation.awardBadge]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to award badge',
        })
      }
    }),
})