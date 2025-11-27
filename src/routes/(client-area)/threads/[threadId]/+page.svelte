<script lang="ts">
	import { Calendar } from '@lucide/svelte';
	import { formatDistanceToNow } from 'date-fns';
	// event dispatching is deprecated in Svelte 5; prefer callback props or direct calls

	import { page } from '$app/state';
	import { Button } from '$components/ui/button';
	import ReplyForm from '$lib/components/thread/ReplyForm.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { createTRPC } from '$lib/trpc';
	import { renderTipTap } from '$utils';

	// ensure `threadId` is always a string when passed to child components
	let threadId: string = page.params.threadId ?? '';

	const trpc = createTRPC();

	let thread = $state<any>(null);
	let replies = $state<any[]>([]);
	let sortBy = $state<'oldest' | 'newest'>('oldest');
	let isLoading = $state(true);

	// fetch controller to avoid racing responses when params change
	let repliesFetchCounter = 0;

	// ✅ grab user from layout data
	let currentUser = $derived(page.data.user);

	// ✅ Load thread once
	$effect(() => {
		if (threadId) {
			(async () => {
				thread = await trpc.thread.byId.query({ id: threadId });
			})();
		}
	});

	// ✅ Reload replies whenever sortBy or threadId changes
	// race-safe replies fetch; increments counter to ignore stale responses
	async function fetchReplies() {
		const id = ++repliesFetchCounter;
		if (!threadId) {
			replies = [];
			isLoading = false;
			return;
		}

		isLoading = true;
		try {
			const res = await trpc.reply.list.query({ threadId, sortBy });
			// ignore stale responses
			if (id !== repliesFetchCounter) return;
			replies = res;
		} catch (err) {
			console.error('Failed to load replies', err);
			if (id === repliesFetchCounter) replies = [];
		} finally {
			if (id === repliesFetchCounter) isLoading = false;
		}
	}

	// public refresh helper used by ReplyForm via onSubmitted
	async function refreshReplies() {
		await fetchReplies();
	}

	// reactively load replies when threadId or sortBy changes
	$effect(() => {
		// reference reactive deps
		threadId;
		sortBy;
		fetchReplies();
	});
</script>

<div class="container mx-auto space-y-8 px-4 py-8">
	<!-- Thread Header -->
	{#if thread}
		<Card.Root>
			<Card.Header>
				<h1 class="text-2xl font-bold">{thread.title}</h1>
				<div class="flex items-center gap-3 text-sm text-muted-foreground">
					<a class="flex gap-2" href={`/profile/${thread.author.username}`}
						><Avatar.Root class="h-6 w-6">
							<Avatar.Image src={thread.author?.image} />
							<Avatar.Fallback>{thread.author?.name?.[0] || 'U'}</Avatar.Fallback>
						</Avatar.Root>
						<span>{thread.author?.name || 'Anonymous'}</span></a
					>
					<div class="flex items-center gap-1">
						<Calendar class="size-4" />
						{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
					</div>
				</div>
			</Card.Header>
			<Card.Content>
				<div class="prose dark:prose-invert max-w-none">{@html renderTipTap(thread.content)}</div>
			</Card.Content>
		</Card.Root>
	{:else}
		<p>Loading thread…</p>
	{/if}

	<!-- Sort & Replies -->
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold">Replies ({replies.length})</h2>
		<Select.Root bind:value={sortBy}>
			<Select.Trigger class="w-40" />
			<Select.Content>
				<Select.Item value="oldest">Oldest First</Select.Item>
				<Select.Item value="newest">Newest First</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>

	{#if isLoading}
		<div class="space-y-4">
			{#each Array(3) as _}
				<Card.Root class="animate-pulse">
					<Card.Content class="h-20" />
				</Card.Root>
			{/each}
		</div>
	{:else if replies.length === 0}
		<p class="text-muted-foreground">No replies yet. Be the first to reply!</p>
	{:else}
		{#each replies as reply}
			<Card.Root>
				<Card.Header>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2 text-sm text-muted-foreground">
							<a class="flex gap-2" href={`/profile/${thread.author.username}`}>
								<Avatar.Root class="h-6 w-6">
									<Avatar.Image src={reply.author?.image} />
									<Avatar.Fallback>{reply.author?.name?.[0] || 'U'}</Avatar.Fallback>
								</Avatar.Root>
								<span>{reply.author?.name || 'Anonymous'}</span></a
							>
						</div>

						{#if reply.author?.id === currentUser?.id}
							<div class="flex gap-2">
								<Button
									size="sm"
									variant="outline"
									href={`/threads/${threadId}/reply/${reply.id}/edit`}
								>
									Edit
								</Button>
								<Button
									size="sm"
									variant="destructive"
									href={`/threads/${threadId}/reply/${reply.id}/delete`}
								>
									Delete
								</Button>
							</div>
						{/if}
					</div>
				</Card.Header>
				<Card.Content>
					{#if reply.content}
						<div class="prose dark:prose-invert max-w-none">
							{@html renderTipTap(reply.content)}
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		{/each}
	{/if}

	<!-- Reply Form -->
	{#if thread?.locked}
		<p class="text-sm text-muted-foreground">This thread is locked. No more replies allowed.</p>
	{:else}
		<ReplyForm {threadId} onSubmitted={refreshReplies} />
	{/if}
</div>
