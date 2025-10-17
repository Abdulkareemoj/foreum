<script lang="ts">
	import {
		BookmarkIcon,
		MessageCircleIcon,
		MoreHorizontalIcon,
		ShareIcon,
		EyeIcon,
		ThumbsUpIcon
	} from '@lucide/svelte';

	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';

	let {
		thread
	}: {
		thread: any;
	} = $props();

	let bookmarked = $state(false);
</script>

<Card.Root class="mb-4 overflow-hidden transition-shadow hover:shadow-md">
	<!-- Added featured image display if thread has an image -->
	{#if thread.image}
		<div class="relative h-48 w-full overflow-hidden bg-muted">
			<img
				src={thread.image || '/placeholder.svg'}
				alt={thread.title}
				class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
			/>
		</div>
	{/if}

	<Card.Content class="px-4">
		<!-- User Info Row -->
		<div class="mb-3 flex items-center gap-2">
			<Avatar.Root class="size-8">
				<Avatar.Image src={thread.author?.image} alt={thread.author?.name} />
				<Avatar.Fallback>{thread.author?.name?.slice(0, 1).toUpperCase()}</Avatar.Fallback>
			</Avatar.Root>
			<div class="flex items-center gap-2 text-sm">
				<span class="font-semibold">{thread.author?.name || 'Anonymous'}</span>
				{#if thread.author?.reputation}
					<span class="text-xs font-medium text-muted-foreground">{thread.author.reputation}</span>
				{/if}
				<span class="text-xs text-muted-foreground">• {thread.timeAgo || 'recently'}</span>
			</div>
		</div>

		<!-- Title -->
		<a href={`/forum/${thread.id}`} class="mb-2 block">
			<h3 class="line-clamp-2 text-base font-semibold transition-colors hover:text-primary">
				{thread.title}
			</h3>
		</a>

		<!-- Content Preview -->
		{#if thread.content}
			<p class="mb-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
				{thread.content}
			</p>
		{/if}

		<!-- Tags displayed horizontally below content -->
		{#if thread.tags && thread.tags.length > 0}
			<div class="mb-3 flex flex-wrap gap-2">
				{#each thread.tags as tag}
					<Badge variant="secondary" class="text-xs">
						{tag}
					</Badge>
				{/each}
			</div>
		{/if}

		<!-- Stats row at bottom with votes, answers, views -->
		<div class="flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
			<div class="flex items-center gap-1">
				<ThumbsUpIcon class="size-4" />
				<span class="font-medium">{thread.score || 0} votes</span>
			</div>
			<div class="flex items-center gap-1">
				<MessageCircleIcon class="size-4" />
				<span class="font-medium">{thread.replyCount || 0} answers</span>
			</div>
			<div class="flex items-center gap-1">
				<EyeIcon class="size-4" />
				<span class="font-medium">{thread.viewCount || 0} views</span>
			</div>
			{#if thread.isPinned}
				<Badge variant="secondary" class="ml-auto text-xs">Pinned</Badge>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
