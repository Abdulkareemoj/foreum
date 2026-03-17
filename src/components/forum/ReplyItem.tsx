import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { ThumbsUp, ThumbsDown, MessageSquare, Flag, MoreVertical } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { trpc } from '~/lib/trpc'
import { toast } from 'sonner'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { useUIStore } from '~/stores/ui-store'

interface ReplyItemProps {
  reply: any // Replace with your Reply type
  threadId: string
  depth?: number
}

export default function ReplyItem({ reply, threadId, depth = 0 }: ReplyItemProps) {
  const utils = trpc.useUtils()
  const { openReplyModal } = useUIStore()
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(reply.userVote)
  const [showReplies, setShowReplies] = useState(false)

  const upvote = trpc.reply.vote.useMutation({
    onSuccess: () => {
      setUserVote('up')
      utils.reply.getByThreadId.invalidate({ threadId })
      toast.success('Upvoted')
    },
  })

  const downvote = trpc.reply.vote.useMutation({
    onSuccess: () => {
      setUserVote('down')
      utils.reply.getByThreadId.invalidate({ threadId })
      toast.success('Downvoted')
    },
  })

  const handleUpvote = () => {
    if (userVote === 'up') {
      upvote.mutate({ replyId: reply.id, value: 0 })
      setUserVote(null)
    } else {
      upvote.mutate({ replyId: reply.id, value: 1 })
    }
  }

  const handleDownvote = () => {
    if (userVote === 'down') {
      downvote.mutate({ replyId: reply.id, value: 0 })
      setUserVote(null)
    } else {
      downvote.mutate({ replyId: reply.id, value: -1 })
    }
  }

  const handleReply = () => {
    openReplyModal(threadId, reply.id)
  }

  // Limit nesting depth
  const maxDepth = 3
  const isMaxDepth = depth >= maxDepth

  return (
    <div className={depth > 0 ? 'ml-8 mt-4' : 'mt-4'}>
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            {/* Avatar */}
            <Link to="/profile/$username" params={{ username: reply.author.id }}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={reply.author.image} />
                <AvatarFallback>{reply.author.name?.[0]}</AvatarFallback>
              </Avatar>
            </Link>

            <div className="flex-1 min-w-0">
              {/* Author Info */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-sm">
                  <Link
                    to="/profile/$username"
                    params={{ username: reply.author.id }}
                    className="font-medium hover:underline"
                  >
                    {reply.author.name}
                  </Link>
                  {reply.author.role === 'admin' && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                      Admin
                    </span>
                  )}
                  <span className="text-muted-foreground">
                    {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                  </span>
                  {reply.isEdited && (
                    <span className="text-xs text-muted-foreground">(edited)</span>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Flag className="mr-2 h-4 w-4" />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Reply to indicator */}
              {reply.parentReply && (
                <div className="text-sm text-muted-foreground mb-2">
                  Replying to{' '}
                  <span className="font-medium">{reply.parentReply.author.name}</span>
                </div>
              )}

              {/* Content */}
              <div className="prose prose-sm max-w-none mb-4">
                {reply.content}
              </div>

              {/* Action Bar */}
              <div className="flex items-center gap-2">
                {/* Vote Buttons */}
                <div className="flex items-center gap-1">
                  <Button
                    variant={userVote === 'up' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={handleUpvote}
                    disabled={upvote.isPending}
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {reply.voteCount > 0 ? reply.voteCount : ''}
                  </Button>
                  <Button
                    variant={userVote === 'down' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={handleDownvote}
                    disabled={downvote.isPending}
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>

                {/* Reply Button */}
                {!isMaxDepth && (
                  <Button variant="ghost" size="sm" onClick={handleReply}>
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                )}

                {/* Show Replies Toggle */}
                {reply.replies && reply.replies.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplies(!showReplies)}
                  >
                    {showReplies ? 'Hide' : 'Show'} {reply.replies.length}{' '}
                    {reply.replies.length === 1 ? 'reply' : 'replies'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nested Replies */}
      {showReplies && reply.replies && reply.replies.length > 0 && (
        <div className="space-y-0">
          {reply.replies.map((nestedReply: any) => (
            <ReplyItem
              key={nestedReply.id}
              reply={nestedReply}
              threadId={threadId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}