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
import { Save, ImageIcon, Trash2, Send, Loader2 } from 'lucide-react'
import { cn } from '~/lib/utils'
import { toast } from 'sonner'
import { adminMiddleware } from '~/server/auth-actions'
import { LayoutTab } from '~/components/admin/settings/layout-tab'
import { SocialSeoTab } from '~/components/admin/settings/social-seo-tab'
import { AdvancedTab } from '~/components/admin/settings/advanced-tab'
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
	const testEmailMutation = trpc.settings.testEmail.useMutation()

	const [forumName, setForumName] = useState('')
	const [forumDescription, setForumDescription] = useState('')
	const [forumLogo, setForumLogo] = useState('')
	const [forumBanner, setForumBanner] = useState('')
	const [favicon, setFavicon] = useState('')
	const [allowRegistration, setAllowRegistration] = useState(true)
	const [requireVerification, setRequireVerification] = useState(true)
	const [defaultRole, setDefaultRole] = useState('user')
	const [smtpHost, setSmtpHost] = useState('')
	const [smtpPort, setSmtpPort] = useState('587')
	const [smtpUser, setSmtpUser] = useState('')
	const [smtpPass, setSmtpPass] = useState('')
	const [smtpSecure, setSmtpSecure] = useState(false)
	const [smtpFrom, setSmtpFrom] = useState('')
	const [testEmailAddress, setTestEmailAddress] = useState('')
	const [testResult, setTestResult] = useState<{ success: boolean; error?: string } | null>(null)
	const [testing, setTesting] = useState(false)

	useEffect(() => {
		if (!settings) return
		setForumName(settings.forum_name ?? 'Foreum')
		setForumDescription(settings.forum_description ?? '')
		setForumLogo(settings.forum_logo ?? '')
		setForumBanner(settings.forum_banner ?? '')
		setFavicon(settings.favicon_url ?? '')
		setAllowRegistration(settings.allow_registration !== 'false')
		setRequireVerification(settings.require_email_verification !== 'false')
		setDefaultRole(settings.default_user_role ?? 'user')
		setSmtpHost(settings.smtp_host ?? '')
		setSmtpPort(settings.smtp_port ?? '587')
		setSmtpUser(settings.smtp_user ?? '')
		setSmtpPass(settings.smtp_pass ?? '')
		setSmtpSecure(settings.smtp_secure === 'true')
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
					<TabsTrigger value="branding">Branding</TabsTrigger>
					<TabsTrigger value="registration">Registration</TabsTrigger>
					<TabsTrigger value="email">Email</TabsTrigger>
				<TabsTrigger value="layout">Layout</TabsTrigger>
				<TabsTrigger value="social-seo">Social &amp; SEO</TabsTrigger>
				<TabsTrigger value="advanced">Advanced</TabsTrigger>
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
										<Save /> Save
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
										<Save /> Save
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="branding" className="flex flex-col gap-4">
					<Card>
						<CardHeader>
							<CardTitle>Logo &amp; Favicon</CardTitle>
							<CardDescription>Upload or link your forum's logo and favicon.</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-6">
							<div className="flex flex-col gap-2">
								<Label>Current Logo Preview</Label>
								<div className="flex items-center gap-4 rounded-lg border bg-muted/30 p-4">
									{forumLogo ? (
										<>
											<img src={forumLogo} alt="Logo preview" className="h-12 w-auto max-w-[200px] object-contain" />
											<Button variant="ghost" size="icon" onClick={() => { setForumLogo(''); save('forum_logo', ''); }}>
												<Trash2 />
											</Button>
										</>
									) : (
										<div className="flex items-center gap-3 text-muted-foreground">
											<ImageIcon />
											<span className="text-sm">No logo set — showing text badge</span>
										</div>
									)}
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="forum-logo">Logo URL</Label>
								<p className="text-xs text-muted-foreground">e.g. https://placehold.co/160x40/6b47ed/white?text=MyForum</p>
								<div className="flex gap-2">
									<Input
										id="forum-logo"
										placeholder="https://..."
										value={forumLogo}
										onChange={(e) => setForumLogo(e.target.value)}
									/>
									<Button size="sm" onClick={() => save('forum_logo', forumLogo)}>
										<Save /> Save
									</Button>
								</div>
							</div>

							<Separator />

							<div className="flex flex-col gap-2">
								<Label>Current Favicon Preview</Label>
								<div className="flex items-center gap-4 rounded-lg border bg-muted/30 p-4">
									{favicon ? (
										<>
											<img src={favicon} alt="Favicon preview" className="h-8 w-8 rounded object-contain ring-1 ring-border" />
											<Button variant="ghost" size="icon" onClick={() => { setFavicon(''); save('favicon_url', ''); }}>
												<Trash2 />
											</Button>
										</>
									) : (
										<div className="flex items-center gap-3 text-muted-foreground">
											<ImageIcon />
											<span className="text-sm">No favicon set</span>
										</div>
									)}
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="favicon">Favicon URL</Label>
								<p className="text-xs text-muted-foreground">e.g. https://placehold.co/32/6b47ed/white?text=F</p>
								<div className="flex gap-2">
									<Input
										id="favicon"
										placeholder="https://..."
										value={favicon}
										onChange={(e) => setFavicon(e.target.value)}
									/>
									<Button size="sm" onClick={() => save('favicon_url', favicon)}>
										<Save /> Save
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Banner Image</CardTitle>
							<CardDescription>A large header image for your forum homepage.</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-6">
							<div className="flex flex-col gap-2">
								<Label>Current Banner Preview</Label>
								<div className={cn(
									"relative flex h-40 items-center justify-center rounded-lg border bg-muted/30 overflow-hidden",
									!forumBanner && "border-dashed"
								)}>
									{forumBanner ? (
										<>
											<img src={forumBanner} alt="Banner preview" className="h-full w-full object-cover" />
											<Button
												variant="secondary"
												size="icon"
												className="absolute top-2 right-2"
												onClick={() => { setForumBanner(''); save('forum_banner', ''); }}
											>
												<Trash2 />
											</Button>
										</>
									) : (
										<div className="flex flex-col items-center gap-2 text-muted-foreground">
											<ImageIcon />
											<span className="text-sm">No banner set</span>
										</div>
									)}
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="forum-banner">Banner Image URL</Label>
								<p className="text-xs text-muted-foreground">e.g. https://picsum.photos/seed/foreum/1200/400</p>
								<div className="flex gap-2">
									<Input
										id="forum-banner"
										placeholder="https://..."
										value={forumBanner}
										onChange={(e) => setForumBanner(e.target.value)}
									/>
									<Button size="sm" onClick={() => save('forum_banner', forumBanner)}>
										<Save /> Save
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
										<Save /> Save
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
										<Save /> Save
									</Button>
								</div>
							</div>

							<Separator />

							<div className="flex flex-col gap-2">
								<Label htmlFor="smtp-port">SMTP Port</Label>
								<div className="flex gap-2">
									<Input id="smtp-port" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} />
									<Button size="sm" onClick={() => save('smtp_port', smtpPort)}>
										<Save /> Save
									</Button>
								</div>
							</div>

							<Separator />

							<div className="flex flex-col gap-2">
								<Label htmlFor="smtp-user">SMTP Username</Label>
								<div className="flex gap-2">
									<Input id="smtp-user" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} />
									<Button size="sm" onClick={() => save('smtp_user', smtpUser)}>
										<Save /> Save
									</Button>
								</div>
							</div>

							<Separator />

							<div className="flex flex-col gap-2">
								<Label htmlFor="smtp-pass">SMTP Password</Label>
								<div className="flex gap-2">
									<Input id="smtp-pass" type="password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} />
									<Button size="sm" onClick={() => save('smtp_pass', smtpPass)}>
										<Save /> Save
									</Button>
								</div>
							</div>

							<Separator />

							<SettingsField label="SMTP Secure (TLS)" description="Enable TLS encryption for SMTP connections (usually required for port 465)">
								<Switch
									checked={smtpSecure}
									onCheckedChange={(v) => {
										setSmtpSecure(v)
										save('smtp_secure', String(v))
									}}
								/>
							</SettingsField>

							<Separator />

							<div className="flex flex-col gap-2">
								<Label htmlFor="smtp-from">From Address</Label>
								<div className="flex gap-2">
									<Input id="smtp-from" value={smtpFrom} onChange={(e) => setSmtpFrom(e.target.value)} />
									<Button size="sm" onClick={() => save('smtp_from', smtpFrom)}>
										<Save /> Save
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Test Email</CardTitle>
							<CardDescription>Send a test email to verify your SMTP configuration.</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-4">
							<div className="flex flex-col gap-2">
								<Label htmlFor="test-email">Send Test Email To</Label>
								<div className="flex gap-2">
									<Input
										id="test-email"
										type="email"
										placeholder="you@example.com"
										value={testEmailAddress}
										onChange={(e) => setTestEmailAddress(e.target.value)}
									/>
									<Button
										size="sm"
										disabled={testing || !testEmailAddress}
										onClick={async () => {
											setTesting(true)
											setTestResult(null)
											try {
												const result = await testEmailMutation.mutateAsync({
													host: smtpHost,
													port: Number(smtpPort) || 587,
													secure: smtpSecure,
													user: smtpUser,
													pass: smtpPass,
													to: testEmailAddress,
												})
												setTestResult(result)
												if (result.success) {
													toast.success('Test email sent successfully')
												} else {
													toast.error(result.error || 'Test email failed')
												}
											} catch (err: any) {
												const msg = err?.message || 'Failed to send test email'
												setTestResult({ success: false, error: msg })
												toast.error(msg)
											} finally {
												setTesting(false)
											}
										}}
									>
										{testing ? <Loader2 className="animate-spin" /> : <Send />}
										{testing ? 'Sending...' : 'Send Test'}
									</Button>
								</div>
							</div>
							{testResult && (
								<div className={`rounded-lg border p-3 text-sm ${testResult.success ? 'border-green-500 bg-green-50 text-green-800' : 'border-red-500 bg-red-50 text-red-800'}`}>
									{testResult.success
										? 'Test email sent! Check your inbox.'
										: `Failed: ${testResult.error}`}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="layout">
					<LayoutTab />
				</TabsContent>

				<TabsContent value="social-seo">
					<SocialSeoTab />
				</TabsContent>

				<TabsContent value="advanced">
					<AdvancedTab />
				</TabsContent>
			</Tabs>
		</div>
	)
}
