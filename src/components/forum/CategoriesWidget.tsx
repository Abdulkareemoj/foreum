import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { trpc } from '~/lib/trpc'
import { FolderOpen } from 'lucide-react'

export default function CategoriesWidget() {
  const { data: categories, isLoading } = trpc.category.top.useQuery({ limit: 5 })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Top Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))
        ) : categories && categories.length > 0 ? (
          categories.map((cat: any) => (
            <Link
              key={cat.id}
              to="/category/$slug"
              params={{ slug: cat.slug }}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FolderOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-medium truncate">{cat.name}</span>
              </div>
              <Badge variant="secondary" className="ml-2 flex-shrink-0">
                {cat.threadCount || 0}
              </Badge>
            </Link>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No categories yet</p>
        )}

        <Link
          to="/categories"
          className="block text-center text-sm text-primary hover:underline pt-2"
        >
          View all categories
        </Link>
      </CardContent>
    </Card>
  )
}