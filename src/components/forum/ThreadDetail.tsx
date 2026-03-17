import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { ThumbsUp, ThumbsDown, Bookmark, Flag, Share2, MoreVertical } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { trpc } from '~/lib/trpc'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { useState } from 'react'

interface ThreadDetailProps {
  thread: any // Replace with your Thread type
}

export default function ThreadDetail({ thread }: ThreadDetailProps) {
  const utils = trpc.useUtils()
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(thread.userVote)

  const upvote = trpc.thread.vote.useMutation({
    onSuccess: () => {
      setUserVote('up')
      utils.thread.getById.invalidate({ id: thread.id })
      toast.success('Upvoted')
    },
    onError: () => {
      toast.error('Failed to vote')
    },
  })

  const downvote = trpc.thread.vote.useMutation({
    onSuccess: () => {
      setUserVote('down')
      utils.thread.getById.invalidate({ id: thread.id })
      toast.success('Downvoted')
    },
  })

  const toggleBookmark = trpc.bookmarks.add.useMutation({
    onSuccess: () => {
      toast.success(thread.isBookmarked ? 'Bookmark removed' : 'Bookmark added')
      utils.thread.getById.invalidate({ id: thread.id })
    },
  })

  const removeBookmark = trpc.bookmarks.remove.useMutation({
    onSuccess: () => {
      toast.success('Bookmark removed')
      utils.thread.getById.invalidate({ id: thread.id })
    },
  })

  const handleUpvote = () => {
    if (userVote === 'up') {
      // Remove upvote
      upvote.mutate({ threadId: thread.id, value: 0 })
      setUserVote(null)
    } else {
      upvote.mutate({ threadId: thread.id, value: 1 })
    }
  }

  const handleDownvote = () => {
    if (userVote === 'down') {
      // Remove downvote
      downvote.mutate({ threadId: thread.id, value: 0 })
      setUserVote(null)
    } else {
      downvote.mutate({ threadId: thread.id, value: -1 })
    }
  }

  const handleBookmark = () => {
    if (thread.isBookmarked) {
      removeBookmark.mutate({ threadId: thread.id })
    } else {
      toggleBookmark.mutate({ threadId: thread.id })
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          {/* Author Avatar */}
          <Link to="/profile/$username" params={{ username: thread.author.id }}>
            <Avatar className="h-12 w-12">
              <AvatarImage src={thread.author.image} />
              <AvatarFallback>{thread.author.name?.[0]}</AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 min-w-0">
            {/* Category Badge */}
            {thread.category && (
              <Badge variant="outline" className="mb-2">
                {thread.category.name}
              </Badge>
            )}

            {/* Title */}
            <h1 className="text-2xl font-bold mb-2">{thread.title}</h1>

            {/* Author Info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                to="/profile/$username"
                params={{ username: thread.author.id }}
                className="hover:underline font-medium"
              >
                {thread.author.name}
              </Link>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
              </span>
              {thread.isEdited && (
                <>
                  <span>•</span>
                  <span className="text-xs">(edited)</span>
                </>
              )}
            </div>

            {/* Tags */}
            {thread.tags && thread.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {thread.tags.map((tag: any) => (
                  <Link key={tag.id} to="/tag/$id" params={{ id: tag.id }}>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                      {tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* More Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBookmark}>
                <Bookmark className="mr-2 h-4 w-4" />
                {thread.isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Flag className="mr-2 h-4 w-4" />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        {/* Content - Replace with rich text editor output later */}
        <div className="prose prose-sm max-w-none mb-6">
          {thread.content}
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2 pt-4 border-t">
          {/* Vote Buttons */}
          <div className="flex items-center gap-1 border rounded-lg">
            <Button
              variant={userVote === 'up' ? 'default' : 'ghost'}
              size="sm"
              onClick={handleUpvote}
              disabled={upvote.isPending}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {thread.voteCount > 0 ? thread.voteCount : ''}
            </Button>
            <Button
              variant={userVote === 'down' ? 'default' : 'ghost'}
              size="sm"
              onClick={handleDownvote}
              disabled={downvote.isPending}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Bookmark Button */}
          <Button
            variant={thread.isBookmarked ? 'default' : 'ghost'}
            size="sm"
            onClick={handleBookmark}
            disabled={toggleBookmark.isPending || removeBookmark.isPending}
          >
            <Bookmark className="h-4 w-4 mr-1" />
            {thread.isBookmarked ? 'Saved' : 'Save'}
          </Button>

          {/* Share Button */}
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>

          {/* Reply Count */}
          <div className="ml-auto text-sm text-muted-foreground">
            {thread.replyCount || 0} {thread.replyCount === 1 ? 'reply' : 'replies'}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}