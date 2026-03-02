import { createFileRoute } from '@tanstack/react-router'
;
import { LifeBuoy, BookOpen, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
export const Route = createFileRoute('/_admin/help')({
  component: AdminHelp,
})

function AdminHelp() {
  return (
   

<div className="space-y-6 p-6">
	<h1 className="text-2xl font-semibold">Help & Support</h1>
	<p className="text-sm text-muted-foreground">
		Resources for managing and troubleshooting your forum.
	</p>

	<div className="grid gap-6 md:grid-cols-2">
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<BookOpen className="size-5" /> Documentation
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground">Access detailed guides and API documentation.</p>
				<a href="/docs" className="mt-3 inline-block text-primary hover:underline">Go to Docs →</a>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<MessageCircle className="size-5" /> Contact Support
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground">Submit a ticket for technical assistance.</p>
				<a href="mailto:support@foreum.com" className="mt-3 inline-block text-primary hover:underline"
					>Email Support →</a>
			</CardContent>
		</Card>
	</div>

	<Card>
		<CardHeader>
			<CardTitle className="flex items-center gap-2">
				<LifeBuoy className="size-5" /> System Status
			</CardTitle>
		</CardHeader>
		<CardContent>
			<p className="font-medium text-green-500">All systems operational.</p>
			<p className="text-sm text-muted-foreground">Last checked: {new Date().toLocaleTimeString()}</p>
		</CardContent>
	</Card>
</div>
     
  )
}
