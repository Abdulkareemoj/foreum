<script lang="ts">
	import { Plus,Search, SlidersHorizontal } from '@lucide/svelte';
	import { onMount } from 'svelte';

	import ThreadCard from '$lib/components/thread/ThreadCard.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { createTRPC } from '$lib/trpc';

	let { slug } = $props<{ slug: string }>();

	const trpc = createTRPC();
	let category = $state<any>(null);
	let threads = $state<any[]>([]);
	let searchQuery = $state('');
	let sortBy = $state<'recent' | 'popular' | 'oldest'>('recent');
	let isLoading = $state(true);

	async function loadCategory() {
		category = await trpc.category.bySlug.query({ slug });
	}

	async function loadThreads() {
		if (!category) return;
		isLoading = true;
		threads = await trpc.thread.list.query({
			search: searchQuery || undefined,
			category: category.id,
			sortBy
		});
		isLoading = false;
	}

	onMount(async () => {
		await loadCategory();
		await loadThreads();
	});

	$effect(() => {
		if (searchQuery || sortBy) {
			if (category) loadThreads();
		}
	});
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-3xl font-bold">{category ? category.name : 'Loading…'}</h1>
			<p class="text-muted-foreground">{category?.description}</p>
		</div>
		<Button href="/forum/new" class="flex items-center gap-2">
			<Plus class="size-5" />
			New Thread
		</Button>
	</div>

	<!-- Filters & Search -->
	<Card.Root class="mb-6">
		<Card.Header>
			<Card.Title class="flex items-center gap-2">
				<SlidersHorizontal class="size-5" />
				Filters & Search
			</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div class="flex flex-col gap-4 sm:flex-row">
				<div class="relative flex-1">
					<Search class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input placeholder="Search threads…" bind:value={searchQuery} class="pl-10" />
				</div>
				<Select.Root bind:value={sortBy}>
					<Select.Trigger class="w-full sm:w-48" />
					<Select.Content>
						<Select.Item value="recent">Most Recent</Select.Item>
						<Select.Item value="popular">Most Popular</Select.Item>
						<Select.Item value="oldest">Oldest First</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Thread List -->
	{#if isLoading}
		<p>Loading threads…</p>
	{:else if !threads.length}
		<Card.Root>
			<Card.Content class="py-12 text-center">
				<p class="text-muted-foreground">No threads found in this category.</p>
			</Card.Content>
		</Card.Root>
	{:else}
		{#each threads as thread}
			<ThreadCard {thread} />
		{/each}
	{/if}
</div>
