<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import StatsGrid from '$components/admin/stats-grid.svelte';
	import { MessageSquare, Users, TrendingUp, ListChecks } from '@lucide/svelte';

	const placeholderStats = [
		{
			title: 'Total Users',
			value: '1,245',
			change: { value: '+5.2%', trend: 'up' },
			icon: Users
		},
		{
			title: 'Active Threads',
			value: '427',
			change: { value: '+1.1%', trend: 'up' },
			icon: MessageSquare
		},
		{
			title: 'New Reports',
			value: '12',
			change: { value: '-17%', trend: 'down' },
			icon: ListChecks
		},
		{
			title: 'Engagement Score',
			value: '78%',
			change: { value: '+0.5%', trend: 'up' },
			icon: TrendingUp
		}
	];
</script>

<div class="flex flex-1 flex-col gap-4 py-4 lg:gap-6 lg:py-6">
	<!-- Page intro -->
	<div class="flex items-center justify-between gap-4">
		<div class="space-y-1">
			<h1 class="text-2xl font-semibold">Welcome back, Admin!</h1>
			<p class="text-sm text-muted-foreground">
				Manage your community, users, and reports all in one place.
			</p>
		</div>
		<Button class="px-3">Quick Action</Button>
	</div>

	<!-- Stats -->
	<StatsGrid stats={placeholderStats} />

	<!-- Placeholder for Charts/Activity Feed -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		<div class="md:col-span-2">
			<div class="rounded-xl border p-4">
				<h2 class="text-lg font-semibold">Recent Activity</h2>
				<p class="text-muted-foreground">Placeholder for activity feed or main chart.</p>
			</div>
		</div>
		<div class="lg:col-span-1">
			<div class="rounded-xl border p-4">
				<h2 class="text-lg font-semibold">Top Categories</h2>
				<p class="text-muted-foreground">Placeholder for pie chart or list.</p>
			</div>
		</div>
	</div>
</div>
