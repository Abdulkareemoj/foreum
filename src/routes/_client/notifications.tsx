import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef, useCallback } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { Badge } from '~/components/ui/badge'
import { Bell, BellOff, CheckCheck, ExternalLink } from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { toast } from 'sonner'
import { cn } from '~/lib/utils'
import { formatDistanceToNow } from 'date-fns'

export const Route = createFileRoute('/_client/notifications')({
  component: NotificationsPage,
})

function NotificationsPage() {
  const utils = trpc.useUtils()
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = trpc.notifications.getAll.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  )

  const notifications = data?.pages.flatMap((page) => page.items) ?? []
  const hasUnread = notifications.some((n) => !n.read)

  const markAsRead = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.getAll.invalidate()
      utils.notifications.countUnread.invalidate()
    },
    onError: () => toast.error('Failed to mark as read'),
  })

  const markAllAsRead = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.getAll.invalidate()
      utils.notifications.countUnread.invalidate()
      toast.success('All notifications marked as read')
    },
    onError: () => toast.error('Failed to mark all as read'),
  })

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  useEffect(() => {
    const element = loadMoreRef.current
    if (!element) return

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [handleObserver])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reply':
        return '💬'
      case 'mention':
        return '@'
      case 'upvote':
        return '👍'
      case 'system':
        return '🔔'
      default:
        return '📩'
    }
  }

  return (
    <div className="container max-w-3xl py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {hasUnread && (
            <Badge variant="default">
              {notifications.filter((n) => !n.read).length} unread
            </Badge>
          )}
        </div>

        {hasUnread && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            {markAllAsRead.isPending ? 'Marking...' : 'Mark all as read'}
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-8 w-28 ml-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <BellOff className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-1">No notifications</h3>
            <p className="text-muted-foreground">
              You're all caught up! New notifications will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              icon={getNotificationIcon(notif.type)}
              onMarkAsRead={() => markAsRead.mutate({ id: notif.id })}
              isMarkingRead={markAsRead.isPending && markAsRead.variables?.id === notif.id}
            />
          ))}
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={loadMoreRef} className="py-4">
        {isFetchingNextPage && (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-28 ml-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {!hasNextPage && notifications.length > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            You've reached the end
          </p>
        )}
      </div>
    </div>
  )
}

interface NotificationCardProps {
  notification: {
    id: string
    type: string
    title: string
    message: string
    link: string
    read: boolean
    createdAt: Date
  }
  icon: string
  onMarkAsRead: () => void
  isMarkingRead: boolean
}

function NotificationCard({
  notification: notif,
  icon,
  onMarkAsRead,
  isMarkingRead,
}: NotificationCardProps) {
  return (
    <Card
      className={cn(
        'transition-colors',
        !notif.read && 'bg-accent/40 border-primary/20'
      )}
    >
      <CardContent className="flex items-start gap-4 p-4">
        {/* Icon */}
        <div
          className={cn(
            'h-10 w-10 rounded-full flex items-center justify-center text-lg flex-shrink-0',
            !notif.read ? 'bg-primary/10' : 'bg-muted'
          )}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p
                className={cn(
                  'font-medium',
                  !notif.read && 'text-foreground',
                  notif.read && 'text-muted-foreground'
                )}
              >
                {notif.title}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
              </p>
            </div>

            {/* Unread Dot */}
            {!notif.read && (
              <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            <Link to={notif.link as any}>
              <Button size="sm" variant="outline">
                <ExternalLink className="h-3 w-3 mr-1" />
                View
              </Button>
            </Link>

            {!notif.read && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onMarkAsRead()
                }}
                disabled={isMarkingRead}
              >
                <Bell className="h-3 w-3 mr-1" />
                {isMarkingRead ? 'Marking...' : 'Mark as read'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}