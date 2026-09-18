import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import { trpc } from '~/lib/trpc'
import { Save, Loader2, Shield, Info } from 'lucide-react'
import { toast } from 'sonner'
import { adminMiddleware } from '~/server/auth-actions'
import { seo } from '~/utils/seo'
import { Badge } from '~/components/ui/badge'

export const Route = createFileRoute('/_admin/trust-levels')({
  head: () => ({
    meta: [...seo({ title: 'Trust Levels - Foreum Admin' })],
  }),
  component: TrustLevelsPage,
  server: {
    middleware: [adminMiddleware],
  },
})

const AVAILABLE_PERMISSIONS = [
  { value: 'thread.create', label: 'Create threads' },
  { value: 'reply.create', label: 'Reply to threads' },
  { value: 'link.post', label: 'Post links' },
  { value: 'file.upload', label: 'Upload files' },
  { value: 'poll.create', label: 'Create polls' },
  { value: 'own_post.edit', label: 'Edit own posts' },
  { value: 'own_post.delete', label: 'Delete own posts' },
  { value: 'own_thread.pin', label: 'Pin own threads' },
  { value: 'extended_upload', label: 'Extended upload limits' },
]

interface TrustLevelData {
  level: number
  name: string
  minDays: number
  minPosts: number
  permissions: string[]
}

function TrustLevelsPage() {
  const { data: config, isLoading } = trpc.trustLevelConfig.list.useQuery()
  const bulkUpdateMutation = trpc.trustLevelConfig.bulkUpdate.useMutation()
  const seedMutation = trpc.trustLevelConfig.seed.useMutation()
  const utils = trpc.useUtils()

  const [levels, setLevels] = useState<TrustLevelData[]>([])
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (config && config.length === 5) {
      setLevels(
        config.map((c: any) => ({
          level: c.level,
          name: c.name,
          minDays: c.minDays,
          minPosts: c.minPosts,
          permissions: (c.permissions as string[]) ?? [],
        }))
      )
    }
  }, [config])

  const handleSeed = async () => {
    try {
      await seedMutation.mutateAsync()
      await utils.trustLevelConfig.list.invalidate()
      toast.success('Default trust levels created')
    } catch {
      toast.error('Failed to seed trust levels')
    }
  }

  const handleSave = async () => {
    try {
      await bulkUpdateMutation.mutateAsync(levels)
      setHasChanges(false)
      toast.success('Trust levels saved')
    } catch {
      toast.error('Failed to save trust levels')
    }
  }

  const updateLevel = (index: number, field: keyof TrustLevelData, value: any) => {
    setLevels((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
    setHasChanges(true)
  }

  const togglePermission = (index: number, perm: string) => {
    setLevels((prev) => {
      const next = [...prev]
      const perms = next[index].permissions
      next[index] = {
        ...next[index],
        permissions: perms.includes(perm)
          ? perms.filter((p) => p !== perm)
          : [...perms, perm],
      }
      return next
    })
    setHasChanges(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (!config || config.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Trust Levels</h1>
          <p className="text-muted-foreground">
            Configure progressive permission escalation for your community members.
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No trust levels configured</p>
            <p className="text-sm text-muted-foreground mb-4">
              Seed the default trust level configuration to get started.
            </p>
            <Button onClick={handleSeed} disabled={seedMutation.isPending}>
              {seedMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Shield className="mr-2 h-4 w-4" />
              )}
              Create Default Trust Levels
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trust Levels</h1>
          <p className="text-muted-foreground">
            Configure progressive permission escalation for your community members.
          </p>
        </div>
        <Button onClick={handleSave} disabled={!hasChanges || bulkUpdateMutation.isPending}>
          {bulkUpdateMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardContent className="flex items-start gap-3 py-4">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">How trust levels work</p>
            <p>
              Users automatically advance through trust levels based on their account age and post count.
              Higher levels unlock new participation abilities (posting links, uploading files, creating polls).
              Trust levels do NOT grant moderation powers, those remain with admin and moderator roles.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {levels.map((level, index) => (
          <Card key={level.level}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                    <span className="text-lg font-bold">TL{level.level}</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{level.name}</CardTitle>
                    <CardDescription>
                      Level {level.level}, requires {level.minDays} days + {level.minPosts} posts
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={level.level === 0 ? 'secondary' : 'default'}>
                  {level.level === 0 ? 'Default' : `TL${level.level}`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${level.level}`}>Display Name</Label>
                  <Input
                    id={`name-${level.level}`}
                    value={level.name}
                    onChange={(e) => updateLevel(index, 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`days-${level.level}`}>Min. Days</Label>
                  <Input
                    id={`days-${level.level}`}
                    type="number"
                    min={0}
                    value={level.minDays}
                    onChange={(e) => updateLevel(index, 'minDays', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`posts-${level.level}`}>Min. Posts</Label>
                  <Input
                    id={`posts-${level.level}`}
                    type="number"
                    min={0}
                    value={level.minPosts}
                    onChange={(e) => updateLevel(index, 'minPosts', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium mb-3 block">Permissions</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const isEnabled = level.permissions.includes(perm.value)
                    const isDefault = levels[0]?.permissions.includes(perm.value)
                    return (
                      <Button
                        key={perm.value}
                        onClick={() => togglePermission(index, perm.value)}
                        className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                          isEnabled
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border text-muted-foreground hover:bg-muted'
                        } ${isDefault && level.level > 0 ? 'opacity-50' : ''}`}
                      >
                        <div
                          className={`h-2 w-2 rounded-full ${
                            isEnabled ? 'bg-primary' : 'bg-muted-foreground/30'
                          }`}
                        />
                        {perm.label}
                          </Button>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
