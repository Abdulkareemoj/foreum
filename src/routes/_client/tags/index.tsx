import { createFileRoute, Link } from '@tanstack/react-router'
import { Badge } from '~/components/ui/badge'
import { Card, CardHeader } from '~/components/ui/card'
import { trpc } from '~/lib/trpc'

export const Route = createFileRoute('/_client/tags/')({
  component: TagsPage,
})

function TagsPage() {
  const { data: tags, isLoading } = trpc.tag.list.useQuery()

  return (
    <div className="container mx-auto space-y-6 px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold">Tags</h1>

      {isLoading ? (
        <p>Loading tags…</p>
      ) : !tags || tags.length === 0 ? (
        <p className="text-muted-foreground">No tags yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tags.map((tag: any) => (
            <Link key={tag.id} to={`/tags/${tag.slug}` as any} className="block group">
              <Card className="flex h-full flex-col justify-between transition-shadow hover:shadow-lg group-hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-primary/80 group-hover:text-primary">
                      #{tag.name}
                    </h2>
                    <Badge variant="secondary">{tag.threadCount ?? 0} threads</Badge>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}