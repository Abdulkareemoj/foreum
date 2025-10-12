<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		ArrowRight,
		Rocket,
		Users,
		Building2,
		GraduationCap,
		MessageSquare,
		Palette,
		BarChart3
	} from '@lucide/svelte';

	const solutions = [
		{
			title: 'For Startups',
			description:
				'Build engaged communities around your product. Get feedback, provide support, and grow your user base with powerful discussion tools.',
			icon: Rocket,
			href: '/solution/startups',
			color: 'text-primary'
		},
		{
			title: 'For Freelancers',
			description:
				'Create a professional space for client communication, project discussions, and portfolio showcases. Manage multiple clients efficiently.',
			icon: Users,
			href: '/solution/freelancers',
			color: 'text-primary'
		},
		{
			title: 'For Organizations',
			description:
				'Enterprise-grade forums for internal communication, knowledge sharing, and team collaboration. Secure, scalable, and customizable.',
			icon: Building2,
			href: '/solution/organizations',
			color: 'text-primary'
		},
		{
			title: 'For Students',
			description:
				'Academic discussion platforms for study groups, course forums, and peer learning. Foster collaboration and knowledge exchange.',
			icon: GraduationCap,
			href: '/solution/students',
			color: 'text-primary'
		},
		{
			title: 'For Collaboration',
			description:
				'Real-time team discussions, project coordination, and asynchronous communication. Keep everyone aligned and productive.',
			icon: MessageSquare,
			href: '/solution/collaboration',
			color: 'text-primary'
		},
		{
			title: 'For Design Teams',
			description:
				'Share designs, gather feedback, and iterate collaboratively. Perfect for design critiques and creative discussions.',
			icon: Palette,
			href: '/solution/design',
			color: 'text-primary'
		},
		{
			title: 'For Management',
			description:
				'Streamline team communication, track discussions, and make data-driven decisions with comprehensive analytics and moderation tools.',
			icon: BarChart3,
			href: '/solution/management',
			color: 'text-primary'
		}
	];
</script>

<div class="min-h-screen bg-background">
	<section class="px-4 py-20">
		<div class="mx-auto max-w-6xl text-center">
			<h1 class="mb-6 text-5xl font-bold text-balance md:text-6xl">Solutions for Every Team</h1>
			<p class="mx-auto mb-8 max-w-3xl text-xl text-pretty text-muted-foreground">
				Discover how Foreum adapts to your unique needs. Whether you're a startup building
				community, a freelancer managing clients, or an enterprise scaling communication—we have the
				perfect solution.
			</p>
		</div>
	</section>

	<section class="px-4 py-12">
		<div class="mx-auto max-w-7xl">
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each solutions as solution}
					<a
						href={solution.href}
						class="group rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:border-primary hover:shadow-lg"
					>
						<div class="mb-4 flex items-start gap-4">
							<div class="rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
								<solution.icon class="h-6 w-6 {solution.color}" />
							</div>
							<div class="flex-1">
								<h3 class="mb-2 text-xl font-semibold transition-colors group-hover:text-primary">
									{solution.title}
								</h3>
							</div>
						</div>
						<p class="mb-4 leading-relaxed text-pretty text-muted-foreground">
							{solution.description}
						</p>
						<div
							class="flex items-center font-medium text-primary transition-all group-hover:gap-2"
						>
							Learn more
							<ArrowRight class="ml-1 size-4 transition-transform group-hover:translate-x-1" />
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section class="px-4 py-20">
		<div class="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-12 text-center">
			<h2 class="mb-4 text-3xl font-bold md:text-4xl">Ready to Get Started?</h2>
			<p class="mb-8 text-lg text-pretty text-muted-foreground">
				Join thousands of teams already using Foreum to build better communities and streamline
				communication.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<Button size="lg" class="bg-primary hover:bg-primary/90">Start Free Trial</Button>
				<Button size="lg" variant="outline">Schedule Demo</Button>
			</div>
		</div>
	</section>
</div>
