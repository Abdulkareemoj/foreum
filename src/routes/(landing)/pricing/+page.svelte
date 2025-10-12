<script>
	import { writable } from 'svelte/store';

	const billingCycleStore = writable('monthly');
	let billingCycle = $state();

	billingCycleStore.subscribe((value) => {
		billingCycle = value;
	});

	const plans = [
		{
			name: 'Starter',
			description: 'Perfect for small communities and personal projects',
			monthlyPrice: 29,
			yearlyPrice: 290,
			features: [
				'Up to 1,000 members',
				'5 GB storage',
				'Basic moderation tools',
				'Email support',
				'Custom branding',
				'Mobile responsive',
				'Basic analytics'
			],
			cta: 'Start Free Trial',
			popular: false
		},
		{
			name: 'Professional',
			description: 'For growing communities with advanced needs',
			monthlyPrice: 99,
			yearlyPrice: 990,
			features: [
				'Up to 10,000 members',
				'50 GB storage',
				'Advanced moderation & AI filters',
				'Priority support',
				'Custom domain',
				'Advanced analytics',
				'API access',
				'SSO integration',
				'Custom themes'
			],
			cta: 'Start Free Trial',
			popular: true
		},
		{
			name: 'Enterprise',
			description: 'For large organizations with custom requirements',
			monthlyPrice: null,
			yearlyPrice: null,
			features: [
				'Unlimited members',
				'Unlimited storage',
				'Enterprise moderation suite',
				'Dedicated support manager',
				'Custom integrations',
				'Advanced security & compliance',
				'SLA guarantee',
				'White-label solution',
				'Custom development'
			],
			cta: 'Contact Sales',
			popular: false
		}
	];

	function toggleBillingCycle() {
		billingCycleStore.update((value) => (value === 'monthly' ? 'yearly' : 'monthly'));
	}
</script>

<svelte:head>
	<title>Pricing - Foreum</title>
	<meta
		name="description"
		content="Choose the perfect plan for your community. Flexible pricing for teams of all sizes."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="bg-background py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mx-auto mb-12 max-w-3xl text-center">
			<h1 class="font-heading mb-6 text-5xl font-bold text-foreground">
				Simple, Transparent Pricing
			</h1>
			<p class="text-xl leading-relaxed text-muted-foreground">
				Choose the perfect plan for your community. All plans include a 14-day free trial.
			</p>
		</div>

		<!-- Billing Toggle -->
		<div class="mb-12 flex items-center justify-center gap-4">
			<span class="text-muted-foreground" class:text-foreground={billingCycle === 'monthly'}
				>Monthly</span
			>
			<button
				onclick={toggleBillingCycle}
				class="relative h-7 w-14 rounded-full bg-muted transition-colors"
				class:bg-primary={billingCycle === 'yearly'}
				aria-label="Toggle Billing Cycle"
			>
				<div
					class="absolute top-1 left-1 h-5 w-5 rounded-full bg-background transition-transform"
					class:translate-x-7={billingCycle === 'yearly'}
				></div>
			</button>
			<span class="text-muted-foreground" class:text-foreground={billingCycle === 'yearly'}>
				Yearly <span class="font-medium text-primary">(Save 17%)</span>
			</span>
		</div>

		<!-- Pricing Cards -->
		<div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
			{#each plans as plan}
				<div
					class="rounded-xl border bg-card transition-all"
					class:border-primary={plan.popular}
					class:border-border={!plan.popular}
					class:shadow-xl={plan.popular}
					class:shadow-sm={!plan.popular}
				>
					{#if plan.popular}
						<div
							class="rounded-t-xl bg-primary py-2 text-center font-medium text-primary-foreground"
						>
							Most Popular
						</div>
					{/if}

					<div class="p-8">
						<h3 class="font-heading mb-2 text-2xl font-bold text-card-foreground">{plan.name}</h3>
						<p class="mb-6 text-muted-foreground">{plan.description}</p>

						<div class="mb-6">
							{#if plan.monthlyPrice}
								<div class="flex items-baseline">
									<span class="text-4xl font-bold text-foreground">
										${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
									</span>
									<span class="ml-2 text-muted-foreground">
										/{billingCycle === 'monthly' ? 'month' : 'year'}
									</span>
								</div>
							{:else}
								<div class="text-4xl font-bold text-foreground">Custom</div>
							{/if}
						</div>

						{#if plan.popular}
							<button
								class="mb-6 w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
								aria-label={plan.cta}
							>
								{plan.cta}
							</button>
						{:else}
							<button
								class="mb-6 w-full rounded-lg border border-border py-3 font-medium text-foreground transition-colors hover:bg-muted"
								aria-label={plan.cta}
							>
								{plan.cta}
							</button>
						{/if}

						<ul class="space-y-3">
							{#each plan.features as feature}
								<li class="flex items-start gap-3">
									<svg
										class="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 13l4 4L19 7"
										/>
									</svg>
									<span class="text-muted-foreground">{feature}</span>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- FAQ Section -->
<section class="bg-muted/30 py-20">
	<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
		<h2 class="font-heading mb-12 text-center text-3xl font-bold text-foreground">
			Frequently Asked Questions
		</h2>

		<div class="space-y-6">
			<div class="rounded-xl border border-border bg-card p-6">
				<h3 class="mb-2 text-lg font-semibold text-card-foreground">Can I change plans later?</h3>
				<p class="text-muted-foreground">
					Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately,
					and we'll prorate the difference.
				</p>
			</div>

			<div class="rounded-xl border border-border bg-card p-6">
				<h3 class="mb-2 text-lg font-semibold text-card-foreground">
					What payment methods do you accept?
				</h3>
				<p class="text-muted-foreground">
					We accept all major credit cards, PayPal, and can arrange invoicing for Enterprise
					customers.
				</p>
			</div>

			<div class="rounded-xl border border-border bg-card p-6">
				<h3 class="mb-2 text-lg font-semibold text-card-foreground">Is there a free trial?</h3>
				<p class="text-muted-foreground">
					Yes! All plans include a 14-day free trial with full access to features. No credit card
					required to start.
				</p>
			</div>

			<div class="rounded-xl border border-border bg-card p-6">
				<h3 class="mb-2 text-lg font-semibold text-card-foreground">
					What happens if I exceed my member limit?
				</h3>
				<p class="text-muted-foreground">
					We'll notify you when you're approaching your limit. You can upgrade to a higher tier or
					we'll work with you on a custom solution.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="bg-primary py-20">
	<div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
		<h2 class="font-heading mb-6 text-4xl font-bold text-primary-foreground">
			Ready to Get Started?
		</h2>
		<p class="mb-8 text-xl text-primary-foreground/80">
			Start your 14-day free trial today. No credit card required.
		</p>
		<button
			class="rounded-lg bg-background px-8 py-4 text-lg font-medium text-foreground shadow-lg transition-colors hover:bg-muted"
			aria-label="Start Free Trial"
		>
			Start Free Trial
		</button>
	</div>
</section>
