import { createMiddleware } from '@tanstack/react-start'
import { createLogger } from '~/server/lib/logger'

const logFn = createLogger('server-fn')

const preLogMiddleware = createMiddleware({ type: 'function' })
  .client(async (ctx) => {
    const clientTime = new Date()

    return ctx.next({
      context: {
        clientTime,
      },
      sendContext: {
        clientTime,
      },
    })
  })
  .server(async (ctx) => {
    const serverTime = new Date()

    return ctx.next({
      sendContext: {
        serverTime,
        durationToServer:
          serverTime.getTime() - ctx.context.clientTime.getTime(),
      },
    })
  })

export const logMiddleware = createMiddleware({ type: 'function' })
  .middleware([preLogMiddleware])
  .server(async (ctx) => {
    const res = await ctx.next()

    logFn.info(
      {
        durationToServer: ctx.context.durationToServer,
      },
      'server function handled',
    )

    return res
  })
  .client(async (ctx) => {
    const res = await ctx.next()

    const now = new Date()
    console.log('Client Req/Res:', {
      duration: now.getTime() - res.context.clientTime.getTime(),
      durationToServer: res.context.durationToServer,
      durationFromServer: now.getTime() - res.context.serverTime.getTime(),
    })

    return res
  })
