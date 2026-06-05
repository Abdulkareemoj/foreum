import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import { Separator } from '~/components/ui/separator'
import { trpc } from '~/lib/trpc'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { adminMiddleware } from '~/server/auth-actions'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_admin/admin-settings')({
  head: () => ({
    meta: [...seo({ title: 'Admin Settings - Foreum' })],
  }),
	component: AdminSettingsPage,
	server: {
		middleware: [adminMiddleware],
	},
})

function SettingsField({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
	return (
		<div className="flex items-center justify-between gap-4">
			<div className="space-y-0.5">
				<Label className="text-sm font-medium">{label}</Label>
				{description && <p className="text-xs text-muted-foreground">{description}</p>}
			</div>
			{children}
		</div>
	)
}

function AdminSettingsPage() {
	const { data: settings, isLoading } = trpc.settings.getAllGlobal.useQuery()
	const updateMutation = trpc.settings.updateGlobal.useMutation()

	const [forumName, setForumName] = useState('')
	const [forumDescription, setForumDescription] = useState('')
	const [forumLogo, setForumLogo] = useState('')
	const [favicon, setFavicon] = useState('')
	const [allowRegistration, setAllowRegistration] = useState(true)
	const [requireVerification, setRequireVerification] = useState(true)
	const [defaultRole, setDefaultRole] = useState('user')
	const [smtpHost, setSmtpHost] = useState('')
	const [smtpPort, setSmtpPort] = useState('587')
	const [smtpUser, setSmtpUser] = useState('')
	const [smtpFrom, setSmtpFrom] = useState('')

	useEffect(() => {
		if (!settings) return
		setForumName(settings.forum_name ?? 'Foreum')
		setForumDescription(settings.forum_description ?? '')
		setForumLogo(settings.forum_logo ?? '')
		setFavicon(settings.favicon_url ?? '')
		setAllowRegistration(settings.allow_registration !== 'false')
		setRequireVerification(settings.require_email_verification !== 'false')
		setDefaultRole(settings.default_user_role ?? 'user')
		setSmtpHost(settings.smtp_host ?? '')
		setSmtpPort(settings.smtp_port ?? '587')
		setSmtpUser(settings.smtp_user ?? '')
		setSmtpFrom(settings.smtp_from ?? '')
	}, [settings])

	const save = async (key: string, value: string) => {
		try {
			await updateMutation.mutateAsync({ key, value })
			toast.success('Saved')
		} catch {
			toast.error('Failed to save')
		}
	}

	if (isLoading) {
		return (
			<div className="flex flex-col gap-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-96 w-full" />
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-semibold">Settings</h1>
				<p className="text-sm text-muted-foreground">Manage your forum configuration.</p>
			</div>

			<Tabs defaultValue="general" className="flex flex-col gap-6">
				<TabsList>
					<TabsTrigger value="general">General</TabsTrigger>
					<TabsTrigger value="registration">Registration</TabsTrigger>
					<TabsTrigger value="email">Email</TabsTrigger>
				</TabsList>

				<TabsContent value="general" className="flex flex-col gap-4">
					<Card>
						<CardHeader>
							<CardTitle>Forum Details</CardTitle>
							<CardDescription>Basic information about your community.</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-6">
							<div className="flex flex-col gap-2">
								<Label htmlFor="forum-name">Forum Name</Label>
								<div className="flex gap-2">
									<Input
										id="forum-name"
										value={forumName}
										onChange={(e) => setForumName(e.target.value)}
									/>
									<Button size="sm" onClick={() => save('forum_name', forumName)}>
										<Save className="size-4" /> Save
									</Button>
								</div>
							</div>

							<Separator />

							<div className="flex flex-col gap-2">
								<Label htmlFor="forum-desc">Description</Label>
								<div className="flex gap-2">
									<Input
										id="forum-desc"
										value={forumDescription}
										onChange={(e) => setForumDescription(e.target.value)}
									/>
									<Button size="sm" onClick={() => save('forum_description', forumDescription)}>
										<Save className="size-4" /> Save
									</Button>
								</div>
							</div>

							<Separator />

							<div className="flex flex-col gap-2">
								<Label htmlFor="forum-logo">Logo URL</Label>
								<div className="flex gap-2">
									<Input
										id="forum-logo"
										placeholder="https://..."
										value={forumLogo}
										onChange={(e) => setForumLogo(e.target.value)}
									/>
									<Button size="sm" onClick={() => save('forum_logo', forumLogo)}>
										<Save className="size-4" /> Save
									</Button>
								</div>
							</div>

							<Separator />

							<div className="flex flex-col gap-2">
								<Label htmlFor="favicon">Favicon URL</Label>
								<div className="flex gap-2">
									<Input
										id="favicon"
										placeholder="https://..."
										value={favicon}
										onChange={(e) => setFavicon(e.target.value)}
									/>
									<Button size="sm" onClick={() => save('favicon_url', favicon)}>
										<Save className="size-4" /> Save
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="registration" className="flex flex-col gap-4">
					<Card>
						<CardHeader>
							<CardTitle>Registration</CardTitle>
							<CardDescription>Control how new users join your community.</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-6">
							<SettingsField label="Allow Registration" description="Let new users create accounts">
								<Switch
									checked={allowRegistration}
									onCheckedChange={(v) => {
										setAllowRegistration(v)
										save('allow_registration', String(v))
									}}
								/>
							</SettingsField>

							<Separator />

							<SettingsField label="Require Email Verification" description="Users must verify their email before posting">
								<Switch
									checked={requireVerification}
									onCheckedChange={(v) => {
										setRequireVerification(v)
										save('require_email_verification', String(v))
									}}
								/>
							</SettingsField>

							<Separator />

							<div className="flex flex-col gap-2">
								<Label>Default User Role</Label>
								<div className="flex gap-2">
									<Select value={defaultRole} onValueChange={(v) => setDefaultRole(v)}>
										<SelectTrigger className="w-48">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="user">User</SelectItem>
											<SelectItem value="moderator">Moderator</SelectItem>
										</SelectContent>
									</Select>
									<Button size="sm" onClick={() => save('default_user_role', defaultRole)}>
										<Save className="size-4" /> Save
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="email" className="flex flex-col gap-4">
					<Card>
						<CardHeader>
							<CardTitle>SMTP Settings</CardTitle>
							<CardDescription>Configure email delivery for notifications and verification.</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-6">
							<div className="flex flex-col gap-2">
								<Label htmlFor="smtp-host">SMTP Host</Label>
								<div className="flex gap-2">
									<Input id="smtp-host" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} />
									<Button size="sm" onClick={() => save('smtp_host', smtpHost)}>
										<Save className="size-4" /> Save
									</Button>
								</div>
							</div>

							<Separator />

							<div className="flex flex-col gap-2">
								<Label htmlFor="smtp-port">SMTP Port</Label>
								<div className="flex gap-2">
									<Input id="smtp-port" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} />
									<Button size="sm" onClick={() => save('smtp_port', smtpPort)}>
										<Save className="size-4" /> Save
									</Button>
								</div>
							</div>

							<Separator />

							<div className="flex flex-col gap-2">
								<Label htmlFor="smtp-user">SMTP Username</Label>
								<div className="flex gap-2">
									<Input id="smtp-user" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} />
									<Button size="sm" onClick={() => save('smtp_user', smtpUser)}>
										<Save className="size-4" /> Save
									</Button>
								</div>
							</div>

							<Separator />

							<div className="flex flex-col gap-2">
								<Label htmlFor="smtp-from">From Address</Label>
								<div className="flex gap-2">
									<Input id="smtp-from" value={smtpFrom} onChange={(e) => setSmtpFrom(e.target.value)} />
									<Button size="sm" onClick={() => save('smtp_from', smtpFrom)}>
										<Save className="size-4" /> Save
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
