import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { Input } from '~/components/ui/input'
import { MessageSquare, Search } from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import { cn } from '~/lib/utils'
import { NewConversationDialog } from '~/components/forum/NewConversationDialog'

export const Route = createFileRoute('/_client/messages/')({
  component: MessagesPage,
})

function MessagesPage() {
  const [search, setSearch] = useState('')
  const { data: conversations, isLoading } = trpc.messages.conversations.useQuery(undefined, {
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  })

  const filteredConversations = conversations?.filter((convo) =>
    convo.otherUser?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="container max-w-6xl py-6">
      <div className="grid md:grid-cols-[350px_1fr] gap-6 h-[calc(100vh-8rem)]">
        {/* Conversations List */}
        <Card className="flex flex-col">
          <CardContent className="p-4 flex-1 flex flex-col">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">Messages</h2>
                <NewConversationDialog />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations..."
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))
              ) : filteredConversations && filteredConversations.length > 0 ? (
                filteredConversations.map((convo) => (
                  <ConversationItem key={convo.id} conversation={convo} />
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {search ? 'No conversations found' : 'No messages yet'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        <Card className="hidden md:flex items-center justify-center">
          <div className="text-center p-12">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
            <p className="text-muted-foreground">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        </Card>
      </div></div>
    
  )
}

function ConversationItem({ conversation }: { conversation: any }) {
  const hasUnread = conversation.unreadCount > 0

  return (
    <Link
      to="/messages/$id"
      params={{ id: conversation.id }}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors',
        hasUnread && 'bg-muted/50'
      )}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={conversation.otherUser?.image} />
        <AvatarFallback>{conversation.otherUser?.name?.[0]}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className={cn('font-medium truncate', hasUnread && 'font-bold')}>
            {conversation.otherUser?.name}
          </p>
          {conversation.lastMessage?.createdAt && (
            <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
              {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                addSuffix: true,
              })}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              'text-sm text-muted-foreground truncate',
              hasUnread && 'font-medium text-foreground'
            )}
          >
            {conversation.lastMessage?.content || 'No messages yet'}
          </p>
          {hasUnread && (
            <Badge variant="default" className="ml-2 flex-shrink-0">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  )
}