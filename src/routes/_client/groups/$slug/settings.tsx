import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
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
import { ArrowLeft, Settings, Trash2 } from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { toast } from 'sonner'

export const Route = createFileRoute('/_client/groups/$slug/settings')({
  component: GroupSettingsPage,
})

function GroupSettingsPage() {
  const { slug } = Route.useParams()
  const navigate = useNavigate()
  const utils = trpc.useUtils()

  const { data: group, isLoading } = trpc.groups.bySlug.useQuery({ slug })

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [bannerImage, setBannerImage] = useState('')
  const [avatarImage, setAvatarImage] = useState('')

  useEffect(() => {
    if (group) {
      setName(group.name)
      setDescription(group.description || '')
      setBannerImage(group.bannerImage || '')
      setAvatarImage(group.avatarImage || '')
    }
  }, [group])

  const updateGroup = trpc.groups.update.useMutation({
    onSuccess: () => {
      toast.success('Group updated successfully')
      utils.groups.bySlug.invalidate({ slug })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update group')
    },
  })

  const deleteGroup = trpc.groups.delete.useMutation({
    onSuccess: () => {
      toast.success('Group deleted')
      navigate({ to: '/groups' })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete group')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Group name is required')
      return
    }

    updateGroup.mutate({
      id: group!.id,
      name: name.trim(),
      description: description.trim() || undefined,
      bannerImage: bannerImage.trim() || undefined,
      avatarImage: avatarImage.trim() || undefined,
    })
  }

  if (isLoading) {
    return (
      <div className="container max-w-2xl py-6">
        <p>Loading...</p>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="container max-w-2xl py-6">
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

  if (!group.isOwner) {
    return (
      <div className="container max-w-2xl py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            Only the group owner can access settings.
          </p>
          <Button onClick={() => navigate({ to: '/groups/$slug', params: { slug } })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Group
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-6 space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate({ to: '/groups/$slug', params: { slug } })}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to {group.name}
      </Button>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Group Settings
          </CardTitle>
          <CardDescription>Update your group information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Group Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter group name"
                disabled={updateGroup.isPending}
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your group..."
                rows={4}
                disabled={updateGroup.isPending}
              />
            </div>

            {/* Banner Image */}
            <div className="space-y-2">
              <Label htmlFor="bannerImage">Banner Image URL (optional)</Label>
              <Input
                id="bannerImage"
                type="url"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                placeholder="https://example.com/banner.jpg"
                disabled={updateGroup.isPending}
              />
              {bannerImage && (
                <div className="mt-2 rounded-lg overflow-hidden border">
                  <img
                    src={bannerImage}
                    alt="Banner preview"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = ''
                      toast.error('Invalid image URL')
                    }}
                  />
                </div>
              )}
            </div>

            {/* Avatar Image */}
            <div className="space-y-2">
              <Label htmlFor="avatarImage">Avatar Image URL (optional)</Label>
              <Input
                id="avatarImage"
                type="url"
                value={avatarImage}
                onChange={(e) => setAvatarImage(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                disabled={updateGroup.isPending}
              />
              {avatarImage && (
                <div className="mt-2">
                  <img
                    src={avatarImage}
                    alt="Avatar preview"
                    className="w-20 h-20 rounded-full object-cover border"
                    onError={(e) => {
                      e.currentTarget.src = ''
                      toast.error('Invalid image URL')
                    }}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate({ to: '/groups/$slug', params: { slug } })}
                disabled={updateGroup.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateGroup.isPending}>
                {updateGroup.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/50 bg-destructive/5">
              <div>
                <p className="font-medium text-destructive">Delete Group</p>
                <p className="text-sm text-muted-foreground">
                  Once you delete a group, there is no going back. Please be certain.
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {group.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the group and
                      remove all members.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteGroup.mutate({ id: group.id })}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Group
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}