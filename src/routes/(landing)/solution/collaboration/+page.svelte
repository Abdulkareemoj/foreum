<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Check, Users, MessageSquare, FileText, Zap, GitBranch, Clock } from '@lucide/svelte';
</script>

<div class="min-h-screen bg-background">
	<section class="px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<div class="space-y-6 text-center">
				<div
					class="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
				>
					For Collaboration
				</div>
				<h1 class="text-5xl font-bold text-balance md:text-6xl">
					Where Teams<br />Work Together
				</h1>
				<p class="mx-auto max-w-2xl text-xl text-pretty text-muted-foreground">
					Replace scattered communication tools with one organized platform. Keep discussions
					focused, decisions documented, and teams aligned.
				</p>
				<div class="flex justify-center gap-4 pt-4">
					<Button size="lg" class="bg-primary hover:bg-primary/90">Start Collaborating</Button>
					<Button size="lg" variant="outline">See How It Works</Button>
				</div>
			</div>
		</div>
	</section>

	<section class="bg-muted/30 px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<h2 class="mb-12 text-center text-3xl font-bold">Built for Team Collaboration</h2>
			<div class="grid gap-8 md:grid-cols-3">
				<Card.Root class="space-y-4 p-6">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<MessageSquare class="h-6 w-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold">Organized Discussions</h3>
					<p class="text-muted-foreground">
						Keep conversations organized by topic, project, or team. No more lost messages in
						endless chat threads.
					</p>
				</Card.Root>

				<Card.Root class="space-y-4 p-6">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<FileText class="h-6 w-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold">Knowledge Base</h3>
					<p class="text-muted-foreground">
						Build a searchable repository of decisions, processes, and institutional knowledge.
					</p>
				</Card.Root>

				<Card.Root class="space-y-4 p-6">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Zap class="h-6 w-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold">Async-First</h3>
					<p class="text-muted-foreground">
						Perfect for distributed teams. Collaborate effectively across time zones without
						constant meetings.
					</p>
				</Card.Root>
			</div>
		</div>
	</section>

	<section class="px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<div class="mb-16 grid items-center gap-12 md:grid-cols-2">
				<div class="space-y-6">
					<h2 class="text-4xl font-bold">Replace Meeting Overload</h2>
					<p class="text-lg text-muted-foreground">
						Move discussions out of meetings and into organized threads. Let team members contribute
						when they're most productive.
					</p>
					<ul class="space-y-4">
						<li class="flex gap-3">
							<Check class="h-6 w-6 flex-shrink-0 text-primary" />
							<span>Threaded discussions keep context clear</span>
						</li>
						<li class="flex gap-3">
							<Check class="h-6 w-6 flex-shrink-0 text-primary" />
							<span>Searchable history of all decisions</span>
						</li>
						<li class="flex gap-3">
							<Check class="h-6 w-6 flex-shrink-0 text-primary" />
							<span>Tag relevant team members</span>
						</li>
						<li class="flex gap-3">
							<Check class="h-6 w-6 flex-shrink-0 text-primary" />
							<span>Pin important announcements</span>
						</li>
					</ul>
				</div>
				<Card.Root class="bg-muted/30 p-8">
					<Clock class="mb-4 h-16 w-16 text-primary" />
					<h3 class="mb-4 text-2xl font-semibold">Async Collaboration</h3>
					<p class="text-muted-foreground">
						Teams using Foreum report 40% fewer meetings and significantly better documentation of
						decisions and processes.
					</p>
				</Card.Root>
			</div>

			<div class="grid items-center gap-12 md:grid-cols-2">
				<Card.Root class="bg-muted/30 p-8 md:order-2">
					<GitBranch class="mb-4 h-16 w-16 text-primary" />
					<h3 class="mb-4 text-2xl font-semibold">Project Spaces</h3>
					<p class="text-muted-foreground">
						Create dedicated spaces for each project with custom categories, tags, and permissions.
						Keep everything organized and accessible.
					</p>
				</Card.Root>
				<div class="space-y-6 md:order-1">
					<h2 class="text-4xl font-bold">Organize by Project</h2>
					<p class="text-lg text-muted-foreground">
						Give each project its own space with relevant categories and team members. No more
						digging through unrelated conversations.
					</p>
					<ul class="space-y-4">
						<li class="flex gap-3">
							<Check class="h-6 w-6 flex-shrink-0 text-primary" />
							<span>Custom categories per project</span>
						</li>
						<li class="flex gap-3">
							<Check class="h-6 w-6 flex-shrink-0 text-primary" />
							<span>Project-specific permissions</span>
						</li>
						<li class="flex gap-3">
							<Check class="h-6 w-6 flex-shrink-0 text-primary" />
							<span>Tag system for organization</span>
						</li>
						<li class="flex gap-3">
							<Check class="h-6 w-6 flex-shrink-0 text-primary" />
							<span>Archive completed projects</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</section>

	<section class="bg-muted/30 px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold">Integrates With Your Workflow</h2>
				<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
					Connect Foreum with the tools your team already uses for a seamless collaboration
					experience.
				</p>
			</div>
			<div class="grid gap-6 md:grid-cols-4">
				<Card.Root class="p-6 text-center">
					<div class="mb-2 text-4xl">🔔</div>
					<h3 class="font-semibold">Slack</h3>
					<p class="text-sm text-muted-foreground">Get notifications</p>
				</Card.Root>
				<Card.Root class="p-6 text-center">
					<div class="mb-2 text-4xl">📧</div>
					<h3 class="font-semibold">Email</h3>
					<p class="text-sm text-muted-foreground">Reply via email</p>
				</Card.Root>
				<Card.Root class="p-6 text-center">
					<div class="mb-2 text-4xl">🔗</div>
					<h3 class="font-semibold">Webhooks</h3>
					<p class="text-sm text-muted-foreground">Custom integrations</p>
				</Card.Root>
				<Card.Root class="p-6 text-center">
					<div class="mb-2 text-4xl">📊</div>
					<h3 class="font-semibold">Analytics</h3>
					<p class="text-sm text-muted-foreground">Track engagement</p>
				</Card.Root>
			</div>
		</div>
	</section>

	<section class="bg-primary px-4 py-20 text-primary-foreground">
		<div class="container mx-auto max-w-4xl space-y-6 text-center">
			<h2 class="text-4xl font-bold">Start Collaborating Better Today</h2>
			<p class="text-xl opacity-90">
				Join teams who've transformed their collaboration with Foreum. Try it free for 14 days.
			</p>
			<Button size="lg" variant="secondary">Start Free Trial</Button>
		</div>
	</section>
</div>
