<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Check, Building2, Shield, Users, BarChart, Lock, Zap } from '@lucide/svelte';
</script>

<div class="min-h-screen bg-background">
	<section class="px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<div class="space-y-6 text-center">
				<div
					class="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
				>
					For Organizations
				</div>
				<h1 class="text-5xl font-bold text-balance md:text-6xl">
					Enterprise-Grade Community<br />Platform
				</h1>
				<p class="mx-auto max-w-2xl text-xl text-pretty text-muted-foreground">
					Empower your organization with a secure, scalable community platform. Perfect for internal
					communication, customer support, and knowledge sharing.
				</p>
				<div class="flex justify-center gap-4 pt-4">
					<Button size="lg" class="bg-primary hover:bg-primary/90">Request Demo</Button>
					<Button size="lg" variant="outline">Contact Sales</Button>
				</div>
			</div>
		</div>
	</section>

	<section class="bg-muted/30 px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<h2 class="mb-12 text-center text-3xl font-bold">Built for Enterprise Needs</h2>
			<div class="grid gap-8 md:grid-cols-3">
				<Card.Root class="space-y-4 p-6">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Shield class="size-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold">Enterprise Security</h3>
					<p class="text-muted-foreground">
						SOC 2 compliant, SSO integration, advanced permissions, and audit logs for complete
						security control.
					</p>
				</Card.Root>

				<Card.Root class="space-y-4 p-6">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Users class="size-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold">Unlimited Scale</h3>
					<p class="text-muted-foreground">
						Support thousands of users with guaranteed uptime and performance. Scale without limits.
					</p>
				</Card.Root>

				<Card.Root class="space-y-4 p-6">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<BarChart class="size-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold">Advanced Analytics</h3>
					<p class="text-muted-foreground">
						Deep insights into community engagement, user behavior, and content performance.
					</p>
				</Card.Root>
			</div>
		</div>
	</section>

	<section class="px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<h2 class="mb-12 text-center text-3xl font-bold">Organizational Use Cases</h2>
			<div class="space-y-12">
				<div class="grid items-center gap-12 md:grid-cols-2">
					<div class="space-y-4">
						<h3 class="text-2xl font-semibold">Internal Communication</h3>
						<p class="text-muted-foreground">
							Replace scattered email threads and chat messages with organized, searchable
							discussions. Keep your entire organization aligned and informed.
						</p>
						<ul class="space-y-2">
							<li class="flex gap-2">
								<Check class="size-5 text-primary" /> Department-specific forums
							</li>
							<li class="flex gap-2">
								<Check class="size-5 text-primary" /> Company announcements
							</li>
							<li class="flex gap-2">
								<Check class="size-5 text-primary" /> Project collaboration spaces
							</li>
							<li class="flex gap-2">
								<Check class="size-5 text-primary" /> Knowledge base integration
							</li>
						</ul>
					</div>
					<Card.Root class="bg-muted/30 p-8">
						<Building2 class="mb-4 size-16 text-primary" />
						<p class="text-lg font-medium">
							"Foreum transformed how our 500+ employee organization communicates. Everything is now
							organized and searchable."
						</p>
						<p class="mt-4 text-sm text-muted-foreground">— Director of Operations, Tech Corp</p>
					</Card.Root>
				</div>

				<div class="grid items-center gap-12 md:grid-cols-2">
					<Card.Root class="bg-muted/30 p-8 md:order-2">
						<Lock class="mb-4 size-16 text-primary" />
						<p class="text-lg font-medium">
							"The security features and compliance certifications gave us confidence to migrate our
							entire support system."
						</p>
						<p class="mt-4 text-sm text-muted-foreground">— CTO, Financial Services</p>
					</Card.Root>
					<div class="space-y-4 md:order-1">
						<h3 class="text-2xl font-semibold">Customer Support Hub</h3>
						<p class="text-muted-foreground">
							Provide exceptional customer support at scale. Let customers help each other while
							your team focuses on complex issues.
						</p>
						<ul class="space-y-2">
							<li class="flex gap-2">
								<Check class="size-5 text-primary" /> Self-service knowledge base
							</li>
							<li class="flex gap-2">
								<Check class="size-5 text-primary" /> Community-powered support
							</li>
							<li class="flex gap-2"><Check class="size-5 text-primary" /> Ticket integration</li>
							<li class="flex gap-2"><Check class="size-5 text-primary" /> Support analytics</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="bg-muted/30 px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<h2 class="mb-12 text-center text-3xl font-bold">Enterprise Features</h2>
			<div class="mx-auto grid max-w-4xl gap-x-12 gap-y-4 md:grid-cols-2">
				<div class="flex gap-3">
					<Check class="size-6 flex-shrink-0 text-primary" />
					<span>Single Sign-On (SSO)</span>
				</div>
				<div class="flex gap-3">
					<Check class="size-6 flex-shrink-0 text-primary" />
					<span>Advanced user permissions</span>
				</div>
				<div class="flex gap-3">
					<Check class="size-6 flex-shrink-0 text-primary" />
					<span>Custom branding & white-label</span>
				</div>
				<div class="flex gap-3">
					<Check class="size-6 flex-shrink-0 text-primary" />
					<span>API access & webhooks</span>
				</div>
				<div class="flex gap-3">
					<Check class="size-6 flex-shrink-0 text-primary" />
					<span>Dedicated account manager</span>
				</div>
				<div class="flex gap-3">
					<Check class="size-6 flex-shrink-0 text-primary" />
					<span>99.9% uptime SLA</span>
				</div>
				<div class="flex gap-3">
					<Check class="size-6 flex-shrink-0 text-primary" />
					<span>Priority support</span>
				</div>
				<div class="flex gap-3">
					<Check class="size-6 flex-shrink-0 text-primary" />
					<span>Custom integrations</span>
				</div>
				<div class="flex gap-3">
					<Check class="size-6 flex-shrink-0 text-primary" />
					<span>Advanced analytics & reporting</span>
				</div>
				<div class="flex gap-3">
					<Check class="size-6 flex-shrink-0 text-primary" />
					<span>Audit logs & compliance</span>
				</div>
				<div class="flex gap-3">
					<Check class="size-6 flex-shrink-0 text-primary" />
					<span>Data export & migration tools</span>
				</div>
				<div class="flex gap-3">
					<Check class="size-6 flex-shrink-0 text-primary" />
					<span>Custom training & onboarding</span>
				</div>
			</div>
		</div>
	</section>

	<section class="bg-primary px-4 py-20 text-primary-foreground">
		<div class="container mx-auto max-w-4xl space-y-6 text-center">
			<h2 class="text-4xl font-bold">Ready to Transform Your Organization?</h2>
			<p class="text-xl opacity-90">
				Schedule a demo with our enterprise team to see how Foreum can work for your organization.
			</p>
			<div class="flex justify-center gap-4 pt-4">
				<Button size="lg" variant="secondary">Request Demo</Button>
				<Button
					size="lg"
					variant="outline"
					class="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
				>
					Contact Sales
				</Button>
			</div>
		</div>
	</section>
</div>
