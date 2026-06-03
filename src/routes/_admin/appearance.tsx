import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { ThemeDataProvider, useThemeData } from '~/providers/theme-data-provider'
import { ThemeEditorSidebar } from '~/components/admin/theme-options/sidebar'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Separator } from '~/components/ui/separator'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Sun, Moon, RotateCcw, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '~/lib/utils'
import { Spinner } from '~/components/ui/spinner'

export const Route = createFileRoute('/_admin/appearance')({
	component: () => (
		<ThemeDataProvider>
			<AdminAppearance />
		</ThemeDataProvider>
	)
})

// --- Live Preview Panel ---
function PreviewPanel() {
	const { theme, previewMode, themedScopeRef } = useThemeData()

	// Apply CSS vars directly to the preview scope on every theme change
	React.useEffect(() => {
		const el = themedScopeRef.current
		if (!el || !theme) return
		const vars = theme[previewMode]
		if (!vars) return
		for (const [key, value] of Object.entries(vars)) {
			if (typeof value === 'string' && value.trim()) {
				el.style.setProperty(`--${key}`, value)
			}
		}
		el.style.setProperty('--radius', theme.theme.radius)
	}, [theme, previewMode, themedScopeRef])

	return (
		<div
			ref={themedScopeRef}
			className={cn(
				'h-full w-full overflow-auto p-6 flex flex-col gap-6',
				previewMode === 'dark' ? 'dark' : ''
			)}
			style={{ background: 'var(--background)', color: 'var(--foreground)' }}
		>
			{/* Header strip */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div
						className="size-8 rounded-md flex items-center justify-center text-[var(--primary-foreground)] font-bold text-sm"
						style={{ background: 'var(--primary)' }}
					>
						F
					</div>
					<span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
						Foreum
					</span>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant="secondary">Community</Badge>
					<Avatar className="size-7">
						<AvatarFallback style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }} className="text-xs">
							JD
						</AvatarFallback>
					</Avatar>
				</div>
			</div>

			<Separator />

			{/* Thread cards */}
			<div className="flex flex-col gap-4">
				<h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
					Recent Discussions
				</h2>
				{[
					{ title: 'Welcome to the forum!', tag: 'Announcements', replies: 12 },
					{ title: 'Best practices for this theme', tag: 'General', replies: 4 },
					{ title: 'Feature request: dark mode toggle', tag: 'Ideas', replies: 27 }
				].map(thread => (
					<div
						key={thread.title}
						className="rounded-[var(--radius)] border p-4 flex items-start gap-4"
						style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--card-foreground)' }}
					>
						<div
							className="size-9 shrink-0 rounded-[var(--radius)] flex items-center justify-center text-sm font-semibold"
							style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
						>
							{thread.title[0]}
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium truncate">{thread.title}</p>
							<p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
								{thread.replies} replies
							</p>
						</div>
						<Badge
							variant="outline"
							className="shrink-0 text-xs"
							style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
						>
							{thread.tag}
						</Badge>
					</div>
				))}
			</div>

			{/* Component showcase */}
			<Card style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--card-foreground)', borderRadius: 'var(--radius)' }}>
				<CardHeader>
					<CardTitle className="text-sm">Component Preview</CardTitle>
					<CardDescription className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
						How buttons, badges and inputs will look.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-wrap gap-2">
					<button
						className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius)] transition-opacity hover:opacity-90"
						style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
					>
						Primary
					</button>
					<button
						className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius)] border transition-opacity hover:opacity-90"
						style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)', borderColor: 'var(--border)' }}
					>
						Secondary
					</button>
					<button
						className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius)] transition-opacity hover:opacity-90"
						style={{ background: 'var(--destructive)', color: 'var(--primary-foreground)' }}
					>
						Destructive
					</button>
					<button
						className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius)] border transition-opacity hover:opacity-90"
						style={{ background: 'var(--accent)', color: 'var(--accent-foreground)', borderColor: 'var(--border)' }}
					>
						Accent
					</button>
				</CardContent>
				<CardFooter className="gap-2 flex-wrap">
					<Badge>Default</Badge>
					<Badge variant="secondary">Secondary</Badge>
					<Badge variant="outline">Outline</Badge>
					<Badge variant="destructive">Destructive</Badge>
				</CardFooter>
			</Card>
		</div>
	)
}

// --- Toolbar ---
function AppearanceToolbar() {
	const { previewMode, setPreviewMode, isSaving, resetTheme } = useThemeData()
	return (
		<div className="flex items-center justify-between px-4 py-2 border-b bg-card shrink-0">
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium">Preview</span>
				{isSaving && (
					<span className="flex items-center gap-1 text-xs text-muted-foreground">
						<Spinner className="size-3 animate-spin" /> Saving...
					</span>
				)}
				{!isSaving && (
					<span className="flex items-center gap-1 text-xs text-muted-foreground">
						<CheckCircle className="size-3 text-green-500" /> Auto-saved
					</span>
				)}
			</div>
			<div className="flex items-center gap-2">
				<Button
					size="sm"
					variant="ghost"
					onClick={() => setPreviewMode(previewMode === 'light' ? 'dark' : 'light')}
				>
					{previewMode === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
					{previewMode === 'light' ? 'Dark' : 'Light'}
				</Button>
				<Button
					size="sm"
					variant="outline"
					onClick={() => {
						resetTheme()
						toast.success('Theme reset to default')
					}}
				>
					<RotateCcw className="size-4" />
					Reset
				</Button>
			</div>
		</div>
	)
}

// --- Main Page ---
function AdminAppearance() {
	return (
			
		<div className="flex flex-1 min-h-0 overflow-hidden -m-4">
			{/* Editor sidebar */}
		
			<div className="w-72 shrink-0 border-r flex flex-col bg-card h-full">
				<div className="px-4 py-3 border-b shrink-0">
					<h1 className="text-base font-semibold">Appearance</h1>
					<p className="text-xs text-muted-foreground mt-0.5">
						Customise your forum's look and feel. Changes are saved automatically.
					</p>
				</div>
			<div className="flex-1 min-h-0 overflow-y-auto">
					<ThemeEditorSidebar />
				</div>
			</div>

			{/* Preview area */}
			<div className="flex-1 flex flex-col min-w-0 min-h-0">
			<ScrollArea>		<AppearanceToolbar /></ScrollArea>
				<div className="flex-1 min-h-0 overflow-y-auto">
					<PreviewPanel />
				</div>
			</div>
		</div>
	)
}
