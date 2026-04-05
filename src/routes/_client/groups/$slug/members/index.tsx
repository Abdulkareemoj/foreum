import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { trpc } from '~/lib/trpc'

export const Route = createFileRoute('/_client/groups/$slug/members/')({
  component: GroupMembersPage,
})

function GroupMembersPage() {
  const { slug } = Route.useParams()


  const { data: members, isLoading, refetch } = trpc.groups.members.useQuery({ groupId: slug })
  
  const updateRole = trpc.groups.update.useMutation({
    onSuccess: () => refetch()
  })

  const removeMember = trpc.groups.delete.useMutation({
    onSuccess: () => refetch()
  })

  const handleChangeRole = (memberId: string, role: 'member' | 'moderator' | 'owner') => {
    updateRole.mutate({ groupId: slug, userId: memberId, role })
  }

  const handleRemoveMember = (memberId: string) => {
    if (!window.confirm('Remove member from group?')) return
    removeMember.mutate({ groupId: slug, memberId })
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Members</h1>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-12" />
            </Card>
          ))}
        </div>
      ) : !members || members.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No members
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {members.map((member: any) => (
            <Card key={member.user?.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.user?.image} />
                    <AvatarFallback>{member.user?.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.user?.name}</div>
                    <div className="text-sm text-muted-foreground capitalize">{member.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {(member?.role === 'admin' || member.canManage) && (
                    <>
                      <Select
                        value={member.role}
                        onValueChange={(val: any) => handleChangeRole(member.user.id, val)}
                        disabled={updateRole.isPending}
                      >
                        <SelectTrigger className="w-32 capitalize">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="owner">Owner</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        variant="destructive" 
                        onClick={() => handleRemoveMember(member.user.id)}
                        disabled={removeMember.isPending}
                      >
                        Remove
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
