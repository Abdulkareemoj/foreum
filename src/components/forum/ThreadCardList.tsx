import { trpc } from '~/lib/trpc'
import ThreadCard from './ThreadCard'
import { Skeleton } from '~/components/ui/skeleton'
import { Button } from '~/components/ui/button'

interface ThreadCardListProps {
  categoryId?: string
  tagId?: string  
  sortBy?: 'recent' | 'popular' | 'oldest'
  searchQuery?: string
}

export default function ThreadCardList({ categoryId, tagId, sortBy = 'recent', searchQuery }: ThreadCardListProps) {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = trpc.thread.list.useInfiniteQuery(
    {
      limit: 10,
      category: categoryId,
      tagId, 
      sortBy,
      search: searchQuery || undefined,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  )

  const threads = data?.pages.flatMap((page) => page.items) ?? []

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    )
  }

  if (threads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No threads yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {threads.map((thread: any) => (
        <ThreadCard key={thread.id} thread={thread} />
      ))}

      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          variant="outline"
          className="w-full"
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  )
}