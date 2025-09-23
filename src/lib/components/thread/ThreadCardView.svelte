<script lang="ts">
	import {
		ArrowDownIcon,
		ArrowUpIcon,
		BookmarkIcon,
		MessageCircleIcon,
		MoreHorizontalIcon,
		ShareIcon	} from '@lucide/svelte';

	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	let {
		thread
	}: {
		thread: any;
	} = $props();

	let upvoted = $state(false);
	let downvoted = $state(false);
	let bookmarked = $state(false);
</script>

<Card.Root class="mb-4 transition-shadow hover:shadow-md">
	<Card.Content class="p-0">
		<div class="flex">
			<!-- Vote Section -->
			<div class="flex flex-col items-center rounded-l-lg bg-muted/30 p-3">
				<Button
					variant="ghost"
					size="sm"
					class="h-8 w-8 p-0 {upvoted ? 'text-orange-500' : ''}"
					onclick={() => {
						upvoted = !upvoted;
						if (upvoted) downvoted = false;
					}}
				>
					<ArrowUpIcon class="size-4" />
				</Button>
				<span class="py-1 text-sm font-medium"
					>{thread.points + (upvoted ? 1 : 0) - (downvoted ? 1 : 0)}</span
				>
				<Button
					variant="ghost"
					size="sm"
					class="h-8 w-8 p-0 {downvoted ? 'text-blue-500' : ''}"
					onclick={() => {
						downvoted = !downvoted;
						if (downvoted) upvoted = false;
					}}
				>
					<ArrowDownIcon class="size-4" />
				</Button>
			</div>

			<!-- Content Section -->
			<div class="flex-1 p-4">
				<!-- Header -->
				<div class="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
					<Avatar.Root class="size-5">
						<Avatar.Image src={thread.community?.avatar} alt={thread.community?.name} />
						<Avatar.Fallback>{thread.community?.name?.slice(0, 2).toUpperCase()}</Avatar.Fallback>
					</Avatar.Root>
					<span class="font-medium">r/{thread.community?.name}</span>
					<span>•</span>
					<span>Posted by u/{thread.author.username}</span>
					<span>•</span>
					<span>{thread.timeAgo}</span>
					{#if thread.isPinned}
						<Badge variant="secondary" class="text-xs">Pinned</Badge>
					{/if}
				</div>

				<!-- Title -->
				<h3 class="mb-2 cursor-pointer text-lg font-semibold hover:text-blue-600">
					{thread.title}
				</h3>

				<!-- Content Preview -->
				{#if thread.content}
					<p class="mb-3 line-clamp-3 text-sm text-muted-foreground">
						{thread.content}
					</p>
				{/if}

				<!-- Image/Media -->
				{#if thread.image}
					<div class="mb-3 overflow-hidden rounded-lg">
						<img src={thread.image} alt={thread.title} class="max-h-96 w-full object-cover" />
					</div>
				{/if}

				<!-- Actions -->
				<div class="flex items-center gap-4 text-xs text-muted-foreground">
					<Button variant="ghost" size="sm" class="h-8 gap-1 px-2">
						<MessageCircleIcon class="size-4" />
						{thread.commentCount} Comments
					</Button>
					<Button variant="ghost" size="sm" class="h-8 gap-1 px-2">
						<ShareIcon class="size-4" />
						Share
					</Button>
					<Button
						variant="ghost"
						size="sm"
						class="h-8 gap-1 px-2 {bookmarked ? 'text-blue-500' : ''}"
						onclick={() => (bookmarked = !bookmarked)}
					>
						<BookmarkIcon class="size-4" />
						Save
					</Button>
					<Button variant="ghost" size="sm" class="ml-auto h-8 w-8 p-0">
						<MoreHorizontalIcon class="size-4" />
					</Button>
				</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>
