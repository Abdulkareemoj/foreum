import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { ArrowLeft, Calendar, Plus } from 'lucide-react'
import { trpc } from '~/lib/trpc'

export const Route = createFileRoute('/_client/groups/$slug/events')({
  component: GroupEventsPage,
})

function GroupEventsPage() {
  const { slug } = Route.useParams()
  const navigate = useNavigate()

  const { data: group, isLoading: groupLoading } = trpc.groups.bySlug.useQuery({ slug })
  const { data: events, isLoading: eventsLoading } = trpc.events.list.useInfiniteQuery(
    { groupId: group?.id, limit: 20 },
    {
      enabled: !!group?.id,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  )

  const isLoading = groupLoading || eventsLoading
  const allEvents = events?.pages.flatMap((page) => page.items) ?? []

  if (groupLoading) {
    return (
      <div className="container max-w-4xl py-6 space-y-6">
        <Skeleton className="h-32" />
      </div>
    )
  }

  if (!group) {
    return (
      <div className="container max-w-4xl py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Group not found</h2>
          <Button onClick={() => navigate({ to: '/groups' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate({ to: '/groups/$slug', params: { slug } })}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to {group.name}
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Group Events</h1>
          <p className="text-muted-foreground">Events organized by this group</p>
        </div>
        {group.membership && (
          <Link to="/events/new" search={{ groupId: group.id }}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </Link>
        )}
      </div>

      {/* Events List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : allEvents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No events yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {allEvents.map((event: any) => (
            <Link key={event.id} to="/events/$id" params={{ id: event.id }}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <p className="font-medium">{event.title}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}