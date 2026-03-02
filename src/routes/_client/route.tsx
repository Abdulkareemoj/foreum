import { createFileRoute, Outlet } from '@tanstack/react-router'
import { clientAuthMiddleware, getSessionFn } from '~/server/auth-actions'
import { useUIStore } from '~/stores/ui-store'
import Navbar from '~/components/forum/Navbar'
import LeftSidebar from '~/components/forum/LeftSidebar'
import RightSidebar from '~/components/forum/RightSidebar'
import LeftMobile from '~/components/forum/LeftMobile'
import RightMobile from '~/components/forum/RightMobile'
import { cn } from '~/lib/utils'

// Middleware and session fetching moved to server functions in ~/server/auth-actions.ts

export const Route = createFileRoute('/_client')({
  component: ClientLayout,
  server: {
    middleware: [clientAuthMiddleware],
  },
  loader: async () => {
    const session = await getSessionFn()
    return {
      user: session?.user || null,
    }
  },
})

function ClientLayout() {
  const { user } = Route.useLoaderData()
  
  // Get sidebar state from Zustand
  const { leftSidebarOpen, rightSidebarOpen } = useUIStore()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      
      <div className="flex flex-1">
        {/* Left Sidebar - Desktop */}
        <aside 
          className={cn(
            'hidden lg:block w-64 border-r transition-all',
            leftSidebarOpen && 'lg:w-0 lg:overflow-hidden'
          )}
        >
          <LeftSidebar user={user} />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>

        {/* Right Sidebar - Desktop */}
        <aside 
          className={cn(
            'hidden xl:block w-80 border-l transition-all',
            rightSidebarOpen && 'xl:w-0 xl:overflow-hidden'
          )}
        >
          <RightSidebar user={user} />
        </aside>
      </div>

      {/* Mobile Navigation */}
      <LeftMobile user={user} />
      <RightMobile user={user} />
    </div>
  )
}