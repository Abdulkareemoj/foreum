import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { trpc } from '~/lib/trpc'
import { useTrpcErrorHandler } from '~/hooks/use-trpc-error'
import { toast } from 'sonner'
import { useEffect, useRef } from 'react'

export const Route = createFileRoute('/_client/bookmarks')({
  component: BookmarksPage,
})

function BookmarksPage() {
  const { handle: handleError } = useTrpcErrorHandler()
  const utils = trpc.useUtils()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.bookmarks.getAll.useInfiniteQuery(
      { limit: 10 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )

  const { mutate: removeBookmark } = trpc.bookmarks.remove.useMutation({
    onMutate: async ({ threadId }) => {
      // Cancel any outgoing refetches
      await utils.bookmarks.getAll.cancel()

      // Snapshot the previous value
      const previousData = utils.bookmarks.getAll.getInfiniteData()

      // Optimistically update to the new value
      utils.bookmarks.getAll.setInfiniteData({ limit: 10 }, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.filter((b) => b.threadId !== threadId),
          })),
        }
      })

      return { previousData }
    },
    onSuccess: () => {
      toast.success('Bookmark removed')
    },
    onError: (err, newBookmark, context) => {
      // Rollback on error
      if (context?.previousData) {
        utils.bookmarks.getAll.setInfiniteData({ limit: 10 }, context.previousData)
      }
      handleError(err)
      toast.error('Failed to remove bookmark')
    },
    onSettled: () => {
      // Always refetch after error or success to ensure sync
      utils.bookmarks.getAll.invalidate()
    },
  })

  const bookmarks = data?.pages.flatMap((page) => page.items) ?? []

  // Infinite Scroll Observer
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }
    return () => {
      observer.disconnect()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <h1 className="mb-6 text-3xl font-bold">Bookmarks</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
             <Card key={i}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <Skeleton className="mb-2 h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-8 w-20 rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <p className="text-muted-foreground">You have no bookmarks yet.</p>
      ) : (
        <div className="space-y-4">
           {bookmarks.map((b: any) => (
             <Card key={b.threadId}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <Link to={`/thread/${b.threadId}`} className="font-medium text-primary hover:underline">
                    {b.threadTitle || b.thread?.title || "Unknown Thread"}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Bookmarked on {new Date(b.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => removeBookmark({ threadId: b.threadId })}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Infinite Scroll Loader */}
      <div className="flex justify-center py-4" ref={sentinelRef}>
        {isFetchingNextPage && (
          <div className="w-full space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
               <Card key={`loading-${i}`}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <Skeleton className="mb-2 h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}