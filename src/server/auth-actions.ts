import { createServerFn, createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '~/server/auth'
import { redirect } from '@tanstack/react-router'

export const clientAuthMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const url = new URL(request.url)
    const isProfilePage = url.pathname.match(/^\/profile\/[^/]+$/)
    
    if (isProfilePage) {
      return await next()
    }

    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    
    if (!session) {
      throw redirect({
        to: '/sign-in',
        search: { redirectTo: url.pathname },
      })
    }
    
    return await next()
  }
)

export const getSessionFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    return session
  })

  
export const authMiddleware = createMiddleware().server(
  async ({ next }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    
    if (!session) {
      throw redirect({ to: "/sign-in" })
    }
    
    return await next()
  }
)

export const adminMiddleware = createMiddleware().server(
  async ({ next }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    
    if (!session) {
      throw redirect({ to: "/sign-in" })
    }
    
    if (session.user.role !== 'admin') {
      throw redirect({ to: "/" })
    }
    
    return await next()
  }
)