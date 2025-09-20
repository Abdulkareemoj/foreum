<script lang="ts">
	import { createTRPC } from '$lib/trpc';
	import { toast } from 'svelte-sonner';
	import { onMount, onDestroy } from 'svelte';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import { Skeleton } from '$components/ui/skeleton';

	let bookmarks = $state<any[]>([]);
	let loading = $state(true);
	let loadingMore = $state(false);
	let nextCursor = $state<Date | null>(null);
	let observer: IntersectionObserver;
	let loadMoreTrigger: HTMLDivElement;
	const trpc = createTRPC();

	async function loadBookmarks(cursor?: Date) {
		try {
			if (cursor) loadingMore = true;
			const res = await trpc.bookmarks.getAll.query({ limit: 10, cursor });
			bookmarks = [...bookmarks, ...res.items];
			nextCursor = res.nextCursor;
		} catch {
			toast.error('Failed to load bookmarks');
		} finally {
			loading = false;
			loadingMore = false;
		}
	}

	async function removeBookmark(threadId: string) {
		const old = bookmarks;
		bookmarks = bookmarks.filter((b) => b.threadId !== threadId);
		try {
			await trpc.bookmarks.remove.mutate({ threadId });
			toast.success('Bookmark removed');
		} catch {
			bookmarks = old; // rollback if failed
			toast.error('Failed to remove bookmark');
		}
	}

	onMount(() => loadBookmarks());

	$effect(() => {
		if (loadMoreTrigger && nextCursor) {
			if (observer) observer.disconnect();
			observer = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && nextCursor) {
					loadBookmarks(nextCursor);
				}
			});
			observer.observe(loadMoreTrigger);
		}
	});

	onDestroy(() => {
		if (observer) observer.disconnect();
	});
</script>

<div class="container mx-auto max-w-3xl py-8">
	<h1 class="mb-6 text-3xl font-bold">Bookmarks</h1>

	{#if loading}
		<!-- Skeleton Loader for Initial Load -->
		<div class="space-y-4">
			{#each Array(3) as _}
				<Card.Root>
					<Card.Content class="flex items-center justify-between p-4">
						<div>
							<Skeleton class="mb-2 h-4 w-32" />
							<Skeleton class="h-3 w-20" />
						</div>
						<Skeleton class="h-8 w-20 rounded-md" />
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{:else if bookmarks.length === 0}
		<p class="text-muted-foreground">You have no bookmarks yet.</p>
	{:else}
		<div class="space-y-4">
			{#each bookmarks as b}
				<Card.Root>
					<Card.Content class="flex items-center justify-between p-4">
						<div>
							<a href={`/threads/${b.threadId}`} class="font-medium text-primary hover:underline">
								{b.threadTitle}
							</a>
							<p class="text-sm text-muted-foreground">
								Bookmarked on {new Date(b.createdAt).toLocaleDateString()}
							</p>
						</div>

						<Button variant="outline" on:click={() => removeBookmark(b.threadId)}>Remove</Button>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}

	<!-- Infinite Scroll Loader -->
	<div class="flex justify-center py-4" bind:this={loadMoreTrigger}>
		{#if loadingMore}
			<div class="w-full space-y-4">
				{#each Array(2) as _}
					<Card.Root>
						<Card.Content class="flex items-center justify-between p-4">
							<div>
								<Skeleton class="mb-2 h-4 w-32" />
								<Skeleton class="h-3 w-20" />
							</div>
							<Skeleton class="h-8 w-20 rounded-md" />
						</Card.Content>
					</Card.Root>
				{/each}
			</div>
		{/if}
	</div>
</div>
