import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { trpc } from '~/lib/trpc'
import { MessageSquare, FolderOpen } from 'lucide-react'

export const Route = createFileRoute('/_client/category/')({
  component: CategoriesPage,
})

function CategoriesPage() {
  const { data: categories, isLoading } = trpc.category.list.useQuery()

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground">Browse discussions by category</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              to="/category/$slug"
              params={{ slug: cat.slug }}
              className="transition-transform hover:scale-[1.02]"
            >
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5 text-primary" />
                      <CardTitle>{cat.name}</CardTitle>
                    </div>
                    <Badge variant="secondary">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {cat.threadCount || 0}
                    </Badge>
                  </div>
                  {cat.description && (
                    <CardDescription className="line-clamp-2">
                      {cat.description}
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No categories yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}