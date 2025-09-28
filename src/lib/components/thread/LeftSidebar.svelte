<script lang="ts">
	import { FolderIcon, MessageCircleIcon, TagIcon, UserIcon } from '@lucide/svelte';

	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { createTRPC } from '$lib/trpc';

	const trpc = createTRPC();

	let categories = $state<any[]>([]);
	let trendingTags = $state<any[]>([]);
	let topContributors = $state<any[]>([]);
	let activeDiscussions = $state<any[]>([]);
	let topCategories = $state<any[]>([]);

	$effect(() => {
		const loadData = async () => {
			categories = await trpc.category.list.query();

			trendingTags = await trpc.tag.trending.query({ limit: 10 });

			topContributors = await trpc.user.topContributors.query({ limit: 5 });

			activeDiscussions = await trpc.thread.active.query({ limit: 5 });

			topCategories = await trpc.category.top.query({ limit: 5 });
		};
		loadData();
	});
</script>

<aside
	class="hidden h-full shrink-0 border-r border-border bg-background lg:block lg:w-72 xl:w-80 2xl:w-96"
>
	<div class="space-y-6 p-4">
		<!-- Categories -->
		<div>
			<h2 class="mb-3 text-lg font-semibold">Categories</h2>
			{#each categories as cat}
				<div
					class="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-accent"
				>
					<a href={`/catgories/${cat.slug}`} class="text-sm">{cat.name}</a>
				</div>
			{/each}
		</div>

		<!-- Trending Tags -->
		<div>
			<h2 class="mb-3 text-lg font-semibold">Trending Tags</h2>
			<div class="flex flex-wrap gap-2">
				{#each trendingTags as tag}
					<a href={`/tags/${tag.slug}`}>
						<Badge variant="secondary" class="cursor-pointer">
							<TagIcon class="mr-1 size-3" />
							{tag.name}
						</Badge></a
					>
				{/each}
			</div>
		</div>

		<!-- Top Contributors -->
		<div>
			<h2 class="mb-3 text-lg font-semibold">Top Contributors</h2>
			<div class="space-y-3">
				{#each topContributors as user}
					<div class="flex items-center gap-3">
						<a class="flex items-center gap-2" href={`/profile/${user.username}`}>
							<Avatar.Root class="size-8">
								<Avatar.Image src={user.image} alt={user.name} />
								<Avatar.Fallback>{user.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
							</Avatar.Root>
							<span class="text-sm">{user.displayUsername}</span></a
						>
					</div>
				{/each}
			</div>
		</div>

		<!-- Active Discussions -->
		<div>
			<h2 class="mb-3 text-lg font-semibold">Active Discussions</h2>
			<div class="space-y-2">
				{#each activeDiscussions as disc}
					<a class="flex items-center gap-2" href={`/thread/${disc.id}`}>
						<div class="flex items-center justify-between gap-5 rounded-lg p-2 hover:bg-accent">
							<span class="line-clamp-1 text-sm">{disc.title}</span>
							<span class="text-xs text-muted-foreground">{disc.replies} replies</span>
						</div></a
					>
				{/each}
			</div>
		</div>

		<!-- Top Categories (with counts) -->
		<div>
			<h2 class="mb-3 text-lg font-semibold">Top Categories</h2>
			<div class="space-y-2">
				{#each topCategories as cat}
					<a
						href={`/categories/${cat.slug}`}
						class="flex justify-between rounded-lg p-2 hover:bg-accent"
					>
						<span class="text-sm">{cat.name}</span>
						<span class="text-xs text-muted-foreground">{cat.count}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
</aside>
