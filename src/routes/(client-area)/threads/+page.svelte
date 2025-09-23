<script lang="ts">
	import { onMount } from 'svelte';

	import Mainbar from '$components/thread/Mainbar.svelte';
	import { createTRPC } from '$lib/trpc';

	const trpc = createTRPC();

	let threads = $state<any[]>([]);
	let categories = $state<any[]>([]);
	let isLoading = $state(false);

	let searchQuery = $state('');
	let categoryFilter = $state('all');

	let sortBy = $state<'recent' | 'popular' | 'oldest'>('recent');
	let offset = 0;
	const limit = 20;
	let hasMore = $state<boolean>(true);

	let sentinel: HTMLDivElement | null = null;

	async function loadThreads(reset = false) {
		if (reset) {
			offset = 0;
			threads = [];
			// a;
			hasMore = true;
		}
		if (!hasMore || isLoading) return;

		isLoading = true;
		const newThreads = await trpc.thread.list.query({
			search: searchQuery || undefined,
			category: categoryFilter === 'all' ? undefined : categoryFilter,
			sortBy,
			limit,
			offset
		});

		if (newThreads.length < limit) hasMore = false;

		threads = reset ? newThreads : [...threads, ...newThreads];
		offset += limit;
		isLoading = false;
	}

	async function loadCategories() {
		categories = await trpc.category.list.query();
	}

	$effect(() => {
		(loadThreads(true), loadCategories());
	});

	onMount(() => {
		loadThreads(true);

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) loadThreads();
			},
			{ threshold: 1.0 }
		);

		if (sentinel) observer.observe(sentinel);
		return () => observer.disconnect();
	});
</script>

<Mainbar
	{threads}
	{categories}
	{isLoading}
	bind:searchQuery
	bind:categoryFilter
	bind:sortBy
	{hasMore}
	{sentinel}
/>
