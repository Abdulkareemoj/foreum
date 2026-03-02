import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Bookmark } from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { useTrpcErrorHandler } from '~/hooks/use-trpc-error'
import { toast } from 'sonner'

export const Route = createFileRoute('/_client/bookmarks')({
  component: BookmarksPage,
})

function BookmarksPage() {
  const { handle: handleError } = useTrpcErrorHandler()
  const utils = trpc.useUtils()

  const { data, isLoading, fetchNextPage, hasNextPage } =
    trpc.bookmarks.getAll.useInfiniteQuery(
      { limit: 10 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )

  const removeBookmark = trpc.bookmarks.remove.useMutation({
    onSuccess: () => {
      toast.success('Bookmark removed')
      utils.bookmarks.getAll.invalidate()
    },
    onError: handleError,
  })

  const bookmarks = data?.pages.flatMap((page) => page.items) ?? []

  return (
    <div className="container max-w-4xl py-6">
      <h1 className="text-3xl font-bold mb-6">Your Bookmarks</h1>

      {isLoading ? (
        <div>Loading...</div>
      ) : bookmarks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Bookmark className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No bookmarks yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark: any) => (
            <Card key={bookmark.id}>
              <CardHeader>
                <CardTitle>{bookmark.thread?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeBookmark.mutate({ threadId: bookmark.threadId })}
                  disabled={removeBookmark.isPending}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}

          {hasNextPage && (
            <Button onClick={() => fetchNextPage()} className="w-full">
              Load More
            </Button>
          )}
        </div>
      )}
    </div>
  )
}