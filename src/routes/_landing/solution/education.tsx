import { createFileRoute } from '@tanstack/react-router'

import { Button } from '~/components/ui/button';
	import { Check, GraduationCap, BookOpen, Users, MessageCircle, Award } from 'lucide-react';
import { Card } from '~/components/ui/card';


export const Route = createFileRoute('/_landing/solution/education')({
  component: EducationSolutionPage,
})

function EducationSolutionPage() {
  return (
    
      <div className="min-h-screen bg-background">
	<section className="px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<div className="space-y-6 text-center">
				<div
					className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
				>
					For Students
				</div>
				<h1 className="text-5xl font-bold text-balance md:text-6xl">
					Learn Together,<br />Grow Together
				</h1>
				<p className="mx-auto max-w-2xl text-xl text-pretty text-muted-foreground">
					Create study groups, collaborate on projects, and build a supportive learning community.
					Free for students and educational use.
				</p>
				<div className="flex justify-center gap-4 pt-4">
					<Button size="lg" className="bg-primary hover:bg-primary/90">Get Started Free</Button>
					<Button size="lg" variant="outline">Student Discount</Button>
				</div>
			</div>
		</div>
	</section>

	<section className="bg-muted/30 px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<h2 className="mb-12 text-center text-3xl font-bold">Perfect for Student Life</h2>
			<div className="grid gap-8 md:grid-cols-3">
				<Card className="space-y-4 p-6">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<BookOpen className="h-6 w-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Study Groups</h3>
					<p className="text-muted-foreground">
						Organize study sessions, share notes, and help each other understand difficult concepts.
					</p>
				</Card>

				<Card className="space-y-4 p-6">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Users className="h-6 w-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Project Collaboration</h3>
					<p className="text-muted-foreground">
						Coordinate group projects, assign tasks, and keep everyone on the same page.
					</p>
				</Card>

				<Card className="space-y-4 p-6">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Award className="h-6 w-6 text-primary" />
					</div>
					<h3 className="text-xl font-semibold">Always Free</h3>
					<p className="text-muted-foreground">
						100% free for students with a valid .edu email. No credit card required, ever.
					</p>
				</Card>
			</div>
		</div>
	</section>

	<section className="px-4 py-20">
		<div className="container mx-auto max-w-6xl">
			<h2 className="mb-12 text-center text-3xl font-bold">How Students Use Foreum</h2>
			<div className="grid gap-8 md:grid-cols-2">
				<Card className="space-y-4 p-6">
					<GraduationCap className="h-12 w-12 text-primary" />
					<h3 className="text-xl font-semibold">Course Study Groups</h3>
					<p className="text-muted-foreground">
						Create dedicated spaces for each className. Share lecture notes, discuss homework problems,
						and prepare for exams together.
					</p>
					<ul className="space-y-2 text-sm">
						<li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Homework help threads</li>
						<li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Exam preparation</li>
						<li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Note sharing</li>
					</ul>
				</Card>

				<Card className="space-y-4 p-6">
					<Users className="h-12 w-12 text-primary" />
					<h3 className="text-xl font-semibold">Student Organizations</h3>
					<p className="text-muted-foreground">
						Manage your club or organization with dedicated forums for announcements, event
						planning, and member discussions.
					</p>
					<ul className="space-y-2 text-sm">
						<li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Event coordination</li>
						<li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Member communication</li>
						<li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Resource sharing</li>
					</ul>
				</Card>

				<Card className="space-y-4 p-6">
					<MessageCircle className="h-12 w-12 text-primary" />
					<h3 className="text-xl font-semibold">Research Groups</h3>
					<p className="text-muted-foreground">
						Collaborate on research projects, share findings, and get feedback from peers and
						mentors.
					</p>
					<ul className="space-y-2 text-sm">
						<li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Literature reviews</li>
						<li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Data discussion</li>
						<li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Paper drafts</li>
					</ul>
				</Card>

				<Card className="space-y-4 p-6">
					<BookOpen className="h-12 w-12 text-primary" />
					<h3 className="text-xl font-semibold">Peer Tutoring</h3>
					<p className="text-muted-foreground">
						Offer or receive tutoring help. Build a reputation as a subject expert and help fellow
						students succeed.
					</p>
					<ul className="space-y-2 text-sm">
						<li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Q&A forums</li>
						<li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Tutorial sessions</li>
						<li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Resource libraries</li>
					</ul>
				</Card>
			</div>
		</div>
	</section>

	<section className="bg-muted/30 px-4 py-20">
		<div className="container mx-auto max-w-4xl">
			<Card className="space-y-6 p-12 text-center">
				<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
					<GraduationCap className="h-8 w-8 text-primary" />
				</div>
				<h2 className="text-3xl font-bold">Student Discount Program</h2>
				<p className="text-lg text-muted-foreground">
					Verify your student status with a .edu email and get access to all premium features
					completely free. No time limits, no credit card required.
				</p>
				<div className="pt-4">
					<Button size="lg" className="bg-primary hover:bg-primary/90">Verify Student Status</Button>
				</div>
				<p className="text-sm text-muted-foreground">
					Available to all students with valid educational institution email addresses
				</p>
			</Card>
		</div>
	</section>

	<section className="bg-primary px-4 py-20 text-primary-foreground">
		<div className="container mx-auto max-w-4xl space-y-6 text-center">
			<h2 className="text-4xl font-bold">Start Your Study Community Today</h2>
			<p className="text-xl opacity-90">
				Join thousands of students using Foreum to collaborate, learn, and succeed together.
			</p>
			<Button size="lg" variant="secondary">Get Started Free</Button>
		</div>
	</section>
</div>

    
  )
}
