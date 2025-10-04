<script lang="ts">
	import Button from '$components/ui/button/button.svelte';
	import { onMount } from 'svelte';

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

<section class="bg-background py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-4xl text-center">
			<h1 class="font-heading mb-6 text-5xl leading-tight font-bold text-foreground md:text-6xl">
				Build Thriving Communities
				<span class="text-muted-foreground">On Your Website</span>
			</h1>

			<p class="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
				Add powerful discussion features to your website with Foreum. Easy integration, advanced
				moderation tools, and everything you need to build engaged communities.
			</p>

			<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
				<button
					class="rounded-lg bg-primary px-8 py-4 text-lg font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
				>
					Start Free Trial
				</button>
				<button
					class="rounded-lg border border-border px-8 py-4 text-lg font-medium text-foreground transition-colors hover:bg-muted"
				>
					View Demo
				</button>
			</div>
		</div>
	</div>
</section>

<!-- Stats Section -->
<!-- Updated stats section with semantic colors -->
<section class="bg-card py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
			<div class="space-y-2">
				<div class="text-4xl font-bold text-foreground">{stats.communities.toLocaleString()}+</div>
				<div class="text-muted-foreground">Active Communities</div>
			</div>
			<div class="space-y-2">
				<div class="text-4xl font-bold text-foreground">{stats.discussions.toLocaleString()}+</div>
				<div class="text-muted-foreground">Discussions Started</div>
			</div>
			<div class="space-y-2">
				<div class="text-4xl font-bold text-foreground">{stats.members.toLocaleString()}+</div>
				<div class="text-muted-foreground">Community Members</div>
			</div>
		</div>
	</div>
</section>

<!-- Features Section -->
<section id="features" class="bg-muted/30 py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-16 text-center">
			<h2 class="font-heading mb-4 text-4xl font-bold text-foreground">
				Everything You Need for Community Building
			</h2>
			<p class="mx-auto max-w-2xl text-xl text-muted-foreground">
				Powerful features designed to help you create, manage, and grow thriving online communities.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			<!-- Feature 1 -->
			<div
				class="rounded-xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
			>
				<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
					<svg
						class="h-6 w-6 text-foreground"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
				</div>
				<h3 class="font-heading mb-3 text-xl font-semibold text-card-foreground">
					Lightning Fast Setup
				</h3>
				<p class="leading-relaxed text-muted-foreground">
					Get your forum running in minutes with our simple embed code. No complex configuration
					required.
				</p>
			</div>

			<!-- Feature 2 -->
			<div
				class="rounded-xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
			>
				<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
					<svg
						class="h-6 w-6 text-foreground"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
						/>
					</svg>
				</div>
				<h3 class="font-heading mb-3 text-xl font-semibold text-card-foreground">
					Advanced Moderation
				</h3>
				<p class="leading-relaxed text-muted-foreground">
					Keep your community safe with AI-powered moderation, custom rules, and comprehensive admin
					tools.
				</p>
			</div>

			<!-- Feature 3 -->
			<div
				class="rounded-xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
			>
				<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
					<svg
						class="h-6 w-6 text-foreground"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						/>
					</svg>
				</div>
				<h3 class="font-heading mb-3 text-xl font-semibold text-card-foreground">
					Engagement Tools
				</h3>
				<p class="leading-relaxed text-muted-foreground">
					Boost participation with reactions, voting, badges, and gamification features that keep
					users coming back.
				</p>
			</div>

			<!-- Feature 4 -->
			<div
				class="rounded-xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
			>
				<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
					<svg
						class="h-6 w-6 text-foreground"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
				</div>
				<h3 class="font-heading mb-3 text-xl font-semibold text-card-foreground">
					Full Customization
				</h3>
				<p class="leading-relaxed text-muted-foreground">
					Match your brand perfectly with custom themes, CSS overrides, and flexible layout options.
				</p>
			</div>

			<!-- Feature 5 -->
			<div
				class="rounded-xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
			>
				<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
					<svg
						class="h-6 w-6 text-foreground"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
						/>
					</svg>
				</div>
				<h3 class="font-heading mb-3 text-xl font-semibold text-card-foreground">
					Analytics & Insights
				</h3>
				<p class="leading-relaxed text-muted-foreground">
					Track engagement, monitor growth, and understand your community with detailed analytics
					and reporting.
				</p>
			</div>

			<!-- Feature 6 -->
			<div
				class="rounded-xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
			>
				<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
					<svg
						class="h-6 w-6 text-foreground"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
						/>
					</svg>
				</div>
				<h3 class="font-heading mb-3 text-xl font-semibold text-card-foreground">
					Enterprise Security
				</h3>
				<p class="leading-relaxed text-muted-foreground">
					Bank-level security with SSO integration, data encryption, and compliance with privacy
					regulations.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<!-- Updated CTA section to use primary colors from design system -->
<section class="bg-primary py-20">
	<div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
		<h2 class="font-heading mb-6 text-4xl font-bold text-primary-foreground">
			Ready to Build Your Community?
		</h2>
		<p class="mx-auto mb-8 max-w-2xl text-xl text-primary-foreground/80">
			Join thousands of websites using Foreum to create engaging discussion experiences. Start your
			free trial today.
		</p>
		<div class="flex flex-col justify-center gap-4 sm:flex-row">
			<Button
				size="2xl"
				class="rounded-lg bg-background px-8 py-4 text-lg font-medium text-foreground shadow-lg transition-colors hover:bg-muted"
			>
				Start Free Trial
			</Button>
			<Button
				href="/threads"
				size="2xl"
				class="rounded-lg border-2 border-primary-foreground px-8 py-4 text-lg font-medium text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-primary"
			>
				Demo Forum
			</Button>
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="border-t border-border bg-card py-12">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
			<div class="space-y-4">
				<div class="flex items-center space-x-2">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
						<span class="text-lg font-bold text-primary-foreground">F</span>
					</div>
					<span class="font-heading text-xl font-bold text-card-foreground">Foreum</span>
				</div>
				<p class="text-muted-foreground">
					The modern forum platform for building thriving online communities.
				</p>
			</div>

			<div>
				<h3 class="mb-4 font-semibold text-card-foreground">Product</h3>
				<ul class="space-y-2 text-muted-foreground">
					<li>
						<a href="/features" class="transition-colors hover:text-card-foreground">Features</a>
					</li>
					<li>
						<a href="/pricing" class="transition-colors hover:text-card-foreground">Pricing</a>
					</li>
					<li>
						<a href="/docs" class="transition-colors hover:text-card-foreground">Documentation</a>
					</li>
					<li><a href="/api" class="transition-colors hover:text-card-foreground">API</a></li>
				</ul>
			</div>

			<div>
				<h3 class="mb-4 font-semibold text-card-foreground">Company</h3>
				<ul class="space-y-2 text-muted-foreground">
					<li><a href="/about" class="transition-colors hover:text-card-foreground">About</a></li>
					<li><a href="/blog" class="transition-colors hover:text-card-foreground">Blog</a></li>
					<li>
						<a href="/careers" class="transition-colors hover:text-card-foreground">Careers</a>
					</li>
					<li>
						<a href="/contact" class="transition-colors hover:text-card-foreground">Contact</a>
					</li>
				</ul>
			</div>

			<div>
				<h3 class="mb-4 font-semibold text-card-foreground">Support</h3>
				<ul class="space-y-2 text-muted-foreground">
					<li>
						<a href="/help-center" class="transition-colors hover:text-card-foreground"
							>Help Center</a
						>
					</li>
					<li>
						<a href="/community" class="transition-colors hover:text-card-foreground">Community</a>
					</li>
					<li><a href="/status" class="transition-colors hover:text-card-foreground">Status</a></li>
					<li>
						<a href="/privacy" class="transition-colors hover:text-card-foreground">Privacy</a>
					</li>
				</ul>
			</div>
		</div>

		<div class="mt-8 border-t border-border pt-8 text-center text-muted-foreground">
			<p>&copy; 2024 Foreum. All rights reserved.</p>
		</div>
	</div>
</footer>
