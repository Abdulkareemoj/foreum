<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Check, Zap, Users, TrendingUp, MessageSquare, Shield } from '@lucide/svelte';
</script>

<div class="min-h-screen bg-background">
	<section class="px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<div class="space-y-6 text-center">
				<div
					class="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
				>
					For Startups
				</div>
				<h1 class="text-5xl font-bold text-balance md:text-6xl">
					Build Your Community<br />From Day One
				</h1>
				<p class="mx-auto max-w-2xl text-xl text-pretty text-muted-foreground">
					Launch your startup with a built-in community. Engage early adopters, gather feedback, and
					build a loyal user base before your product even launches.
				</p>
				<div class="flex justify-center gap-4 pt-4">
					<Button size="lg" class="bg-primary hover:bg-primary/90">Start Free Trial</Button>
					<Button size="lg" variant="outline">View Demo</Button>
				</div>
			</div>
		</div>
	</section>

	<section class="bg-muted/30 px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<h2 class="mb-12 text-center text-3xl font-bold">Why Startups Choose Foreum</h2>
			<div class="grid gap-8 md:grid-cols-3">
				<Card.Root class="space-y-4 p-6">
					<div class="flex size-12 items-center justify-center rounded-lg bg-primary/10">
						<Zap class="size-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold">Launch in Minutes</h3>
					<p class="text-muted-foreground">
						Get your community forum up and running in minutes, not weeks. No technical expertise
						required.
					</p>
				</Card.Root>

				<Card.Root class="space-y-4 p-6">
					<div class="flex size-12 items-center justify-center rounded-lg bg-primary/10">
						<Users class="size-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold">Early Adopter Engagement</h3>
					<p class="text-muted-foreground">
						Connect with your first users, gather valuable feedback, and iterate based on real
						community input.
					</p>
				</Card.Root>

				<Card.Root class="space-y-4 p-6">
					<div class="flex size-12 items-center justify-center rounded-lg bg-primary/10">
						<TrendingUp class="size-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold">Scale as You Grow</h3>
					<p class="text-muted-foreground">
						Start small and scale seamlessly. Our infrastructure grows with your startup's success.
					</p>
				</Card.Root>
			</div>
		</div>
	</section>

	<section class="px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<div class="grid items-center gap-12 md:grid-cols-2">
				<div class="space-y-6">
					<h2 class="text-4xl font-bold">Everything You Need to Build Community</h2>
					<p class="text-lg text-muted-foreground">
						Foreum provides all the tools startups need to create, manage, and grow their community
						without breaking the bank.
					</p>
					<ul class="space-y-4">
						<li class="flex gap-3">
							<Check class="size-6 flex-shrink-0 text-primary" />
							<span>Unlimited discussions and threads</span>
						</li>
						<li class="flex gap-3">
							<Check class="size-6 flex-shrink-0 text-primary" />
							<span>Built-in moderation tools</span>
						</li>
						<li class="flex gap-3">
							<Check class="size-6 flex-shrink-0 text-primary" />
							<span>Custom branding and themes</span>
						</li>
						<li class="flex gap-3">
							<Check class="size-6 flex-shrink-0 text-primary" />
							<span>Analytics and insights</span>
						</li>
						<li class="flex gap-3">
							<Check class="size-6 flex-shrink-0 text-primary" />
							<span>Email notifications</span>
						</li>
						<li class="flex gap-3">
							<Check class="size-6 flex-shrink-0 text-primary" />
							<span>API access for integrations</span>
						</li>
					</ul>
				</div>
				<div class="space-y-4 rounded-lg bg-muted/30 p-8">
					<MessageSquare class="h-16 w-16 text-primary" />
					<h3 class="text-2xl font-semibold">Real-Time Feedback Loop</h3>
					<p class="text-muted-foreground">
						Turn your community into your product development team. Get instant feedback on
						features, identify bugs early, and validate ideas before investing resources.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="bg-primary px-4 py-20 text-primary-foreground">
		<div class="container mx-auto max-w-4xl space-y-6 text-center">
			<h2 class="text-4xl font-bold">Start Building Your Community Today</h2>
			<p class="text-xl opacity-90">
				Join thousands of startups using Foreum to engage their users and build thriving
				communities.
			</p>
			<div class="flex justify-center gap-4 pt-4">
				<Button size="lg" variant="secondary">Start Free Trial</Button>
				<Button
					size="lg"
					variant="outline"
					class="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
				>
					View Pricing
				</Button>
			</div>
		</div>
	</section>
</div>
