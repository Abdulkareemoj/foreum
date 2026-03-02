import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Skeleton } from '~/components/ui/skeleton'
import {
  Calendar,
  MapPin,
  Video,
  Users,
  ArrowLeft,
  Clock,
  Share2,
  Edit,
  Trash,
} from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { format } from 'date-fns'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'

export const Route = createFileRoute('/_client/events/$id')({
  component: EventDetailPage,
})

function EventDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const utils = trpc.useUtils()

  const { data: event, isLoading } = trpc.events.getById.useQuery({ eventId: id })
  const { data: attendees } = trpc.events.attendees.useQuery({ eventId: id })

  const rsvp = trpc.events.rsvp.useMutation({
    onSuccess: () => {
      toast.success('RSVP updated')
      utils.events.getById.invalidate({ eventId: id })
      utils.events.attendees.invalidate({ eventId: id })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update RSVP')
    },
  })

  const deleteEvent = trpc.events.delete.useMutation({
    onSuccess: () => {
      toast.success('Event deleted')
      navigate({ to: '/events' })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete event')
    },
  })

  const handleRSVP = (status: 'going' | 'maybe' | 'not_going') => {
    rsvp.mutate({ eventId: id, status })
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-6 space-y-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-32" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container max-w-4xl py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Event not found</h2>
          <p className="text-muted-foreground mb-4">
            This event doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate({ to: '/events' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>
    )
  }

  const isPastEvent = new Date(event.endsAt) < new Date()

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate({ to: '/events' })}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Button>

      {/* Event Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <Badge>{event.eventType}</Badge>
                {isPastEvent && <Badge variant="outline">Past Event</Badge>}
                {event.visibility !== 'public' && (
                  <Badge variant="secondary">{event.visibility}</Badge>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                {event.description && (
                  <p className="text-muted-foreground text-lg">{event.description}</p>
                )}
              </div>

              {/* Creator */}
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={event.creator?.image} />
                  <AvatarFallback>{event.creator?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">Organized by</p>
                  <Link
                    to="/profile/$id"
                    params={{ id: event.creator?.id || '' }}
                    className="text-muted-foreground hover:underline"
                  >
                    {event.creator?.name}
                  </Link>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/events/$id/edit" params={{ id }}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Event
                    </Link>
                  </DropdownMenuItem>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Event
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Event?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the event.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteEvent.mutate({ id })}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Event Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Start</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.startsAt), 'PPP')} at{' '}
                    {format(new Date(event.startsAt), 'p')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">End</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.endsAt), 'PPP')} at{' '}
                    {format(new Date(event.endsAt), 'p')}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {event.physicalLocation && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{event.physicalLocation}</p>
                  </div>
                </div>
              )}

              {event.virtualUrl && (
                <div className="flex items-start gap-3">
                  <Video className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Virtual Meeting</p>
                    <Link
                      to={event.virtualUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Join meeting
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RSVP Buttons */}
          {!isPastEvent && (
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={() => handleRSVP('going')}
                disabled={rsvp.isPending}
                variant="default"
              >
                Going ({event.counts?.going || 0})
              </Button>
              <Button
                onClick={() => handleRSVP('maybe')}
                disabled={rsvp.isPending}
                variant="outline"
              >
                Maybe ({event.counts?.maybe || 0})
              </Button>
              <Button
                onClick={() => handleRSVP('not_going')}
                disabled={rsvp.isPending}
                variant="outline"
              >
                Can't Go ({event.counts?.notGoing || 0})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendees */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Attendees ({attendees?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attendees && attendees.length > 0 ? (
            <div className="space-y-3">
              {attendees.map((attendee: any) => (
                <div key={attendee.userId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={attendee.user?.image} />
                      <AvatarFallback>{attendee.user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <Link
                      to="/profile/$id"
                      params={{ id: attendee.userId }}
                      className="font-medium hover:underline"
                    >
                      {attendee.user?.name}
                    </Link>
                  </div>
                  <Badge
                    variant={
                      attendee.status === 'going'
                        ? 'default'
                        : attendee.status === 'maybe'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {attendee.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No attendees yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}