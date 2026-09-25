import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { count, eq, sql } from 'drizzle-orm'
import { auth } from '~/server/auth'
import { db } from '~/server/db'
import { user } from '~/server/db/schema/auth-schema'
import { reply, thread } from '~/server/db/schema/thread-schema'
import { calculateTrustLevel, loadTrustLevelConfig } from '~/server/lib/trust-levels'

// Throttle trust level checks to once per 15 minutes per user
const trustLevelCheckCache = new Map<string, number>()
const TRUST_LEVEL_THROTTLE_MS = 15 * 60 * 1000

export async function createContext(opts: FetchCreateContextFnOptions) {
  const session = await auth.api.getSession({
    headers: opts.req.headers
  })

  // Auto-unban check: if user is banned and ban has expired, unban them
  if (session?.user?.banned && session.user.banExpires) {
    const now = new Date()
    const banExpires = new Date(session.user.banExpires)
    if (now >= banExpires) {
      try {
        await db
          .update(user)
          .set({ banned: false, banReason: null, banExpires: null })
          .where(eq(user.id, session.user.id))
        session.user.banned = false
        session.user.banReason = null
        session.user.banExpires = null
      } catch {
        // Log but don't fail the request
      }
    }
  }

  // Trust level auto-promotion check (throttled to once per 15 minutes per user)
  if (session?.user?.id) {
    const now = Date.now()
    const lastCheck = trustLevelCheckCache.get(session.user.id) ?? 0
    if (now - lastCheck > TRUST_LEVEL_THROTTLE_MS) {
      trustLevelCheckCache.set(session.user.id, now)
      try {
        // Use a single query with coalesced count
        // Use a single subquery to count threads + replies
        const userId = session.user.id
        const [threadCount] = await db
          .select({ count: count() })
          .from(thread)
          .where(eq(thread.authorId, userId))
        const [replyCount] = await db
          .select({ count: count() })
          .from(reply)
          .where(eq(reply.authorId, userId))
        const totalPosts = (threadCount?.count ?? 0) + (replyCount?.count ?? 0)

        const createdAt = session.user.createdAt instanceof Date
          ? session.user.createdAt
          : new Date(session.user.createdAt as string)

        const config = await loadTrustLevelConfig()
        const expectedLevel = calculateTrustLevel(createdAt, totalPosts, config)
        const currentUser = session.user as any
        const currentLevel = (currentUser.trustLevel as number) ?? 0

        if (expectedLevel > currentLevel) {
          await db
            .update(user)
            .set({ trustLevel: expectedLevel })
            .where(eq(user.id, session.user.id))
          currentUser.trustLevel = expectedLevel
        }
      } catch {
        // Don't fail requests over trust level promotion
      }
    }
  }

  return {
    req: opts.req,
    resHeaders: opts.resHeaders,
    user: session?.user || null,
    session: session?.session || null
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
