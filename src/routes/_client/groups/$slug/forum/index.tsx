import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { trpc } from '~/lib/trpc'
import ThreadCard from '~/components/forum/ThreadCard'

export const Route = createFileRoute('/_client/groups/$slug/forum/')({
  component: GroupForumPage,
})

function GroupForumPage() {
  const { slug } = Route.useParams()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 220)
    return () => clearTimeout(timer)
  }, [search])

  const { data: threads, isLoading } = trpc.groups.threads.useQuery({ 
    groupId: slug, 
    search: debouncedSearch || undefined, 
    sortBy: sortBy === 'popular' ? 'popular' : 'recent', 
    limit: 30 
  })

  const handleOpenNew = () => {
    // Navigate using a query parameter for group assignment if thread creation handles it
    navigate({ to: '/_client/threads' as any, search: { group: slug } }) // adjust to the correct route for new thread
  }

  return (
    <div className="p-6 space-y-6 container mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Group Forum</h1>

        <div className="flex items-center gap-3">
          <Input 
            placeholder="Search threads..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full sm:w-auto"
          />
          <Select 
            value={sortBy} 
            onValueChange={(val: any) => setSortBy(val)}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="popular">Most Replies</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleOpenNew}>New Thread</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-24" />
            </Card>
          ))}
        </div>
      ) : !threads || threads.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No threads yet.
          </CardContent>
        </Card>
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
