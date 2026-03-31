import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Input } from '~/components/ui/input'
import {
  MessageSquare,
  Edit,
  LogOut,
  Globe,
} from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { useSession, authClient } from '~/lib/auth-client'
import ThreadCard from '~/components/forum/ThreadCard'

export const Route = createFileRoute('/_client/profile/$username')({
  component: ProfilePage,
})

function ProfilePage() {
  const { username } = Route.useParams()
  const navigate = useNavigate()
  const { data: session } = useSession()

  const { data: user, isLoading } = trpc.user.byUsername.useQuery({ username })

  const { data: threads, isLoading: threadsLoading } = trpc.thread.byUser.useQuery(
    { userId: user?.id || '', limit: 20 },
    { enabled: !!user?.id }
  )

  const { data: popularThreads } = trpc.thread.byUser.useQuery(
    { userId: user?.id || '', limit: 5 },
    { enabled: !!user?.id }
  )

  const { data: recentThreads } = trpc.thread.byUser.useQuery(
    { userId: user?.id || '', limit: 5 },
    { enabled: !!user?.id }
  )

  const { data: userReputation } = trpc.reputation.getByUserId.useQuery(
    { userId: user?.id || '' },
    { enabled: !!user?.id }
  )

  const userBadges = userReputation?.badges || []

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            navigate({ to: '/sign-in' })
          },
        },
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const isOwnProfile = session?.user?.id === user?.id

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-[250px_1fr]">
          <div className="space-y-6">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-12 text-center">
        <p className="text-muted-foreground">User not found.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-background h-full">
      <main className="container mx-auto max-w-6xl flex-1 px-4 py-12">
        <div className="grid gap-8 md:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-20 w-20 border border-border">
                <AvatarImage src={user.image || '/placeholder.svg'} alt={user.username} />
                <AvatarFallback>{user.name?.[0] ?? 'U'}</AvatarFallback>
              </Avatar>

              <h1 className="mt-4 text-2xl font-semibold tracking-tight">
                {user.username}
              </h1>
              <p className="text-muted-foreground">{user.name}</p>

              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-1 text-sm text-muted-foreground hover:underline"
                >
                  <Globe className="h-3 w-3" />
                  {user.website}
                </a>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {isOwnProfile && (
                <>
                  <Link to="/profile/$username/edit" params={{ username: user.username || '' }}>
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                  </Link>
                  <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Log Out
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Stats</h2>
              <div className="grid grid-cols-2 gap-2">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                    <span className="text-2xl font-semibold">{user.threadCount ?? threads?.length ?? 0}</span>
                    <span className="text-xs text-muted-foreground">Threads</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                    <span className="text-2xl font-semibold">{user.replyCount ?? 0}</span>
                    <span className="text-xs text-muted-foreground">Replies</span>
                  </CardContent>
                </Card>
              </div>
              {userReputation && (
                <Link to="/profile/$username/reputation" params={{ username }}>
                  <Card className="mt-2 hover:bg-accent transition-colors cursor-pointer">
                    <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                      <span className="text-2xl font-semibold">{userReputation.points ?? 0}</span>
                      <span className="text-xs text-muted-foreground">Reputation</span>
                    </CardContent>
                  </Card>
                </Link>
              )}
            </div>

            {/* Badges Preview */}
            {userBadges && userBadges.length > 0 && (
              <div className="space-y-2 border-t pt-4">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Badges</h2>
                <div className="flex flex-wrap gap-3">
                  {userBadges.slice(0, 6).map((badge: any) => (
                    <div key={badge.id} className="flex flex-col items-center gap-1" title={badge.description}>
                      <span className="text-2xl">{badge.icon}</span>
                      <span className="text-[10px] text-center text-muted-foreground line-clamp-1 w-12">
                        {badge.name}
                      </span>
                    </div>
                  ))}
                </div>
                {userBadges.length > 6 && (
                   <Link to="/profile/$username/badges" params={{ username }} className="text-xs text-primary hover:underline block pt-1">
                     View all {userBadges.length} badges
                   </Link>
                )}
              </div>
            )}

            {/* Popular Threads Preview */}
            {popularThreads && popularThreads.length > 0 && (
              <div className="space-y-2 border-t pt-4">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Popular Threads</h2>
                <div className="space-y-2">
                  {popularThreads.map((thread: any) => (
                    <Link
                      key={thread.id}
                      to="/threads/thread/$id"
                      params={{ id: thread.id }}
                      className="block rounded-md p-2 transition-colors hover:bg-accent"
                    >
                      <div className="text-sm font-medium line-clamp-1">{thread.title}</div>
                      <div className="text-xs text-muted-foreground">{thread.replyCount} replies</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                Threads <Badge variant="outline">{threads?.length || 0}</Badge>
              </h2>
              <div className="relative w-full sm:w-auto">
                <Input placeholder="Filter threads..." className="w-full sm:w-[240px]" />
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6 h-auto w-full justify-start border-b bg-transparent p-0 rounded-none">
                <TabsTrigger
                  value="all"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="popular"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none"
                >
                  Popular
                </TabsTrigger>
                <TabsTrigger
                  value="recent"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none"
                >
                  Recently Updated
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {threadsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)
                ) : threads && threads.length > 0 ? (
                  threads.map((thread: any) => <ThreadCard key={thread.id} thread={thread} />)
                ) : (
                  <p className="text-center py-12 text-muted-foreground">No threads found.</p>
                )}
              </TabsContent>

              <TabsContent value="popular" className="space-y-4">
                {popularThreads && popularThreads.length > 0 ? (
                  popularThreads.map((thread: any) => <ThreadCard key={thread.id} thread={thread} />)
                ) : (
                  <p className="text-center py-12 text-muted-foreground">No popular threads found.</p>
                )}
              </TabsContent>

              <TabsContent value="recent" className="space-y-4">
                {recentThreads && recentThreads.length > 0 ? (
                  recentThreads.map((thread: any) => <ThreadCard key={thread.id} thread={thread} />)
                ) : (
                  <p className="text-center py-12 text-muted-foreground">No recently updated threads found.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}