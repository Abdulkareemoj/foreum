import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef, useCallback } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { trpc } from '~/lib/trpc'
import { toast } from 'sonner'
import { cn } from '~/lib/utils'

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
  const hasUnread = notifications.some((n: any) => !n.read)

  const markAsRead = trpc.notifications.markAsRead.useMutation({
    onSuccess: (data, variables) => {
      // Optimistic-like update using exact cache invalidation
      utils.notifications.getAll.invalidate()
    },
    onError: () => toast.error('Failed to mark as read'),
  })

  const markAllAsRead = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.getAll.invalidate()
      toast.success('All notifications marked as read')
    },
    onError: () => toast.error('Failed to mark all as read'),
  })

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

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {hasUnread && (
          <Button size="sm" variant="outline" onClick={() => markAllAsRead.mutate()}>
            Mark all as read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <Skeleton className="mb-2 h-4 w-64" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-28 rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-muted-foreground">No notifications yet.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n: any) => (
            <Card key={n.id} className={cn(!n.read ? 'bg-accent/40' : '')}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p>{n.message}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                {!n.read && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      markAsRead.mutate({ id: n.id })
                    }}
                  >
                    Mark as Read
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Infinite Scroll Loader */}
      <div className="flex justify-center py-4" ref={loadMoreRef}>
        {isFetchingNextPage && (
          <div className="w-full space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <Skeleton className="mb-2 h-4 w-64" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-28 rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}