import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { trpc } from '~/lib/trpc'

export const Route = createFileRoute('/_client/groups/')({
  component: GroupsPage,
})

function GroupsPage() {
  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q)
    }, 220)
    return () => clearTimeout(timer)
  }, [q])

  const { data: groups, isLoading } = trpc.groups.list.useQuery({ 
    search: debouncedQ || undefined, 
    limit: 40 
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Groups</h1>

        <div className="flex items-center gap-3">
          <Input 
            placeholder="Search groups..." 
            value={q} 
            onChange={(e) => setQ(e.target.value)} 
            className="min-w-[220px]" 
          />
          <Link to="/groups/new">
            <Button>Create Group</Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-32" />
            </Card>
          ))}
        </div>
      ) : groups?.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No groups found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups?.map((group: any) => (
            <Link key={group.id} to={`/groups/${group.id}`} className="block">
              <Card className="h-full transition hover:shadow-md">
                <div className="h-32 overflow-hidden rounded-t border-b bg-muted/10 flex items-center justify-center">
                  {group.bannerUrl ? (
                    <img src={group.bannerUrl} className="h-32 w-full object-cover" alt={group.name} />
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center text-muted-foreground">
                      <span className="text-sm">{group.name}</span>
                    </div>
                  )}
                </div>
                <CardContent>
                  <div className="flex items-start justify-between gap-3 mt-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{group.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {group.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <div>{group.memberCount ?? 0} members</div>
                    <div>
                      <span className="inline-flex items-center rounded bg-muted/50 px-2 py-0.5 text-xs">
                        {group.privacy === 'private' ? 'Private' : 'Public'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}