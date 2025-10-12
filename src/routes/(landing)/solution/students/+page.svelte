<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Check, GraduationCap, BookOpen, Users, MessageCircle, Award } from '@lucide/svelte';
</script>

<div class="min-h-screen bg-background">
	<section class="px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<div class="space-y-6 text-center">
				<div
					class="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
				>
					For Students
				</div>
				<h1 class="text-5xl font-bold text-balance md:text-6xl">
					Learn Together,<br />Grow Together
				</h1>
				<p class="mx-auto max-w-2xl text-xl text-pretty text-muted-foreground">
					Create study groups, collaborate on projects, and build a supportive learning community.
					Free for students and educational use.
				</p>
				<div class="flex justify-center gap-4 pt-4">
					<Button size="lg" class="bg-primary hover:bg-primary/90">Get Started Free</Button>
					<Button size="lg" variant="outline">Student Discount</Button>
				</div>
			</div>
		</div>
	</section>

	<section class="bg-muted/30 px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<h2 class="mb-12 text-center text-3xl font-bold">Perfect for Student Life</h2>
			<div class="grid gap-8 md:grid-cols-3">
				<Card.Root class="space-y-4 p-6">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<BookOpen class="h-6 w-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold">Study Groups</h3>
					<p class="text-muted-foreground">
						Organize study sessions, share notes, and help each other understand difficult concepts.
					</p>
				</Card.Root>

				<Card.Root class="space-y-4 p-6">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Users class="h-6 w-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold">Project Collaboration</h3>
					<p class="text-muted-foreground">
						Coordinate group projects, assign tasks, and keep everyone on the same page.
					</p>
				</Card.Root>

				<Card.Root class="space-y-4 p-6">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Award class="h-6 w-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold">Always Free</h3>
					<p class="text-muted-foreground">
						100% free for students with a valid .edu email. No credit card required, ever.
					</p>
				</Card.Root>
			</div>
		</div>
	</section>

	<section class="px-4 py-20">
		<div class="container mx-auto max-w-6xl">
			<h2 class="mb-12 text-center text-3xl font-bold">How Students Use Foreum</h2>
			<div class="grid gap-8 md:grid-cols-2">
				<Card.Root class="space-y-4 p-6">
					<GraduationCap class="h-12 w-12 text-primary" />
					<h3 class="text-xl font-semibold">Course Study Groups</h3>
					<p class="text-muted-foreground">
						Create dedicated spaces for each class. Share lecture notes, discuss homework problems,
						and prepare for exams together.
					</p>
					<ul class="space-y-2 text-sm">
						<li class="flex gap-2"><Check class="h-4 w-4 text-primary" /> Homework help threads</li>
						<li class="flex gap-2"><Check class="h-4 w-4 text-primary" /> Exam preparation</li>
						<li class="flex gap-2"><Check class="h-4 w-4 text-primary" /> Note sharing</li>
					</ul>
				</Card.Root>

				<Card.Root class="space-y-4 p-6">
					<Users class="h-12 w-12 text-primary" />
					<h3 class="text-xl font-semibold">Student Organizations</h3>
					<p class="text-muted-foreground">
						Manage your club or organization with dedicated forums for announcements, event
						planning, and member discussions.
					</p>
					<ul class="space-y-2 text-sm">
						<li class="flex gap-2"><Check class="h-4 w-4 text-primary" /> Event coordination</li>
						<li class="flex gap-2"><Check class="h-4 w-4 text-primary" /> Member communication</li>
						<li class="flex gap-2"><Check class="h-4 w-4 text-primary" /> Resource sharing</li>
					</ul>
				</Card.Root>

				<Card.Root class="space-y-4 p-6">
					<MessageCircle class="h-12 w-12 text-primary" />
					<h3 class="text-xl font-semibold">Research Groups</h3>
					<p class="text-muted-foreground">
						Collaborate on research projects, share findings, and get feedback from peers and
						mentors.
					</p>
					<ul class="space-y-2 text-sm">
						<li class="flex gap-2"><Check class="h-4 w-4 text-primary" /> Literature reviews</li>
						<li class="flex gap-2"><Check class="h-4 w-4 text-primary" /> Data discussion</li>
						<li class="flex gap-2"><Check class="h-4 w-4 text-primary" /> Paper drafts</li>
					</ul>
				</Card.Root>

				<Card.Root class="space-y-4 p-6">
					<BookOpen class="h-12 w-12 text-primary" />
					<h3 class="text-xl font-semibold">Peer Tutoring</h3>
					<p class="text-muted-foreground">
						Offer or receive tutoring help. Build a reputation as a subject expert and help fellow
						students succeed.
					</p>
					<ul class="space-y-2 text-sm">
						<li class="flex gap-2"><Check class="h-4 w-4 text-primary" /> Q&A forums</li>
						<li class="flex gap-2"><Check class="h-4 w-4 text-primary" /> Tutorial sessions</li>
						<li class="flex gap-2"><Check class="h-4 w-4 text-primary" /> Resource libraries</li>
					</ul>
				</Card.Root>
			</div>
		</div>
	</section>

	<section class="bg-muted/30 px-4 py-20">
		<div class="container mx-auto max-w-4xl">
			<Card.Root class="space-y-6 p-12 text-center">
				<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
					<GraduationCap class="h-8 w-8 text-primary" />
				</div>
				<h2 class="text-3xl font-bold">Student Discount Program</h2>
				<p class="text-lg text-muted-foreground">
					Verify your student status with a .edu email and get access to all premium features
					completely free. No time limits, no credit card required.
				</p>
				<div class="pt-4">
					<Button size="lg" class="bg-primary hover:bg-primary/90">Verify Student Status</Button>
				</div>
				<p class="text-sm text-muted-foreground">
					Available to all students with valid educational institution email addresses
				</p>
			</Card.Root>
		</div>
	</section>

	<section class="bg-primary px-4 py-20 text-primary-foreground">
		<div class="container mx-auto max-w-4xl space-y-6 text-center">
			<h2 class="text-4xl font-bold">Start Your Study Community Today</h2>
			<p class="text-xl opacity-90">
				Join thousands of students using Foreum to collaborate, learn, and succeed together.
			</p>
			<Button size="lg" variant="secondary">Get Started Free</Button>
		</div>
	</section>
</div>
