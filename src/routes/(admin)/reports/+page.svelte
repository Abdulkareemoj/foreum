<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { ListChecks, MessageSquare, Trash2 } from '@lucide/svelte';

	let activeTab = $state('pending');

	const pendingReports = [
		{
			id: 1,
			type: 'Thread',
			target: 'Why is SvelteKit so fast?',
			reason: 'Spam/Promotion',
			reporter: 'user1'
		},
		{
			id: 2,
			type: 'Reply',
			target: 'Reply to Thread #123',
			reason: 'Hate Speech',
			reporter: 'user2'
		}
	];

	const resolvedReports = [
		{
			id: 3,
			type: 'Thread',
			target: 'Old Bug Report',
			reason: 'Resolved by Admin',
			reporter: 'user3'
		}
	];

	function resolveReport(id: number) {
		alert(`Resolving report ${id}`);
	}
</script>

<div class="space-y-6 p-6">
	<h1 class="text-2xl font-semibold">Content Reports</h1>
	<p class="text-sm text-muted-foreground">Manage user-submitted reports on threads and replies.</p>

	<Tabs.Root bind:value={activeTab}>
		<Tabs.List class="mb-4">
			<Tabs.Trigger value="pending">Pending ({pendingReports.length})</Tabs.Trigger>
			<Tabs.Trigger value="resolved">Resolved ({resolvedReports.length})</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="pending">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<ListChecks class="size-5" /> Pending Review
					</Card.Title>
				</Card.Header>
				<Card.Content class="divide-y">
					{#if pendingReports.length === 0}
						<div class="py-4 text-sm text-muted-foreground">No pending reports.</div>
					{:else}
						{#each pendingReports as report}
							<div class="flex items-center justify-between py-3">
								<div class="space-y-1">
									<p class="font-medium">{report.type} Report: {report.target}</p>
									<p class="text-sm text-red-500">Reason: {report.reason}</p>
									<p class="text-xs text-muted-foreground">Reported by: {report.reporter}</p>
								</div>
								<Button size="sm" on:click={() => resolveReport(report.id)}>Resolve</Button>
							</div>
						{/each}
					{/if}
				</Card.Content>
			</Card.Root>
		</Tabs.Content>

		<Tabs.Content value="resolved">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<MessageSquare class="size-5" /> Resolved Reports
					</Card.Title>
				</Card.Header>
				<Card.Content class="divide-y">
					{#if resolvedReports.length === 0}
						<div class="py-4 text-sm text-muted-foreground">No resolved reports.</div>
					{:else}
						{#each resolvedReports as report}
							<div class="flex items-center justify-between py-3">
								<div class="space-y-1">
									<p class="font-medium">{report.type} Report: {report.target}</p>
									<p class="text-sm text-green-500">Status: Resolved</p>
									<p class="text-xs text-muted-foreground">Reported by: {report.reporter}</p>
								</div>
								<Button size="sm" variant="ghost" disabled>View Log</Button>
							</div>
						{/each}
					{/if}
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>
