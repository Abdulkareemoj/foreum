import { createMiddleware } from '@tanstack/react-start'
import { createLogger } from '~/server/lib/logger'

const logFn = createLogger('server-fn')

interface LogContext {
  clientTime: Date
  serverTime?: Date
  durationToServer?: number
}

const preLogMiddleware = createMiddleware({ type: 'function' })
  .client(async (ctx) => {
    const clientTime = new Date()

    return ctx.next({
      context: {
        clientTime,
      } as LogContext,
      sendContext: {
        clientTime,
      },
    })
  })
  .server(async (ctx) => {
    const serverTime = new Date()
    const context = ctx.context as LogContext

    return ctx.next({
      sendContext: {
        serverTime,
        durationToServer:
          serverTime.getTime() - context.clientTime.getTime(),
      },
    })
  })

export const logMiddleware = createMiddleware({ type: 'function' })
  .middleware([preLogMiddleware])
  .client(async (ctx) => {
    const res = await ctx.next()
    const context = res.context as LogContext

    const now = new Date()
    console.log('Client Req/Res:', {
      duration: now.getTime() - context.clientTime.getTime(),
      durationToServer: context.durationToServer,
      durationFromServer: context.serverTime
        ? now.getTime() - context.serverTime.getTime()
        : undefined,
    })

    return res
  })
  .server(async (ctx) => {
    const res = await ctx.next()
    const context = ctx.context as LogContext

    logFn.info(
      {
        durationToServer: context.durationToServer,
      },
      'server function handled',
    )

    return res
  })
