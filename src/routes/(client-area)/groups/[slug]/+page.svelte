<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import * as Avatar from '$components/ui/avatar';
	import * as Tabs from '$lib/components/ui/tabs';
	import { createTRPC } from '$lib/trpc';
	import { renderTipTap } from '$utils';

	const trpc = createTRPC();

	let { params } = $props<{ params: { id: string } }>();

	let group = $state<any>(null);
	let recentThreads = $state<any[]>([]);
	let isLoading = $state(true);
	let activeTab = $state<'overview' | 'forum' | 'members'>('overview');

	$effect(() => {
		// if URL uses ?tab=forum you could read it (optional)
	});

	async function load() {
		isLoading = true;
		try {
			group = await trpc.groups.byId.query({ id: params.id });
			recentThreads = await trpc.groups.threads.query({ groupId: params.id, limit: 5 });
		} catch (err) {
			console.error('Failed to load group', err);
		} finally {
			isLoading = false;
		}
	}

	onMount(() => load());

	function gotoForum() {
		activeTab = 'forum';
		// you could navigate programmatically if desired
	}
</script>

{#if isLoading}
	<div class="space-y-4 p-6">
		<Card.Root class="animate-pulse"><Card.Content class="h-40" /></Card.Root>
	</div>
{:else if !group}
	<div class="p-6 text-center text-muted-foreground">Group not found.</div>
{:else}
	<div class="space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center gap-4">
			<Avatar.Root class="h-16 w-16">
				<Avatar.Image src={group.avatarUrl} />
				<Avatar.Fallback>{group.name?.slice(0, 2).toUpperCase()}</Avatar.Fallback>
			</Avatar.Root>
			<div class="min-w-0 flex-1">
				<h1 class="text-2xl font-bold">{group.name}</h1>
				<p class="text-sm text-muted-foreground">
					{group.memberCount ?? 0} members • {group.privacy}
				</p>
			</div>

			<div class="flex items-center gap-2">
				{#if group.isMember}
					<Button
						variant="outline"
						on:click={() => trpc.groups.leave.mutate({ id: group.id }).then(load)}>Leave</Button
					>
				{:else}
					<Button on:click={() => trpc.groups.join.mutate({ id: group.id }).then(load)}>Join</Button
					>
				{/if}
				{#if group.isModerator}
					<a href={`/groups/${group.id}/settings`}><Button variant="outline">Manage</Button></a>
				{/if}
			</div>
		</div>

		<!-- Tabs -->
		<Tabs.Root value={activeTab}>
			<Tabs.List class="mb-4">
				<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
				<Tabs.Trigger value="forum">Forum</Tabs.Trigger>
				<Tabs.Trigger value="members">Members</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="overview">
				<div class="grid gap-6 lg:grid-cols-3">
					<div class="space-y-4 lg:col-span-2">
						<Card.Root>
							<Card.Header>About</Card.Header>
							<Card.Content>
								<div class="prose dark:prose-invert max-w-none">
									{@html renderTipTap(group.description)}
								</div>
							</Card.Content>
						</Card.Root>

						<Card.Root>
							<Card.Header>Recent posts</Card.Header>
							<Card.Content>
								{#if recentThreads.length === 0}
									<p class="text-sm text-muted-foreground">No threads yet.</p>
								{:else}
									<div class="space-y-4">
										{#each recentThreads as t}
											<a href={`/threads/${t.id}`} class="block rounded p-3 hover:bg-muted/30">
												<div class="font-medium">{t.title}</div>
												<div class="text-sm text-muted-foreground">
													{t.replyCount ?? 0} replies • {new Date(t.createdAt).toLocaleString()}
												</div>
											</a>
										{/each}
									</div>
								{/if}
							</Card.Content>
						</Card.Root>
					</div>

					<div class="space-y-4">
						<Card.Root>
							<Card.Header>Rules</Card.Header>
							<Card.Content>
								{#if group.rules}
									<div class="text-sm text-muted-foreground">
										{@html renderTipTap(group.rules)}
									</div>
								{:else}
									<p class="text-sm text-muted-foreground">No rules posted.</p>
								{/if}
							</Card.Content>
						</Card.Root>

						<Card.Root>
							<Card.Header>Members</Card.Header>
							<Card.Content>
								<div class="flex items-center gap-2">
									<div class="text-sm">{group.memberCount ?? 0} members</div>
									<a href={`/groups/${group.id}/members`} class="ml-auto text-sm text-primary"
										>See all</a
									>
								</div>
							</Card.Content>
						</Card.Root>
					</div>
				</div>
			</Tabs.Content>

			<Tabs.Content value="forum">
				<div>
					<a class="mb-4 inline-block" href={`/groups/${group.id}/forum`}>
						<Button>Open group forum</Button>
					</a>
					<p class="text-sm text-muted-foreground">
						Group forum threads are shown in the forum page.
					</p>
				</div>
			</Tabs.Content>

			<Tabs.Content value="members">
				<div>
					<a href={`/groups/${group.id}/members`}><Button>View members</Button></a>
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</div>
{/if}
