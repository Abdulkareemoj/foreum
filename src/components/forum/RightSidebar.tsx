import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { trpc } from '~/lib/trpc'
import { Skeleton } from '~/components/ui/skeleton'
import { Link } from '@tanstack/react-router'
import CategoriesWidget from './CategoriesWidget'
import TagsWidget from './TagsWidget'

interface RightSidebarProps {
  user: any
}

export default function RightSidebar({ user }: RightSidebarProps) {
  const { data: trendingThreads, isLoading } = trpc.thread.trending.useQuery({
    limit: 5,
  })

  return (
    <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-4 space-y-4">
      {/* Trending Threads */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Trending Discussions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))
          ) : (
            trendingThreads?.map((thread: any) => (
              <Link
                key={thread.id}
                to="/thread/$id"
                params={{ id: thread.id }}
                className="block space-y-1 hover:opacity-80 transition-opacity"
              >
                <p className="text-sm font-medium line-clamp-2">{thread.title}</p>
                <p className="text-xs text-muted-foreground">
                  {thread.replyCount} replies
                </p>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      {/* Categories Widget */}
      <CategoriesWidget />

      {/* Community Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Community Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Active Users</span>
            <span className="font-medium">1,234</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Threads</span>
            <span className="font-medium">5,678</span>
          </div>
        </CardContent>
      </Card>

      {/* Tags Widget */}
      <TagsWidget />
<CategoriesWidget />
    </div>
  )
}