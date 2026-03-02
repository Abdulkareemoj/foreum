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
  
  const { data: trendingThreads, isLoading } = trpc.thread.trending.useQuery(
    { limit: 5 },
    { enabled: open } // Only fetch when drawer is open
  )

  const { data: stats } = trpc.user.stats.useQuery(undefined, {
    enabled: open
  })

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
          <div className="sticky top-0 border-b bg-background p-4">
            <h2 className="text-lg font-semibold">Trending & Stats</h2>
          </div>

          <div className="space-y-4 p-4">
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
                      onClick={() => setOpen(false)}
                    >
                      <div className="space-y-1 cursor-pointer hover:opacity-80 transition-opacity">
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

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Users</span>
                  <span className="font-medium">
                    {stats?.activeUsers?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Threads</span>
                  <span className="font-medium">
                    {stats?.totalThreads?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Replies</span>
                  <span className="font-medium">
                    {stats?.totalReplies?.toLocaleString() || '0'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Active Now (if you want to add it) */}
            {user && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Your Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Your Threads</span>
                    <span className="font-medium">
                      {user.threadCount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Your Replies</span>
                    <span className="font-medium">
                      {user.replyCount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reputation</span>
                    <span className="font-medium">
                      {user.reputation || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}