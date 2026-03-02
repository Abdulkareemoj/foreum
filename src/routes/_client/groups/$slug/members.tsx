import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Skeleton } from '~/components/ui/skeleton'
import { Input } from '~/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Users, ArrowLeft, Search, MoreVertical, Crown, UserMinus } from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { toast } from 'sonner'
import { useState } from 'react'

export const Route = createFileRoute('/_client/groups/$slug/members')({
  component: GroupMembersPage, 
})

function GroupMembersPage() {
  const { slug } = Route.useParams()
  const navigate = useNavigate()
  const utils = trpc.useUtils()
  const [search, setSearch] = useState('')

  const { data: group, isLoading: groupLoading } = trpc.groups.bySlug.useQuery({ slug })
  const { data: members, isLoading: membersLoading } = trpc.groups.members.useQuery(
    { groupId: group?.id || '' },
    { enabled: !!group?.id }
  )

  const removeMember = trpc.groups.removeMember.useMutation({
    onSuccess: () => {
      toast.success('Member removed')
      utils.groups.members.invalidate({ groupId: group?.id || '' })
      utils.groups.bySlug.invalidate({ slug })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to remove member')
    },
  })

  const updateRole = trpc.groups.updateMemberRole.useMutation({
    onSuccess: () => {
      toast.success('Role updated')
      utils.groups.members.invalidate({ groupId: group?.id || '' })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update role')
    },
  })

  const isLoading = groupLoading || membersLoading
  const isOwner = group?.isOwner

  const filteredMembers = members?.filter((member: any) =>
    member.user?.name?.toLowerCase().includes(search.toLowerCase())
  )

  if (groupLoading) {
    return (
      <div className="container max-w-4xl py-6 space-y-6">
        <Skeleton className="h-32" />
      </div>
    )
  }

  if (!group) {
    return (
      <div className="container max-w-4xl py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Group not found</h2>
          <Button onClick={() => navigate({ to: '/groups' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate({ to: '/groups/$slug', params: { slug } })}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to {group.name}
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Members</h1>
        <p className="text-muted-foreground">
          {members?.length || 0} {members?.length === 1 ? 'member' : 'members'} in this group
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search members..."
          className="pl-9"
        />
      </div>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : filteredMembers && filteredMembers.length > 0 ? (
            <div className="space-y-3">
              {filteredMembers.map((member: any) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.user?.image} />
                      <AvatarFallback>{member.user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <Link
                        to="/profile/$id"
                        params={{ id: member.userId }}
                        className="font-medium hover:underline block truncate"
                      >
                        {member.user?.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={member.role === 'owner' ? 'default' : 'secondary'}
                      className="flex items-center gap-1"
                    >
                      {member.role === 'owner' && <Crown className="h-3 w-3" />}
                      {member.role}
                    </Badge>

                    {/* Owner Actions */}
                    {isOwner && member.role !== 'owner' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {member.role === 'member' && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateRole.mutate({
                                  groupId: group.id,
                                  userId: member.userId,
                                  role: 'owner',
                                })
                              }
                            >
                              <Crown className="mr-2 h-4 w-4" />
                              Make Owner
                            </DropdownMenuItem>
                          )}

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <UserMinus className="mr-2 h-4 w-4" />
                                Remove Member
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Member?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove {member.user?.name} from this
                                  group?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    removeMember.mutate({
                                      groupId: group.id,
                                      memberId: member.userId,
                                    })
                                  }
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {search ? 'No members found matching your search' : 'No members yet'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}