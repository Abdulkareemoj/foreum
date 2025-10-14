<script lang="ts">
	import {
		Bell,
		ChevronDown,
		Home,
		Menu,
		MessageSquare,
		Moon,
		Package2,
		PlusIcon,
		Search,
		Settings,
		Sun,
		TrendingUp,
		Users
	} from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$components/ui/avatar';
	import { Button, buttonVariants } from '$components/ui/button';
	import * as Collapsible from '$components/ui/collapsible';
	import { Input } from '$components/ui/input';
	import { Separator } from '$components/ui/separator';
	import * as Sheet from '$components/ui/sheet';
	import { Switch } from '$components/ui/switch';
	import Logo from '$components/shared/Logo.svelte';
	// import LeftSidebar from '$components/thread/LeftSidebar.svelte';
	// import RightSidebar from '$components/thread/RightSidebar.svelte';
	import { createTRPC } from '$lib/trpc';

	import LeftSidebarMobile from './LeftMobile.svelte';
	import RightSidebarMobile from './RightMobile.svelte';
	import NavUser from './NavUser.svelte';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';

	let unreadCount = $state(0);
	let pollingInterval: ReturnType<typeof setInterval> | null = null;

	let { user } = $props<{ user: { name: string; email: string; image?: string } }>();

	// Data for sidebars
	let categories = $state<any[]>([]);
	let trendingTags = $state<any[]>([]);
	let topContributors = $state<any[]>([]);
	let recentPosts = $state<any[]>([]);
	let announcements = $state<string[]>([]);

	let recentNotifications = $state<any[]>([]);
	let loading = $state(false);
	$effect(() => {
		const loadData = async () => {
			categories = await trpc.category.list.query();
			trendingTags = await trpc.tag.trending.query({ limit: 10 });
			topContributors = await trpc.user.topContributors.query({ limit: 5 });
			recentPosts = await trpc.thread.recent.query({ limit: 5 });
			// announcements = await trpc.announcement.list.query();
		};
		loadData();
	});
	async function loadUnreadCount() {
		try {
			const res = await trpc.notifications.countUnread.query();
			unreadCount = res.count;
		} catch {
			toast.error('Failed to fetch notifications');
		}
	}

	onMount(() => {
		loadUnreadCount();
		// Optional polling to keep count fresh (every 30s)
		pollingInterval = setInterval(loadUnreadCount, 30000);

		return () => {
			if (pollingInterval) clearInterval(pollingInterval);
		};
	});

	const trpc = createTRPC();

	let isDarkMode = $state(false);
	let isSheetOpen = $state(false);

	async function loadNotifications() {
		try {
			loading = true;
			const [countRes, listRes] = await Promise.all([
				trpc.notifications.countUnread.query(),
				trpc.notifications.getAll.query({ limit: 5 })
			]);
			unreadCount = countRes.count;
			recentNotifications = listRes.items;
		} catch (err) {
			console.error(err);
			toast.error('Failed to load notifications');
		} finally {
			loading = false;
		}
	}

	onMount(loadNotifications);

	async function markAsRead(id: string) {
		try {
			await trpc.notifications.markAsRead.mutate({ id });
			recentNotifications = recentNotifications.map((n) =>
				n.id === id ? { ...n, read: true } : n
			);
			unreadCount = Math.max(0, unreadCount - 1);
		} catch {
			toast.error('Failed to mark as read');
		}
	}

	$effect(() => {
		document.documentElement.classList.toggle('dark', isDarkMode);
	});

	// Navigation items for mobile
	const navigationItems = [
		{ href: '/', label: 'Home', icon: Home },
		{ href: '/communities', label: 'Communities', icon: Users },
		{ href: '/trending', label: 'Trending', icon: TrendingUp },
		{ href: '/messages', label: 'Messages', icon: MessageSquare }
	];
</script>

<header class="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
	<nav class="flex w-full items-center justify-between gap-6 font-medium">
		<!-- Left Section -->
		<div class="flex items-center gap-4">
			<a href="/threads" class="flex items-center gap-2 text-lg font-semibold md:text-base">
				<Logo />
			</a>
		</div>

		<!-- Middle Section -->
		<div class="flex flex-1 justify-center">
			<form class="w-full max-w-md">
				<div class="relative">
					<Search class="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search communities, posts..."
						aria-label="Search"
						class="w-full pl-8"
					/>
				</div>
			</form>
		</div>

		<!-- Right Section -->
		<div class="flex items-center gap-4">
			<Button
				href="/threads/new"
				variant="outline"
				size="lg"
				class="hidden rounded-lg md:inline-flex"
			>
				<PlusIcon class="size-5" /> New Thread
			</Button>
			<!-- <Button
				href="/notifications"
				variant="outline"
				size="icon"
				class="relative hidden md:inline-flex"
			>
				<Bell class="size-5" />
				{#if unreadCount > 0}
					<span
						class="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-[0.65rem] font-bold text-white"
					>
						{unreadCount}
					</span>
				{/if}
			</Button> -->

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
						View all notifications →
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<Button href="/settings" variant="outline" size="icon" class="hidden md:inline-flex">
				<Settings class="size-5" />
			</Button>
			<NavUser {user} />
		</div>

		<!-- Mobile Sheet -->
		<Sheet.Root bind:open={isSheetOpen}>
			<Sheet.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" size="icon" class="shrink-0 md:hidden" {...props}>
						<Menu class="size-5" />
						<span class="sr-only">Toggle navigation menu</span>
					</Button>
				{/snippet}
			</Sheet.Trigger>
			<Sheet.Content side="left" class="w-80">
				<Sheet.Header class="text-left">
					<Sheet.Title class="flex items-center gap-2">
						<Package2 class="h-6 w-6" />
						Foreum
					</Sheet.Title>
				</Sheet.Header>

				<div class="flex h-full flex-col overflow-y-auto">
					<!-- User Profile Section -->
					<div class="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
						{#if user}
							<a
								href={`/profile/${user.username ?? user.id}`}
								class="flex w-full items-center gap-3"
							>
								<Avatar.Root class="size-10">
									<Avatar.Image src={user.image} alt={user.name} />
									<Avatar.Fallback>{user.name?.slice(0, 2).toUpperCase()}</Avatar.Fallback>
								</Avatar.Root>
								<div class="min-w-0 flex-1">
									<p class="truncate text-sm font-medium">{user.name}</p>
									<p class="truncate text-xs text-muted-foreground">{user.email}</p>
								</div>
							</a>
						{:else}
							<a href="/login" class="text-sm font-medium text-primary">Sign in</a>
						{/if}
					</div>

					<Separator class="my-4" />

					<!-- Navigation Items -->
					<nav class="flex flex-col gap-2 px-4">
						{#each navigationItems as item}
							{@const icon = item.icon}
							<a
								href={item.href}
								class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
								onclick={() => (isSheetOpen = false)}
							>
								<icon class="size-5" />
								{item.label}
							</a>
						{/each}
					</nav>

					<Separator class="my-4" />

					<div class="px-4 py-2">
						<a
							href="/notifications"
							class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
						>
							<Bell class="size-5" />
							<span>Notifications</span>
							{#if unreadCount > 0}
								<span
									class="ml-auto flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-[0.65rem] font-bold text-white"
								>
									{unreadCount}
								</span>
							{/if}
						</a>
					</div>
					<Separator class="my-4" />

					<div class="flex flex-col gap-2 px-2">
						<!-- Categories Section -->
						<Collapsible.Root open>
							<Collapsible.Trigger
								class={buttonVariants({
									variant: 'ghost',
									size: 'sm',
									class: 'flex w-full items-center justify-between px-3 py-2'
								})}
							>
								<span class="text-base font-medium">Links</span>
								<ChevronDown
									class="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
								/>
							</Collapsible.Trigger>
							<Collapsible.Content class="pt-2 pl-4">
								<LeftSidebarMobile {categories} {trendingTags} {topContributors} mobile />
							</Collapsible.Content>
						</Collapsible.Root>

						<!-- More Section -->
						<Collapsible.Root open>
							<Collapsible.Trigger
								class={buttonVariants({
									variant: 'ghost',
									size: 'sm',
									class: 'flex w-full items-center justify-between px-3 py-2'
								})}
							>
								<span class="text-base font-medium">More</span>
								<ChevronDown
									class="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
								/>
							</Collapsible.Trigger>
							<Collapsible.Content class="pt-2 pl-4">
								<RightSidebarMobile {recentPosts} {announcements} mobile />
							</Collapsible.Content>
						</Collapsible.Root>
					</div>
					<Separator class="my-4" />

					<!-- Dark Mode Toggle -->
					<div class="flex items-center justify-between px-4 py-2">
						<div class="flex items-center gap-3">
							{#if isDarkMode}
								<Moon class="size-5" />
							{:else}
								<Sun class="size-5" />
							{/if}
							<span>Dark Mode</span>
						</div>
						<Switch bind:checked={isDarkMode} />
					</div>
					<Separator class="my-4" />

					<!-- Footer -->
					<div class="mt-auto py-4">
						<p class="text-center text-xs text-muted-foreground">
							© 2024 Foreum. All rights reserved.
						</p>
					</div>
				</div>
			</Sheet.Content>
		</Sheet.Root>
	</nav>
</header>
