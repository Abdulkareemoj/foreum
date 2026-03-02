import { createFileRoute } from '@tanstack/react-router'

import { Button } from '~/components/ui/button';
	import { Card} from '~/components/ui/card';
	import {  Check, Palette, Image, MessageCircle, Users, Eye, Sparkles} from 'lucide-react';

export const Route = createFileRoute('/_landing/solution/design')({
  component: DesignSolution,
})

function DesignSolution() {
  return (
      <div className="min-h-screen bg-background">
	<section className="px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<div className="space-y-6 text-center">
				<div
					className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
				>
					For Design Teams
				</div>
				<h1 className="text-5xl font-bold text-balance md:text-6xl">
					Design Feedback<br />Made Simple
				</h1>
				<p className="mx-auto max-w-2xl text-xl text-pretty text-muted-foreground">
					Centralize design feedback, iterate faster, and keep stakeholders aligned. The perfect
					platform for design collaboration and critique.
				</p>
				<div className="flex justify-center gap-4 pt-4">
					<Button size="lg" className="bg-primary hover:bg-primary/90">Start Free Trial</Button>
					<Button size="lg" variant="outline">View Examples</Button>
				</div>
			</div>
		</div>
	</section>

	<section className="bg-muted/30 px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<h2 className="mb-12 text-center text-3xl font-bold">Built for Design Workflows</h2>
			<div className="grid gap-8 md:grid-cols-3">
				<Card className="space-y-4 p-6">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Eye className="size-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Visual Feedback</h3>
					<p className="text-muted-foreground">
						Share designs and gather contextual feedback in organized threads. Keep all feedback in
						one place.
					</p>
				</Card>

				<Card className="space-y-4 p-6">
					<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
						<Users className="h-6 w-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Stakeholder Alignment</h3>
					<p className="text-muted-foreground">
						Keep clients, developers, and team members aligned with clear communication and version
						history.
					</p>
				</Card>

				<Card className="space-y-4 p-6">
					<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
						<Sparkles className="size-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Design System Hub</h3>
					<p className="text-muted-foreground">
						Document your design system, share components, and maintain consistency across projects.
					</p>
				</Card>
			</div>
		</div>
	</section>

	<section className="px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<h2 className="mb-12 text-center text-3xl font-bold">How Design Teams Use Foreum</h2>
			<div className="space-y-12">
				<div className="grid items-center gap-12 md:grid-cols-2">
					<div className="space-y-4">
						<h3 className="text-2xl font-semibold">Design Critiques</h3>
						<p className="text-muted-foreground">
							Share work-in-progress designs and get structured feedback from your team. Keep
							critique sessions organized and actionable.
						</p>
						<ul className="space-y-2">
							<li className="flex gap-2">
								<Check className="size-5 text-primary" /> Organized feedback threads
							</li>
							<li className="flex gap-2"><Check className="size-5 text-primary" /> Version comparison</li>
							<li className="flex gap-2">
								<Check className="size-5 text-primary" /> Action item tracking
							</li>
							<li className="flex gap-2">
								<Check className="size-5 text-primary" /> Design rationale documentation
							</li>
						</ul>
					</div>
					<Card className="bg-muted/30 p-8">
						<Image className="mb-4 size-16 text-primary" />
						<p className="text-lg font-medium">
							"Foreum transformed our design review process. Feedback is now organized, actionable,
							and easy to track."
						</p>
						<p className="mt-4 text-sm text-muted-foreground">— Lead Designer, Creative Agency</p>
					</Card>
				</div>

				<div className="grid items-center gap-12 md:grid-cols-2">
					<Card className="bg-muted/30 p-8 md:order-2">
						<MessageCircle className="mb-4 size-16 text-primary" />
						<p className="text-lg font-medium">
							"Client feedback is finally organized. No more scattered emails and lost comments."
						</p>
						<p className="mt-4 text-sm text-muted-foreground">— Design Director, Studio</p>
					</Card>
					<div className="space-y-4 md:order-1">
						<Users className=" size-12 text-primary" />
						<h3 className="text-2xl font-semibold">Client Collaboration</h3>
						<p className="text-muted-foreground">
							Create private spaces for client projects. Share designs, gather feedback, and keep
							all communication in one organized place.
						</p>
						<ul className="space-y-2">
							<li className="flex gap-2">
								<Check className="size-5 text-primary" /> Private client portals
							</li>
							<li className="flex gap-2"><Check className="size-5 text-primary" /> Revision tracking</li>
							<li className="flex gap-2"><Check className="size-5 text-primary" /> Approval workflows</li>
							<li className="flex gap-2"><Check className="size-5 text-primary" /> File attachments</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section className="bg-muted/30 px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<h2 className="mb-12 text-center text-3xl font-bold">Design-Focused Features</h2>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card className="space-y-3 p-6">
					<h3 className="font-semibold">Image Attachments</h3>
					<p className="text-sm text-muted-foreground">
						Share designs directly in threads with full-resolution image support.
					</p>
				</Card>
				<Card className="space-y-3 p-6">
					<h3 className="font-semibold">Version History</h3>
					<p className="text-sm text-muted-foreground">
						Track design iterations and compare versions side-by-side.
					</p>
				</Card>
				<Card className="space-y-3 p-6">
					<h3 className="font-semibold">Threaded Comments</h3>
					<p className="text-sm text-muted-foreground">
						Keep feedback organized with nested comment threads.
					</p>
				</Card>
				<Card className="space-y-3 p-6">
					<h3 className="font-semibold">Tag System</h3>
					<p className="text-sm text-muted-foreground">
						Organize designs by project, status, or component type.
					</p>
				</Card>
				<Card className="space-y-3 p-6">
					<h3 className="font-semibold">Private Spaces</h3>
					<p className="text-sm text-muted-foreground">
						Create client-specific or project-specific private forums.
					</p>
				</Card>
				<Card className="space-y-3 p-6">
					<h3 className="font-semibold">Custom Branding</h3>
					<p className="text-sm text-muted-foreground">
						White-label the platform to match your brand identity.
					</p>
				</Card>
			</div>
		</div>
	</section>

	<section className="bg-primary px-4 py-20 text-primary-foreground">
		<div className="container mx-auto max-w-4xl space-y-6 text-center">
			<h2 className="text-4xl font-bold">Elevate Your Design Process</h2>
			<p className="text-xl opacity-90">
				Join design teams who've streamlined their feedback and collaboration with Foreum.
			</p>
			<Button size="lg" variant="secondary">Start Free Trial</Button>
		</div>
	</section>
</div>

      )
}
