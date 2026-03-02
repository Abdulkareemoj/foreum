import { createFileRoute } from '@tanstack/react-router'

import { Button } from '~/components/ui/button';
	import { Card} from '~/components/ui/card';
 	import { Check, Zap, Users, TrendingUp, MessageSquare, Shield } from 'lucide-react';
export const Route = createFileRoute('/_landing/solution/startups')({
  component: StartupsSolution,
})

function StartupsSolution() {
  return (
    <div className="min-h-screen bg-background">
	<section className="px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<div className="space-y-6 text-center">
				<div
					className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
				>
					For Startups
				</div>
				<h1 className="text-5xl font-bold text-balance md:text-6xl">
					Build Your Community<br />From Day One
				</h1>
				<p className="mx-auto max-w-2xl text-xl text-pretty text-muted-foreground">
					Launch your startup with a built-in community. Engage early adopters, gather feedback, and
					build a loyal user base before your product even launches.
				</p>
				<div className="flex justify-center gap-4 pt-4">
					<Button size="lg" className="bg-primary hover:bg-primary/90">Start Free Trial</Button>
					<Button size="lg" variant="outline">View Demo</Button>
				</div>
			</div>
		</div>
	</section>

	<section className="bg-muted/30 px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<h2 className="mb-12 text-center text-3xl font-bold">Why Startups Choose Foreum</h2>
			<div className="grid gap-8 md:grid-cols-3">
				<Card className="space-y-4 p-6">
					<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
						<Zap className="size-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Launch in Minutes</h3>
					<p className="text-muted-foreground">
						Get your community forum up and running in minutes, not weeks. No technical expertise
						required.
					</p>
				</Card>

				<Card className="space-y-4 p-6">
					<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
						<Users className="size-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Early Adopter Engagement</h3>
					<p className="text-muted-foreground">
						Connect with your first users, gather valuable feedback, and iterate based on real
						community input.
					</p>
				</Card>

				<Card className="space-y-4 p-6">
					<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
						<TrendingUp className="size-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Scale as You Grow</h3>
					<p className="text-muted-foreground">
						Start small and scale seamlessly. Our infrastructure grows with your startup's success.
					</p>
				</Card>
			</div>
		</div>
	</section>

	<section className="px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<div className="grid items-center gap-12 md:grid-cols-2">
				<div className="space-y-6">
					<h2 className="text-4xl font-bold">Everything You Need to Build Community</h2>
					<p className="text-lg text-muted-foreground">
						Foreum provides all the tools startups need to create, manage, and grow their community
						without breaking the bank.
					</p>
					<ul className="space-y-4">
						<li className="flex gap-3">
							<Check className="size-6 flex-shrink-0 text-primary" />
							<span>Unlimited discussions and threads</span>
						</li>
						<li className="flex gap-3">
							<Check className="size-6 flex-shrink-0 text-primary" />
							<span>Built-in moderation tools</span>
						</li>
						<li className="flex gap-3">
							<Check className="size-6 flex-shrink-0 text-primary" />
							<span>Custom branding and themes</span>
						</li>
						<li className="flex gap-3">
							<Check className="size-6 flex-shrink-0 text-primary" />
							<span>Analytics and insights</span>
						</li>
						<li className="flex gap-3">
							<Check className="size-6 flex-shrink-0 text-primary" />
							<span>Email notifications</span>
						</li>
						<li className="flex gap-3">
							<Check className="size-6 flex-shrink-0 text-primary" />
							<span>API access for integrations</span>
						</li>
					</ul>
				</div>
				<div className="space-y-4 rounded-lg bg-muted/30 p-8">
					<MessageSquare className="h-16 w-16 text-primary" />
					<h3 className="text-2xl font-semibold">Real-Time Feedback Loop</h3>
					<p className="text-muted-foreground">
						Turn your community into your product development team. Get instant feedback on
						features, identify bugs early, and validate ideas before investing resources.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section className="bg-primary px-4 py-20 text-primary-foreground">
		<div className="container mx-auto max-w-4xl space-y-6 text-center">
			<h2 className="text-4xl font-bold">Start Building Your Community Today</h2>
			<p className="text-xl opacity-90">
				Join thousands of startups using Foreum to engage their users and build thriving
				communities.
			</p>
			<div className="flex justify-center gap-4 pt-4">
				<Button size="lg" variant="secondary">Start Free Trial</Button>
				<Button
					size='lg'
					variant="outline"
					className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
				>
					View Pricing
				</Button>
			</div>
		</div>
	</section>
</div>
    )
}
