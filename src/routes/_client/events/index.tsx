import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { format, isPast } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_client/events/')({
  component: EventsPage,
})

function EventsPage() {
  const [allEvents, setAllEvents] = useState<any[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [pastEvents, setPastEvents] = useState<any[]>([])
  
  const { data, isLoading, error, refetch, isRefetching } = trpc.events.list.useQuery(
    {},
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  )

  useEffect(() => {
    if (data) {
      setAllEvents(data)
      setUpcomingEvents(data.filter((e: any) => !isPast(new Date(e.endsAt))))
      setPastEvents(data.filter((e: any) => isPast(new Date(e.endsAt))))
    }
  }, [data])

  useEffect(() => {
    if (error) {
      toast.error('Failed to load events')
    }
  }, [error])

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      virtual: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      physical: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      hybrid: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    }
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="mt-1 text-muted-foreground">Discover and join community events</p>
        </div>
        <Link to="/events/new">
          <Button>Create Event</Button>
        </Link>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center justify-between pt-6">
            <p className="text-sm text-destructive">{error.message}</p>
            <Button variant="outline" onClick={() => refetch()} disabled={isLoading || isRefetching}>
              {(isLoading || isRefetching) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="py-8">
                <div className="h-24 animate-pulse rounded bg-muted"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">
              Upcoming <Badge variant="secondary" className="ml-2">{upcomingEvents.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="past">
              Past <Badge variant="secondary" className="ml-2">{pastEvents.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="all">
              All <Badge variant="secondary" className="ml-2">{allEvents.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Tab */}
          <TabsContent value="upcoming" className="mt-6">
            {upcomingEvents.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No upcoming events. Check back soon!
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <Link key={event.id} to={`/events/${event.id}`} className="block transition hover:opacity-75">
                    <EventCardContent event={event} getEventTypeColor={getEventTypeColor} />
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Past Tab */}
          <TabsContent value="past" className="mt-6">
            {pastEvents.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No past events yet.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <Link key={event.id} to={`/events/${event.id}`} className="block opacity-75 transition hover:opacity-100">
                    <EventCardContent event={event} getEventTypeColor={getEventTypeColor} isPastEvent />
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* All Tab */}
          <TabsContent value="all" className="mt-6">
            {allEvents.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No events found. Create the first one!
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {allEvents.map((event) => (
                  <Link key={event.id} to={`/events/${event.id}`} className="block transition hover:opacity-75">
                    <EventCardContent event={event} getEventTypeColor={getEventTypeColor} />
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

function EventCardContent({ event, getEventTypeColor, isPastEvent = false }: { event: any, getEventTypeColor: (t: string) => string, isPastEvent?: boolean }) {
  const isEventPast = isPastEvent || isPast(new Date(event.endsAt))
  
  return (
    <Card className="h-full overflow-hidden">
      {event.coverImage ? (
         <div className="h-40 overflow-hidden">
           <img
             src={event.coverImage || '/placeholder.svg'}
             alt={event.title}
             className={`h-full w-full object-cover ${isPastEvent ? 'grayscale' : ''}`}
           />
         </div>
      ) : (
        <div className={`h-40 ${isPastEvent ? 'bg-gradient-to-br from-muted to-muted/50' : 'bg-gradient-to-br from-primary/20 to-primary/10'}`}></div>
      )}
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="line-clamp-2 font-semibold">{event.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {event.description}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <div className="text-xs text-muted-foreground">
            {isPastEvent ? format(new Date(event.endsAt), 'PPP') : format(new Date(event.startsAt), isPast(new Date(event.endsAt)) ? 'PPP' : 'PPP p')}
          </div>
          <div className="flex gap-2">
            {!isPastEvent && (
              <Badge className={getEventTypeColor(event.eventType)} variant="outline">
                {event.eventType}
              </Badge>
            )}
            
            {event.capacity && !isPastEvent && (
              <Badge variant="outline">Capacity: {event.capacity}</Badge>
            )}

            {isEventPast && (
              <Badge variant="secondary">Past{isPastEvent ? ' Event' : ''}</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}