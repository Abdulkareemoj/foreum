import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { clientAuthMiddleware, getSessionFn } from '~/server/auth-actions'
import Navbar from '~/components/forum/Navbar'
import LeftSidebar from '~/components/forum/LeftSidebar'
import RightSidebar from '~/components/forum/RightSidebar'

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

  const location = useLocation()
  const pathname = location.pathname

  // Determine active sidebars based on route, matching Svelte behavior
  // Left sidebar for navigation and categories
  const activeSidebar = {
    left: pathname === '/' ||
          pathname.startsWith('/threads') ||
          pathname.startsWith('/communities') ||
          pathname.startsWith('/trending') ||
          pathname.startsWith('/bookmarks') ||
          pathname.startsWith('/notifications') ||
          pathname.startsWith('/categories') ||
          pathname.startsWith('/category') ||
          pathname.startsWith('/groups') ||
          pathname.startsWith('/messages') ||
          pathname.startsWith('/search') ||
          pathname.startsWith('/tags') ||
          pathname.startsWith('/events'),
    // Right sidebar for stats and recent activity
    right: pathname === '/' ||
           pathname.startsWith('/threads') ||
           pathname.startsWith('/communities') ||
           pathname.startsWith('/trending') ||
           pathname.startsWith('/bookmarks') ||
           pathname.startsWith('/tags') ||
           pathname.startsWith('/categories') ||
           pathname.startsWith('/category') ||
           pathname.startsWith('/groups') ||
           pathname.startsWith('/search') ||
           pathname.startsWith('/profile') ||
           pathname.startsWith('/events')
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      <Navbar user={user} />

      {/* Main Layout Below Navbar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar (desktop) */}
        {activeSidebar.left && (
          <aside className="hidden shrink-0 border-r lg:flex lg:w-72 xl:w-80 2xl:w-96">
            <LeftSidebar />
          </aside>
        )}

        {/* Main Content Area */}
        <main className="relative min-w-0 flex-1 overflow-y-auto p-2">
          <Outlet />
        </main>

        {/* Right Sidebar (desktop) */}
        {activeSidebar.right && (
          <aside className="hidden shrink-0 border-l xl:flex xl:w-72 2xl:w-96">
            <RightSidebar />
          </aside>
        )}
      </div>
    </div>
  )
}