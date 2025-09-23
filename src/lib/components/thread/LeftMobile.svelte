<script lang="ts">
	import { TagIcon } from '@lucide/svelte';

	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';

	let {
		mobile = false,
		categories = [],
		trendingTags = [],
		topContributors = []
	} = $props<{
		mobile?: boolean;
		categories: any[];
		trendingTags: any[];
		topContributors: any[];
	}>();
</script>

<aside
	class={`${
		mobile
			? 'flex flex-col gap-4 p-2' // mobile-friendly, no borders
			: 'hidden shrink-0 border-r p-4 lg:flex lg:w-80 xl:w-80 2xl:w-96'
	}`}
>
	<!-- Categories -->
	<section>
		<h2 class="mb-2 text-sm font-semibold">Categories</h2>
		{#each categories as cat}
			<div class="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-accent">
				<a href={`/catgories/${cat.slug}`} class="text-sm">{cat.name}</a>
			</div>
		{/each}
	</section>

	<!-- Trending Tags -->
	<section>
		<h2 class="mt-4 mb-2 text-sm font-semibold">Trending Tags</h2>
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
	</section>

	<!-- Top Contributors -->
	<section>
		<h2 class="mt-4 mb-2 text-sm font-semibold">Top Contributors</h2>
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
	</section>
</aside>
