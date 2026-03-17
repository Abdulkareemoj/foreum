import { createFileRoute } from '@tanstack/react-router'
import { trpc } from '~/lib/trpc'
import ThreadCard from '~/components/forum/ThreadCard'

export const Route = createFileRoute('/_client/tags/$slug')({
  component: TagSlugPage,
})

function TagSlugPage() {
  const { slug } = Route.useParams()

  const { data: tag, isLoading: tagLoading } = trpc.tag.bySlug.useQuery({ slug })
  
  const { data: threads, isLoading: threadsLoading } = trpc.thread.list.useQuery(
    { tagId: tag?.id as string },
    { enabled: !!tag?.id }
  )

  const isLoading = tagLoading || threadsLoading

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">
        #{tag?.name ?? (isLoading ? 'Loading…' : 'Tag Not Found')}
      </h1>

      {isLoading ? (
        <p>Loading threads…</p>
      ) : !threads || threads.length === 0 ? (
        <p className="text-muted-foreground">No threads with this tag yet.</p>
      ) : (
        <div className="space-y-4">
          {threads.map((thread: any) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </div>
      )}
    </div>
  )
}