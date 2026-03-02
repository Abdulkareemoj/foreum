import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { Calendar, MapPin, Users, Video, Plus } from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

export const Route = createFileRoute('/_client/events/')({
  component: EventsPage,
})

function EventsPage() {
  const {
    data: upcomingData,
    isLoading: upcomingLoading,
    fetchNextPage: fetchNextUpcoming,
    hasNextPage: hasNextUpcoming,
  } = trpc.events.list.useInfiniteQuery(
    { upcoming: true, limit: 10 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  )

  const {
    data: pastData,
    isLoading: pastLoading,
    fetchNextPage: fetchNextPast,
    hasNextPage: hasNextPast,
  } = trpc.events.list.useInfiniteQuery(
    { past: true, limit: 10 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  )

  const upcomingEvents = upcomingData?.pages.flatMap((page) => page.items) ?? []
  const pastEvents = pastData?.pages.flatMap((page) => page.items) ?? []

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Discover and join community events</p>
        </div>
        <Link to="/events/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48" />)
          ) : upcomingEvents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No upcoming events</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {upcomingEvents.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
              {hasNextUpcoming && (
                <Button
                  onClick={() => fetchNextUpcoming()}
                  variant="outline"
                  className="w-full"
                >
                  Load More
                </Button>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {pastLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48" />)
          ) : pastEvents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No past events</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {pastEvents.map((event: any) => (
                <EventCard key={event.id} event={event} isPast />
              ))}
              {hasNextPast && (
                <Button onClick={() => fetchNextPast()} variant="outline" className="w-full">
                  Load More
                </Button>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EventCard({ event, isPast = false }: { event: any; isPast?: boolean }) {
  const eventTypeIcons = {
    physical: MapPin,
    virtual: Video,
    hybrid: Users,
    other: Calendar,
  }

  const Icon = eventTypeIcons[event.eventType as keyof typeof eventTypeIcons] || Calendar

  return (
    <Link to="/events/$id" params={{ id: event.id }}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4 text-primary" />
                <Badge variant="secondary">{event.eventType}</Badge>
                {isPast && <Badge variant="outline">Past</Badge>}
              </div>
              <CardTitle className="text-xl">{event.title}</CardTitle>
              {event.description && (
                <CardDescription className="line-clamp-2 mt-2">
                  {event.description}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(event.startsAt), 'PPP')} at{' '}
                {format(new Date(event.startsAt), 'p')}
              </span>
            </div>
            {event.physicalLocation && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{event.physicalLocation}</span>
              </div>
            )}
            {event.virtualUrl && (
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span className="truncate">Virtual event</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}