import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import {
  Search as SearchIcon,
  MessageSquare,
  User,
  FolderOpen,
  Hash,
  ArrowLeft,
  Users,
} from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { useDebounce } from '~/hooks/use-debounce'
import { format } from 'date-fns'

export const Route = createFileRoute('/_client/search')({
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>) => ({
    q: (search.q as string) || '',
  }),
})

function SearchPage() {
  const navigate = useNavigate()
  const searchParams = Route.useSearch()
  const [query, setQuery] = useState(searchParams.q || '')
  const debouncedQuery = useDebounce(query, 500)

  const { data, isLoading } = trpc.search.all.useQuery(
    { query: debouncedQuery, limit: 20 },
    { enabled: debouncedQuery.length > 0 }
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ to: '/search', search: { q: query } })
  }

  const totalResults =
    (data?.threads?.length || 0) +
    (data?.users?.length || 0) +
    (data?.categories?.length || 0) +
    (data?.tags?.length || 0)

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate({ to: '/thread' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <SearchIcon className="h-8 w-8" />
            Search
          </h1>
          <p className="text-muted-foreground mt-1">
            Find threads, users, categories, and tags
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="pl-9"
            autoFocus
          />
        </form>
      </div>

      {/* Results */}
      {!debouncedQuery ? (
        <Card>
          <CardContent className="py-12 text-center">
            <SearchIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Enter a search term to get started</p>
            <p className="text-sm text-muted-foreground mt-2">
              Or press <kbd className="px-2 py-1 bg-muted rounded">⌘K</kbd> to open quick
              search
            </p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Searching...</p>
        </div>
      ) : totalResults === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <SearchIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              No results found for "{debouncedQuery}"
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Found {totalResults} results for "{debouncedQuery}"
          </p>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">
                All ({totalResults})
              </TabsTrigger>
              <TabsTrigger value="threads">
                Threads ({data?.threads?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="users">
                Users ({data?.users?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="categories">
                Categories ({data?.categories?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="tags">
                Tags ({data?.tags?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="groups">
  Groups ({data?.groups?.length || 0})
</TabsTrigger>
<TabsTrigger value="events">
  Events ({data?.events?.length || 0})
</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6 mt-6">
              {data?.threads && data.threads.length > 0 && (
                <ThreadResults threads={data.threads} />
              )}
              {data?.users && data.users.length > 0 && (
                <UserResults users={data.users} />
              )}
              {data?.categories && data.categories.length > 0 && (
                <CategoryResults categories={data.categories} />
              )}
              {data?.tags && data.tags.length > 0 && (
                <TagResults tags={data.tags} />
              )}
              {data?.groups && data.groups.length > 0 && (
  <GroupResults groups={data.groups} />
)}
{data?.events && data.events.length > 0 && (
  <EventResults events={data.events} />
)}
            </TabsContent>

            <TabsContent value="threads" className="mt-6">
              {data?.threads && data.threads.length > 0 ? (
                <ThreadResults threads={data.threads} />
              ) : (
                <p className="text-center text-muted-foreground py-12">No threads found</p>
              )}
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              {data?.users && data.users.length > 0 ? (
                <UserResults users={data.users} />
              ) : (
                <p className="text-center text-muted-foreground py-12">No users found</p>
              )}
            </TabsContent>

            <TabsContent value="categories" className="mt-6">
              {data?.categories && data.categories.length > 0 ? (
                <CategoryResults categories={data.categories} />
              ) : (
                <p className="text-center text-muted-foreground py-12">
                  No categories found
                </p>
              )}
            </TabsContent>

            <TabsContent value="tags" className="mt-6">
              {data?.tags && data.tags.length > 0 ? (
                <TagResults tags={data.tags} />
              ) : (
                <p className="text-center text-muted-foreground py-12">No tags found</p>
              )}
            </TabsContent>

            <TabsContent value="groups" className="mt-6">
  {data?.groups && data.groups.length > 0 ? (
    <GroupResults groups={data.groups} />
  ) : (
    <p className="text-center text-muted-foreground py-12">No groups found</p>
  )}
</TabsContent>

<TabsContent value="events" className="mt-6">
  {data?.events && data.events.length > 0 ? (
    <EventResults events={data.events} />
  ) : (
    <p className="text-center text-muted-foreground py-12">No events found</p>
  )}
</TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

function ThreadResults({ threads }: { threads: any[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Threads
      </h2>
      {threads.map((thread) => (
        <Link key={thread.id} to="/thread/$id" params={{ id: thread.id }}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="py-4">
              <h3 className="font-medium line-clamp-1">{thread.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                by {thread.author?.name} •{' '}
                {format(new Date(thread.createdAt), 'MMM d, yyyy')}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

function UserResults({ users }: { users: any[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <User className="h-5 w-5" />
        Users
      </h2>
      {users.map((user) => (
        <Link
          key={user.id}
          to="/profile/$username"
          params={{ username: user.username }}
        >
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="py-4 flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.image} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

function CategoryResults({ categories }: { categories: any[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <FolderOpen className="h-5 w-5" />
        Categories
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((cat) => (
          <Link key={cat.id} to="/category/$slug" params={{ slug: cat.slug }}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{cat.name}</CardTitle>
                {cat.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {cat.description}
                  </p>
                )}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

function TagResults({ tags }: { tags: any[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Hash className="h-5 w-5" />
        Tags
      </h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link key={tag.id} to="/tags/$slug" params={{ slug: tag.slug }}>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-base py-2 px-4"
            >
              <Hash className="h-4 w-4 mr-1" />
              {tag.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  )
}

function GroupResults({ groups }: { groups: any[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Users className="h-5 w-5" />
        Groups
      </h2>
      {groups.map((group) => (
        <Link key={group.id} to="/groups/$slug" params={{ slug: group.slug }}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="py-4 flex items-center gap-3">
              <Avatar>
                <AvatarImage src={group.avatarImage} />
                <AvatarFallback>{group.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium line-clamp-1">{group.name}</p>
                {group.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {group.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

function EventResults({ events }: { events: any[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Events
      </h2>
      {events.map((event) => (
        <Link key={event.id} to="/events/$id" params={{ id: event.id }}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium line-clamp-1">{event.title}</p>
                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {event.description}
                    </p>
                  )}
                </div>
                <Badge variant="secondary">{event.eventType}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {format(new Date(event.startsAt), 'PPP')}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}