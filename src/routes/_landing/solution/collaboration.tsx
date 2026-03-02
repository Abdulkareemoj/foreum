import { createFileRoute } from '@tanstack/react-router'

import { Button } from '~/components/ui/button';
	import { Card} from '~/components/ui/card';
	import { Check, Users, MessageSquare, FileText, Zap, GitBranch, Clock } from 'lucide-react';

export const Route = createFileRoute('/_landing/solution/collaboration')({
  component: CollaborationSolution,
})

function CollaborationSolution() {
  return (
  
      <div className="min-h-screen bg-background">
	<section className="px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<div className="space-y-6 text-center">
				<div
					className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
				>
					For Collaboration
				</div>
				<h1 className="text-5xl font-bold text-balance md:text-6xl">
					Where Teams<br />Work Together
				</h1>
				<p className="mx-auto max-w-2xl text-xl text-pretty text-muted-foreground">
					Replace scattered communication tools with one organized platform. Keep discussions
					focused, decisions documented, and teams aligned.
				</p>
				<div className="flex justify-center gap-4 pt-4">
					<Button size="lg" className="bg-primary hover:bg-primary/90">Start Collaborating</Button>
					<Button size="lg" variant="outline">See How It Works</Button>
				</div>
			</div>
		</div>
	</section>

	<section className="bg-muted/30 px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<h2 className="mb-12 text-center text-3xl font-bold">Built for Team Collaboration</h2>
			<div className="grid gap-8 md:grid-cols-3">
				<Card className="space-y-4 p-6">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<MessageSquare className="h-6 w-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Organized Discussions</h3>
					<p className="text-muted-foreground">
						Keep conversations organized by topic, project, or team. No more lost messages in
						endless chat threads.
					</p>
				</Card>

				<Card className="space-y-4 p-6">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<FileText className="h-6 w-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Knowledge Base</h3>
					<p className="text-muted-foreground">
						Build a searchable repository of decisions, processes, and institutional knowledge.
					</p>
				</Card>

				<Card className="space-y-4 p-6">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Zap className="h-6 w-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Async-First</h3>
					<p className="text-muted-foreground">
						Perfect for distributed teams. Collaborate effectively across time zones without
						constant meetings.
					</p>
				</Card>
			</div>
		</div>
	</section>

	<section className="px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<div className="mb-16 grid items-center gap-12 md:grid-cols-2">
				<div className="space-y-6">
					<h2 className="text-4xl font-bold">Replace Meeting Overload</h2>
					<p className="text-lg text-muted-foreground">
						Move discussions out of meetings and into organized threads. Let team members contribute
						when they're most productive.
					</p>
					<ul className="space-y-4">
						<li className="flex gap-3">
							<Check className="h-6 w-6 flex-shrink-0 text-primary" />
							<span>Threaded discussions keep context clear</span>
						</li>
						<li className="flex gap-3">
							<Check className="h-6 w-6 flex-shrink-0 text-primary" />
							<span>Searchable history of all decisions</span>
						</li>
						<li className="flex gap-3">
							<Check className="h-6 w-6 flex-shrink-0 text-primary" />
							<span>Tag relevant team members</span>
						</li>
						<li className="flex gap-3">
							<Check className="h-6 w-6 flex-shrink-0 text-primary" />
							<span>Pin important announcements</span>
						</li>
					</ul>
				</div>
				<Card className="bg-muted/30 p-8">
					<Clock className="mb-4 h-16 w-16 text-primary" />
					<h3 className="mb-4 text-2xl font-semibold">Async Collaboration</h3>
					<p className="text-muted-foreground">
						Teams using Foreum report 40% fewer meetings and significantly better documentation of
						decisions and processes.
					</p>
				</Card>
			</div>

			<div className="grid items-center gap-12 md:grid-cols-2">
				<Card className="bg-muted/30 p-8 md:order-2">
					<GitBranch className="mb-4 h-16 w-16 text-primary" />
					<h3 className="mb-4 text-2xl font-semibold">Project Spaces</h3>
					<p className="text-muted-foreground">
						Create dedicated spaces for each project with custom categories, tags, and permissions.
						Keep everything organized and accessible.
					</p>
				</Card>
				<div className="space-y-6 md:order-1">
					<h2 className="text-4xl font-bold">Organize by Project</h2>
					<p className="text-lg text-muted-foreground">
						Give each project its own space with relevant categories and team members. No more
						digging through unrelated conversations.
					</p>
					<ul className="space-y-4">
						<li className="flex gap-3">
							<Check className="h-6 w-6 flex-shrink-0 text-primary" />
							<span>Custom categories per project</span>
						</li>
						<li className="flex gap-3">
							<Check className="h-6 w-6 flex-shrink-0 text-primary" />
							<span>Project-specific permissions</span>
						</li>
						<li className="flex gap-3">
							<Check className="h-6 w-6 flex-shrink-0 text-primary" />
							<span>Tag system for organization</span>
						</li>
						<li className="flex gap-3">
							<Check className="h-6 w-6 flex-shrink-0 text-primary" />
							<span>Archive completed projects</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</section>

	<section className="bg-muted/30 px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<div className="mb-12 text-center">
				<h2 className="mb-4 text-3xl font-bold">Integrates With Your Workflow</h2>
				<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
					Connect Foreum with the tools your team already uses for a seamless collaboration
					experience.
				</p>
			</div>
			<div className="grid gap-6 md:grid-cols-4">
				<Card className="p-6 text-center">
					<div className="mb-2 text-4xl">🔔</div>
					<h3 className="font-semibold">Slack</h3>
					<p className="text-sm text-muted-foreground">Get notifications</p>
				</Card>
				<Card className="p-6 text-center">
					<div className="mb-2 text-4xl">📧</div>
					<h3 className="font-semibold">Email</h3>
					<p className="text-sm text-muted-foreground">Reply via email</p>
				</Card>
				<Card className="p-6 text-center">
					<div className="mb-2 text-4xl">🔗</div>
					<h3 className="font-semibold">Webhooks</h3>
					<p className="text-sm text-muted-foreground">Custom integrations</p>
				</Card>
				<Card className="p-6 text-center">
					<div className="mb-2 text-4xl">📊</div>
					<h3 className="font-semibold">Analytics</h3>
					<p className="text-sm text-muted-foreground">Track engagement</p>
				</Card>
			</div>
		</div>
	</section>

	<section className="bg-primary px-4 py-20 text-primary-foreground">
		<div className="container mx-auto max-w-4xl space-y-6 text-center">
			<h2 className="text-4xl font-bold">Start Collaborating Better Today</h2>
			<p className="text-xl opacity-90">
				Join teams who've transformed their collaboration with Foreum. Try it free for 14 days.
			</p>
			<Button size="lg" variant="secondary">Start Free Trial</Button>
		</div>
	</section>
</div>

      )
}
