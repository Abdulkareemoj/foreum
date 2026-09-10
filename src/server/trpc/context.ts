import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { eq } from 'drizzle-orm'
import { auth } from '~/server/auth'
import { db } from '~/server/db'
import { user } from '~/server/db/schema/auth-schema'

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
        // Update the in-memory session user
        session.user.banned = false
        session.user.banReason = null
        session.user.banExpires = null
      } catch {
        // Log but don't fail the request — worst case the user stays banned until next request
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
