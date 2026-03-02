import { createFileRoute } from '@tanstack/react-router'

import { Button } from '~/components/ui/button';
	import { Card} from '~/components/ui/card';
	import { Check, Building2, Shield, Users, BarChart, Lock, Zap } from 'lucide-react';
export const Route = createFileRoute('/_landing/solution/organizations')({
  component: OrganizationSolution,
})

function OrganizationSolution() {
  return (
      <div className="min-h-screen bg-background">
	<section className="px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<div className="space-y-6 text-center">
				<div
					className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
				>
					For Organizations
				</div>
				<h1 className="text-5xl font-bold text-balance md:text-6xl">
					Enterprise-Grade Community<br />Platform
				</h1>
				<p className="mx-auto max-w-2xl text-xl text-pretty text-muted-foreground">
					Empower your organization with a secure, scalable community platform. Perfect for internal
					communication, customer support, and knowledge sharing.
				</p>
				<div className="flex justify-center gap-4 pt-4">
					<Button size="lg" className="bg-primary hover:bg-primary/90">Request Demo</Button>
					<Button size="lg" variant="outline">Contact Sales</Button>
				</div>
			</div>
		</div>
	</section>

	<section className="bg-muted/30 px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<h2 className="mb-12 text-center text-3xl font-bold">Built for Enterprise Needs</h2>
			<div className="grid gap-8 md:grid-cols-3">
				<Card className="space-y-4 p-6">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Shield className="size-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Enterprise Security</h3>
					<p className="text-muted-foreground">
						SOC 2 compliant, SSO integration, advanced permissions, and audit logs for complete
						security control.
					</p>
				</Card>

				<Card className="space-y-4 p-6">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Users className="size-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Unlimited Scale</h3>
					<p className="text-muted-foreground">
						Support thousands of users with guaranteed uptime and performance. Scale without limits.
					</p>
				</Card>

				<Card className="space-y-4 p-6">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<BarChart className="size-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Advanced Analytics</h3>
					<p className="text-muted-foreground">
						Deep insights into community engagement, user behavior, and content performance.
					</p>
				</Card>
			</div>
		</div>
	</section>

	<section className="px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<h2 className="mb-12 text-center text-3xl font-bold">Organizational Use Cases</h2>
			<div className="space-y-12">
				<div className="grid items-center gap-12 md:grid-cols-2">
					<div className="space-y-4">
						<h3 className="text-2xl font-semibold">Internal Communication</h3>
						<p className="text-muted-foreground">
							Replace scattered email threads and chat messages with organized, searchable
							discussions. Keep your entire organization aligned and informed.
						</p>
						<ul className="space-y-2">
							<li className="flex gap-2">
								<Check className="size-5 text-primary" /> Department-specific forums
							</li>
							<li className="flex gap-2">
								<Check className="size-5 text-primary" /> Company announcements
							</li>
							<li className="flex gap-2">
								<Check className="size-5 text-primary" /> Project collaboration spaces
							</li>
							<li className="flex gap-2">
								<Check className="size-5 text-primary" /> Knowledge base integration
							</li>
						</ul>
					</div>
					<Card className="bg-muted/30 p-8">
						<Building2 className="mb-4 size-16 text-primary" />
						<p className="text-lg font-medium">
							"Foreum transformed how our 500+ employee organization communicates. Everything is now
							organized and searchable."
						</p>
						<p className="mt-4 text-sm text-muted-foreground">— Director of Operations, Tech Corp</p>
					</Card>
				</div>

				<div className="grid items-center gap-12 md:grid-cols-2">
					<Card className="bg-muted/30 p-8 md:order-2">
						<Lock className="mb-4 size-16 text-primary" />
						<p className="text-lg font-medium">
							"The security features and compliance certifications gave us confidence to migrate our
							entire support system."
						</p>
						<p className="mt-4 text-sm text-muted-foreground">— CTO, Financial Services</p>
					</Card>
					<div className="space-y-4 md:order-1">
						<h3 className="text-2xl font-semibold">Customer Support Hub</h3>
						<p className="text-muted-foreground">
							Provide exceptional customer support at scale. Let customers help each other while
							your team focuses on complex issues.
						</p>
						<ul className="space-y-2">
							<li className="flex gap-2">
								<Check className="size-5 text-primary" /> Self-service knowledge base
							</li>
							<li className="flex gap-2">
								<Check className="size-5 text-primary" /> Community-powered support
							</li>
							<li className="flex gap-2"><Check className="size-5 text-primary" /> Ticket integration</li>
							<li className="flex gap-2"><Check className="size-5 text-primary" /> Support analytics</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section className="bg-muted/30 px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<h2 className="mb-12 text-center text-3xl font-bold">Enterprise Features</h2>
			<div className="mx-auto grid max-w-4xl gap-x-12 gap-y-4 md:grid-cols-2">
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Single Sign-On (SSO)</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Advanced user permissions</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Custom branding & white-label</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>API access & webhooks</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Dedicated account manager</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>99.9% uptime SLA</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Priority support</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Custom integrations</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Advanced analytics & reporting</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Audit logs & compliance</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Data export & migration tools</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Custom training & onboarding</span>
				</div>
			</div>
		</div>
	</section>

	<section className="bg-primary px-4 py-20 text-primary-foreground">
		<div className="container mx-auto max-w-4xl space-y-6 text-center">
			<h2 className="text-4xl font-bold">Ready to Transform Your Organization?</h2>
			<p className="text-xl opacity-90">
				Schedule a demo with our enterprise team to see how Foreum can work for your organization.
			</p>
			<div className="flex justify-center gap-4 pt-4">
				<Button size="lg" variant="secondary">Request Demo</Button>
				<Button
					size='lg'
					variant="outline"
					className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
				>
					Contact Sales
				</Button>
			</div>
		</div>
	</section>
</div>

      )
}
