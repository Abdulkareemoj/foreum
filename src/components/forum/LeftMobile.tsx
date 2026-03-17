import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Home, TrendingUp, Bookmark, Users, Settings, MessageSquare, Tag } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import { Skeleton } from '~/components/ui/skeleton'
import { trpc } from '~/lib/trpc'
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
          <nav className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="space-y-1">
              <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Menu
              </h3>
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href as any}
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
            </div>

            <Separator />

            {/* Categories */}
            <div className="space-y-1">
              <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Categories
              </h3>
              <MobileCategories onClose={() => setOpen(false)} />
            </div>

            <Separator />

            {/* Trending Tags */}
            <div className="space-y-1">
              <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Trending Tags
              </h3>
              <MobileTags onClose={() => setOpen(false)} />
            </div>
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

function MobileCategories({ onClose }: { onClose: () => void }) {
  const { data: categories, isLoading } = trpc.category.list.useQuery()

  if (isLoading) {
    return (
      <div className="space-y-2 px-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return <p className="px-3 text-xs text-muted-foreground italic">No categories</p>
  }

  return (
    <div className="space-y-1">
      {categories.map((cat: any) => (
        <Link
          key={cat.id}
          to={`/categories/${cat.slug}`}
          onClick={onClose}
          className="block rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}

function MobileTags({ onClose }: { onClose: () => void }) {
  const { data: tags, isLoading } = trpc.tag.popular.useQuery({ limit: 10 })

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2 px-3">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
    )
  }

  if (!tags || tags.length === 0) {
    return <p className="px-3 text-xs text-muted-foreground italic">No tags</p>
  }

  return (
    <div className="flex flex-wrap gap-2 px-3">
      {tags.map((tag: any) => (
        <Link
          key={tag.id}
          to={`/tags/${tag.slug}`}
          onClick={onClose}
          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
        >
          <Tag className="mr-1 h-3 w-3" />
          {tag.name}
        </Link>
      ))}
    </div>
  )
}
