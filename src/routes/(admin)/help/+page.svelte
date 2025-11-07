<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { LifeBuoy, BookOpen, MessageCircle } from '@lucide/svelte';
</script>

<div class="space-y-6 p-6">
	<h1 class="text-2xl font-semibold">Help & Support</h1>
	<p class="text-sm text-muted-foreground">
		Resources for managing and troubleshooting your forum.
	</p>

	<div class="grid gap-6 md:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<BookOpen class="size-5" /> Documentation
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<p class="text-muted-foreground">Access detailed guides and API documentation.</p>
				<a href="/docs" class="mt-3 inline-block text-primary hover:underline">Go to Docs →</a>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<MessageCircle class="size-5" /> Contact Support
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<p class="text-muted-foreground">Submit a ticket for technical assistance.</p>
				<a href="mailto:support@foreum.com" class="mt-3 inline-block text-primary hover:underline"
					>Email Support →</a
				>
			</Card.Content>
		</Card.Root>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center gap-2">
				<LifeBuoy class="size-5" /> System Status
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<p class="font-medium text-green-500">All systems operational.</p>
			<p class="text-sm text-muted-foreground">Last checked: {new Date().toLocaleTimeString()}</p>
		</Card.Content>
	</Card.Root>
</div>
