import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { MessageSquarePlus } from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

export function NewConversationDialog() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  // You'll need a user search endpoint
  const { data: users, isLoading } = trpc.user.search.useQuery(
    { query: search },
    { enabled: search.length > 0 }
  )

  const createConversation = trpc.messages.createConversation.useMutation({
    onSuccess: (data) => {
      toast.success(data.existing ? 'Opening conversation' : 'Conversation created')
      setOpen(false)
      navigate({ to: '/messages/$id', params: { id: data.id } })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create conversation')
    },
  })

  const handleSelectUser = (userId: string) => {
    createConversation.mutate({ userId })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>Search for a user to start messaging</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            autoFocus
          />

          <div className="max-h-64 overflow-y-auto space-y-2">
            {isLoading ? (
              <p className="text-sm text-muted-foreground text-center py-4">Searching...</p>
            ) : users && users.length > 0 ? (
              users.map((user: any) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user.id)}
                  className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted transition-colors"
                  disabled={createConversation.isPending}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image} />
                    <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </button>
              ))
            ) : search ? (
              <p className="text-sm text-muted-foreground text-center py-4">No users found</p>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Start typing to search
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}