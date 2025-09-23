<script lang="ts">
	import { Eye,MessageSquare } from '@lucide/svelte';
	import { onMount } from 'svelte';

	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { createTRPC } from '$lib/trpc';

	const trpc = createTRPC();
	let categories = $state<any[]>([]);
	let isLoading = $state(true);

	async function loadCategories() {
		isLoading = true;
		categories = await trpc.category.list.query();
		isLoading = false;
	}

	onMount(() => {
		loadCategories();

		// "Realtime" refresh every 10 seconds
		const interval = setInterval(() => {
			loadCategories();
		}, 10000);

		return () => clearInterval(interval);
	});
</script>

<div class="container mx-auto space-y-6 px-4 py-8">
	<h1 class="text-3xl font-bold">Categories</h1>

	{#if isLoading}
		<p>Loading categories…</p>
	{:else if categories.length === 0}
		<p class="text-muted-foreground">No categories yet.</p>
	{:else}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each categories as cat}
				<a href={`/categories/${cat.slug}`}>
					<Card.Root class="flex h-full flex-col justify-between transition-shadow hover:shadow-lg">
						<Card.Header>
							<div class="flex items-center justify-between">
								<h2 class="text-xl font-semibold">{cat.name}</h2>
								<Badge variant="secondary">{cat.threadCount} threads</Badge>
							</div>
							<p class="mt-2 line-clamp-3 text-muted-foreground">{cat.description}</p>
						</Card.Header>
						<Card.Content>
							<div class="flex items-center justify-end gap-4 text-muted-foreground">
								<!-- These would come from your thread stats in a later query -->
								<div class="flex items-center gap-1">
									<MessageSquare class="size-4" />
									<span>{cat.replyCount ?? 0}</span>
								</div>
								<div class="flex items-center gap-1">
									<Eye class="size-4" />
									<span>{cat.viewCount ?? 0}</span>
								</div>
							</div>
						</Card.Content>
					</Card.Root>
				</a>
			{/each}
		</div>
	{/if}
</div>
