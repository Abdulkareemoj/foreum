import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Skeleton } from '~/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import {
  Users,
  Settings,
  ArrowLeft,
  Calendar,
  MessageSquare,
  Share2,
  UserPlus,
  UserMinus,
} from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { toast } from 'sonner'
import ThreadCardList from '~/components/forum/ThreadCardList'

export const Route = createFileRoute('/_client/groups/$slug/')({
  component: GroupDetailPage,
})

function GroupDetailPage() {
  const { slug } = Route.useParams()
  const navigate = useNavigate()
  const utils = trpc.useUtils()

  const { data: group, isLoading } = trpc.groups.bySlug.useQuery({ slug })

  const joinGroup = trpc.groups.join.useMutation({
    onSuccess: () => {
      toast.success('Joined group')
      utils.groups.bySlug.invalidate({ slug })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to join group')
    },
  })

  const leaveGroup = trpc.groups.leave.useMutation({
    onSuccess: () => {
      toast.success('Left group')
      utils.groups.bySlug.invalidate({ slug })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to leave group')
    },
  })

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-6 space-y-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!group) {
    return (
      <div className="container max-w-6xl py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Group not found</h2>
          <p className="text-muted-foreground mb-4">
            This group doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate({ to: '/groups' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
        </div>
      </div>
    )
  }

  const isMember = !!group.membership
  const isOwner = group.isOwner

  return (
    <div className="container max-w-6xl py-6 space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate({ to: '/groups' })}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        All Groups
      </Button>

      {/* Group Header */}
      <Card>
        {/* Banner */}
        {group.bannerImage ? (
          <div className="h-48 bg-muted rounded-t-lg overflow-hidden">
            <img
              src={group.bannerImage}
              alt={group.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg" />
        )}

        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-12 md:-mt-8">
            {/* Avatar & Info */}
            <div className="flex items-end gap-4">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={group.avatarImage} />
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  {group.name?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className="pb-2">
                <h1 className="text-3xl font-bold">{group.name}</h1>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>

              {isOwner ? (
                <Link to="/groups/$slug/settings" params={{ slug }}>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              ) : isMember ? (
                <Button
                  variant="outline"
                  onClick={() => leaveGroup.mutate({ groupId: group.id })}
                  disabled={leaveGroup.isPending}
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  Leave Group
                </Button>
              ) : (
                <Button
                  onClick={() => joinGroup.mutate({ groupId: group.id })}
                  disabled={joinGroup.isPending}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join Group
                </Button>
              )}
            </div>
          </div>

          {/* Description */}
          {group.description && (
            <p className="mt-4 text-muted-foreground">{group.description}</p>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="threads">
        <TabsList>
          <TabsTrigger value="threads">
            <MessageSquare className="h-4 w-4 mr-2" />
            Threads
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="threads" className="mt-6">
          {/* Group-specific threads would go here */}
          {/* For now, you can filter threads by group or show a message */}
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Group threads feature coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <Link to="/groups/$slug/members" params={{ slug }}>
            <Button variant="outline" className="mb-4">
              View All Members
            </Button>
          </Link>
          <MembersPreview groupId={group.id} />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <Link to="/groups/$slug/events" params={{ slug }}>
            <Button variant="outline" className="mb-4">
              View All Events
            </Button>
          </Link>
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No upcoming events</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MembersPreview({ groupId }: { groupId: string }) {
  const { data: members, isLoading } = trpc.groups.members.useQuery({ groupId })

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    )
  }

  const displayMembers = members?.slice(0, 10) || []

  return (
    <Card>
      <CardContent className="pt-6">
        {displayMembers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No members yet</p>
        ) : (
          <div className="space-y-3">
            {displayMembers.map((member: any) => (
              <div key={member.userId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.user?.image} />
                    <AvatarFallback>{member.user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      to="/profile/$id"
                      params={{ id: member.userId }}
                      className="font-medium hover:underline"
                    >
                      {member.user?.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}