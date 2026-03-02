import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Plus } from 'lucide-react'
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

export const Route = createFileRoute('/_client/threads/')({
  component: ThreadPage,
})

function ThreadPage() {
  const { openThreadModal } = useUIStore()
  const [sortBy, setSortBy] = useState<'latest' | 'trending' | 'popular'>('latest')

  return (
    <>
      <div className="container max-w-4xl py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Home Feed</h1>
            <p className="text-muted-foreground">
              Latest discussions from the community
            </p>
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
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Thread List */}
        <ThreadCardList sortBy={sortBy} />
      </div>

      {/* Thread Creation Modal */}
      <ThreadModal />
    </>
  )
}