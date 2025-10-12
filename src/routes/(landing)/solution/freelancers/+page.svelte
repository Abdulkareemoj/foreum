<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Check, Briefcase, DollarSign, Clock, Star, Users } from '@lucide/svelte';
</script>

<div class="min-h-screen bg-background">
	<section class="px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<div class="space-y-6 text-center">
				<div
					class="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
				>
					For Freelancers
				</div>
				<h1 class="text-5xl font-bold text-balance md:text-6xl">
					Build Your Personal Brand<br />With Community
				</h1>
				<p class="mx-auto max-w-2xl text-xl text-pretty text-muted-foreground">
					Create a dedicated space for your clients, showcase your expertise, and build a community
					around your freelance services.
				</p>
				<div class="flex justify-center gap-4 pt-4">
					<Button size="lg" class="bg-primary hover:bg-primary/90">Get Started Free</Button>
					<Button size="lg" variant="outline">See Examples</Button>
				</div>
			</div>
		</div>
	</section>

	<section class="bg-muted/30 px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<h2 class="mb-12 text-center text-3xl font-bold">Perfect for Independent Professionals</h2>
			<div class="grid gap-8 md:grid-cols-3">
				<Card.Root class="space-y-4 p-6">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Briefcase class="h-6 w-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold">Client Portal</h3>
					<p class="text-muted-foreground">
						Create a private space for client communication, project updates, and file sharing.
					</p>
				</Card.Root>

				<Card.Root class="space-y-4 p-6">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Star class="h-6 w-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold">Showcase Expertise</h3>
					<p class="text-muted-foreground">
						Share insights, tutorials, and case studies to demonstrate your skills and attract new
						clients.
					</p>
				</Card.Root>

				<Card.Root class="space-y-4 p-6">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<DollarSign class="h-6 w-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold">Affordable Pricing</h3>
					<p class="text-muted-foreground">
						Professional features at freelancer-friendly prices. No enterprise costs, just what you
						need.
					</p>
				</Card.Root>
			</div>
		</div>
	</section>

	<section class="px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<h2 class="mb-12 text-center text-3xl font-bold">How Freelancers Use Foreum</h2>
			<div class="grid gap-8 md:grid-cols-2">
				<Card.Root class="space-y-4 p-6">
					<h3 class="text-xl font-semibold">Designers & Creatives</h3>
					<p class="text-muted-foreground">
						Share work-in-progress, gather client feedback, and build a portfolio community that
						showcases your creative process.
					</p>
					<ul class="space-y-2 text-sm text-muted-foreground">
						<li class="flex gap-2">
							<Check class="size-4 text-primary" /> Client feedback threads
						</li>
						<li class="flex gap-2">
							<Check class="size-4 text-primary" /> Design showcase galleries
						</li>
						<li class="flex gap-2"><Check class="size-4 text-primary" /> Revision tracking</li>
					</ul>
				</Card.Root>

				<Card.Root class="space-y-4 p-6">
					<h3 class="text-xl font-semibold">Developers & Consultants</h3>
					<p class="text-muted-foreground">
						Provide technical support, share code snippets, and maintain documentation for your
						clients in one organized place.
					</p>
					<ul class="space-y-2 text-sm text-muted-foreground">
						<li class="flex gap-2"><Check class="size-4 text-primary" /> Technical Q&A forums</li>
						<li class="flex gap-2"><Check class="size-4 text-primary" /> Code snippet sharing</li>
						<li class="flex gap-2"><Check class="size-4 text-primary" /> Project documentation</li>
					</ul>
				</Card.Root>

				<Card.Root class="space-y-4 p-6">
					<h3 class="text-xl font-semibold">Writers & Content Creators</h3>
					<p class="text-muted-foreground">
						Build an audience, share exclusive content, and engage with readers in a dedicated
						community space.
					</p>
					<ul class="space-y-2 text-sm text-muted-foreground">
						<li class="flex gap-2">
							<Check class="size-4 text-primary" /> Exclusive content threads
						</li>
						<li class="flex gap-2"><Check class="size-4 text-primary" /> Reader discussions</li>
						<li class="flex gap-2"><Check class="size-4 text-primary" /> Writing workshops</li>
					</ul>
				</Card.Root>

				<Card.Root class="space-y-4 p-6">
					<h3 class="text-xl font-semibold">Coaches & Educators</h3>
					<p class="text-muted-foreground">
						Create a learning community, share resources, and provide ongoing support to your
						students and clients.
					</p>
					<ul class="space-y-2 text-sm text-muted-foreground">
						<li class="flex gap-2"><Check class="size-4 text-primary" /> Course discussions</li>
						<li class="flex gap-2"><Check class="size-4 text-primary" /> Resource libraries</li>
						<li class="flex gap-2">
							<Check class="size-4 text-primary" /> Student support forums
						</li>
					</ul>
				</Card.Root>
			</div>
		</div>
	</section>

	<section class="bg-primary px-4 py-20 text-primary-foreground">
		<div class="container mx-auto max-w-4xl space-y-6 text-center">
			<h2 class="text-4xl font-bold">Ready to Elevate Your Freelance Business?</h2>
			<p class="text-xl opacity-90">
				Start building your professional community today. No credit card required.
			</p>
			<Button size="lg" variant="secondary">Start Free Trial</Button>
		</div>
	</section>
</div>
