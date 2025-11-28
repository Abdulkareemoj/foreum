<script lang="ts">
	import { reply } from '$server/db/schema/thread-schema';
	import { onMount } from 'svelte';
	import * as Card from '$components/ui/card';
	import * as Avatar from '$components/ui/avatar';
	import ReplyForm from '$lib/components/thread/ReplyForm.svelte';
	import { createTRPC } from '$lib/trpc';
	import { renderTipTap } from '$utils';

	let { params } = $props<{ params: { id: string; threadId: string } }>();

	const trpc = createTRPC();

	let thread = $state<any>(null);
	let replies = $state<any[]>([]);
	let isLoading = $state(true);

	async function load() {
		isLoading = true;
		try {
			thread = await trpc.thread.byId.query({ id: params.threadId });
			replies = await trpc.reply.list.query({ threadId: params.threadId, limit: 200 });
		} catch (err) {
			console.error('Failed to load thread', err);
		} finally {
			isLoading = false;
		}
	}

	onMount(load);

	function refresh() {
		load();
	}
</script>

{#if isLoading}
	<div class="p-6"><Card.Root class="animate-pulse"><Card.Content class="h-40" /></Card.Root></div>
{:else if !thread}
	<div class="p-6 text-muted-foreground">Thread not found.</div>
{:else}
	<div class="container mx-auto max-w-4xl space-y-6 px-4 py-8">
		<Card.Root>
			<Card.Header>
				<h1 class="text-2xl font-bold">{thread.title}</h1>
				<div class="flex items-center gap-3 text-sm text-muted-foreground">
					<Avatar.Root class="h-6 w-6">
						<Avatar.Image src={thread.author?.image} />
						<Avatar.Fallback>{thread.author?.name?.[0] || 'U'}</Avatar.Fallback>
					</Avatar.Root>
					<span>{thread.author?.name}</span>
					<span>•</span>
					<span>{new Date(thread.createdAt).toLocaleString()}</span>
				</div>
			</Card.Header>

			<Card.Content>
				<div class="prose dark:prose-invert max-w-none">{@html renderTipTap(thread.content)}</div>
			</Card.Content>
		</Card.Root>

		<div>
			<h2 class="text-lg font-semibold">Replies ({replies.length})</h2>

			{#if replies.length === 0}
				<p class="text-muted-foreground">No replies yet — be the first to reply.</p>
			{:else}
				<div class="mt-4 space-y-4">
					{#each replies as reply}
						<Card.Root>
							<Card.Header>
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-2 text-sm text-muted-foreground">
										<Avatar.Root class="h-6 w-6">
											<Avatar.Image src={reply.author?.image} />
											<Avatar.Fallback>{reply.author?.name?.[0] || 'U'}</Avatar.Fallback>
										</Avatar.Root>
										<span>{reply.author?.name}</span>
										<span>•</span>
										<span>{new Date(reply.createdAt).toLocaleString()}</span>
									</div>
								</div>
							</Card.Header>
							<Card.Content>
								<div class="prose dark:prose-invert max-w-none">
									{@html renderTipTap(reply.content)}
								</div>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>
			{/if}
		</div>

		<div>
			<ReplyForm threadId={thread.id} onSubmitted={refresh} />
		</div>
	</div>
{/if}
