import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { ArrowLeft, Plus } from 'lucide-react'
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

export const Route = createFileRoute('/_client/category/category/$slug')({
  component: CategoryPage,
})

function CategoryPage() {
  const { slug } = Route.useParams()
  const { openThreadModal } = useUIStore()
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'oldest'>('recent')

  const { data: category, isLoading } = trpc.category.bySlug.useQuery({ slug })

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-6 space-y-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container max-w-4xl py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Category not found</h2>
          <p className="text-muted-foreground mb-4">
            This category doesn't exist or has been removed.
          </p>
          <Link to="/categories">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container max-w-4xl py-6 space-y-6">
        {/* Back Button */}
        <Link to="/categories">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            All Categories
          </Button>
        </Link>

        {/* Category Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{category.name}</h1>
                <Badge variant="secondary">
                  {category.threadCount} {category.threadCount === 1 ? 'thread' : 'threads'}
                </Badge>
              </div>
              {category.description && (
                <p className="text-muted-foreground text-lg">{category.description}</p>
              )}
            </div>

            <Button onClick={() => openThreadModal()}>
              <Plus className="h-4 w-4 mr-2" />
              New Thread
            </Button>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Latest</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Thread List */}
        <ThreadCardList categoryId={category.id} sortBy={sortBy} />
      </div>

      {/* Thread Creation Modal */}
      <ThreadModal />
    </>
  )
}