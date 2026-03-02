import { createFileRoute } from '@tanstack/react-router'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '~/server/trpc/routers'
import { createContext } from '~/server/trpc/context'

export const APIRoute = createFileRoute('/api/trpc/$')({
  GET: async ({ request }) => {
    return handleTRPC(request)
  },
  POST: async ({ request }) => {
    return handleTRPC(request)
  },
})

async function handleTRPC(request: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext,
    onError: ({ error, path }) => {
      console.error(`❌ tRPC Error on ${path}:`, error)
    },
  })
}