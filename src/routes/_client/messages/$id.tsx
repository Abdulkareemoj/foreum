import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Skeleton } from '~/components/ui/skeleton'
import { ArrowLeft, Send, Paperclip, Image as ImageIcon } from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { cn } from '~/lib/utils'

export const Route = createFileRoute('/_client/messages/$id')({
  component: ConversationPage,
})

function ConversationPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const utils = trpc.useUtils()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messageText, setMessageText] = useState('')

  const { data, isLoading } = trpc.messages.getConversation.useQuery(
    { conversationId: id },
    {
      refetchInterval: 3000, // Poll every 3 seconds for new messages
      onSuccess: () => {
        // Mark as read when conversation loads
        markAsRead.mutate({ conversationId: id })
      },
    }
  )

  const sendMessage = trpc.messages.sendMessage.useMutation({
    onSuccess: () => {
      setMessageText('')
      utils.messages.getConversation.invalidate({ conversationId: id })
      utils.messages.conversations.invalidate()
      scrollToBottom()
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send message')
    },
  })

  const markAsRead = trpc.messages.markAsRead.useMutation()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [data?.messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!messageText.trim()) {
      return
    }

    sendMessage.mutate({
      conversationId: id,
      content: messageText.trim(),
    })
  }

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-6">
        <Skeleton className="h-[calc(100vh-8rem)]" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container max-w-6xl py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Conversation not found</h2>
          <Button onClick={() => navigate({ to: '/messages' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Messages
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6">
      <Card className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <CardHeader className="border-b py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: '/messages' })}
              className="md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <Avatar className="h-10 w-10">
              <AvatarImage src={data.otherUser.image} />
              <AvatarFallback>{data.otherUser.name?.[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <p className="font-semibold">{data.otherUser.name}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {data.messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            data.messages.map((message: any, index: number) => {
              const isCurrentUser = message.senderId === data.currentUser.id
              const showDateDivider =
                index === 0 ||
                format(new Date(message.createdAt), 'PP') !==
                  format(new Date(data.messages[index - 1].createdAt), 'PP')

              return (
                <div key={message.id}>
                  {showDateDivider && (
                    <div className="flex items-center gap-2 my-4">
                      <div className="h-px bg-border flex-1" />
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(message.createdAt), 'PP')}
                      </span>
                      <div className="h-px bg-border flex-1" />
                    </div>
                  )}

                  <MessageBubble
                    message={message}
                    isCurrentUser={isCurrentUser}
                    user={isCurrentUser ? data.currentUser : data.otherUser}
                  />
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              disabled
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            <div className="flex-1">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                disabled={sendMessage.isPending}
                className="resize-none"
              />
            </div>

            <Button
              type="submit"
              size="icon"
              disabled={!messageText.trim() || sendMessage.isPending}
              className="flex-shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}

function MessageBubble({
  message,
  isCurrentUser,
  user,
}: {
  message: any
  isCurrentUser: boolean
  user: any
}) {
  return (
    <div className={cn('flex gap-2', isCurrentUser && 'flex-row-reverse')}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={user.image} />
        <AvatarFallback>{user.name?.[0]}</AvatarFallback>
      </Avatar>

      <div className={cn('flex flex-col', isCurrentUser && 'items-end')}>
        <div
          className={cn(
            'rounded-lg px-4 py-2 max-w-md break-words',
            isCurrentUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment: any) => (
                <AttachmentPreview key={attachment.id} attachment={attachment} />
              ))}
            </div>
          )}
        </div>

        <span className="text-xs text-muted-foreground mt-1">
          {format(new Date(message.createdAt), 'p')}
          {message.readAt && isCurrentUser && (
            <span className="ml-1">· Read</span>
          )}
        </span>
      </div>
    </div>
  )
}

function AttachmentPreview({ attachment }: { attachment: any }) {
  if (attachment.type === 'image') {
    return (
      <a href={attachment.url} target="_blank" rel="noopener noreferrer">
        <img
          src={attachment.url}
          alt={attachment.fileName || 'Image'}
          className="rounded max-w-xs max-h-64 object-cover"
        />
      </a>
    )
  }

  if (attachment.type === 'file') {
    return (
      <Link
        to={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-2 rounded bg-background border hover:bg-muted transition-colors"
      >
        <Paperclip className="h-4 w-4" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">
            {attachment.fileName || 'File'}
          </p>
          {attachment.fileSize && (
            <p className="text-xs text-muted-foreground">
              {(attachment.fileSize / 1024).toFixed(1)} KB
            </p>
          )}
        </div>
      </Link>
    )
  }

  return null
}