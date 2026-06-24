import { createFileRoute, Link } from '@tanstack/react-router'
import { trpc } from '~/lib/trpc'
import { Skeleton } from '~/components/ui/skeleton'
import { Button } from '~/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_client/pages/$slug')({
	component: PageView,
})

function PageView() {
	const { slug } = Route.useParams()
	const { data: page, isLoading } = trpc.pages.getBySlug.useQuery({ slug })
	const { data: settings } = trpc.settings.getPublicSettings.useQuery()

	if (isLoading) {
		return (
			<div className="flex flex-col gap-6 p-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-64 w-full" />
			</div>
		)
	}

	if (!page) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 p-12">
				<h1 className="text-4xl font-bold">404</h1>
				<p className="text-muted-foreground">Page not found</p>
				<Link to="/threads">
					<Button variant="outline" className="gap-2">
						<ArrowLeft /> Back to threads
					</Button>
				</Link>
			</div>
		)
	}

	const forumName = settings?.forumName ?? 'Foreum'

	return (
		<div className="mx-auto max-w-3xl px-6 py-10">
			<Link to="/threads" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
				<ArrowLeft className="h-4 w-4" /> Back to {forumName}
			</Link>
			<article className="prose prose-neutral dark:prose-invert max-w-none">
				<h1>{page.title}</h1>
				<div dangerouslySetInnerHTML={{ __html: page.content }} />
			</article>
		</div>
	)
}
