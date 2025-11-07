<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Switch } from '$lib/components/ui/switch';
	import { Plus, Speaker } from '@lucide/svelte';

	let announcements = [
		{
			id: 1,
			title: 'Welcome to Foreum Admin!',
			content: 'Check out the new dashboard.',
			active: true
		},
		{
			id: 2,
			title: 'Maintenance Scheduled',
			content: 'Server downtime next Tuesday.',
			active: false
		}
	];
</script>

<div class="space-y-6 p-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold">Announcements</h1>
		<Button>
			<Plus class="mr-2 size-4" /> New Announcement
		</Button>
	</div>
	<p class="text-sm text-muted-foreground">Manage global messages displayed to all users.</p>

	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center gap-2">
				<Speaker class="size-5" /> Active Announcements
			</Card.Title>
		</Card.Header>
		<Card.Content class="divide-y">
			{#each announcements as ann}
				<div class="flex items-center justify-between py-4">
					<div class="space-y-1">
						<p class="font-medium">{ann.title}</p>
						<p class="text-sm text-muted-foreground">{ann.content}</p>
					</div>
					<Switch checked={ann.active} />
				</div>
			{/each}
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Create New</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-4">
			<Input placeholder="Title" />
			<Textarea placeholder="Content" rows={3} />
			<div class="flex justify-end">
				<Button>Publish</Button>
			</div>
		</Card.Content>
	</Card.Root>
</div>
