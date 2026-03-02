import { createFileRoute } from '@tanstack/react-router'
;
	import { Select, SelectTrigger, SelectContent, SelectItem} from '~/components/ui/select';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
	import { Input } from '~/components/ui/input';
	import { History, User, Trash2 } from 'lucide-react';
export const Route = createFileRoute('/_admin/moderation')({
  component: AdminModeration,
})

function AdminModeration() {
  return (
   
 <div className="space-y-6 p-6">
	<h1 className="text-2xl font-semibold">Moderation Logs</h1>
	<p className="text-sm text-muted-foreground">
		Review all actions taken by administrators and moderators.
	</p>
{/* 
	<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<Input className="w-full md:w-1/3" placeholder="Search by moderator or target..." />
		<Select>
			<SelectTrigger value="Filter by action" />
			<SelectContent>
				<SelectItem value="ban">Ban User</SelectItem>
				<SelectItem value="delete">Delete Content</SelectItem>
				<SelectItem value="pin">Pin/Lock</SelectItem>
			</SelectContent>
		</Select>
	</div>

	<Card>
		<CardHeader>
			<CardTitle className="flex items-center gap-2">
				<History className="size-5" /> Recent Actions
			</CardTitle>
		</CardHeader>
		<CardContent className="divide-y">
			{#each logs as log}
				<div className="flex items-center justify-between py-3">
					<div className="flex items-center gap-3">
						{#if log.action.includes('Ban')}
							<User className="size-4 text-red-500" />
						{:else if log.action.includes('Delete')}
							<Trash2 className="size-4 text-orange-500" />
						{:else}
							<History className="size-4 text-blue-500" />
						{/if}
						<div>
							<p className="font-medium">{log.action} on {log.target}</p>
							<p className="text-xs text-muted-foreground">By {log.moderator} - {log.reason}</p>
						</div>
					</div>
					<span className="text-xs text-muted-foreground">{log.date}</span>
				</div>
			{/each}
		</CardContent>
	</Card> */}
</div>


     
  )
}
