<script lang="ts">
	import { onMount } from 'svelte';

	import Mainbar from '$components/thread/Mainbar.svelte';
	import { createTRPC } from '$lib/trpc';

	const trpc = createTRPC();

	let threads = $state<any[]>([]);
	let categories = $state<any[]>([]);
	let isLoading = $state(true);

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
			hasMore = true;
		}
		if (!hasMore || isLoading) return;

		isLoading = true;
		try {
			const newThreads = await trpc.thread.list.query({
				search: searchQuery || undefined,
				category: categoryFilter === 'all' ? undefined : categoryFilter,
				sortBy,
				limit,
				offset
			});

			if (newThreads.length < limit) {
				hasMore = false;
			}

			threads = reset ? newThreads : [...threads, ...newThreads];
			offset += newThreads.length;
		} catch (error) {
			console.error('Failed to load threads:', error);
		} finally {
			isLoading = false;
		}
	}

	async function loadCategories() {
		try {
			categories = await trpc.category.list.query();
		} catch (error) {
			console.error('Failed to load categories:', error);
		}
	}

	$effect(() => {
		loadThreads(true);
		loadCategories();
	});

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !isLoading) {
					loadThreads();
				}
			},
			{ threshold: 1.0 }
		);

		if (sentinel) {
			observer.observe(sentinel);
		}

		return () => {
			if (sentinel) {
				observer.unobserve(sentinel);
			}
		};
	});
</script>

<Mainbar
	{threads}
	{categories}
	{isLoading}
	bind:searchQuery
	bind:categoryFilter
	bind:sortBy
	onLoadMore={() => loadThreads()}
/>

{#if hasMore}
	<div bind:this={sentinel} class="h-10" />
{/if}