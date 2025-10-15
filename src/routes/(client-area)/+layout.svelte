<script lang="ts">
	import { page } from '$app/state';
	import LeftSidebar from '$components/thread/LeftSidebar.svelte';
	import Navbar from '$components/thread/Navbar.svelte';
	import RightSidebar from '$components/thread/RightSidebar.svelte';
	import { Skeleton } from '$components/ui/skeleton';
	import { createTRPC } from '$lib/trpc';

	let { data, children } = $props<{
		data: { user: any };
		children: any;
	}>();

	let categories = $state<any[]>([]);
	let trendingTags = $state<any[]>([]);
	let topContributors = $state<any[]>([]);
	let recentPosts = $state<any[]>([]);
	let announcements = $state<string[]>([]);
	// let isLeftOpen = $state(false);
	// let isRightOpen = $state(false);
	const trpc = createTRPC();
	let isLoading = $state(true);

	const sidebarConfig: Record<
		string,
		{ left?: boolean; right?: boolean; load: () => Promise<void> }
	> = {
		'/(client-area)/threads': {
			left: true,
			right: true,
			load: async () => {
				isLoading = true;
				[categories, trendingTags, topContributors, recentPosts] = await Promise.all([
					trpc.category.list.query(),
					trpc.tag.popular.query({ limit: 10 }),
					trpc.user.topContributors.query({ limit: 5 }),
					trpc.thread.recent.query({ limit: 5 })
				]);
				announcements = [
					'New feature: Bookmark threads!',
					'Scheduled maintenance at 10 PM UTC',
					'Community Q&A this weekend!'
				];
				isLoading = false;
			}
		},
		'/(client-area)/threads/[threadId]': {
			left: true,
			right: true,
			load: async () => {
				isLoading = true;
				[categories, trendingTags, topContributors, recentPosts] = await Promise.all([
					trpc.category.list.query(),
					trpc.tag.popular.query({ limit: 10 }),
					trpc.user.topContributors.query({ limit: 5 }),
					trpc.thread.recent.query({ limit: 5 })
				]);
				announcements = [
					'New feature: Bookmark threads!',
					'Scheduled maintenance at 10 PM UTC',
					'Community Q&A this weekend!'
				];
				isLoading = false;
			}
		},

		'/(client-area)/bookmarks': {
			left: true,
			right: true,
			load: async () => {
				isLoading = true;
				[categories, trendingTags, topContributors, recentPosts] = await Promise.all([
					trpc.category.list.query(),
					trpc.tag.popular.query({ limit: 10 }),
					trpc.user.topContributors.query({ limit: 5 }),
					trpc.thread.recent.query({ limit: 5 })
				]);
				announcements = [
					'New feature: Bookmark threads!',
					'Scheduled maintenance at 10 PM UTC',
					'Community Q&A this weekend!'
				];
				isLoading = false;
			}
		},
		'/(client-area)/tags': {
			right: true,
			left: true,
			load: async () => {
				isLoading = true;
				[categories, trendingTags] = await Promise.all([
					trpc.category.list.query(),
					trpc.tag.popular.query({ limit: 10 })
				]);
				isLoading = false;
			}
		},
		'/(client-area)/notifications': {
			right: true,
			load: async () => {
				isLoading = true;
				recentPosts = await trpc.thread.recent.query({ limit: 5 });
				isLoading = false;
			}
		},
		'/(client-area)/categories': {
			right: true,
			left: true,
			load: async () => {
				isLoading = true;
				recentPosts = await trpc.thread.recent.query({ limit: 5 });
				isLoading = false;
			}
		}
	};

	let activeSidebar = $derived(page.route.id ? sidebarConfig[page.route.id] : null);

	$effect(() => {
		if (activeSidebar?.load) activeSidebar.load();
	});
</script>

<div class="flex h-screen flex-col bg-background text-foreground">
	<Navbar user={data.user} />

	<!-- Main Layout Below Navbar -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Left Sidebar (desktop) -->
		{#if activeSidebar?.left}
			{#if isLoading}
				<aside class="hidden shrink-0 border-r lg:flex lg:w-72 xl:w-80 2xl:w-96">
					<div class="w-full space-y-4 p-4">
						<Skeleton class="h-6 w-3/4" />
						<Skeleton class="h-6 w-2/3" />
						<Skeleton class="h-32 w-full" />
					</div>
				</aside>
			{:else}
				<LeftSidebar {categories} {trendingTags} {topContributors} />
			{/if}
		{/if}

		<!-- Main Content -->
		<main class="relative min-w-0 flex-1 overflow-y-auto p-2">
			<!-- Mobile sidebar toggles -->
			<!-- <div class="mb-4 flex gap-2 lg:hidden">
				{#if activeSidebar?.left}
					<Button variant="outline" size="sm" onclick={() => (isLeftOpen = true)}>
						<Menu class="mr-1 size-4" /> Menu
					</Button>
				{/if}
				{#if activeSidebar?.right}
					<Button variant="outline" size="sm" onclick={() => (isRightOpen = true)}>
						<Menu class="mr-1 size-4" /> More
					</Button>
				{/if}
			</div> -->

			{@render children?.()}
		</main>

		<!-- Right Sidebar (desktop) -->
		{#if activeSidebar?.right}
			{#if isLoading}
				<aside class="hidden shrink-0 border-l xl:flex xl:w-72 2xl:w-96">
					<div class="w-full space-y-4 p-4">
						<Skeleton class="h-6 w-3/4" />
						<Skeleton class="h-32 w-full" />
						<Skeleton class="h-24 w-full" />
					</div>
				</aside>
			{:else}
				<RightSidebar {recentPosts} {announcements} />
			{/if}
		{/if}
	</div>
</div>
