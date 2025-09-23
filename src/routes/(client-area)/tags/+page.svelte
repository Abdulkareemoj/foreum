<script lang="ts">
	import { Badge } from '$components/ui/badge';
	import * as Card from '$components/ui/card';
	import { createTRPC } from '$lib/trpc';

	const trpc = createTRPC();

	let tags = $state<any[]>([]);
	let isLoading = $state(true);

	async function loadTags() {
		isLoading = true;
		tags = await trpc.tag.list.query();
		isLoading = false;
	}

	// Run once on mount
	$effect(() => {
		loadTags();
	});
</script>

<div class="container mx-auto space-y-6 px-4 py-8">
	<h1 class="text-3xl font-bold">Tags</h1>

	{#if isLoading}
		<p>Loading tags…</p>
	{:else if tags.length === 0}
		<p class="text-muted-foreground">No tags yet.</p>
	{:else}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each tags as tag}
				<a href={`/tags/${tag.slug}`}>
					<Card.Root class="flex h-full flex-col justify-between transition-shadow hover:shadow-lg">
						<Card.Header>
							<div class="flex items-center justify-between">
								<h2 class="text-xl font-semibold">#{tag.name}</h2>
								<Badge variant="secondary">{tag.threadCount} threads</Badge>
							</div>
						</Card.Header>
					</Card.Root>
				</a>
			{/each}
		</div>
	{/if}
</div>
