<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import { Input } from '$components/ui/input';
	import { createTRPC } from '$lib/trpc';

	const trpc = createTRPC();

	let groups = $state<any[]>([]);
	let q = $state('');
	let isLoading = $state(true);

	async function loadGroups() {
		isLoading = true;
		try {
			groups = await trpc.groups.list.query({ search: q || undefined, limit: 40 });
		} catch (err) {
			console.error('Failed loading groups', err);
		} finally {
			isLoading = false;
		}
	}

	$effect(() => {
		// debounce search a tiny bit
		const t = setTimeout(() => loadGroups(), 220);
		return () => clearTimeout(t);
	});

	onMount(() => loadGroups());
</script>

<div class="space-y-6 p-6">
	<div class="flex items-center justify-between gap-4">
		<h1 class="text-2xl font-semibold">Groups</h1>

		<div class="flex items-center gap-3">
			<Input placeholder="Search groups..." bind:value={q} class="min-w-[220px]" />
			<a href="/groups/new">
				<Button>Create Group</Button>
			</a>
		</div>
	</div>

	{#if isLoading}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each Array(6) as _}
				<Card.Root class="animate-pulse">
					<Card.Content class="h-32" />
				</Card.Root>
			{/each}
		</div>
	{:else if groups.length === 0}
		<Card.Root>
			<Card.Content class="py-8 text-center text-muted-foreground">No groups found.</Card.Content>
		</Card.Root>
	{:else}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each groups as group}
				<a href={`/groups/${group.id}`} class="block">
					<Card.Root class="h-full transition hover:shadow-md">
						<div class="h-32 overflow-hidden rounded-t border-b bg-muted/10">
							{#if group.bannerUrl}
								<img src={group.bannerUrl} class="h-32 w-full object-cover" alt={group.name} />
							{:else}
								<div class="flex h-32 w-full items-center justify-center text-muted-foreground">
									<span class="text-sm">{group.name}</span>
								</div>
							{/if}
						</div>
						<Card.Content>
							<div class="flex items-start justify-between gap-3">
								<div class="min-w-0">
									<h3 class="truncate font-semibold">{group.name}</h3>
									<p class="mt-1 line-clamp-2 text-sm text-muted-foreground">
										{group.shortDescription}
									</p>
								</div>
							</div>

							<div class="mt-4 flex items-center justify-between text-sm text-muted-foreground">
								<div>{group.memberCount ?? 0} members</div>
								<div>
									<span class="inline-flex items-center rounded bg-muted/50 px-2 py-0.5 text-xs">
										{group.privacy === 'private' ? 'Private' : 'Public'}
									</span>
								</div>
							</div>
						</Card.Content>
					</Card.Root>
				</a>
			{/each}
		</div>
	{/if}
</div>
