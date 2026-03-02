import { createFileRoute } from '@tanstack/react-router'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { CardContent, CardHeader, CardTitle, Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { BarChart3, Users } from 'lucide-react';
;
export const Route = createFileRoute('/_admin/analytics')({
  component: AdminAnalytics,
})

function AdminAnalytics() {
  return (
   
      <div className="space-y-6 p-6">
	<h1 className="text-2xl font-semibold">Community Analytics</h1>
	<p className="text-sm text-muted-foreground">
		Track user growth, engagement, and content performance.
	</p>

	<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<Input className="w-full md:w-1/3" placeholder="Filter by date range..." />
		<Select>
			<SelectTrigger value="Select Metric" />
			<SelectContent>
				<SelectItem value="users">New Users</SelectItem>
				<SelectItem value="threads">New Threads</SelectItem>
				<SelectItem value="replies">Total Replies</SelectItem>
			</SelectContent>
		</Select>
	</div>

	<Card>
		<CardHeader>
			<CardTitle className="flex items-center gap-2">
				<Users className="size-5" /> User Growth Over Time
			</CardTitle>
		</CardHeader>
		<CardContent>
			<div className="flex h-64 w-full items-center justify-center text-muted-foreground">
				[Placeholder: Area Chart Component]
			</div>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle className="flex items-center gap-2">
				<BarChart3 className="size-5" /> Top Categories by Activity
			</CardTitle>
		</CardHeader>
		<CardContent>
			<div className="flex h-64 w-full items-center justify-center text-muted-foreground">
				[Placeholder: Bar Chart Component]
			</div>
		</CardContent>
	</Card>
</div>

     
  )
}
