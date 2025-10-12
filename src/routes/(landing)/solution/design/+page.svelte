<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Check, Palette, Image, MessageCircle, Users, Eye, Sparkles } from '@lucide/svelte';
</script>

<div class="min-h-screen bg-background">
	<section class="px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<div class="space-y-6 text-center">
				<div
					class="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
				>
					For Design Teams
				</div>
				<h1 class="text-5xl font-bold text-balance md:text-6xl">
					Design Feedback<br />Made Simple
				</h1>
				<p class="mx-auto max-w-2xl text-xl text-pretty text-muted-foreground">
					Centralize design feedback, iterate faster, and keep stakeholders aligned. The perfect
					platform for design collaboration and critique.
				</p>
				<div class="flex justify-center gap-4 pt-4">
					<Button size="lg" class="bg-primary hover:bg-primary/90">Start Free Trial</Button>
					<Button size="lg" variant="outline">View Examples</Button>
				</div>
			</div>
		</div>
	</section>

	<section class="bg-muted/30 px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<h2 class="mb-12 text-center text-3xl font-bold">Built for Design Workflows</h2>
			<div class="grid gap-8 md:grid-cols-3">
				<Card.Root class="space-y-4 p-6">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Eye class="size-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold">Visual Feedback</h3>
					<p class="text-muted-foreground">
						Share designs and gather contextual feedback in organized threads. Keep all feedback in
						one place.
					</p>
				</Card.Root>

				<Card.Root class="space-y-4 p-6">
					<div class="flex size-12 items-center justify-center rounded-lg bg-primary/10">
						<Users class="h-6 w-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold">Stakeholder Alignment</h3>
					<p class="text-muted-foreground">
						Keep clients, developers, and team members aligned with clear communication and version
						history.
					</p>
				</Card.Root>

				<Card.Root class="space-y-4 p-6">
					<div class="flex size-12 items-center justify-center rounded-lg bg-primary/10">
						<Sparkles class="size-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold">Design System Hub</h3>
					<p class="text-muted-foreground">
						Document your design system, share components, and maintain consistency across projects.
					</p>
				</Card.Root>
			</div>
		</div>
	</section>

	<section class="px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<h2 class="mb-12 text-center text-3xl font-bold">How Design Teams Use Foreum</h2>
			<div class="space-y-12">
				<div class="grid items-center gap-12 md:grid-cols-2">
					<div class="space-y-4">
						<h3 class="text-2xl font-semibold">Design Critiques</h3>
						<p class="text-muted-foreground">
							Share work-in-progress designs and get structured feedback from your team. Keep
							critique sessions organized and actionable.
						</p>
						<ul class="space-y-2">
							<li class="flex gap-2">
								<Check class="size-5 text-primary" /> Organized feedback threads
							</li>
							<li class="flex gap-2"><Check class="size-5 text-primary" /> Version comparison</li>
							<li class="flex gap-2">
								<Check class="size-5 text-primary" /> Action item tracking
							</li>
							<li class="flex gap-2">
								<Check class="size-5 text-primary" /> Design rationale documentation
							</li>
						</ul>
					</div>
					<Card.Root class="bg-muted/30 p-8">
						<Image class="mb-4 size-16 text-primary" />
						<p class="text-lg font-medium">
							"Foreum transformed our design review process. Feedback is now organized, actionable,
							and easy to track."
						</p>
						<p class="mt-4 text-sm text-muted-foreground">— Lead Designer, Creative Agency</p>
					</Card.Root>
				</div>

				<div class="grid items-center gap-12 md:grid-cols-2">
					<Card.Root class="bg-muted/30 p-8 md:order-2">
						<MessageCircle class="mb-4 size-16 text-primary" />
						<p class="text-lg font-medium">
							"Client feedback is finally organized. No more scattered emails and lost comments."
						</p>
						<p class="mt-4 text-sm text-muted-foreground">— Design Director, Studio</p>
					</Card.Root>
					<div class="space-y-4 md:order-1">
						<Users class=" size-12 text-primary" />
						<h3 class="text-2xl font-semibold">Client Collaboration</h3>
						<p class="text-muted-foreground">
							Create private spaces for client projects. Share designs, gather feedback, and keep
							all communication in one organized place.
						</p>
						<ul class="space-y-2">
							<li class="flex gap-2">
								<Check class="size-5 text-primary" /> Private client portals
							</li>
							<li class="flex gap-2"><Check class="size-5 text-primary" /> Revision tracking</li>
							<li class="flex gap-2"><Check class="size-5 text-primary" /> Approval workflows</li>
							<li class="flex gap-2"><Check class="size-5 text-primary" /> File attachments</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="bg-muted/30 px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<h2 class="mb-12 text-center text-3xl font-bold">Design-Focused Features</h2>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card.Root class="space-y-3 p-6">
					<h3 class="font-semibold">Image Attachments</h3>
					<p class="text-sm text-muted-foreground">
						Share designs directly in threads with full-resolution image support.
					</p>
				</Card.Root>
				<Card.Root class="space-y-3 p-6">
					<h3 class="font-semibold">Version History</h3>
					<p class="text-sm text-muted-foreground">
						Track design iterations and compare versions side-by-side.
					</p>
				</Card.Root>
				<Card.Root class="space-y-3 p-6">
					<h3 class="font-semibold">Threaded Comments</h3>
					<p class="text-sm text-muted-foreground">
						Keep feedback organized with nested comment threads.
					</p>
				</Card.Root>
				<Card.Root class="space-y-3 p-6">
					<h3 class="font-semibold">Tag System</h3>
					<p class="text-sm text-muted-foreground">
						Organize designs by project, status, or component type.
					</p>
				</Card.Root>
				<Card.Root class="space-y-3 p-6">
					<h3 class="font-semibold">Private Spaces</h3>
					<p class="text-sm text-muted-foreground">
						Create client-specific or project-specific private forums.
					</p>
				</Card.Root>
				<Card.Root class="space-y-3 p-6">
					<h3 class="font-semibold">Custom Branding</h3>
					<p class="text-sm text-muted-foreground">
						White-label the platform to match your brand identity.
					</p>
				</Card.Root>
			</div>
		</div>
	</section>

	<section class="bg-primary px-4 py-20 text-primary-foreground">
		<div class="container mx-auto max-w-4xl space-y-6 text-center">
			<h2 class="text-4xl font-bold">Elevate Your Design Process</h2>
			<p class="text-xl opacity-90">
				Join design teams who've streamlined their feedback and collaboration with Foreum.
			</p>
			<Button size="lg" variant="secondary">Start Free Trial</Button>
		</div>
	</section>
</div>
