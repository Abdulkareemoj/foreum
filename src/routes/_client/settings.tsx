import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { User, Palette, Bell, Shield, Save, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '~/lib/utils'
import { seo } from '~/utils/seo'
import { trpc } from '~/lib/trpc'
import { useSession } from '~/lib/auth-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Switch } from '~/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Spinner } from '~/components/ui/spinner'
import { FieldGroup, Field, FieldLabel, FieldContent } from '~/components/ui/field'

export const Route = createFileRoute('/_client/settings')({
  head: () => ({
    meta: [...seo({ title: 'Settings - Foreum' })],
  }),
  component: SettingsPage,
})

const sections = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'privacy', label: 'Privacy', icon: Shield },
] as const

function SettingsPage() {
  const [active, setActive] = useState<(typeof sections)[number]['key']>('profile')
  const { data: session } = useSession()
  const { data: settings, isLoading } = trpc.settings.getAll.useQuery()

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-[900px] items-center justify-center py-20">
        <Spinner className="size-6" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[900px] px-6 py-8 lg:px-10 lg:py-10">
      <div className="mb-8">
        <h1 className="font-semibold text-2xl">Settings</h1>
        <p className="mt-1 text-muted-foreground text-sm">Manage your account and preferences.</p>
      </div>

      <div className="flex gap-8 md:flex-row flex-col">
        <nav className="flex shrink-0 gap-1 md:w-48 md:flex-col">
          {sections.map((s) => (
            <button
              type="button"
              key={s.key}
              onClick={() => setActive(s.key)}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                active === s.key
                  ? 'bg-accent text-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent/60',
              )}
            >
              <s.icon className="size-4" />
              {s.label}
            </button>
          ))}
        </nav>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {active === 'profile' && <ProfileSection session={session} />}
          {active === 'appearance' && <AppearanceSection settings={settings} />}
          {active === 'notifications' && <NotificationsSection settings={settings} />}
          {active === 'privacy' && <PrivacySection settings={settings} />}
        </div>
      </div>
    </div>
  )
}

function ProfileSection({ session }: { session: any }) {
  const user = session?.user
  const { data: profile, isLoading: profileLoading } = trpc.user.getMyProfile.useQuery()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => toast.success('Profile updated'),
    onError: (err) => toast.error(err.message),
  })

  useEffect(() => {
    if (!profile) return
    setName(profile.name ?? '')
    setUsername(profile.username ?? '')
    setBio(profile.bio ?? '')
    setLocation(profile.location ?? '')
    setWebsite(profile.website ?? '')
  }, [profile])

  if (profileLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your public profile information.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner className="size-5 text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your public profile information.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel>Display Name</FieldLabel>
            <FieldContent>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FieldContent>
          </Field>

          <Field orientation="horizontal">
            <FieldLabel>Username</FieldLabel>
            <FieldContent>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} />
            </FieldContent>
          </Field>

          <Field orientation="horizontal">
            <FieldLabel>Bio</FieldLabel>
            <FieldContent>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                className="min-h-[80px]"
              />
            </FieldContent>
          </Field>

          <Field orientation="horizontal">
            <FieldLabel>Location</FieldLabel>
            <FieldContent>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
            </FieldContent>
          </Field>

          <Field orientation="horizontal">
            <FieldLabel>Website</FieldLabel>
            <FieldContent>
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" />
            </FieldContent>
          </Field>

          <div className="flex justify-end pt-2">
            <Button
              disabled={updateProfile.isPending}
              onClick={() =>
                updateProfile.mutate({ name, username, bio, location, website })
              }
            >
              {updateProfile.isPending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Save data-icon="inline-start" />
              )}
              Save Changes
            </Button>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

const themes = [
  { key: 'light', name: 'Light' },
  { key: 'dark', name: 'Dark' },
  { key: 'system', name: 'System' },
] as const

function AppearanceSection({ settings }: { settings: any }) {
  const [theme, setThemeState] = useState(settings?.theme?.theme ?? 'system')
  const updateTheme = trpc.settings.updateTheme.useMutation({
    onSuccess: () => toast.success('Theme updated'),
    onError: (err) => toast.error(err.message),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>Choose your preferred color scheme.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel>Color Scheme</FieldLabel>
            <FieldContent>
              <Select
                value={theme}
                onValueChange={(v: string) => {
                  setThemeState(v)
                  updateTheme.mutate({ theme: v as 'light' | 'dark' | 'system', customCss: null })
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((t) => (
                    <SelectItem key={t.key} value={t.key}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

const notificationTypes = [
  { key: 'email', label: 'Email Notifications' },
  { key: 'push', label: 'Push Notifications' },
  { key: 'mention', label: 'Mentions' },
  { key: 'reply', label: 'Replies to your threads' },
] as const

function NotificationsSection({ settings }: { settings: any }) {
  const notifications = settings?.notifications ?? []
  const getEnabled = (type: string) => notifications.find((n: any) => n.type === type)?.enabled ?? true
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(notificationTypes.map((n) => [n.key, getEnabled(n.key)]))
  )
  const updateNotification = trpc.settings.updateNotification.useMutation({
    onSuccess: () => toast.success('Notification preference saved'),
    onError: (err) => toast.error(err.message),
  })

  const toggle = (key: string, value: boolean) => {
    setToggles((prev) => ({ ...prev, [key]: value }))
    updateNotification.mutate({ type: key, enabled: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Control which notifications you receive.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          {notificationTypes.map((n) => (
            <Field key={n.key} orientation="horizontal">
              <FieldLabel>{n.label}</FieldLabel>
              <Switch checked={toggles[n.key]} onCheckedChange={(v) => toggle(n.key, v)} />
            </Field>
          ))}
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

function PrivacySection({ settings }: { settings: any }) {
  const [visibility, setVisibilityState] = useState(settings?.privacy?.visibility ?? 'public')
  const [dataSharing, setDataSharingState] = useState(settings?.privacy?.dataSharing ?? true)
  const updatePrivacy = trpc.settings.updatePrivacy.useMutation({
    onSuccess: () => toast.success('Privacy settings updated'),
    onError: (err) => toast.error(err.message),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy</CardTitle>
        <CardDescription>Manage your privacy preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel>Profile Visibility</FieldLabel>
            <FieldContent>
              <Select
                value={visibility}
                onValueChange={(v: string) => {
                  setVisibilityState(v)
                  updatePrivacy.mutate({ visibility: v as 'public' | 'private', dataSharing })
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <span className="flex items-center gap-2">
                      <Eye className="size-3.5" />
                      Public
                    </span>
                  </SelectItem>
                  <SelectItem value="private">
                    <span className="flex items-center gap-2">
                      <EyeOff className="size-3.5" />
                      Private
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          <Field orientation="horizontal">
            <FieldLabel>Data Sharing</FieldLabel>
            <FieldContent>
              <div className="flex items-center gap-3">
                <Switch
                  checked={dataSharing}
                  onCheckedChange={(v) => {
                    setDataSharingState(v)
                    updatePrivacy.mutate({ visibility: visibility as 'public' | 'private', dataSharing: v })
                  }}
                />
                <span className="text-muted-foreground text-sm">
                  {dataSharing ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
