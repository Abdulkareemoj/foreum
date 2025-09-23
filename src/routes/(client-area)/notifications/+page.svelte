<script lang="ts">
	import { onDestroy,onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import { Skeleton } from '$components/ui/skeleton';
	import { createTRPC } from '$lib/trpc';

	const trpc = createTRPC();

	type Notification = Awaited<ReturnType<typeof trpc.notifications.getAll.query>>['items'][number];

	let notifications = $state<Notification[]>([]);
	let loading = $state(true);
	let loadingMore = $state(false);
	let nextCursor = $state<string | null>(null);

	let observer: IntersectionObserver;
	let loadMoreTrigger: HTMLDivElement;

	async function loadNotifications(cursor?: string) {
		if (loadingMore || loading) return;

		try {
			if (cursor) loadingMore = true;
			const res = await trpc.notifications.getAll.query({ limit: 10, cursor });
			notifications = [...notifications, ...res.items];
			nextCursor = res.nextCursor;
		} catch {
			toast.error('Failed to load notifications');
		} finally {
			loading = false;
			loadingMore = false;
		}
	}

	async function markAsRead(id: string) {
		try {
			await trpc.notifications.markAsRead.mutate({ id });
			notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
		} catch {
			toast.error('Failed to mark as read');
		}
	}

	async function markAllAsRead() {
		try {
			await trpc.notifications.markAllAsRead.mutate();
			notifications = notifications.map((n) => ({ ...n, read: true }));
			toast.success('All notifications marked as read');
		} catch {
			toast.error('Failed to mark all as read');
		}
	}

	onMount(() => loadNotifications());

	$effect(() => {
		if (loadMoreTrigger && nextCursor) {
			if (observer) observer.disconnect();
			observer = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && nextCursor) {
					loadNotifications(nextCursor);
				}
			});
			observer.observe(loadMoreTrigger);
		}
	});

	onDestroy(() => {
		if (observer) observer.disconnect();
	});
</script>

<div class="container mx-auto max-w-3xl py-8">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Notifications</h1>
		{#if notifications.some((n) => !n.read)}
			<Button size="sm" variant="outline" on:click={markAllAsRead}>Mark all as read</Button>
		{/if}
	</div>

	{#if loading}
		<!-- Initial Skeleton Loader -->
		<div class="space-y-4">
			{#each Array(3) as _}
				<Card.Root>
					<Card.Content class="flex items-center justify-between p-4">
						<div>
							<Skeleton class="mb-2 h-4 w-64" />
							<Skeleton class="h-3 w-24" />
						</div>
						<Skeleton class="h-8 w-28 rounded-md" />
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{:else if notifications.length === 0}
		<p class="text-muted-foreground">No notifications yet.</p>
	{:else}
		<div class="space-y-4">
			{#each notifications as n}
				<Card.Root class={!n.read ? 'bg-accent/40' : ''}>
					<Card.Content class="flex items-center justify-between p-4">
						<div>
							<p>{n.message}</p>
							<p class="text-sm text-muted-foreground">
								{new Date(n.createdAt).toLocaleString()}
							</p>
						</div>
						{#if !n.read}
							<Button size="sm" variant="outline" on:click={() => markAsRead(n.id)}>
								Mark as Read
							</Button>
						{/if}
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}

	<!-- Infinite Scroll Loader -->
	<div class="flex justify-center py-4" bind:this={loadMoreTrigger}>
		{#if loadingMore}
			<div class="w-full space-y-4">
				{#each Array(2) as _}
					<Card.Root>
						<Card.Content class="flex items-center justify-between p-4">
							<div>
								<Skeleton class="mb-2 h-4 w-64" />
								<Skeleton class="h-3 w-24" />
							</div>
							<Skeleton class="h-8 w-28 rounded-md" />
						</Card.Content>
					</Card.Root>
				{/each}
			</div>
		{/if}
	</div>
</div>
