<script lang="ts">
	import {
		CalendarIcon,
		ClockIcon,
		GridIcon,
		ListIcon,
		Plus,
		PlusIcon,
		Search,
		SearchIcon,
		SlidersHorizontal,
		SlidersHorizontalIcon,
		TrendingUpIcon
	} from '@lucide/svelte';

	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import * as Select from '$components/ui/select';
	import * as Tabs from '$lib/components/ui/tabs';

	import ThreadCardView from './ThreadCardList.svelte';
	import { Skeleton } from '$components/ui/skeleton';

	let {
		threads = [],
		categories = [],
		isLoading = false,
		searchQuery = $bindable(''),
		categoryFilter = $bindable('all'),
		sortBy = $bindable('popular'),
		onLoadMore = () => {}
	}: {
		threads?: any[];
		categories?: any[];
		isLoading?: boolean;
		searchQuery?: string;
		categoryFilter?: string;
		sortBy?: string;
		onLoadMore?: () => void;
	} = $props();
</script>

<div class="h-full flex-1">
	<!-- Header with Tabs -->
	<div class="border-b border-border bg-background">
		<div class="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
			<div class="flex w-full items-center gap-2">
				<Button variant="outline" size="sm" class="flex items-center gap-2">
					<GridIcon class="size-4" />
					Card View
				</Button>
				<Button variant="ghost" size="sm">
					<SlidersHorizontalIcon class="size-4" />
				</Button>
				<Select.Root type="single" bind:value={categoryFilter}>
					<Select.Trigger class="flex-1 sm:w-48 sm:flex-none">
						{categoryFilter === 'all' ? 'All Categories' : categoryFilter}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="all">All Categories</Select.Item>
						{#each categories as category}
							<Select.Item value={category.id}>{category.name}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<Tabs.Root value={sortBy} onValueChange={(value) => (sortBy = value)}>
				<div class=" flex items-center justify-between">
					<Tabs.List
						class="relative w-full rounded-none border-b bg-background p-0 sm:max-w-screen-sm "
					>
						<Tabs.Trigger
							value="popular"
							class="h-full rounded-none border-0 border-b-2 border-transparent bg-background text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground dark:data-[state=active]:border-primary"
						>
							<TrendingUpIcon class="size-4" />
							Popular
						</Tabs.Trigger>
						<Tabs.Trigger
							value="recent"
							class="h-full rounded-none border-0 border-b-2 border-transparent bg-background text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground dark:data-[state=active]:border-primary"
						>
							<ClockIcon class="size-4" />
							New
						</Tabs.Trigger>
						<Tabs.Trigger
							value="oldest"
							class="h-full rounded-none border-0 border-b-2 border-transparent bg-background text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground dark:data-[state=active]:border-primary"
						>
							<CalendarIcon class="size-4" />
							Oldest
						</Tabs.Trigger>
					</Tabs.List>
				</div>
			</Tabs.Root>
		</div>
	</div>

	<!-- Content Area -->
	<div class="p-4">
		{#if isLoading}
			<div class="space-y-4">
				{#each Array(5) as _, i}
					<Card.Root>
						<Card.Content class="p-4">
							<div class="flex gap-4">
								<Skeleton class="h-20 w-12 rounded" />
								<div class="flex-1 space-y-2">
									<Skeleton class="h-4 w-3/4 rounded" />
									<Skeleton class="h-3 w-1/2 rounded" />
									<Skeleton class="h-3 w-1/4 rounded" />
								</div>
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>
		{:else if !threads.length}
			<Card.Root>
				<Card.Content class="py-12 text-center">
					<div class="text-muted-foreground">
						{#if searchQuery || categoryFilter !== 'all'}
							<p class="mb-2 text-lg font-medium">No threads found</p>
							<p>Try adjusting your search or filters</p>
						{:else}
							<p class="mb-2 text-lg font-medium">No threads yet</p>
							<p>Be the first to start a conversation!</p>
							<Button href="/threads/new" class="mt-4">
								<PlusIcon class="mr-2 size-4" />
								Create First Thread
							</Button>
						{/if}
					</div>
				</Card.Content>
			</Card.Root>
		{:else}
			{#each threads as thread}
				<ThreadCardView {thread} />
			{/each}
		{/if}
	</div>
</div>
