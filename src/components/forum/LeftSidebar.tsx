import { Link } from '@tanstack/react-router'
import { Home, TrendingUp, Bookmark, Users, Settings, FolderOpen,MessageSquare, Award, Star } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

interface LeftSidebarProps {
  user: any
}

export default function LeftSidebar({ user }: LeftSidebarProps) {
  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Threads', href: '/thread', icon: MessageSquare },
     { name: 'Categories', href: '/categories', icon: FolderOpen },
    { name: 'Trending', href: '/trending', icon: TrendingUp },
    { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
     { name: 'Badges', href: '/badges', icon: Award },       
  { name: 'Reputation', href: '/reputation', icon: Star }, 
 
    { name: 'Communities', href: '/communities', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.name} to={item.href}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-secondary'
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Create Thread Button */}
      <div className="mt-4">
        <Button className="w-full" onClick={() => {
          // This will open the thread modal via Zustand
          const { openThreadModal } = require('~/stores/ui-store').useUIStore.getState()
          openThreadModal()
        }}>
          Create Thread
        </Button>
      </div>
    </div>
  )
}