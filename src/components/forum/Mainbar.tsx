import {
  CalendarIcon,
  ClockIcon,
  GridIcon,
  PlusIcon,
  SlidersHorizontalIcon,
  TrendingUpIcon
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Skeleton } from '~/components/ui/skeleton'
import ThreadCard from './ThreadCard'
import { trpc } from '~/lib/trpc'
import { useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'

interface MainbarProps {
  searchQuery: string
  setSearchQuery: (val: string) => void
  categoryFilter: string
  setCategoryFilter: (val: string) => void
  sortBy: 'recent' | 'popular' | 'oldest'
  setSortBy: (val: 'recent' | 'popular' | 'oldest') => void
}

export default function Mainbar({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
}: MainbarProps) {
  
  const { data: categories } = trpc.category.list.useQuery()

  // In the React port we can just use useInfiniteQuery for the thread list
  // Note: we might need to adjust the exact query name based on what's available
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = trpc.thread.list.useInfiniteQuery(
    {
      limit: 20,
      search: searchQuery || undefined,
      category: categoryFilter === 'all' ? undefined : categoryFilter,
      sortBy,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  )

  const threads = data?.pages.flatMap((page) => page.items) ?? []

  // Infinite Scroll logic
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
    <div className="h-full flex-1">
      {/* Header with Tabs */}
      <div className="border-b border-border bg-background">
        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <GridIcon className="h-4 w-4" />
              Card View
            </Button>
            <Button variant="ghost" size="sm">
              <SlidersHorizontalIcon className="h-4 w-4" />
            </Button>
            <div className="flex-1 sm:w-48 sm:flex-none">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
            <div className="flex items-center justify-between">
              <TabsList className="relative w-full rounded-none border-b bg-background p-0 sm:max-w-screen-sm">
                <TabsTrigger
                  value="popular"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full bg-background text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none px-4"
                >
                  <TrendingUpIcon className="h-4 w-4 mr-2" />
                  Popular
                </TabsTrigger>
                <TabsTrigger
                  value="recent"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full bg-background text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none px-4"
                >
                  <ClockIcon className="h-4 w-4 mr-2" />
                  New
                </TabsTrigger>
                <TabsTrigger
                  value="oldest"
                   className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full bg-background text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none px-4"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Oldest
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
             <Card key={i}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="h-20 w-12 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                    <Skeleton className="h-3 w-1/4 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : threads.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">
                {searchQuery || categoryFilter !== 'all' ? (
                  <>
                    <p className="mb-2 text-lg font-medium">No threads found</p>
                    <p>Try adjusting your search or filters</p>
                  </>
                ) : (
                  <>
                    <p className="mb-2 text-lg font-medium">No threads yet</p>
                    <p>Be the first to start a conversation!</p>
                    <Link to="/threads/new">
                      <Button className="mt-4">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Create First Thread
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          threads.map((thread: any) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))
        )}

        {/* Sentinel for Infinite Scroll */}
        {hasNextPage && (
          <div ref={sentinelRef} className="h-10 w-full flex items-center justify-center">
             {isFetchingNextPage ? (
                <span className="text-sm text-muted-foreground">Loading more...</span>
             ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
