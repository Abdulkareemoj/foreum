import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Skeleton } from '~/components/ui/skeleton'
import { Switch } from '~/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { trpc } from '~/lib/trpc'
import { Save, Loader2, Trash2, Plus, ShieldCheck, FlaskConical } from 'lucide-react'
import { toast } from 'sonner'
import { adminMiddleware } from '~/server/auth-actions'
import { seo } from '~/utils/seo'
import { Badge } from '~/components/ui/badge'

export const Route = createFileRoute('/_admin/auto-moderation')({
  head: () => ({
    meta: [...seo({ title: 'Auto-Moderation - Foreum Admin' })],
  }),
  component: AutoModerationPage,
  server: {
    middleware: [adminMiddleware],
  },
})

const PATTERN_TYPES = [
  { value: 'contains', label: 'Contains' },
  { value: 'regex', label: 'Regex' },
  { value: 'startsWith', label: 'Starts with' },
  { value: 'endsWith', label: 'Ends with' },
]

const ACTIONS = [
  { value: 'block', label: 'Block', description: 'Reject the content entirely' },
  { value: 'flag', label: 'Flag', description: 'Allow but flag for review' },
  { value: 'replace', label: 'Replace', description: 'Censor matched text' },
]

const TARGETS = [
  { value: 'both', label: 'Title & Content' },
  { value: 'title', label: 'Title only' },
  { value: 'content', label: 'Content only' },
]

interface RuleForm {
  name: string
  patternType: string
  pattern: string
  action: string
  replacement: string
  target: string
  message: string
}

const defaultForm: RuleForm = {
  name: '',
  patternType: 'contains',
  pattern: '',
  action: 'block',
  replacement: '***',
  target: 'both',
  message: '',
}

function AutoModerationPage() {
  const { data: rules, isLoading } = trpc.moderationConfig.list.useQuery()
  const createMutation = trpc.moderationConfig.create.useMutation()
  const updateMutation = trpc.moderationConfig.update.useMutation()
  const deleteMutation = trpc.moderationConfig.delete.useMutation()
  const utils = trpc.useUtils()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<RuleForm>(defaultForm)
  const [testContent, setTestContent] = useState('')
  const [testTitle, setTestTitle] = useState('')
  const [testResult, setTestResult] = useState<any>(null)

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          name: form.name,
          patternType: form.patternType as 'regex' | 'contains' | 'startsWith' | 'endsWith',
          pattern: form.pattern,
          action: form.action as 'block' | 'flag' | 'replace',
          replacement: form.action === 'replace' ? form.replacement : undefined,
          target: form.target as 'title' | 'content' | 'both',
          message: form.message || undefined,
        })
        toast.success('Rule updated')
      } else {
        await createMutation.mutateAsync({
          name: form.name,
          patternType: form.patternType as 'regex' | 'contains' | 'startsWith' | 'endsWith',
          pattern: form.pattern,
          action: form.action as 'block' | 'flag' | 'replace',
          replacement: form.action === 'replace' ? form.replacement : undefined,
          target: form.target as 'title' | 'content' | 'both',
          message: form.message || undefined,
        })
        toast.success('Rule created')
      }
      setShowForm(false)
      setEditingId(null)
      setForm(defaultForm)
      await utils.moderationConfig.list.invalidate()
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to save rule')
    }
  }

  const handleEdit = (rule: any) => {
    setForm({
      name: rule.name,
      patternType: rule.patternType,
      pattern: rule.pattern,
      action: rule.action,
      replacement: rule.replacement ?? '***',
      target: rule.target,
      message: rule.message ?? '',
    })
    setEditingId(rule.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync({ id })
      toast.success('Rule deleted')
      await utils.moderationConfig.list.invalidate()
    } catch {
      toast.error('Failed to delete rule')
    }
  }

  const handleToggle = async (rule: any) => {
    try {
      await updateMutation.mutateAsync({
        id: rule.id,
        enabled: !rule.enabled,
      })
      await utils.moderationConfig.list.invalidate()
    } catch {
      toast.error('Failed to toggle rule')
    }
  }

  const handleTest = async () => {
    try {
      const result = await utils.client.moderationConfig.test.query({
        content: testContent,
        title: testTitle,
      })
      setTestResult(result)
    } catch {
      toast.error('Failed to test content')
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Auto-Moderation</h1>
          <p className="text-muted-foreground">
            Configure rules to automatically filter or flag content.
          </p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingId(null); setForm(defaultForm) }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Rule
        </Button>
      </div>

      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <CardContent className="flex items-start gap-3 py-4">
          <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <p className="font-medium mb-1">How auto-moderation works</p>
            <p>
              Content is checked against active rules when users create threads or replies.
              Blocked content is rejected, flagged content is allowed but queued for review,
              and replace rules censor matched text automatically.
            </p>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Rule' : 'New Rule'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rule Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Spam filter"
                />
              </div>
              <div className="space-y-2">
                <Label>Pattern Type</Label>
                <Select value={form.patternType} onValueChange={(v) => setForm({ ...form, patternType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PATTERN_TYPES.map((pt) => (
                      <SelectItem key={pt.value} value={pt.value}>{pt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Pattern</Label>
                <Input
                  value={form.pattern}
                  onChange={(e) => setForm({ ...form, pattern: e.target.value })}
                  placeholder={form.patternType === 'regex' ? '\\b(badword)\\b' : 'spam text'}
                />
              </div>
              <div className="space-y-2">
                <Label>Action</Label>
                <Select value={form.action} onValueChange={(v) => setForm({ ...form, action: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ACTIONS.map((a) => (
                      <SelectItem key={a.value} value={a.value}>{a.label} — {a.description}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {form.action === 'replace' && (
                <div className="space-y-2">
                  <Label>Replacement</Label>
                  <Input
                    value={form.replacement}
                    onChange={(e) => setForm({ ...form, replacement: e.target.value })}
                    placeholder="***"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Target</Label>
                <Select value={form.target} onValueChange={(v) => setForm({ ...form, target: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TARGETS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Block Message (optional)</Label>
              <Input
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Your content was blocked because..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null) }}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!form.name || !form.pattern}>
                <Save className="mr-2 h-4 w-4" />
                {editingId ? 'Update' : 'Create'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Moderation Rules</CardTitle>
          <CardDescription>
            {rules?.length ?? 0} rules configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!rules || rules.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No moderation rules configured yet. Click "Add Rule" to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => handleToggle(rule)}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{rule.name}</span>
                        <Badge variant={rule.action === 'block' ? 'destructive' : rule.action === 'flag' ? 'secondary' : 'outline'}>
                          {rule.action}
                        </Badge>
                        <Badge variant="outline">{rule.patternType}</Badge>
                        <Badge variant="outline">{rule.target}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pattern: <code className="bg-muted px-1 rounded">{rule.pattern}</code>
                        {rule.message && <> — {rule.message}</>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(rule)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(rule.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            Test Content
          </CardTitle>
          <CardDescription>
            Preview how your rules affect content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title (optional)</Label>
            <Input
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              placeholder="Test title"
            />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={testContent}
              onChange={(e) => setTestContent(e.target.value)}
              placeholder="Test content"
              rows={3}
            />
          </div>
          <Button onClick={handleTest} variant="secondary">
            <FlaskConical className="mr-2 h-4 w-4" />
            Test
          </Button>
          {testResult && (
            <div className={`rounded-lg border p-4 ${testResult.blocked ? 'border-destructive bg-destructive/5' : testResult.flagged ? 'border-amber-500 bg-amber-50 dark:bg-amber-950' : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'}`}>
              <p className="font-medium">
                {testResult.blocked ? '🚫 Blocked' : testResult.flagged ? '⚠️ Flagged' : '✅ Allowed'}
              </p>
              {testResult.message && <p className="text-sm mt-1">{testResult.message}</p>}
              {testResult.matchedRules?.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Matched: {testResult.matchedRules.join(', ')}
                </p>
              )}
              {testResult.cleanedContent !== testContent && (
                <p className="text-xs text-muted-foreground mt-2">
                  Cleaned: {testResult.cleanedContent}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
