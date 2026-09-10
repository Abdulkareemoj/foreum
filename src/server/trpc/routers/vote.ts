import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import { vote, voteCount } from '~/server/db/schema/vote-schema'
import { protectedProcedure, publicProcedure, router } from '~/server/trpc/init'

export const voteRouter = router({
  getByThread: publicProcedure
    .input(z.object({ threadId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const counts = await db
          .select()
          .from(voteCount)
          .where(eq(voteCount.threadId, input.threadId))
          .limit(1)

        const userVote = ctx.user
          ? await db
              .select()
              .from(vote)
              .where(
                and(
                  eq(vote.threadId, input.threadId),
                  eq(vote.userId, ctx.user.id)
                )
              )
              .limit(1)
          : []

        return {
          score: counts[0]?.score ?? 0,
          upvotes: counts[0]?.upvotes ?? 0,
          downvotes: counts[0]?.downvotes ?? 0,
          userVote: (userVote[0]?.value as 1 | -1) ?? null,
        }
      } catch (error) {
        console.error('[vote.getByThread]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch votes',
        })
      }
    }),

  getByReply: publicProcedure
    .input(z.object({ replyId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const counts = await db
          .select()
          .from(voteCount)
          .where(eq(voteCount.replyId, input.replyId))
          .limit(1)

        const userVote = ctx.user
          ? await db
              .select()
              .from(vote)
              .where(
                and(
                  eq(vote.replyId, input.replyId),
                  eq(vote.userId, ctx.user.id)
                )
              )
              .limit(1)
          : []

        return {
          score: counts[0]?.score ?? 0,
          upvotes: counts[0]?.upvotes ?? 0,
          downvotes: counts[0]?.downvotes ?? 0,
          userVote: (userVote[0]?.value as 1 | -1) ?? null,
        }
      } catch (error) {
        console.error('[vote.getByReply]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch votes',
        })
      }
    }),

  toggle: protectedProcedure
    .input(
      z.object({
        value: z.literal(1).or(z.literal(-1)),
        threadId: z.string().optional(),
        replyId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.threadId && !input.replyId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either threadId or replyId is required',
        })
      }

      const targetField = input.threadId ? 'threadId' : 'replyId'
      const targetId = input.threadId ?? input.replyId!

      try {
        // Check for existing vote
        const existing = await db
          .select()
          .from(vote)
          .where(
            and(
              eq(vote.userId, ctx.user.id),
              eq(
                input.threadId ? vote.threadId : vote.replyId,
                targetId
              )
            )
          )
          .limit(1)

        const existingVote = existing[0]

        if (existingVote) {
          if (existingVote.value === input.value) {
            // Same value → remove vote
            await db.delete(vote).where(eq(vote.id, existingVote.id))
            await adjustCount(targetField, targetId, -input.value, input.value === 1 ? -1 : 0, input.value === -1 ? -1 : 0)
            return { action: 'removed' as const, score: 0 }
          } else {
            // Different value → update
            await db.update(vote).set({ value: input.value }).where(eq(vote.id, existingVote.id))
            const scoreDelta = input.value * 2 // e.g. -1 → +1 = +2
            await adjustCount(targetField, targetId, scoreDelta, input.value === 1 ? 1 : -1, input.value === -1 ? 1 : -1)
            return { action: 'updated' as const, score: scoreDelta }
          }
        } else {
          // No existing → create
          const id = crypto.randomUUID()
          await db.insert(vote).values({
            id,
            value: input.value,
            userId: ctx.user.id,
            threadId: input.threadId ?? null,
            replyId: input.replyId ?? null,
          })
          await adjustCount(targetField, targetId, input.value, input.value === 1 ? 1 : 0, input.value === -1 ? 1 : 0)
          return { action: 'added' as const, score: input.value }
        }
      } catch (error) {
        console.error('[vote.toggle]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to toggle vote',
        })
      }
    }),
})

async function getCountRecord(targetField: 'threadId' | 'replyId', targetId: string) {
  const col = targetField === 'threadId' ? voteCount.threadId : voteCount.replyId
  const rows = await db.select().from(voteCount).where(eq(col, targetId)).limit(1)
  return rows[0] ?? null
}

async function ensureCountRecord(targetField: 'threadId' | 'replyId', targetId: string) {
  const existing = await getCountRecord(targetField, targetId)
  if (existing) return existing

  const id = crypto.randomUUID()
  const values =
    targetField === 'threadId'
      ? { id, threadId: targetId, replyId: null }
      : { id, threadId: null, replyId: targetId }

  await db.insert(voteCount).values(values)
  return getCountRecord(targetField, targetId) as Promise<NonNullable<Awaited<ReturnType<typeof getCountRecord>>>>
}

async function adjustCount(
  targetField: 'threadId' | 'replyId',
  targetId: string,
  scoreDelta: number,
  upDelta: number,
  downDelta: number
) {
  const record = await ensureCountRecord(targetField, targetId)
  await db
    .update(voteCount)
    .set({
      score: (record.score ?? 0) + scoreDelta,
      upvotes: Math.max(0, (record.upvotes ?? 0) + upDelta),
      downvotes: Math.max(0, (record.downvotes ?? 0) + downDelta),
    })
    .where(eq(voteCount.id, record.id))
}
