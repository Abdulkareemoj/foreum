<script lang="ts">
	import { CrownIcon, FlameIcon, InfoIcon } from '@lucide/svelte';

	import * as Avatar from '$lib/components/ui/avatar';
	import * as Card from '$lib/components/ui/card';
	import { createTRPC } from '$lib/trpc';

	const trpc = createTRPC();

	let recentPosts = $state<any[]>([]);
	let announcements = $state<string[]>([]);
	let popularPosts = $state<any[]>([]);
	let quickLinks = [
		{ name: 'About', href: '/about' },
		{ name: 'Help', href: '/help' },
		{ name: 'Contact', href: '/contact' },
		{ name: 'Privacy', href: '/privacy' }
	];

	$effect(() => {
		const loadData = async () => {
			recentPosts = await trpc.thread.recent.query({ limit: 5 });
			popularPosts = await trpc.thread.popular.query({ limit: 5 });
			// announcements = await trpc.announcement.list.query();
		};
		loadData();
	});
</script>

<aside class="hidden h-full shrink-0 border-l bg-background xl:block xl:w-72 2xl:w-96">
	<div class="space-y-6 p-4">
		<!-- Announcements -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Announcements</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-2">
				<!-- {#each announcements as note}
					<p class="text-sm">{note}</p>
				{/each} -->
			</Card.Content>
		</Card.Root>

		<!-- Recent Posts -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Recent Posts</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-2">
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
			</Card.Content>
		</Card.Root>

		<!-- Popular This Week -->
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<FlameIcon class="size-4 text-orange-500" /> Popular This Week
				</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-2">
				{#each popularPosts as post}
					<div class="flex justify-between rounded-lg p-2 hover:bg-accent">
						<span class="line-clamp-1 text-sm">{post.title}</span>
						<span class="text-xs text-muted-foreground">{post.score} pts</span>
					</div>
				{/each}
			</Card.Content>
		</Card.Root>

		<!-- Quick Links -->
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<InfoIcon class="size-4" /> Quick Links
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<ul class="space-y-2">
					{#each quickLinks as link}
						<li>
							<a href={link.href} class="text-sm text-muted-foreground hover:underline">
								{link.name}
							</a>
						</li>
					{/each}
				</ul>
			</Card.Content>
		</Card.Root>
	</div>
</aside>
