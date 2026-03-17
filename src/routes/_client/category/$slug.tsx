import { createFileRoute } from '@tanstack/react-router'
import { Plus, Search, SlidersHorizontal, ArrowLeft } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { trpc } from '~/lib/trpc'
import { useState, useEffect } from 'react'
import { useUIStore } from '~/stores/ui-store'
import ThreadCardList from '~/components/forum/ThreadCardList'
import ThreadModal from '~/components/forum/ThreadModal'
import { Skeleton } from '~/components/ui/skeleton'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_client/category/$slug')({
  component: CategorySlugPage,
})

function CategorySlugPage() {
  const { slug } = Route.useParams()
  const { openThreadModal } = useUIStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'oldest'>('recent')

  // Debounce search query to prevent excessive refetches
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: category, isLoading: isCategoryLoading } = trpc.category.bySlug.useQuery({ slug })

  if (isCategoryLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-10 w-1/3 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-32 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{category ? category.name : 'Loading…'}</h1>
            <p className="text-muted-foreground">{category?.description}</p>
          </div>
          <Button onClick={() => openThreadModal()} className="flex items-center gap-2">
            <Plus className="size-5" />
            New Thread
          </Button>
        </div>

        {/* Filters & Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="size-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search threads…" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="pl-10" 
                />
              </div>
              <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Thread List */}
        {/* We reuse ThreadCardList but add support for searchQuery to it if it doesn't already have it */}
        <ThreadCardList 
          categoryId={category.id} 
          sortBy={sortBy} 
          searchQuery={debouncedSearch} 
        />
      </div>

      <ThreadModal />
    </>
  )
}