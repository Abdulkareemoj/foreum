import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { Empty, EmptyDescription, EmptyTitle } from '~/components/ui/empty'
import { Skeleton } from '~/components/ui/skeleton'
import { trpc } from '~/lib/trpc'
import { Plus, ExternalLink, Save, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { adminMiddleware } from '~/server/auth-actions'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_admin/admin-pages')({
	head: () => ({
		meta: [...seo({ title: 'Custom Pages - Foreum' })],
	}),
	component: AdminPagesPage,
	server: {
		middleware: [adminMiddleware],
	},
})

function AdminPagesPage() {
	const { data: pages, isLoading } = trpc.pages.list.useQuery()
	const createPage = trpc.pages.create.useMutation()
	const updatePage = trpc.pages.update.useMutation()
	const deletePage = trpc.pages.delete.useMutation()
	const utils = trpc.useUtils()

	const [editingId, setEditingId] = useState<string | null>(null)
	const [newTitle, setNewTitle] = useState('')
	const [newSlug, setNewSlug] = useState('')
	const [newContent, setNewContent] = useState('')
	const [newPublished, setNewPublished] = useState(false)

	function resetForm() {
		setEditingId(null)
		setNewTitle('')
		setNewSlug('')
		setNewContent('')
		setNewPublished(false)
	}

	function startEdit(page: typeof pages extends (infer U)[] ? U : never) {
		if (!page) return
		setEditingId(page.id)
		setNewTitle(page.title)
		setNewSlug(page.slug)
		setNewContent(page.content)
		setNewPublished(page.published)
	}

	function handleSave() {
		if (!newTitle || !newSlug) {
			toast.error('Title and slug are required')
			return
		}
		const slug = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
		const mutation = editingId
			? updatePage.mutateAsync({ id: editingId, title: newTitle, slug, content: newContent, published: newPublished })
			: createPage.mutateAsync({ title: newTitle, slug, content: newContent })
		mutation
			.then(() => {
				toast.success(editingId ? 'Page updated' : 'Page created')
				utils.pages.list.invalidate()
				resetForm()
			})
			.catch((err) => toast.error(err.message))
	}

	function handleDelete(id: string) {
		deletePage.mutate(
			{ id },
			{ onSuccess: () => { toast.success('Page deleted'); utils.pages.list.invalidate() }, onError: (err) => toast.error(err.message) }
		)
	}

	if (isLoading) {
		return (
			<div className="flex flex-col gap-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-64 w-full" />
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Custom Pages</h1>
					<p className="text-sm text-muted-foreground">Create static pages like About, Rules, or Contact.</p>
				</div>
				{!editingId && (
					<Button onClick={() => setEditingId('new')} className="gap-2">
						<Plus /> New Page
					</Button>
				)}
			</div>

			{(editingId === 'new' || editingId) && (
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>{editingId === 'new' ? 'New Page' : 'Edit Page'}</CardTitle>
						<Button variant="ghost" size="icon-sm" onClick={resetForm}>
							<X />
						</Button>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-2">
								<Label htmlFor="page-title">Title</Label>
								<Input id="page-title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="About Us" />
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="page-slug">Slug</Label>
								<Input id="page-slug" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="about" />
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="page-content">Content (HTML)</Label>
							<Textarea id="page-content" value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={12} className="font-mono text-sm" />
						</div>
						{editingId !== 'new' && (
							<div className="flex items-center gap-4">
								<Switch checked={newPublished} onCheckedChange={setNewPublished} />
								<span className="text-sm">{newPublished ? 'Published' : 'Draft'}</span>
							</div>
						)}
						<div className="flex justify-end gap-2">
							<Button variant="outline" onClick={resetForm}>Cancel</Button>
							<Button onClick={handleSave} disabled={createPage.isPending || updatePage.isPending}>
								<Save /> {editingId === 'new' ? 'Create Page' : 'Save Changes'}
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{(!pages || pages.length === 0) && !editingId && (
				<Empty>
					<EmptyTitle>No custom pages</EmptyTitle>
					<EmptyDescription>Create your first page like About, Rules, or Contact.</EmptyDescription>
				</Empty>
			)}

			{pages && pages.length > 0 && (
				<div className="flex flex-col gap-3">
					{pages.map((page) => (
						<Card key={page.id} className="hover:bg-muted/30 transition-colors">
							<CardContent className="flex items-center justify-between p-4">
								<div className="flex items-center gap-3">
									<div>
										<p className="font-medium">{page.title}</p>
										<p className="text-xs text-muted-foreground">
											/{page.slug} &middot; {page.published ? 'Published' : 'Draft'}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Link to="/pages/$slug" params={{ slug: page.slug }} target="_blank">
										<Button variant="ghost" size="icon-sm">
											<ExternalLink />
										</Button>
									</Link>
									<Button variant="ghost" size="icon-sm" onClick={() => startEdit(page as any)}>
										<Save />
									</Button>
									<Button variant="ghost" size="icon-sm" onClick={() => handleDelete(page.id)}>
										<Trash2 />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}
