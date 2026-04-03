import { createFileRoute } from '@tanstack/react-router'
import { trpc } from '~/lib/trpc'
import ThreadDetail from '~/components/forum/ThreadDetail'
import ReplyForm from '~/components/forum/ReplyForm'
import ReplyItem from '~/components/forum/ReplyItem'
import { Skeleton } from '~/components/ui/skeleton'
import { Button } from '~/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_client/threads/thread/$id')({
  component: ThreadPage,
})  

function ThreadPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()

  const { data: thread, isLoading: threadLoading } = trpc.thread.getById.useQuery({ id })
  const { data: replies, isLoading: repliesLoading } = trpc.reply.byThread.useQuery({
    threadId: id,
  })

  if (threadLoading) {
    return (
      <div className="container max-w-4xl py-6 space-y-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="container max-w-4xl py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Thread not found</h2>
          <p className="text-muted-foreground mb-4">
            This thread may have been deleted or doesn't exist.
          </p>
          <Button onClick={() => navigate({ to: '/threads' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      {/* Back Button */}
  <Button
  variant="ghost"
  onClick={() => navigate({ to: '/threads' })}
>
  <ArrowLeft className="h-4 w-4 mr-2" />
  Back to Threads
</Button>

      {/* Thread Detail */}
      <ThreadDetail thread={thread} />

      {/* Reply Form */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Write a Reply</h2>
        <ReplyForm threadId={id} />
      </div>

      {/* Replies Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Replies ({replies?.length || 0})
        </h2>

        {repliesLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : replies && replies.length > 0 ? (
          <div className="space-y-0">
            {replies.map((reply: any) => (
              <ReplyItem key={reply.id} reply={reply} threadId={id} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No replies yet. Be the first to reply!
          </p>
        )}
      </div>
    </div>
  )
}