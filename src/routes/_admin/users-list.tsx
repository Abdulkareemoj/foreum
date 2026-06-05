import { createFileRoute } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { DataTable } from '~/components/ui/data-table'
import { DataTableColumnHeader } from '~/components/ui/data-table-column-header'
import { Skeleton } from '~/components/ui/skeleton'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '~/components/ui/empty'
import { Checkbox } from '~/components/ui/checkbox'
import { trpc } from '~/lib/trpc'
import {
  Ban,
  CheckCircle2,
  Eye,
  MoreHorizontal,
  ShieldCheck,
  ShieldHalf,
  UserCog,
} from 'lucide-react'
import { toast } from 'sonner'
import { adminMiddleware } from '~/server/auth-actions'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_admin/users-list')({
  head: () => ({
    meta: [...seo({ title: 'User Management - Foreum' })],
  }),
  component: UsersListPage,
  server: {
    middleware: [adminMiddleware],
  },
})

type User = {
  id: string
  name: string
  email: string
  username: string | null
  image: string | null
  role: string | null
  banned: boolean | null
  banReason: string | null
  createdAt: Date
}

const roles = ['user', 'moderator', 'admin']

function RoleBadge({ role }: { role: string | null }) {
  if (role === 'admin') return <Badge variant="default">{role}</Badge>
  if (role === 'moderator') return <Badge variant="secondary">{role}</Badge>
  return <Badge variant="outline">{role ?? 'user'}</Badge>
}

function UsersListPage() {
  const utils = trpc.useUtils()
  const { data, isLoading } = trpc.user.list.useQuery({ limit: 500 })

  const updateRoleMutation = trpc.user.updateRole.useMutation({
    onSuccess: () => { utils.user.list.invalidate(); toast.success('Role updated') },
    onError: (err) => toast.error(err.message),
  })

  const banMutation = trpc.user.banUser.useMutation({
    onSuccess: () => { utils.user.list.invalidate(); toast.success('User banned') },
    onError: (err) => toast.error(err.message),
  })

  const unbanMutation = trpc.user.unbanUser.useMutation({
    onSuccess: () => { utils.user.list.invalidate(); toast.success('User unbanned') },
    onError: (err) => toast.error(err.message),
  })

  const columns: ColumnDef<User>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
      cell: ({ row }) => {
        const u = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarImage src={u.image ?? undefined} />
              <AvatarFallback>{u.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{u.name}</span>
              <span className="text-xs text-muted-foreground">{u.email}</span>
              {u.username && <span className="text-xs text-muted-foreground/60">@{u.username}</span>}
            </div>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        const u = row.original
        const search = String(value).toLowerCase()
        return (
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          (u.username ?? '').toLowerCase().includes(search)
        )
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => <RoleBadge role={row.getValue('role')} />,
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'banned',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const banned = row.getValue('banned')
        return banned ? (
          <div className="flex items-center gap-2">
            <Ban className="size-3.5 text-destructive" />
            <span className="text-sm text-destructive">Banned</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            <span className="text-sm text-emerald-500">Active</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        const rowBanned = row.getValue(id) ? 'banned' : 'active'
        return value.includes(rowBanned)
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Joined" />,
      cell: ({ row }) => {
        const date = row.getValue<Date>('createdAt')
        return <span className="text-sm text-muted-foreground">{new Date(date).toLocaleDateString()}</span>
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const u = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.open(`/profile/${u.username ?? u.id}`, '_blank')}>
                <Eye className="size-4" /> View Profile
              </DropdownMenuItem>

              <DropdownMenuLabel className="text-xs text-muted-foreground mt-1">Change Role</DropdownMenuLabel>
              {roles.map((role) => (
                <DropdownMenuItem
                  key={role}
                  disabled={u.role === role}
                  onClick={() => updateRoleMutation.mutate({ userId: u.id, role })}
                >
                  {role === 'admin' ? <ShieldCheck className="size-4" /> :
                   role === 'moderator' ? <ShieldHalf className="size-4" /> :
                   <UserCog className="size-4" />}
                  {role}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
              {u.banned ? (
                <DropdownMenuItem onClick={() => unbanMutation.mutate({ userId: u.id })}>
                  <CheckCircle2 className="size-4 text-emerald-500" /> Unban User
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => banMutation.mutate({ userId: u.id, reason: 'Banned by admin' })}>
                  <Ban className="size-4 text-destructive" /> Ban User
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const users = data?.users ?? []
  const total = data?.total ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage user accounts, roles, and permissions. {total.toLocaleString()} total users.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : users.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No users found</EmptyTitle>
            <EmptyDescription>No users have registered yet.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <DataTable columns={columns} data={users} pageSize={25} />
      )}
    </div>
  )
}
