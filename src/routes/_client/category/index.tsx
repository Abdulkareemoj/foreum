import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { trpc } from '~/lib/trpc'
import { Eye, MessageSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Skeleton } from '~/components/ui/skeleton'

export const Route = createFileRoute('/_client/category/')({
  component: CategoriesPage,
})

function CategoriesPage() {
  const { data: initialCategories, isLoading, refetch } = trpc.category.list.useQuery()
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    if (initialCategories) {
      setCategories(initialCategories)
    }
  }, [initialCategories])

  // "Realtime" refresh every 10 seconds matching Svelte
  useEffect(() => {
    const interval = setInterval(() => {
      refetch().then((res) => {
        if (res.data) setCategories(res.data)
      })
    }, 10000)
    return () => clearInterval(interval)
  }, [refetch])

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold">Categories</h1>

      {isLoading && categories.length === 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
             <Card key={i} className="flex h-full flex-col justify-between">
              <CardHeader>
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-end gap-4 mt-4">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-muted-foreground">No categories yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat: any) => (
            <Link key={cat.id} to={`/category/${cat.slug}`}>
              <Card className="flex h-full flex-col justify-between transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{cat.name}</h2>
                    <Badge variant="secondary">{cat.threadCount || 0} threads</Badge>
                  </div>
                  <p className="mt-2 line-clamp-3 text-muted-foreground">{cat.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-end gap-4 text-muted-foreground">
                    {/* These would come from your thread stats in a later query */}
                    <div className="flex items-center gap-1">
                      <MessageSquare className="size-4" />
                      <span>{cat.replyCount ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="size-4" />
                      <span>{cat.viewCount ?? 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}