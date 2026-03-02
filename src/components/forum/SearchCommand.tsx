'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '~/components/ui/command'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  MessageSquare,
  User,
  FolderOpen,
  Hash,
  Home,
  TrendingUp,
  Bookmark,
  Star,
  Settings,
  Calendar,
  Users,
  Mail,
  Bell,
  LogOut,
} from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { useDebounce } from '~/hooks/use-debounce'
import { signOut } from '~/lib/auth-client'
import { toast } from 'sonner'

interface SearchCommandProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  // Use the simpler global search for command palette
  const { data: results, isLoading } = trpc.search.global.useQuery(
    { query: debouncedSearch, limit: 5 },
    { enabled: debouncedSearch.length > 0 }
  )

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  const handleSelect = (callback: () => void) => {
    onOpenChange(false)
    setSearch('') // Clear search on select
    callback()
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out successfully')
    navigate({ to: '/login' })
  }

  const quickActions = [
    { icon: Home, label: 'Home', action: () => navigate({ to: '/' }) },
    { icon: MessageSquare, label: 'Threads', action: () => navigate({ to: '/thread' }) },
    { icon: FolderOpen, label: 'Categories', action: () => navigate({ to: '/categories' }) },
    { icon: Hash, label: 'Tags', action: () => navigate({ to: '/tags' }) },
    { icon: Users, label: 'Groups', action: () => navigate({ to: '/groups' }) },
    { icon: Calendar, label: 'Events', action: () => navigate({ to: '/events' }) },
    { icon: TrendingUp, label: 'Trending', action: () => navigate({ to: '/trending' }) },
    { icon: Bookmark, label: 'Bookmarks', action: () => navigate({ to: '/bookmarks' }) },
    { icon: Star, label: 'Reputation', action: () => navigate({ to: '/reputation' }) },
    { icon: Mail, label: 'Messages', action: () => navigate({ to: '/messages' }) },
    { icon: Bell, label: 'Notifications', action: () => navigate({ to: '/notifications' }) },
    { icon: Settings, label: 'Settings', action: () => navigate({ to: '/settings' }) },
    { icon: LogOut, label: 'Sign Out', action: handleSignOut },
  ]

  // Group results by type
  const groupedResults = results?.reduce(
    (acc, item: any) => {
      if (!acc[item.type]) acc[item.type] = []
      acc[item.type].push(item)
      return acc
    },
    {} as Record<string, any[]>
  )

  const getIcon = (type: string) => {
    switch (type) {
      case 'thread':
        return MessageSquare
      case 'user':
        return User
      case 'group':
        return Users
      case 'category':
        return FolderOpen
      case 'tag':
        return Hash
      default:
        return MessageSquare
    }
  }

  const getLink = (item: any) => {
    switch (item.type) {
      case 'thread':
        return { to: '/thread/$id' as const, params: { id: item.id } }
      case 'user':
        return { to: '/profile/$username' as const, params: { username: item.subtitle || '' } }
      case 'group':
        return { to: '/groups/$slug' as const, params: { slug: item.slug } }
      case 'category':
        return { to: '/category/$slug' as const, params: { slug: item.slug } }
      case 'tag':
        return { to: '/tags/$slug' as const, params: { slug: item.slug } }
      default:
        return { to: '/' as const }
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search or type a command..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>{isLoading ? 'Searching...' : 'No results found.'}</CommandEmpty>

        {/* Quick Actions - show when no search */}
        {!search && (
          <CommandGroup heading="Quick Actions">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <CommandItem key={action.label} onSelect={() => handleSelect(action.action)}>
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{action.label}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>
        )}

        {/* Search Results */}
        {search && groupedResults && (
          <>
            {Object.entries(groupedResults).map(([type, items], index) => {
              const Icon = getIcon(type)
              return (
                <div key={type}>
                  {index > 0 && <CommandSeparator />}
                  <CommandGroup heading={type.charAt(0).toUpperCase() + type.slice(1) + 's'}>
                    {items.map((item: any) => (
                      <CommandItem
                        key={`${type}-${item.id}`}
                        value={`${type}-${item.id}-${item.title}`}
                        onSelect={() => handleSelect(() => navigate(getLink(item)))}
                      >
                        {item.image ? (
                          <Avatar className="mr-2 h-6 w-6">
                            <AvatarImage src={item.image} />
                            <AvatarFallback>
                              <Icon className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <Icon className="mr-2 h-4 w-4" />
                        )}
                        <div className="flex-1 overflow-hidden">
                          <div className="font-medium truncate">{item.title}</div>
                          {item.subtitle && (
                            <div className="text-xs text-muted-foreground">@{item.subtitle}</div>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </div>
              )
            })}
          </>
        )}

        {/* Keyboard Shortcuts Hint */}
        {!search && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Tips">
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                Press{' '}
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>{' '}
                to open search • Type to search everything
              </div>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}