import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import {
  reaction,
  reactionCount,
  reactionSummary,
} from '~/server/db/schema/reaction-schema'
import { protectedProcedure, publicProcedure, router } from '~/server/trpc/init'

export const reactionsRouter = router({
  getByThread: publicProcedure
    .input(z.object({ threadId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const counts = await db
          .select()
          .from(reactionCount)
          .where(eq(reactionCount.threadId, input.threadId))
          .limit(1)

        const userReaction = ctx.user
          ? await db
              .select()
              .from(reaction)
              .where(
                and(
                  eq(reaction.threadId, input.threadId),
                  eq(reaction.userId, ctx.user.id)
                )
              )
              .limit(1)
          : []

        return {
          counts: counts[0] ?? {
            likeCount: 0,
            heartCount: 0,
            laughCount: 0,
            total: 0,
          },
          userReaction: userReaction[0]?.type ?? null,
        }
      } catch (error) {
        console.error('[reactions.getByThread]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch reactions',
        })
      }
    }),

  getByReply: publicProcedure
    .input(z.object({ replyId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const counts = await db
          .select()
          .from(reactionCount)
          .where(eq(reactionCount.replyId, input.replyId))
          .limit(1)

        const userReaction = ctx.user
          ? await db
              .select()
              .from(reaction)
              .where(
                and(
                  eq(reaction.replyId, input.replyId),
                  eq(reaction.userId, ctx.user.id)
                )
              )
              .limit(1)
          : []

        return {
          counts: counts[0] ?? {
            likeCount: 0,
            heartCount: 0,
            laughCount: 0,
            total: 0,
          },
          userReaction: userReaction[0]?.type ?? null,
        }
      } catch (error) {
        console.error('[reactions.getByReply]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch reactions',
        })
      }
    }),

  toggle: protectedProcedure
    .input(
      z.object({
        type: z.enum(['like', 'heart', 'laugh']),
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

      try {
        const targetField = input.threadId ? 'threadId' : 'replyId'
        const targetId = input.threadId ?? input.replyId!

        // Check for existing reaction
        const existing = await db
          .select()
          .from(reaction)
          .where(
            and(
              eq(reaction.userId, ctx.user.id),
              eq(
                input.threadId ? reaction.threadId : reaction.replyId,
                targetId
              )
            )
          )
          .limit(1)

        const existingReaction = existing[0]

        if (existingReaction) {
          if (existingReaction.type === input.type) {
            // Same type → remove reaction
            await db
              .delete(reaction)
              .where(eq(reaction.id, existingReaction.id))

            await decrementCount(targetField, targetId, input.type)
            return { action: 'removed' as const, type: input.type }
          } else {
            // Different type → update
            await db
              .update(reaction)
              .set({ type: input.type })
              .where(eq(reaction.id, existingReaction.id))

            await updateCount(targetField, targetId, existingReaction.type, input.type)
            return { action: 'updated' as const, type: input.type }
          }
        } else {
          // No existing → create
          const id = crypto.randomUUID()
          await db.insert(reaction).values({
            id,
            type: input.type,
            userId: ctx.user.id,
            threadId: input.threadId ?? null,
            replyId: input.replyId ?? null,
          })

          await incrementCount(targetField, targetId, input.type)
          return { action: 'added' as const, type: input.type }
        }
      } catch (error) {
        console.error('[reactions.toggle]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to toggle reaction',
        })
      }
    }),
})

const countColumnMap = {
  like: 'likeCount' as const,
  heart: 'heartCount' as const,
  laugh: 'laughCount' as const,
}

async function getCountRecord(targetField: 'threadId' | 'replyId', targetId: string) {
  const col = targetField === 'threadId' ? reactionCount.threadId : reactionCount.replyId
  const rows = await db.select().from(reactionCount).where(eq(col, targetId)).limit(1)
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

  await db.insert(reactionCount).values(values)
  return getCountRecord(targetField, targetId) as Promise<NonNullable<Awaited<ReturnType<typeof getCountRecord>>>>
}

async function incrementCount(targetField: 'threadId' | 'replyId', targetId: string, type: string) {
  const record = await ensureCountRecord(targetField, targetId)
  const col = countColumnMap[type as keyof typeof countColumnMap]
  if (!col) return

  const colRef = reactionCount[col]
  const totalRef = reactionCount.total
  await db
    .update(reactionCount)
    .set({
      [col]: (record[col] ?? 0) + 1,
      total: (record.total ?? 0) + 1,
    })
    .where(eq(reactionCount.id, record.id))
}

async function decrementCount(targetField: 'threadId' | 'replyId', targetId: string, type: string) {
  const record = await getCountRecord(targetField, targetId)
  if (!record) return

  const col = countColumnMap[type as keyof typeof countColumnMap]
  if (!col) return

  const colRef = reactionCount[col]
  const totalRef = reactionCount.total
  await db
    .update(reactionCount)
    .set({
      [col]: Math.max(0, (record[col] ?? 0) - 1),
      total: Math.max(0, (record.total ?? 0) - 1),
    })
    .where(eq(reactionCount.id, record.id))
}

async function updateCount(
  targetField: 'threadId' | 'replyId',
  targetId: string,
  fromType: string,
  toType: string
) {
  const record = await getCountRecord(targetField, targetId)
  if (!record) return

  const fromCol = countColumnMap[fromType as keyof typeof countColumnMap]
  const toCol = countColumnMap[toType as keyof typeof countColumnMap]
  if (!fromCol || !toCol) return

  await db
    .update(reactionCount)
    .set({
      [fromCol]: Math.max(0, (record[fromCol] ?? 0) - 1),
      [toCol]: (record[toCol] ?? 0) + 1,
    })
    .where(eq(reactionCount.id, record.id))
}
