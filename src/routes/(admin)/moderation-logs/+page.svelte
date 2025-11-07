<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { History, User, Trash2 } from '@lucide/svelte';

	const logs = [
		{
			id: 1,
			action: 'Ban User',
			target: 'johndoe',
			moderator: 'Admin',
			reason: 'Spamming links',
			date: '2024-01-15'
		},
		{
			id: 2,
			action: 'Delete Thread',
			target: 'Thread #123',
			moderator: 'Moderator',
			reason: 'Off-topic',
			date: '2024-01-14'
		},
		{
			id: 3,
			action: 'Pin Thread',
			target: 'Thread #456',
			moderator: 'Admin',
			reason: 'Important announcement',
			date: '2024-01-13'
		}
	];
</script>

<div class="space-y-6 p-6">
	<h1 class="text-2xl font-semibold">Moderation Logs</h1>
	<p class="text-sm text-muted-foreground">
		Review all actions taken by administrators and moderators.
	</p>

	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<Input class="w-full md:w-1/3" placeholder="Search by moderator or target..." />
		<Select.Root>
			<Select.Trigger placeholder="Filter by action" />
			<Select.Content>
				<Select.Item value="ban">Ban User</Select.Item>
				<Select.Item value="delete">Delete Content</Select.Item>
				<Select.Item value="pin">Pin/Lock</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center gap-2">
				<History class="size-5" /> Recent Actions
			</Card.Title>
		</Card.Header>
		<Card.Content class="divide-y">
			{#each logs as log}
				<div class="flex items-center justify-between py-3">
					<div class="flex items-center gap-3">
						{#if log.action.includes('Ban')}
							<User class="size-4 text-red-500" />
						{:else if log.action.includes('Delete')}
							<Trash2 class="size-4 text-orange-500" />
						{:else}
							<History class="size-4 text-blue-500" />
						{/if}
						<div>
							<p class="font-medium">{log.action} on {log.target}</p>
							<p class="text-xs text-muted-foreground">By {log.moderator} - {log.reason}</p>
						</div>
					</div>
					<span class="text-xs text-muted-foreground">{log.date}</span>
				</div>
			{/each}
		</Card.Content>
	</Card.Root>
</div>
