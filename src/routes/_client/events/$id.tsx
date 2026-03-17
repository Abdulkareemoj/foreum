import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { trpc } from '~/lib/trpc'
import { format } from 'date-fns'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/_client/events/$id')({
  component: EventDetailPage,
})

// Optional dummy render text-editor content to HTML
function renderTipTap(text: string | null) {
  if (!text) return ''
  return `<p>${text}</p>` // Basic fallback; should ideally use a proper rich text renderer
}

function EventDetailPage() {
  const { id } = Route.useParams()

  const { data: eventData } = trpc.events.getById.useQuery({ eventId: id })
  const { data: initialAttendees } = trpc.events.attendees.useQuery({ eventId: id })
  
  const [event, setEvent] = useState<any>(null)
  const [attendees, setAttendees] = useState<any[]>([])
  const [rsvpLoading, setRsvpLoading] = useState(false)
  const [myStatus, setMyStatus] = useState<string | null>(null)

  const utils = trpc.useUtils()
  const { mutateAsync: RSVP } = trpc.events.rsvp.useMutation()

  useEffect(() => {
    if (eventData) setEvent(eventData)
  }, [eventData])

  useEffect(() => {
    if (initialAttendees) {
      setAttendees(initialAttendees)
      // Attempt to find my status. Without a session here, we rely on the server returning it eventually or keeping state.
      // E.g., const me = initialAttendees.find(a => a.userId === session?.user?.id); setMyStatus(me?.status)
    }
  }, [initialAttendees])

  async function rsvp(status: 'going' | 'maybe' | 'not_going') {
    setRsvpLoading(true)
    try {
      await RSVP({ eventId: id, status })
      const newAttendees = await utils.events.attendees.fetch({ eventId: id })
      setAttendees(newAttendees)
      setMyStatus(status)
    } catch (err) {
      console.error('Failed to RSVP', err)
    } finally {
      setRsvpLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      {!event ? (
        <p className="text-muted-foreground">Event not found or loading...</p>
      ) : (
        <Card>
          {event.coverImage && (
            <div className="h-48 overflow-hidden rounded-t">
              <img src={event.coverImage} className="h-48 w-full object-cover" alt={event.title} />
            </div>
          )}

          <CardHeader className="flex items-start justify-between gap-4 flex-row">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold">{event.title}</h1>
              <div className="text-sm text-muted-foreground">
                {format(new Date(event.startsAt), 'PPP p')} — {format(new Date(event.endsAt), 'PPP p')}
                <span> • </span>
                {event.eventType === 'virtual' ? 'Virtual' : event.eventType === 'physical' ? 'Physical' : event.eventType === 'hybrid' ? 'Hybrid' : 'Other'}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {(event.eventType === 'virtual' || event.virtualUrl) && (
                <a
                  className="hidden sm:inline-block"
                  href={event.virtualUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button>Join Event</Button>
                </a>
              )}
              <div className="inline-flex gap-2">
                <Button
                  variant={myStatus === 'going' ? 'secondary' : 'ghost'}
                  onClick={() => rsvp('going')}
                  disabled={rsvpLoading}
                >
                  Going
                </Button>
                <Button
                  variant={myStatus === 'maybe' ? 'secondary' : 'ghost'}
                  onClick={() => rsvp('maybe')}
                  disabled={rsvpLoading}
                >
                  Maybe
                </Button>
                <Button
                  variant={myStatus === 'not_going' ? 'destructive' : 'ghost'}
                  onClick={() => rsvp('not_going')}
                  disabled={rsvpLoading}
                >
                  Not Going
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {event.physicalLocation && (
              <div className="mb-4">
                <h3 className="text-sm font-medium">Location</h3>
                <p className="text-sm text-muted-foreground">{event.physicalLocation}</p>
                {/* Optional: embed map using a component */}
              </div>
            )}

            <div 
              className="prose dark:prose-invert max-w-none" 
              dangerouslySetInnerHTML={{ __html: renderTipTap(event.description) }} 
            />

            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium">Attendees ({attendees.length})</h3>
              <div className="flex flex-wrap gap-2">
                {attendees.map((a: any) => (
                  <div key={a.id || a.userId} className="flex items-center gap-2 rounded border px-2 py-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={a.user?.image} />
                      <AvatarFallback>{a.user?.name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">{a.user?.name}</div>
                    <div className="ml-2 text-xs text-muted-foreground">• {a.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}