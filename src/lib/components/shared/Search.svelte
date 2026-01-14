<script lang="ts">
	import * as Command from '$lib/components/ui/command';
	import { Dialog, DialogContent } from '$lib/components/ui/dialog';
	import { createTRPC } from '$lib/trpc';
	import { goto } from '$app/navigation';
	import { Button } from '$components/ui/button';
	import { MessageSquare, User, Users2, Loader2 } from 'lucide-svelte';

	const trpc = createTRPC();

	let open = $state(false);
	let query = $state('');
	let results: any[] = $state([]);
	let loading = $state(false);

	function handleKeyDown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			open = !open;
		}
	}

	async function search(q: string) {
		query = q;

		if (q.length < 2) {
			results = [];
			return;
		}

		loading = true;
		try {
			results = await trpc.search.global.query({ query: q });
		} catch (error) {
			console.error('[v0] Search error:', error);
		} finally {
			loading = false;
		}
	}

	function openResult(item: any) {
		open = false;

		if (item.type === 'thread') goto(`/threads/${item.id}`);
		if (item.type === 'user') goto(`/profile/${item.title.replace('@', '')}`);
		if (item.type === 'group') goto(`/groups/${item.id}`);
	}

	function groupResults(items: any[]) {
		return {
			threads: items.filter((item) => item.type === 'thread'),
			users: items.filter((item) => item.type === 'user'),
			groups: items.filter((item) => item.type === 'group')
		};
	}

	$effect(() => {
		if (open) {
			document.addEventListener('keydown', handleKeyDown);
			return () => document.removeEventListener('keydown', handleKeyDown);
		}
	});

	const grouped = $derived(groupResults(results));
	const hasResults = $derived(
		grouped.threads.length > 0 || grouped.users.length > 0 || grouped.groups.length > 0
	);
</script>

<svelte:window onkeydown={handleKeyDown} />

<Dialog bind:open>
	<DialogContent class="overflow-hidden p-0 shadow-lg">
		<Command.Root
			class="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:overflow-hidden [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-item]]:px-2"
		>
			<Command.Input
				placeholder="Search threads, users, groups... (⌘K)"
				onInput={(e) => search(e.currentTarget.value)}
				autofocus
			/>

			<Command.List>
				{#if loading}
					<div class="flex items-center justify-center py-6">
						<Loader2 class="mr-2 size-4 animate-spin text-muted-foreground" />
						<span class="text-sm text-muted-foreground">Searching…</span>
					</div>
				{:else if query.length < 2}
					<Command.Empty class="py-6 text-center">
						<p class="text-sm text-muted-foreground">Start typing to search</p>
					</Command.Empty>
				{:else if !hasResults}
					<Command.Empty class="py-6 text-center">
						<p class="text-sm text-muted-foreground">No results found for "{query}"</p>
						<p class="mt-1 text-xs text-muted-foreground/60">Try different keywords</p>
					</Command.Empty>
				{:else}
					<!-- Threads section with icon -->
					{#if grouped.threads.length > 0}
						<Command.Group heading="Threads">
							{#each grouped.threads as item}
								<Command.Item onSelect={() => openResult(item)} class="cursor-pointer">
									<MessageSquare class="mr-2 size-4 text-muted-foreground" />
									<div class="flex-1 overflow-hidden">
										<div class="truncate text-sm">{item.title}</div>
									</div>
								</Command.Item>
							{/each}
						</Command.Group>
					{/if}

					<!-- Users section with icon -->
					{#if grouped.users.length > 0}
						<Command.Group heading="Users">
							{#each grouped.users as item}
								<Command.Item onSelect={() => openResult(item)} class="cursor-pointer">
									<User class="mr-2 size-4 text-muted-foreground" />
									<div class="flex-1 overflow-hidden">
										<div class="truncate text-sm">{item.title}</div>
									</div>
								</Command.Item>
							{/each}
						</Command.Group>
					{/if}

					<!-- Groups section with icon -->
					{#if grouped.groups.length > 0}
						<Command.Group heading="Groups">
							{#each grouped.groups as item}
								<Command.Item onSelect={() => openResult(item)} class="cursor-pointer">
									<Users2 class="mr-2 size-4 text-muted-foreground" />
									<div class="flex-1 overflow-hidden">
										<div class="truncate text-sm">{item.title}</div>
									</div>
								</Command.Item>
							{/each}
						</Command.Group>
					{/if}
				{/if}
			</Command.List>
		</Command.Root>
	</DialogContent>
</Dialog>

<!-- Trigger Button -->
<Button
	onclick={() => (open = true)}
	class="flex w-full items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
>
	<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
		/>
	</svg>
	<span class="hidden sm:inline-flex">Search…</span>
	<span class="inline-flex sm:hidden">⌘K</span>
</Button>
