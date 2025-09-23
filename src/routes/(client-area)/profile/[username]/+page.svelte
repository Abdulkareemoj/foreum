<script lang="ts">
	import { goto } from '$app/navigation';
	import ThreadCard from '$components/thread/ThreadCard.svelte';
	import { Avatar, AvatarFallback, AvatarImage } from '$components/ui/avatar';
	import { Badge } from '$components/ui/badge';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import { Input } from '$components/ui/input';
	import * as Tabs from '$components/ui/tabs';
	import { authClient } from '$lib/auth-client';
	import { createTRPC } from '$lib/trpc';

	const trpc = createTRPC();

	// ✅ use $props instead of export let
	let { data } = $props<{ data: { username: string } }>();
	const username = data.username;
	let user = $state<any>(null);
	let threads = $state<any[]>([]);
	let popularThreads = $state<any[]>([]);
	let recentThreads = $state<any[]>([]);
	let isLoading = $state(true);

	// ✅ load data whenever username changes
	$effect(() => {
		// console.log('Username prop received:', username, typeof username);

		if (!username) {
			user = null;
			isLoading = false;
			return;
		}

		(async () => {
			isLoading = true;
			try {
				// console.log('Searching for username:', username);
				user = await trpc.user.byUsername.query({ username });
				// console.log('Query result:', user);

				if (user) {
					threads = await trpc.thread.byUser.query({ userId: user.id, limit: 20 });
					popularThreads = await trpc.thread.byUser.query({ userId: user.id, limit: 5 });
					recentThreads = await trpc.thread.byUser.query({ userId: user.id, limit: 5 });
				}
			} catch (e) {
				console.error('Error loading profile:', e);
				user = null;
			} finally {
				isLoading = false;
			}
		})();
	});
</script>

<div class="flex min-h-screen flex-col bg-background">
	<main class="container mx-auto max-w-6xl flex-1 px-4 py-12">
		{#if isLoading}
			<p>Loading profile…</p>
		{:else if !user}
			<p class="text-muted-foreground">User not found.</p>
		{:else}
			<div class="grid gap-8 md:grid-cols-[250px_1fr]">
				<!-- Sidebar -->
				<div class="space-y-6">
					<div class="flex flex-col items-center md:items-start">
						<Avatar class="h-20 w-20 border border-border">
							<AvatarImage src={user.image} alt={user.username} />
							<AvatarFallback>{user.name?.[0] ?? 'U'}</AvatarFallback>
						</Avatar>

						<h1 class="mt-4 text-2xl font-semibold tracking-tight">{user.displayUsername}</h1>
						<p class="text-muted-foreground">{user.name}</p>

						{#if user.website}
							<a
								href={user.website}
								target="_blank"
								rel="noopener noreferrer"
								class="mt-3 text-sm text-muted-foreground hover:underline"
							>
								{user.website}
							</a>
						{/if}
					</div>
					<div>
						<Button variant="outline" href={`/profile/${user.username}/edit`}>Edit Profile</Button>
						<Button
							onclick={async () => {
								try {
									console.log('Button clicked!');
									await authClient.signOut({
										fetchOptions: {
											onSuccess: () => {
												goto('/login');
											},
											onError: (error) => {
												console.error('Logout failed:', error);
											}
										}
									});
								} catch (error) {
									console.error('Logout error:', error);
								}
							}}
						>
							Log Out
						</Button>
					</div>
					<!-- Stats -->
					<div class="space-y-2">
						<h2 class="text-sm font-medium text-muted-foreground">Stats</h2>
						<div class="grid grid-cols-2 gap-2">
							<Card.Root>
								<Card.Content class="flex flex-col items-center justify-center p-4">
									<span class="text-2xl font-semibold">{user.threadCount ?? threads.length}</span>
									<span class="text-xs text-muted-foreground">Threads</span>
								</Card.Content>
							</Card.Root>
							<Card.Root>
								<Card.Content class="flex flex-col items-center justify-center p-4">
									<span class="text-2xl font-semibold">{user.replyCount ?? 0}</span>
									<span class="text-xs text-muted-foreground">Replies</span>
								</Card.Content>
							</Card.Root>
						</div>
					</div>

					<!-- Popular Threads -->
					<div class="space-y-2 border-t pt-4">
						<h2 class="text-sm font-medium text-muted-foreground">Popular Threads</h2>
						<div class="space-y-2">
							{#each popularThreads as thread}
								<a
									href={`/threads/${thread.id}`}
									class="block rounded-md p-2 transition-colors hover:bg-accent"
								>
									<div class="text-sm font-medium">{thread.title}</div>
									<div class="text-xs text-muted-foreground">{thread.replyCount} replies</div>
								</a>
							{/each}
						</div>
					</div>
				</div>

				<!-- Main Content -->
				<div class="space-y-8">
					<!-- Tabs -->
					<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<h2 class="text-xl font-semibold">
							Threads <Badge variant="outline" class="ml-2">{threads.length}</Badge>
						</h2>
						<div class="relative w-full sm:w-auto">
							<Input placeholder="Filter threads..." class="w-full sm:w-[240px]" />
						</div>
					</div>

					<Tabs.Root value="all" class="w-full">
						<Tabs.List class="mb-6 h-auto w-full justify-start border-b bg-transparent p-0">
							<Tabs.Trigger
								value="all"
								class="rounded-none border-b-2 px-4 py-2 data-[state=active]:border-primary"
							>
								All
							</Tabs.Trigger>
							<Tabs.Trigger
								value="popular"
								class="rounded-none border-b-2 px-4 py-2 data-[state=active]:border-primary"
							>
								Popular
							</Tabs.Trigger>
							<Tabs.Trigger
								value="recent"
								class="rounded-none border-b-2 px-4 py-2 data-[state=active]:border-primary"
							>
								Recently Updated
							</Tabs.Trigger>
						</Tabs.List>

						<Tabs.Content value="all">
							{#each threads as thread}
								<ThreadCard {thread} />
							{/each}
						</Tabs.Content>

						<Tabs.Content value="popular">
							{#each popularThreads as thread}
								<ThreadCard {thread} />
							{/each}
						</Tabs.Content>

						<Tabs.Content value="recent">
							{#each recentThreads as thread}
								<ThreadCard {thread} />
							{/each}
						</Tabs.Content>
					</Tabs.Root>
				</div>
			</div>
		{/if}
	</main>
</div>
