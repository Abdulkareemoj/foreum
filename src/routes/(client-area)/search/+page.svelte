<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { createTRPC } from '$lib/trpc';

	const trpc = createTRPC();

	let query = '';
	let results: any[] = [];
	let loading = true;

	page.subscribe((p) => {
		query = p.url.searchParams.get('q') ?? '';
	});

	onMount(async () => {
		if (!query) return;
		results = await trpc.search.global.query({ query, limit: 20 });
		loading = false;
	});
</script>

<div class="space-y-4 p-6">
	<h1 class="text-2xl font-semibold">Search results</h1>

	{#if loading}
		<p class="text-muted-foreground">Searching…</p>
	{:else if results.length === 0}
		<p class="text-muted-foreground">No results found</p>
	{:else}
		<div class="space-y-2">
			{#each results as item}
				<a
					href={item.type === 'thread'
						? `/threads/${item.id}`
						: item.type === 'user'
							? `/profile/${item.title.replace('@', '')}`
							: `/groups/${item.id}`}
					class="block rounded-md border p-3 hover:bg-muted"
				>
					<p class="text-xs text-muted-foreground uppercase">
						{item.type}
					</p>
					<p class="font-medium">{item.title}</p>
				</a>
			{/each}
		</div>
	{/if}
</div>
