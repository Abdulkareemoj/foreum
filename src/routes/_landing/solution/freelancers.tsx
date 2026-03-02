import { createFileRoute } from '@tanstack/react-router'

import { Button } from '~/components/ui/button';
  import { Check, GraduationCap, BookOpen, Users, MessageCircle, Award, Briefcase, DollarSign, Star } from 'lucide-react';
import { Card } from '~/components/ui/card';


export const Route = createFileRoute('/_landing/solution/freelancers')({
  component: FreelancersSolution,
})

function FreelancersSolution() {
  return (
    
      <div className="min-h-screen bg-background">
	<section className="px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<div className="space-y-6 text-center">
				<div
					className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
				>
					For Freelancers
				</div>
				<h1 className="text-5xl font-bold text-balance md:text-6xl">
					Build Your Personal Brand<br />With Community
				</h1>
				<p className="mx-auto max-w-2xl text-xl text-pretty text-muted-foreground">
					Create a dedicated space for your clients, showcase your expertise, and build a community
					around your freelance services.
				</p>
				<div className="flex justify-center gap-4 pt-4">
					<Button size="lg" className="bg-primary hover:bg-primary/90">Get Started Free</Button>
					<Button size="lg" variant="outline">See Examples</Button>
				</div>
			</div>
		</div>
	</section>

	<section className="bg-muted/30 px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<h2 className="mb-12 text-center text-3xl font-bold">Perfect for Independent Professionals</h2>
			<div className="grid gap-8 md:grid-cols-3">
				<Card className="space-y-4 p-6">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Briefcase className="h-6 w-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Client Portal</h3>
					<p className="text-muted-foreground">
						Create a private space for client communication, project updates, and file sharing.
					</p>
				</Card>

				<Card className="space-y-4 p-6">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Star className="h-6 w-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Showcase Expertise</h3>
					<p className="text-muted-foreground">
						Share insights, tutorials, and case studies to demonstrate your skills and attract new
						clients.
					</p>
				</Card>

				<Card className="space-y-4 p-6">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<DollarSign className="h-6 w-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Affordable Pricing</h3>
					<p className="text-muted-foreground">
						Professional features at freelancer-friendly prices. No enterprise costs, just what you
						need.
					</p>
				</Card>
			</div>
		</div>
	</section>

	<section className="px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<h2 className="mb-12 text-center text-3xl font-bold">How Freelancers Use Foreum</h2>
			<div className="grid gap-8 md:grid-cols-2">
				<Card className="space-y-4 p-6">
					<h3 className="text-xl font-semibold">Designers & Creatives</h3>
					<p className="text-muted-foreground">
						Share work-in-progress, gather client feedback, and build a portfolio community that
						showcases your creative process.
					</p>
					<ul className="space-y-2 text-sm text-muted-foreground">
						<li className="flex gap-2">
							<Check className="size-4 text-primary" /> Client feedback threads
						</li>
						<li className="flex gap-2">
							<Check className="size-4 text-primary" /> Design showcase galleries
						</li>
						<li className="flex gap-2"><Check className="size-4 text-primary" /> Revision tracking</li>
					</ul>
				</Card>

				<Card className="space-y-4 p-6">
					<h3 className="text-xl font-semibold">Developers & Consultants</h3>
					<p className="text-muted-foreground">
						Provide technical support, share code snippets, and maintain documentation for your
						clients in one organized place.
					</p>
					<ul className="space-y-2 text-sm text-muted-foreground">
						<li className="flex gap-2"><Check className="size-4 text-primary" /> Technical Q&A forums</li>
						<li className="flex gap-2"><Check className="size-4 text-primary" /> Code snippet sharing</li>
						<li className="flex gap-2"><Check className="size-4 text-primary" /> Project documentation</li>
					</ul>
				</Card>

				<Card className="space-y-4 p-6">
					<h3 className="text-xl font-semibold">Writers & Content Creators</h3>
					<p className="text-muted-foreground">
						Build an audience, share exclusive content, and engage with readers in a dedicated
						community space.
					</p>
					<ul className="space-y-2 text-sm text-muted-foreground">
						<li className="flex gap-2">
							<Check className="size-4 text-primary" /> Exclusive content threads
						</li>
						<li className="flex gap-2"><Check className="size-4 text-primary" /> Reader discussions</li>
						<li className="flex gap-2"><Check className="size-4 text-primary" /> Writing workshops</li>
					</ul>
				</Card>

				<Card className="space-y-4 p-6">
					<h3 className="text-xl font-semibold">Coaches & Educators</h3>
					<p className="text-muted-foreground">
						Create a learning community, share resources, and provide ongoing support to your
						students and clients.
					</p>
					<ul className="space-y-2 text-sm text-muted-foreground">
						<li className="flex gap-2"><Check className="size-4 text-primary" /> Course discussions</li>
						<li className="flex gap-2"><Check className="size-4 text-primary" /> Resource libraries</li>
						<li className="flex gap-2">
							<Check className="size-4 text-primary" /> Student support forums
						</li>
					</ul>
				</Card>
			</div>
		</div>
	</section>

	<section className="bg-primary px-4 py-20 text-primary-foreground">
		<div className="container mx-auto max-w-4xl space-y-6 text-center">
			<h2 className="text-4xl font-bold">Ready to Elevate Your Freelance Business?</h2>
			<p className="text-xl opacity-90">
				Start building your professional community today. No credit card required.
			</p>
			<Button size="lg" variant="secondary">Start Free Trial</Button>
		</div>
	</section>
</div>

    
  )
}
