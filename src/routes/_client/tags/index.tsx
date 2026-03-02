import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardHeader } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'
import { Skeleton } from '~/components/ui/skeleton'
import { Hash, Search } from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { useState } from 'react'

export const Route = createFileRoute('/_client/tags/')({
  component: TagsPage,
})

function TagsPage() {
  const [search, setSearch] = useState('')
  const { data: tags, isLoading } = trpc.tag.list.useQuery()

  const filtered = tags?.filter(
    (t: any) => !search || t.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Hash className="h-8 w-8" />
          Tags
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse threads by topic
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tags..."
          className="pl-9"
        />
      </div>

      {/* Tags Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : !filtered || filtered.length === 0 ? (
        <div className="text-center py-12">
          <Hash className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {search ? 'No tags found matching your search' : 'No tags yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t: any) => (
            <Link key={t.id} to="/tags/$slug" params={{ slug: t.slug }}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <h2 className="text-lg font-semibold">{t.name}</h2>
                    </div>
                    <Badge variant="secondary">
                      {t.threadCount || 0}{' '}
                      {t.threadCount === 1 ? 'thread' : 'threads'}
                    </Badge>
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