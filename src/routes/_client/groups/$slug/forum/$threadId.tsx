import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import ReplyForm from '~/components/thread/ReplyForm' // Adjust imports accordingly
import { trpc } from '~/lib/trpc'

export const Route = createFileRoute('/_client/groups/$slug/forum/$threadId')({
  component: GroupThreadPage,
})

// Stub for HTML content
const renderTipTap = (content: string | null) => {
  if (!content) return ''
  return `<p>${content}</p>`
}

function GroupThreadPage() {
  const { threadId } = Route.useParams()

  const { data: thread, isLoading: threadLoading } = trpc.thread.byId.useQuery({ id: threadId })
  const { data: replies, isLoading: repliesLoading, refetch: refetchReplies } = trpc.reply.list.useQuery({ 
    threadId, 
    limit: 200 
  })

  const isLoading = threadLoading || repliesLoading

  if (isLoading) {
    return (
      <div className="p-6">
        <Card className="animate-pulse">
          <CardContent className="h-40" />
        </Card>
      </div>
    )
  }

  if (!thread) {
    return <div className="p-6 text-muted-foreground">Thread not found.</div>
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">{thread.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={thread.author?.image} />
              <AvatarFallback>{thread.author?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <span>{thread.author?.name}</span>
            <span>•</span>
            <span>{new Date(thread.createdAt).toLocaleString()}</span>
          </div>
        </CardHeader>

        <CardContent>
          <div 
            className="prose dark:prose-invert max-w-none" 
            dangerouslySetInnerHTML={{ __html: renderTipTap(thread.content) }}
          />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-4">Replies ({replies?.length || 0})</h2>

        {!replies || replies.length === 0 ? (
          <p className="text-muted-foreground">No replies yet — be the first to reply.</p>
        ) : (
          <div className="space-y-4">
            {replies.map((reply: any) => (
              <Card key={reply.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={reply.author?.image} />
                        <AvatarFallback>{reply.author?.name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <span>{reply.author?.name}</span>
                      <span>•</span>
                      <span>{new Date(reply.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderTipTap(reply.content) }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <ReplyForm threadId={thread.id} onSubmitted={() => refetchReplies()} />
      </div>
    </div>
  )
}
