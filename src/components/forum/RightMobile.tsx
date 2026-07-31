import { useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { trpc } from '~/lib/trpc'
import { Link } from '@tanstack/react-router'

interface RightMobileProps {
  user: any
}

export default function RightMobile({ user }: RightMobileProps) {
  const [open, setOpen] = useState(false)
  
  const { data: trendingThreads, isLoading: trendingLoading } = trpc.thread.trending.useQuery(
    { limit: 5 },
    { enabled: open }
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg xl:hidden"
        >
          <TrendingUp className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-80 p-0">
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 border-b bg-background p-4 z-10">
            <h2 className="text-lg font-semibold">Trending & Stats</h2>
          </div>

          <div className="space-y-4 p-4">
            {/* Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground italic">No new announcements</p>
              </CardContent>
            </Card>

            {/* Trending Threads */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Trending Discussions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))
                ) : !trendingThreads || trendingThreads.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No trending discussions</p>
                ) : (
                  trendingThreads.map((thread: any) => (
                    <Link
                      key={thread.id}
                      to="/threads/$id"
                      params={{ id: thread.id }}
                      onClick={() => setOpen(false)}
                      className="block"
                    >
                      <div className="space-y-1 cursor-pointer hover:bg-accent p-1 rounded-md transition-colors">
                        <p className="text-sm font-medium line-clamp-2">
                          {thread.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {thread.replyCount} replies
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <MobileRecentPosts onClose={() => setOpen(false)} open={open} />

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground italic">Stats coming soon</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function MobileRecentPosts({ onClose, open }: { onClose: () => void, open: boolean }) {
  const { data: recentPosts, isLoading } = trpc.thread.recent.useQuery(
    { limit: 5 },
    { enabled: open }
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Recent Posts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))
        ) : !recentPosts || recentPosts.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No recent posts</p>
        ) : (
          recentPosts.map((post: any) => (
            <Link
              key={post.id}
              to="/threads/$id"
              params={{ id: post.id }}
              onClick={onClose}
              className="block"
            >
              <div className="space-y-1 cursor-pointer hover:bg-accent p-1 rounded-md transition-colors">
                <p className="text-sm font-medium line-clamp-2">{post.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  )
}