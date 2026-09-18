import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Skeleton } from '~/components/ui/skeleton'
import { Switch } from '~/components/ui/switch'
import { Badge } from '~/components/ui/badge'
import { trpc } from '~/lib/trpc'
import { Loader2, Plus, Trash2, Puzzle, Download, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { adminMiddleware } from '~/server/auth-actions'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_admin/plugins')({
  head: () => ({
    meta: [...seo({ title: 'Plugins - Foreum Admin' })],
  }),
  component: PluginsPage,
  server: {
    middleware: [adminMiddleware],
  },
})

interface PluginForm {
  name: string
  version: string
  description: string
  author: string
}

const defaultForm: PluginForm = {
  name: '',
  version: '1.0.0',
  description: '',
  author: '',
}

function PluginsPage() {
  const { data: plugins, isLoading } = trpc.plugins.list.useQuery()
  const registerMutation = trpc.plugins.register.useMutation()
  const toggleMutation = trpc.plugins.toggle.useMutation()
  const unregisterMutation = trpc.plugins.unregister.useMutation()
  const exportManifest = trpc.theme.exportManifest.useQuery()
  const importManifest = trpc.theme.importManifest.useMutation()
  const utils = trpc.useUtils()

  const [showRegister, setShowRegister] = useState(false)
  const [form, setForm] = useState<PluginForm>(defaultForm)
  const [importJson, setImportJson] = useState('')

  const handleRegister = async () => {
    try {
      await registerMutation.mutateAsync({
        name: form.name,
        version: form.version,
        description: form.description || undefined,
        author: form.author || undefined,
      })
      toast.success(`Plugin "${form.name}" registered`)
      setShowRegister(false)
      setForm(defaultForm)
      await utils.plugins.list.invalidate()
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to register plugin')
    }
  }

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      await toggleMutation.mutateAsync({ id, enabled: !enabled })
      await utils.plugins.list.invalidate()
    } catch {
      toast.error('Failed to toggle plugin')
    }
  }

  const handleUnregister = async (id: string, name: string) => {
    try {
      await unregisterMutation.mutateAsync({ id })
      toast.success(`Plugin "${name}" removed`)
      await utils.plugins.list.invalidate()
    } catch {
      toast.error('Failed to remove plugin')
    }
  }

  const handleExportTheme = async () => {
    if (!exportManifest.data) return
    const json = JSON.stringify(exportManifest.data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `foreum-theme-${exportManifest.data.$name?.replace(/\s+/g, '-') ?? 'export'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportTheme = async () => {
    try {
      const parsed = JSON.parse(importJson)
      await importManifest.mutateAsync(parsed)
      toast.success(`Theme "${parsed.$name}" imported`)
      setImportJson('')
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to import theme')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Plugins & Themes</h1>
        <p className="text-muted-foreground">
          Manage plugins and import/export themes.
        </p>
      </div>

      {/* Theme Export/Import */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Theme Contract
          </CardTitle>
          <CardDescription>
            Export your current theme or import a theme manifest.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={handleExportTheme} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Current Theme
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Import Theme Manifest (JSON)</Label>
            <textarea
              className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[120px] font-mono"
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='{"$name": "My Theme", "theme": {...}}'
            />
            <Button
              onClick={handleImportTheme}
              disabled={!importJson.trim()}
              variant="outline"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import Theme
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plugins */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Puzzle className="h-5 w-5" />
              Plugin Contract
            </CardTitle>
            <CardDescription>
              Register and manage plugins. Plugins can hook into thread/reply creation and other events.
            </CardDescription>
          </div>
          <Button onClick={() => setShowRegister(!showRegister)}>
            <Plus className="mr-2 h-4 w-4" />
            Register Plugin
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showRegister && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Plugin Name</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="My Plugin"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Version</Label>
                    <Input
                      value={form.version}
                      onChange={(e) => setForm({ ...form, version: e.target.value })}
                      placeholder="1.0.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="What this plugin does"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Author</Label>
                    <Input
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowRegister(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleRegister} disabled={!form.name.trim()}>
                    Register
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!plugins || plugins.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No plugins registered. Click "Register Plugin" to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {plugins.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={p.enabled}
                      onCheckedChange={() => handleToggle(p.id, p.enabled)}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{p.name}</span>
                        <Badge variant="outline">v{p.version}</Badge>
                        {p.author && (
                          <Badge variant="secondary">{p.author}</Badge>
                        )}
                      </div>
                      {p.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {p.description}
                        </p>
                      )}
                      {p.hooks.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {p.hooks.map((hook: string) => (
                            <Badge key={hook} variant="outline" className="text-xs">
                              {hook}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnregister(p.id, p.name)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Hooks Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Available Hooks</CardTitle>
          <CardDescription>
            Plugins can register handlers for these lifecycle events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {[
              'thread:beforeCreate',
              'thread:afterCreate',
              'reply:beforeCreate',
              'reply:afterCreate',
              'user:beforeCreate',
              'user:afterCreate',
              'reaction:afterToggle',
              'notification:afterCreate',
              'report:afterCreate',
              'page:beforeRender',
            ].map((hook) => (
              <div key={hook} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                <code className="text-xs font-mono">{hook}</code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
