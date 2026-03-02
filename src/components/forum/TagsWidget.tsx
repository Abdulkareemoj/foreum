import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { Hash } from 'lucide-react'
import { trpc } from '~/lib/trpc'

export default function TagsWidget() {
  const { data: tags, isLoading } = trpc.tag.popular.useQuery({ limit: 8 })

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Popular Tags</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>
        ) : tags && tags.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2">
              {tags.map((t: any) => (
                <Link key={t.id} to="/tags/$slug" params={{ slug: t.slug }}>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Hash className="h-3 w-3 mr-1" />
                    {t.name}
                    <span className="ml-1 opacity-60">{t.threadCount || 0}</span>
                  </Badge>
                </Link>
              ))}
            </div>

            <Link
              to="/tags"
              className="block text-center text-sm text-primary hover:underline mt-3"
            >
              View all tags
            </Link>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No tags yet</p>
        )}
      </CardContent>
    </Card>
  )
}