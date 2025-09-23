<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';

	let {
		mobile = false,
		recentPosts = [],
		announcements = []
	} = $props<{
		mobile?: boolean;
		recentPosts: any[];
		announcements: string[];
	}>();

	const quickLinks = [
		{ name: 'About', href: '/about' },
		{ name: 'Help', href: '/help' },
		{ name: 'Contact', href: '/contact' },
		{ name: 'Privacy', href: '/privacy' }
	];
</script>

<aside
	class={`${
		mobile
			? 'flex flex-col gap-4 p-2' // mobile-friendly, no borders
			: 'hidden shrink-0 border-l p-4 xl:flex xl:w-80 2xl:w-96'
	}`}
>
	<!-- Recent Posts -->
	<section>
		<h2 class="mb-2 text-sm font-semibold">Recent Posts</h2>
		{#each recentPosts as post}
			<div class="flex gap-3 rounded-lg p-1 hover:bg-accent">
				<Avatar.Root class="size-10">
					<Avatar.Image src={post.author?.image} alt={post.author.name} />
					<Avatar.Fallback>
						{post.author.name.slice(0, 2).toUpperCase()}
					</Avatar.Fallback>
				</Avatar.Root>
				<div class="flex-1">
					<p class="line-clamp-2 text-sm font-medium">{post.title}</p>
				</div>
			</div>
		{/each}
	</section>

	<!-- Announcements -->
	<section>
		<h2 class="mt-4 mb-2 text-sm font-semibold">Announcements</h2>
		<ul class="space-y-2 text-sm">
			{#each announcements as ann}
				<li>{ann}</li>
			{/each}
		</ul>
	</section>
</aside>
