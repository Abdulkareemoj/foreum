import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { MessageSquare, ThumbsUp, Bookmark, MoreVertical } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { trpc } from '~/lib/trpc'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

interface ThreadCardProps {
  thread: any // Replace with your Thread type
}

export default function ThreadCard({ thread }: ThreadCardProps) {
  const utils = trpc.useUtils()

  const toggleBookmark = trpc.bookmarks.add.useMutation({
    onSuccess: () => {
      toast.success('Bookmark added')
      utils.thread.list.invalidate()
    },
    onError: () => {
      toast.error('Failed to bookmark')
    },
  })

  const removeBookmark = trpc.bookmarks.remove.useMutation({
    onSuccess: () => {
      toast.success('Bookmark removed')
      utils.thread.list.invalidate()
    },
  })

  const handleBookmark = () => {
    if (thread.isBookmarked) {
      removeBookmark.mutate({ threadId: thread.id })
    } else {
      toggleBookmark.mutate({ threadId: thread.id })
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">

<Link
  to="/threads/thread/$id"
  params={{ id: thread.id }}
  className="hover:underline"
>
  <h3 className="text-lg font-semibold line-clamp-2">
    {thread.title}
  </h3>
</Link>
            
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Link
                to="/profile/$username"
                params={{ username: thread.author.id }}
                className="hover:underline"
              >
                {thread.author.name}
              </Link>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleBookmark}>
                <Bookmark className="mr-2 h-4 w-4" />
                {thread.isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                Report Thread
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        {/* Preview */}
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {thread.contentPreview}
        </p>

        {/* Tags */}
        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {thread.tags.map((tag: any) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{thread.voteCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{thread.replyCount || 0} replies</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}