import { createFileRoute } from '@tanstack/react-router'
	import { Button } from '~/components/ui/button';
	import {Card }from '~/components/ui/card';
import { Check, BarChart, Users, Target, TrendingUp, Shield, Zap } from 'lucide-react';
;
export const Route = createFileRoute('/_landing/solution/management')({
  component: ManagementSolution,
})

function ManagementSolution() {
  return (
      <div className="min-h-screen bg-background">
	<section className="px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<div className="space-y-6 text-center">
				<div
					className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
				>
					For Management
				</div>
				<h1 className="text-5xl font-bold text-balance md:text-6xl">
					Lead With Transparency<br />And Clarity
				</h1>
				<p className="mx-auto max-w-2xl text-xl text-pretty text-muted-foreground">
					Empower your management team with tools for transparent communication, decision tracking,
					and team alignment. Keep everyone informed and engaged.
				</p>
				<div className="flex justify-center gap-4 pt-4">
					<Button size="lg" className="bg-primary hover:bg-primary/90">Request Demo</Button>
					<Button size="lg" variant="outline">Learn More</Button>
				</div>
			</div>
		</div>
	</section>

	<section className="bg-muted/30 px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<h2 className="mb-12 text-center text-3xl font-bold">Management Tools That Work</h2>
			<div className="grid gap-8 md:grid-cols-3">
				<Card className="space-y-4 p-6">
					<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
						<Target className="size-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Strategic Alignment</h3>
					<p className="text-muted-foreground">
						Keep teams aligned on goals, priorities, and strategic initiatives with transparent
						communication.
					</p>
				</Card>

				<Card className="space-y-4 p-6">
					<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
						<BarChart className="size-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Decision Tracking</h3>
					<p className="text-muted-foreground">
						Document decisions, track outcomes, and maintain institutional knowledge for future
						reference.
					</p>
				</Card>

				<Card className="space-y-4 p-6">
					<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
						<Users className="size-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Team Engagement</h3>
					<p className="text-muted-foreground">
						Foster open communication and gather feedback from all levels of your organization.
					</p>
				</Card>
			</div>
		</div>
	</section>

	<section className="px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<h2 className="mb-12 text-center text-3xl font-bold">Management Use Cases</h2>
			<div className="space-y-12">
				<div className="grid items-center gap-12 md:grid-cols-2">
					<div className="space-y-4">
						<h3 className="text-2xl font-semibold">Company-Wide Communication</h3>
						<p className="text-muted-foreground">
							Share announcements, updates, and strategic initiatives with your entire organization.
							Keep everyone informed and aligned.
						</p>
						<ul className="space-y-2">
							<li className="flex gap-2">
								<Check className="size-5 text-primary" /> Company announcements
							</li>
							<li className="flex gap-2">
								<Check className="size-5 text-primary" /> Town hall discussions
							</li>
							<li className="flex gap-2"><Check className="size-5 text-primary" /> Policy updates</li>
							<li className="flex gap-2"><Check className="size-5 text-primary" /> Q&A with leadership</li>
						</ul>
					</div>
					<Card className="bg-muted/30 p-8">
						<TrendingUp className="mb-4 size-16 text-primary" />
						<p className="text-lg font-medium">
							"Foreum helped us scale our communication as we grew from 50 to 500 employees.
							Everyone stays informed."
						</p>
						<p className="mt-4 text-sm text-muted-foreground">— VP of Operations, Tech Company</p>
					</Card>
				</div>

				<div className="grid items-center gap-12 md:grid-cols-2">
					<Card className="bg-muted/30 p-8 md:order-2">
						<Shield className="mb-4 size-16 text-primary" />
						<p className="text-lg font-medium">
							"The audit trail and decision documentation features are invaluable for compliance and
							governance."
						</p>
						<p className="mt-4 text-sm text-muted-foreground">— Chief Compliance Officer</p>
					</Card>
					<div className="space-y-4 md:order-1">
						<h3 className="text-2xl font-semibold">Decision Documentation</h3>
						<p className="text-muted-foreground">
							Create a permanent record of important decisions, the reasoning behind them, and their
							outcomes. Essential for compliance and institutional knowledge.
						</p>
						<ul className="space-y-2">
							<li className="flex gap-2"><Check className="size-5 text-primary" /> Decision logs</li>
							<li className="flex gap-2">
								<Check className="size-5 text-primary" /> Stakeholder input tracking
							</li>
							<li className="flex gap-2"><Check className="size-5 text-primary" /> Outcome monitoring</li>
							<li className="flex gap-2"><Check className="size-5 text-primary" /> Audit trails</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section className="bg-muted/30 px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<h2 className="mb-12 text-center text-3xl font-bold">Management Features</h2>
			<div className="mx-auto grid max-w-4xl gap-x-12 gap-y-4 md:grid-cols-2">
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Announcement pinning and highlighting</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Read receipts and engagement tracking</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Department-specific forums</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Anonymous feedback options</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Polls and surveys</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Analytics and insights</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Role-based permissions</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Moderation tools</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Email digest notifications</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Search and archive</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Integration with existing tools</span>
				</div>
				<div className="flex gap-3">
					<Check className="size-6 flex-shrink-0 text-primary" />
					<span>Custom branding</span>
				</div>
			</div>
		</div>
	</section>

	<section className="px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<div className="mb-12 text-center">
				<h2 className="mb-4 text-3xl font-bold">Measurable Impact</h2>
				<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
					Organizations using Foreum report significant improvements in communication and
					engagement.
				</p>
			</div>
			<div className="grid gap-8 md:grid-cols-3">
				<Card className="p-8 text-center">
					<div className="mb-2 text-4xl font-bold text-primary">60%</div>
					<p className="text-muted-foreground">Reduction in email volume</p>
				</Card>
				<Card className="p-8 text-center">
					<div className="mb-2 text-4xl font-bold text-primary">3x</div>
					<p className="text-muted-foreground">Increase in employee engagement</p>
				</Card>
				<Card className="p-8 text-center">
					<div className="mb-2 text-4xl font-bold text-primary">85%</div>
					<p className="text-muted-foreground">Better information retention</p>
				</Card>
			</div>
		</div>
	</section>

	<section className="bg-primary px-4 py-20 text-primary-foreground">
		<div className="container mx-auto max-w-4xl space-y-6 text-center">
			<h2 className="text-4xl font-bold">Transform Your Management Communication</h2>
			<p className="text-xl opacity-90">
				See how Foreum can help your leadership team communicate more effectively and build a more
				engaged organization.
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
