<script lang="ts">
	import { Button } from '$components/ui/button/';
	import { Badge } from '$components/ui/badge/';
	import * as Card from '$components/ui/card/';
	import { onMount } from 'svelte';
	import { BarChart3, Globe, MessageSquare, Shield, Users, Zap } from '@lucide/svelte';
	let stats = $state({
		communities: 0,
		discussions: 0,
		members: 0
	});

	onMount(() => {
		// Animate counters
		const animateCounter = (target, key, end) => {
			let current = 0;
			const increment = end / 50;
			const timer = setInterval(() => {
				current += increment;
				if (current >= end) {
					current = end;
					clearInterval(timer);
				}
				stats[key] = Math.floor(current);
			}, 30);
		};

		animateCounter(stats, 'communities', 2500);
		animateCounter(stats, 'discussions', 45000);
		animateCounter(stats, 'members', 180000);
	});
</script>

<svelte:head>
	<title>Foreum - Modern Forum Platform for Your Website</title>
	<meta
		name="description"
		content="Add powerful discussion features to your website with Foreum. Easy integration, advanced moderation, and community building tools."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="py-20 lg:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid items-center gap-12 lg:grid-cols-2">
			<div class="space-y-8">
				<div class="space-y-4">
					<Badge
						class="rounded-full border-none bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5"
					>
						<span class="size-1.5 rounded-full bg-green-600 dark:bg-green-400" aria-hidden="true"
						></span>
						Modern Forum Platform
					</Badge>
					<h1 class="font-heading text-4xl leading-tight font-bold text-foreground lg:text-6xl">
						Build Your Community with <span class="text-primary">Seamless Discussions</span>
					</h1>
					<p class="text-xl leading-relaxed text-muted-foreground">
						Embed powerful discussion features into any website. Easy integration, robust moderation
						tools, and engaging community features that grow with your audience.
					</p>
				</div>
				<div class="flex flex-col gap-4 sm:flex-row">
					<Button size="lg" class="bg-primary text-primary-foreground hover:bg-primary/90">
						Start Free Trial
					</Button>
					<Button size="lg" variant="outline" class="border-border bg-transparent hover:bg-muted">
						View Demo
					</Button>
				</div>
				<div class="flex items-center space-x-6 text-sm text-muted-foreground">
					<div class="flex items-center space-x-2">
						<div class="size-2 rounded-full bg-primary"></div>
						<span>5-minute setup</span>
					</div>
					<div class="flex items-center space-x-2">
						<div class="size-2 rounded-full bg-primary"></div>
						<span>No coding required</span>
					</div>
					<div class="flex items-center space-x-2">
						<div class="size-2 rounded-full bg-primary"></div>
						<span>Free 14-day trial</span>
					</div>
				</div>
			</div>
			<div class="relative">
				<div class="rounded-lg border border-border bg-card p-6 shadow-lg">
					<img
						src="/placeholder.svg?height=400&width=600"
						alt="Foreum Forum Interface"
						class="h-auto w-full rounded-md"
					/>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Features Section -->
<section id="features" class="bg-muted/30 py-20">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mb-16 space-y-4 text-center">
			<h2 class="font-heading text-3xl font-bold text-foreground lg:text-4xl">
				Everything You Need for Community Building
			</h2>
			<p class="mx-auto max-w-2xl text-xl text-muted-foreground">
				Powerful features designed to foster engagement and maintain healthy discussions
			</p>
		</div>

		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			<Card.Root class="border-border bg-card transition-shadow hover:shadow-lg">
				<Card.Header>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Zap class="size-6 text-primary" />
					</div>
					<Card.Title class="font-heading text-card-foreground">Easy Integration</Card.Title>
					<Card.Description>
						Embed discussions anywhere with a simple code snippet. Works with any website or CMS.
					</Card.Description>
				</Card.Header>
			</Card.Root>

			<Card.Root class="border-border bg-card transition-shadow hover:shadow-lg">
				<Card.Header>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Shield class="size-6 text-primary" />
					</div>
					<Card.Title class="font-heading text-card-foreground">Advanced Moderation</Card.Title>
					<Card.Description>
						Comprehensive moderation tools with automated spam detection and custom rules.
					</Card.Description>
				</Card.Header>
			</Card.Root>

			<Card.Root class="border-border bg-card transition-shadow hover:shadow-lg">
				<Card.Header>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Users class="size-6 text-primary" />
					</div>
					<Card.Title class="font-heading text-card-foreground">User Management</Card.Title>
					<Card.Description>
						Role-based permissions, user profiles, and reputation systems to build trust.
					</Card.Description>
				</Card.Header>
			</Card.Root>

			<Card.Root class="border-border bg-card transition-shadow hover:shadow-lg">
				<Card.Header>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Globe class="size-6 text-primary" />
					</div>
					<Card.Title class="font-heading text-card-foreground">Multi-Site Support</Card.Title>
					<Card.Description>
						Manage multiple communities from one dashboard with unified analytics.
					</Card.Description>
				</Card.Header>
			</Card.Root>

			<Card.Root class="border-border bg-card transition-shadow hover:shadow-lg">
				<Card.Header>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<BarChart3 class="size-6 text-primary" />
					</div>
					<Card.Title class="font-heading text-card-foreground">Analytics & Insights</Card.Title>
					<Card.Description>
						Track engagement, popular topics, and community growth with detailed analytics.
					</Card.Description>
				</Card.Header>
			</Card.Root>

			<Card.Root class="border-border bg-card transition-shadow hover:shadow-lg">
				<Card.Header>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<MessageSquare class="size-6 text-primary" />
					</div>
					<Card.Title class="font-heading text-card-foreground">Rich Discussions</Card.Title>
					<Card.Description>
						Threaded conversations, reactions, file uploads, and real-time notifications.
					</Card.Description>
				</Card.Header>
			</Card.Root>
		</div>
	</div>
</section>

<!-- Community Stats Section -->
<section id="community" class="py-20">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mb-16 space-y-4 text-center">
			<h2 class="font-heading text-3xl font-bold text-foreground lg:text-4xl">
				Join Thousands of Growing Communities
			</h2>
			<p class="text-xl text-muted-foreground">
				Trusted by websites worldwide to power their discussions
			</p>
		</div>

		<div class="grid gap-8 text-center md:grid-cols-4">
			<div class="space-y-2">
				<div class="font-heading text-4xl font-bold text-primary">10K+</div>
				<div class="text-muted-foreground">Active Communities</div>
			</div>
			<div class="space-y-2">
				<div class="font-heading text-4xl font-bold text-primary">2M+</div>
				<div class="text-muted-foreground">Monthly Discussions</div>
			</div>
			<div class="space-y-2">
				<div class="font-heading text-4xl font-bold text-primary">500K+</div>
				<div class="text-muted-foreground">Registered Users</div>
			</div>
			<div class="space-y-2">
				<div class="font-heading text-4xl font-bold text-primary">99.9%</div>
				<div class="text-muted-foreground">Uptime</div>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="bg-primary/5 py-20">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-3xl space-y-8 text-center">
			<h2 class="font-heading text-3xl font-bold text-foreground lg:text-4xl">
				Ready to Build Your Community?
			</h2>
			<p class="text-xl text-muted-foreground">
				Start your free trial today and see how easy it is to add engaging discussions to your
				website.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<Button size="lg" class="bg-primary text-primary-foreground hover:bg-primary/90">
					Start Free Trial
				</Button>
				<Button size="lg" variant="outline" class="border-border bg-transparent hover:bg-muted">
					Schedule Demo
				</Button>
			</div>
			<p class="text-sm text-muted-foreground">
				No credit card required • 14-day free trial • Cancel anytime
			</p>
		</div>
	</div>
</section>
