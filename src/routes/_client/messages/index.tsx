import { createFileRoute, Link } from '@tanstack/react-router'
import { trpc } from '~/lib/trpc'

export const Route = createFileRoute('/_client/messages/')({
  component: MessagesPage,
})

function MessagesPage() {
  const { data: conversations, isLoading, error } = trpc.messaging.conversations.useQuery()

  return (
    <div className="space-y-4 p-6 container mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold">Messages</h1>

      {isLoading ? (
        <p>Loading…</p>
      ) : error ? (
        <p className="text-red-500">Error loading conversations: {error.message}</p>
      ) : !conversations || conversations.length === 0 ? (
        <p className="text-muted-foreground">No conversations yet</p>
      ) : (
        <div className="space-y-2">
          {conversations.map((convo: any) => (
            <Link
              key={convo.conversationId}
              to={`/messages/${convo.conversationId}`}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted"
            >
              <div className="space-y-1">
                <p className="font-medium">Conversation</p>
                <p className="max-w-60 truncate text-sm text-muted-foreground">
                  {convo.messageContent ?? 'No messages yet'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {convo.unreadCount > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {convo.unreadCount}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {convo.lastMessageAt ? new Date(convo.lastMessageAt).toLocaleDateString() : ''}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}