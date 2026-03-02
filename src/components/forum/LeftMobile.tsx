import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Home, TrendingUp, Bookmark, Users, Settings, MessageSquare } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import { cn } from '~/lib/utils'
import { useUIStore } from '~/stores/ui-store'

interface LeftMobileProps {
  user: any
}

export default function LeftMobile({ user }: LeftMobileProps) {
  const [open, setOpen] = useState(false)
  const { openThreadModal } = useUIStore()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Threads', href: '/thread', icon: MessageSquare },
    { name: 'Trending', href: '/trending', icon: TrendingUp },
    { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
    { name: 'Communities', href: '/communities', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const handleCreateThread = () => {
    setOpen(false)
    openThreadModal()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 left-4 z-50 h-14 w-14 rounded-full shadow-lg lg:hidden"
        >
          <Users className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">Navigation</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setOpen(false)}
                >
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
          <div className="border-t p-4">
            <Button className="w-full" onClick={handleCreateThread}>
              Create Thread
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}