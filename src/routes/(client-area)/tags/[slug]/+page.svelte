<script lang="ts">
	import ThreadCard from '$lib/components/thread/ThreadCard.svelte';
	import { createTRPC } from '$lib/trpc';

	let { slug } = $props<{ slug: string }>();

	const trpc = createTRPC();

	let tag = $state<any>(null);
	let threads = $state<any[]>([]);
	let isLoading = $state(true);

	async function loadTagAndThreads() {
		isLoading = true;
		tag = await trpc.tag.bySlug.query({ slug });
		if (tag) {
			threads = await trpc.thread.list.query({ tagId: tag.id });
		}
		isLoading = false;
	}

	// Fetch when slug changes
	$effect(() => {
		loadTagAndThreads();
	});
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold">#{tag?.name ?? 'Loading…'}</h1>

	{#if isLoading}
		<p>Loading threads…</p>
	{:else if threads.length === 0}
		<p class="text-muted-foreground">No threads with this tag yet.</p>
	{:else}
		{#each threads as thread}
			<ThreadCard {thread} />
		{/each}
	{/if}
</div>
