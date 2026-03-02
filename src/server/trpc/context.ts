import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { auth } from '~/server/auth'

export async function createContext(opts: FetchCreateContextFnOptions) {
  const session = await auth.api.getSession({
    headers: opts.req.headers
  })

  return {
    req: opts.req,
    resHeaders: opts.resHeaders,
    user: session?.user || null,
    session: session?.session || null
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>