import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { trpc } from '~/lib/trpc'
import { format } from 'date-fns'

export const Route = createFileRoute('/_client/groups/$slug/')({
  component: GroupSlugPage,
})

// Quick HTML renderer stub for Tiptap structure
function renderTipTap(text: string | null) {
  if (!text) return ''
  return `<p>${text}</p>`
}

function GroupSlugPage() {
  const { slug } = Route.useParams()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'forum' | 'members'>('overview')

  const { data: group, isLoading, refetch } = trpc.groups.byId.useQuery({ id: slug })
  const { data: recentThreads } = trpc.groups.threads.useQuery({ groupId: slug, limit: 5 })

  const joinGroup = trpc.groups.join.useMutation({
    onSuccess: () => refetch()
  })
  const leaveGroup = trpc.groups.leave.useMutation({
    onSuccess: () => refetch()
  })

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Card className="animate-pulse">
          <CardContent className="h-40" />
        </Card>
      </div>
    )
  }

  if (!group) {
    return <div className="p-6 text-center text-muted-foreground">Group not found.</div>
  }

  return (
    <div className="space-y-6 p-6 container mx-auto max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={group.avatarUrl} />
          <AvatarFallback>{group.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold">{group.name}</h1>
          <p className="text-sm text-muted-foreground">
            {group.memberCount ?? 0} members • {group.privacy}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {group.isMember ? (
            <Button
              variant="outline"
              onClick={() => leaveGroup.mutate({ id: group.id })}
              disabled={leaveGroup.isPending}
            >
              Leave
            </Button>
          ) : (
            <Button 
              onClick={() => joinGroup.mutate({ id: group.id })}
              disabled={joinGroup.isPending}
            >
              Join
            </Button>
          )}
          {group.isModerator && (
            <Link to={`/groups/${group.id}/settings` as any}>
              <Button variant="outline">Manage</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forum">Forum</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Card>
                <CardHeader>About</CardHeader>
                <CardContent>
                  <div 
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderTipTap(group.description) }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>Recent posts</CardHeader>
                <CardContent>
                  {!recentThreads || recentThreads.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No threads yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {recentThreads.map((t: any) => (
                        <Link key={t.id} to={`/threads/${t.id}` as any} className="block rounded p-3 hover:bg-muted/30">
                          <div className="font-medium">{t.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {t.replyCount ?? 0} replies • {new Date(t.createdAt).toLocaleString()}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>Rules</CardHeader>
                <CardContent>
                  {group.rules ? (
                    <div 
                      className="text-sm text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: renderTipTap(group.rules) }}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">No rules posted.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>Members</CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="text-sm">{group.memberCount ?? 0} members</div>
                    <Link to={`/groups/${group.id}/members` as any} className="ml-auto text-sm text-primary">
                      See all
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="forum">
          <div>
            <Link className="mb-4 inline-block" to={`/groups/${group.id}/forum` as any}>
              <Button>Open group forum</Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Group forum threads are shown in the forum page.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="members">
          <div>
            <Link to={`/groups/${group.id}/members` as any}>
              <Button>View members</Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}