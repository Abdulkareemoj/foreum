import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Skeleton } from '~/components/ui/skeleton'
import { Input } from '~/components/ui/input'
import { Users, Plus, Search } from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { useState } from 'react'

export const Route = createFileRoute('/_client/groups/')({
  component: GroupsPage,
})

function GroupsPage() {
  const [search, setSearch] = useState('')

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = trpc.groups.list.useInfiniteQuery(
    { limit: 12, query: search },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  )

  const groups = data?.pages.flatMap((page) => page.items) ?? []

  return (
    <div className="container max-w-6xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="text-muted-foreground">
            Join groups to connect with like-minded people
          </p>
        </div>
        <Link to="/groups/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search groups..."
          className="pl-9"
        />
      </div>

      {/* Groups Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {search ? 'No groups found matching your search' : 'No groups yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group: any) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>

          {hasNextPage && (
            <div className="text-center">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function GroupCard({ group }: { group: any }) {
  return (
    <Link to="/groups/$slug" params={{ slug: group.slug }}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        {/* Banner/Cover Image */}
        {group.bannerImage ? (
          <div className="h-32 bg-muted rounded-t-lg overflow-hidden">
            <img
              src={group.bannerImage}
              alt={group.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg" />
        )}

        <CardHeader className="relative pb-3">
          {/* Group Avatar */}
          <Avatar className="h-16 w-16 border-4 border-background -mt-12 mb-2">
            <AvatarImage src={group.avatarImage} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {group.name?.[0]}
            </AvatarFallback>
          </Avatar>

          <CardTitle className="text-xl">{group.name}</CardTitle>
          {group.description && (
            <CardDescription className="line-clamp-2">{group.description}</CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {group.memberCount || 0} {group.memberCount === 1 ? 'member' : 'members'}
              </span>
            </div>
            {group.creator && (
              <span className="text-xs">by {group.creator.name}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}