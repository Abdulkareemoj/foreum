import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { count, eq } from 'drizzle-orm'
import { auth } from '~/server/auth'
import { db } from '~/server/db'
import { user } from '~/server/db/schema/auth-schema'
import { reply, thread } from '~/server/db/schema/thread-schema'
import { calculateTrustLevel, loadTrustLevelConfig } from '~/server/lib/trust-levels'

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

  // Trust level auto-promotion check (runs once per session, throttled by DB writes)
  if (session?.user?.id) {
    try {
      // Count total posts (threads + replies)
      const [threadCount] = await db
        .select({ count: count() })
        .from(thread)
        .where(eq(thread.authorId, session.user.id))

      const [replyCount] = await db
        .select({ count: count() })
        .from(reply)
        .where(eq(reply.authorId, session.user.id))

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

  return {
    req: opts.req,
    resHeaders: opts.resHeaders,
    user: session?.user || null,
    session: session?.session || null
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
