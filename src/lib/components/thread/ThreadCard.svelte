<script lang="ts">
	import { renderTipTap } from '$utils';
	import { Calendar, Eye, MessageSquare } from '@lucide/svelte';
	import { formatDistanceToNow } from 'date-fns';

	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';

	// type Thread = {
	// 	id: string;
	// 	title: string;
	// 	content: string;
	// 	pinned: boolean;
	// 	locked: boolean;
	// 	createdAt: string | Date;
	// 	updatedAt: string | Date;
	// 	author: {
	// 		id: string;
	// 		name: string | null;
	// 		image: string | null;
	// 	} | null;
	// 	category: {
	// 		id: string;
	// 		name: string;
	// 		slug: string;
	// 	} | null;
	// 	replyCount: number;
	// 	_count?: {
	// 		views: number;
	// 	};
	// };
	let { thread } = $props();
</script>

<div class="mb-4">
	<Card.Root class="transition-shadow	 hover:shadow-md">
		<Card.Header class="pb-3">
			<div class="flex items-start justify-between">
				<div class="flex-1">
					<a href={`/forum/${thread.id}`}>
						<h2 class="text-xl font-semibold transition-colors hover:text-primary">
							{thread.title}
						</h2>
					</a>
					<div class="mt-2 line-clamp-3 text-muted-foreground">
						{@html renderTipTap(thread.content)}
					</div>
				</div>
			</div>
		</Card.Header>
		<Card.Content>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-4 text-sm text-muted-foreground">
					<div class="flex items-center gap-2">
						<a href={`/profile/${thread.author.username}`}>
							<Avatar.Root class="h-6 w-6">
								<Avatar.Image src={thread.author?.image} />
								<Avatar.Fallback>
									{thread.author?.name?.charAt(0).toUpperCase() || 'U'}
								</Avatar.Fallback>
							</Avatar.Root>
							<span>{thread.author?.username || 'Anonymous'}</span></a
						>
					</div>
					<div class="flex items-center gap-1">
						<Calendar class="size-4" />
						<span>
							{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
						</span>
					</div>
				</div>

				<div class="flex items-center gap-4">
					{#if thread.category}
						<a href={`/categories/${thread.category.slug}`}>
							<Badge variant="secondary" class="hover:bg-secondary/80">
								{thread.category.name}
							</Badge>
						</a>
					{/if}

					<div class="flex items-center gap-4 text-sm text-muted-foreground">
						<div class="flex items-center gap-1">
							<MessageSquare class="size-4" />
							<span>{thread.replyCount || 0}</span>
						</div>
						<div class="flex items-center gap-1">
							<Eye class="size-4" />
							<span>{thread._count?.views || 0}</span>
						</div>
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
