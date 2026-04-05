import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from '~/components/ui/emoji-picker'
import { Phone, Info, Video, SmilePlus, Send, ArrowLeft } from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { cn } from '~/lib/utils'

export const Route = createFileRoute('/_client/messages/$id')({
  component: ConversationPage,
})

function initials(name: string) {
  if (!name) return 'U'
  return name.split(' ').map((n) => n[0]).join('')
}

function formatShortTime(date: Date) {
  return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function ConversationPage() {
  const { id: conversationId } = Route.useParams()
  const navigate = useNavigate()
  const utils = trpc.useUtils()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messageText, setMessageText] = useState('')
  const [openEmoji, setOpenEmoji] = useState(false)
  const [messages, setMessages] = useState<any[]>([])

  const { data: conversationData, isLoading } = trpc.messaging.getConversation.useQuery(
    { conversationId },
  )

  useEffect(() => {
    if (conversationData) {
      setMessages(conversationData.messages || [])
      scrollToBottom()
    }
  }, [conversationData])

  const { mutateAsync: sendMessageMutation } = trpc.messaging.sendMessage.useMutation()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!messageText.trim() || !conversationId || !conversationData) {
      return
    }

    const content = messageText
    setMessageText('')

    // optimistic update
    const optimisticMsg = {
      id: crypto.randomUUID(),
      senderId: conversationData.currentUser,
      content: content,
      createdAt: new Date(),
    }
    setMessages((prev) => [...prev, optimisticMsg])
    setTimeout(scrollToBottom, 50) // wait for DOM to render the new msg

    // actual send
    try {
      await sendMessageMutation({
        conversationId,
        content,
      })
      // invalidate to get real IDs etc if needed later
      utils.messaging.getConversation.invalidate({ conversationId })
      utils.messaging.conversations.invalidate()
    } catch (error) {
      console.error('Failed to send message', error)
      // On error, we'd typically rollback the optimistic update here
    }
  }

  if (isLoading || !conversationData) {
    return (
      <p className="p-10 text-center text-muted-foreground">
        {isLoading ? 'Loading conversation...' : 'Conversation not found'}
      </p>
    )
  }

  return (
    <div className="w-full border border-border flex flex-col h-[calc(100vh-180px)]">
      {/* TOP BAR */}
      <div className="flex place-items-center justify-between border-b bg-background p-2">
        <div className="flex place-items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/messages' })}
            className="md:hidden mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <Avatar>
            <AvatarImage src={conversationData.otherUser.image} />
            <AvatarFallback>
              {initials(conversationData.otherUser.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {conversationData.otherUser.name}
            </span>
            <span className="text-xs text-muted-foreground">
              Active {conversationData.otherUser.lastActive || 0}s ago
            </span>
          </div>
        </div>

        <div className="flex place-items-center">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* MESSAGE LIST */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => {
          const mine = msg.senderId === conversationData.currentUser
          const sender = mine ? conversationData.currentUser : conversationData.otherUser

          return (
            <div key={msg.id} className={cn("flex gap-2 max-w-[80%]", mine ? "ml-auto flex-row-reverse" : "")}>
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={sender?.image} />
                <AvatarFallback>{initials(sender?.name || '')}</AvatarFallback>
              </Avatar>

              <div className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}>
                <div className={cn(
                  "rounded-lg px-3 py-2 text-sm", 
                  mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                )}>
                  {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                  
                  {/* msg.attachments placeholder - integrate MessageAttachments if present */}
                  {msg.attachments?.length > 0 && (
                     <div className="mt-2 text-xs italic opacity-70">[Attachments...]</div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatShortTime(new Date(msg.createdAt))}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-3 border-t">
        <Popover open={openEmoji} onOpenChange={setOpenEmoji}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full flex-shrink-0">
              <SmilePlus className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 border-none shadow-none w-auto bg-transparent h-fit">
            <EmojiPicker
              className="h-[350px] w-[300px] shadow-xl border bg-popover"
              onSelect={(e: any) => {
                setMessageText(prev => prev + e.emoji)
                setOpenEmoji(false)
              }}
            >
              <EmojiPickerSearch />
              <EmojiPickerContent />
              <EmojiPickerFooter />
            </EmojiPicker>
          </PopoverContent>
        </Popover>

        <Input 
          value={messageText} 
          onChange={(e) => setMessageText(e.target.value)}
          className="flex-1 rounded-full" 
          placeholder="Type a message..." 
        />

        <Button type="submit" size="icon" className="rounded-full flex-shrink-0" disabled={!messageText.trim()}>
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}