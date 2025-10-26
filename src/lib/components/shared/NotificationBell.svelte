<script lang="ts">
	import { Bell } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { createEventDispatcher } from 'svelte';

	type Notification = {
		id: string;
		title: string;
		body: string | null;
		read: boolean;
	};

	let {
		unreadCount = 0,
		loading = false,
		recentNotifications = []
	}: {
		unreadCount: number;
		loading: boolean;
		recentNotifications: Notification[];
	} = $props();

	const dispatch = createEventDispatcher();

	function markAsRead(notificationId: string) {
		dispatch('markAsRead', notificationId);
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button variant="outline" size="icon" class="relative inline-flex">
			<Bell class="size-5" />
			{#if unreadCount > 0}
				<span
					class="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-[0.65rem] font-bold text-white"
				>
					{unreadCount}
				</span>
			{/if}
		</Button>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content align="end" class="w-72">
		<DropdownMenu.Label class="font-semibold">Notifications</DropdownMenu.Label>
		<DropdownMenu.Separator />

		{#if loading}
			<div class="py-6 text-center text-sm text-muted-foreground">Loading...</div>
		{:else if recentNotifications.length === 0}
			<div class="py-6 text-center text-sm text-muted-foreground">No notifications yet</div>
		{:else}
			{#each recentNotifications as n (n.id)}
				<DropdownMenu.Item
					class="flex cursor-pointer flex-col gap-1"
					on:click={() => markAsRead(n.id)}
				>
					<div class="flex items-center justify-between">
						<p class="truncate text-sm font-medium">{n.title}</p>
						{#if !n.read}
							<span class="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
						{/if}
					</div>
					{#if n.body}
						<p class="line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
					{/if}
				</DropdownMenu.Item>
			{/each}
		{/if}

		<DropdownMenu.Separator />
		<DropdownMenu.Item
			class="justify-center text-center text-sm font-medium text-primary hover:bg-transparent hover:text-primary/80"
			on:click={() => (window.location.href = '/notifications')}
		>
			<a href="/notifications">View all notifications →</a>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
