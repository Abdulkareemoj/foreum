import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { ArrowLeft, Hash } from 'lucide-react'
import { trpc } from '~/lib/trpc'
import ThreadCardList from '~/components/forum/ThreadCardList'
import ThreadModal from '~/components/forum/ThreadModal'
import { useUIStore } from '~/stores/ui-store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useState } from 'react'

export const Route = createFileRoute('/_client/tags/tags/$slug')({
  component: TagPage,
})

function TagPage() {
  const { slug } = Route.useParams()
  const navigate = useNavigate()
  const { openThreadModal } = useUIStore()
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'oldest'>('recent')

  const { data: tag, isLoading } = trpc.tag.bySlug.useQuery({ slug })

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-6 space-y-6">
        <Skeleton className="h-24" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!tag) {
    return (
      <div className="container max-w-4xl py-6">
        <div className="text-center py-12">
          <Hash className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Tag not found</h2>
          <p className="text-muted-foreground mb-4">
            This tag doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate({ to: '/tags' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tags
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container max-w-4xl py-6 space-y-6">
        {/* Back */}
        <Button variant="ghost" onClick={() => navigate({ to: '/tags' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          All Tags
        </Button>

        {/* Tag Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Hash className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">#{tag.name}</h1>
              <p className="text-sm text-muted-foreground">
                {tag.threadCount}{' '}
                {tag.threadCount === 1 ? 'thread' : 'threads'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={sortBy}
              onValueChange={(value: any) => setSortBy(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Latest</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => openThreadModal()}>New Thread</Button>
          </div>
        </div>

        {/* Threads */}
        <ThreadCardList tagId={tag.id} sortBy={sortBy} />
      </div>

      <ThreadModal />
    </>
  )
}