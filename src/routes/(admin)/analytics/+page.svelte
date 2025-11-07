<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { BarChart3, Users } from '@lucide/svelte';
</script>

<div class="space-y-6 p-6">
	<h1 class="text-2xl font-semibold">Community Analytics</h1>
	<p class="text-sm text-muted-foreground">
		Track user growth, engagement, and content performance.
	</p>

	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<Input class="w-full md:w-1/3" placeholder="Filter by date range..." />
		<Select.Root>
			<Select.Trigger placeholder="Select Metric" />
			<Select.Content>
				<Select.Item value="users">New Users</Select.Item>
				<Select.Item value="threads">New Threads</Select.Item>
				<Select.Item value="replies">Total Replies</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center gap-2">
				<Users class="size-5" /> User Growth Over Time
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="flex h-64 w-full items-center justify-center text-muted-foreground">
				[Placeholder: Area Chart Component]
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center gap-2">
				<BarChart3 class="size-5" /> Top Categories by Activity
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="flex h-64 w-full items-center justify-center text-muted-foreground">
				[Placeholder: Bar Chart Component]
			</div>
		</Card.Content>
	</Card.Root>
</div>
