<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Switch } from '$lib/components/ui/switch';
	import { ToggleLeft, Plus } from '@lucide/svelte';

	let flags = $state([
		{
			name: 'New Thread Editor',
			description: 'Enable the advanced TipTap editor for all users.',
			enabled: true
		},
		{
			name: 'Event System',
			description: 'Allow users to create and RSVP to community events.',
			enabled: false
		},
		{
			name: 'Private Messaging',
			description: 'Enable direct messaging between users.',
			enabled: true
		},
		{
			name: 'Reputation System',
			description: 'Show user reputation scores and badges.',
			enabled: false
		}
	]);

	function toggleFlag(flag: (typeof flags)[number]) {
		flag.enabled = !flag.enabled;
	}
</script>

<div class="space-y-6 p-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold">Feature Flags</h1>
		<Button variant="outline">
			<Plus class="mr-2 size-4" /> Add Flag
		</Button>
	</div>
	<p class="text-sm text-muted-foreground">
		Control experimental and optional features across the platform.
	</p>

	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center gap-2">
				<ToggleLeft class="size-5" /> Feature Toggles
			</Card.Title>
		</Card.Header>
		<Card.Content class="divide-y">
			{#each flags as flag}
				<div class="flex items-center justify-between py-4">
					<div>
						<p class="font-medium">{flag.name}</p>
						<p class="text-sm text-muted-foreground">{flag.description}</p>
					</div>
					<Switch checked={flag.enabled} on:click={() => toggleFlag(flag)} />
				</div>
			{/each}
		</Card.Content>
	</Card.Root>
</div>
