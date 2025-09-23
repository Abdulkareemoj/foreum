<script lang="ts">
	import { ArrowLeft, Trash2 } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import { createTRPC } from '$lib/trpc';

	let currentUser = $derived(page.data.user);

	let { data } = $props<{ data: { threadId: string } }>();
	const threadId = data.threadId;

	const trpc = createTRPC();

	let loading = $state(true);
	let deleting = $state(false);
	let threadTitle = $state('');
	let threadContent = $state('');

	$effect(() => {
		(async () => {
			try {
				const thread = await trpc.thread.byId.query({ id: threadId });
				if (!thread) {
					toast.error('Thread not found');
					goto('/thread');
					return;
				}

				threadTitle = thread.title;
				threadContent = thread.content;
			} catch (err) {
				console.error(err);
				toast.error('Failed to load thread');
				goto('/thread');
			} finally {
				loading = false;
			}
		})();
	});

	async function handleDelete() {
		deleting = true;
		try {
			await trpc.thread.delete.mutate({ id: threadId });
			toast.success('Thread deleted successfully');
			goto('/thread');
		} catch (err) {
			console.error(err);
			toast.error('Failed to delete thread');
		} finally {
			deleting = false;
		}
	}
</script>

<div class="container mx-auto max-w-3xl px-4 py-8">
	<div class="mb-8 flex flex-col gap-4">
		<a href={`/thread/${threadId}`} class="inline-flex items-center text-sm text-muted-foreground">
			<Button variant="ghost" size="sm">
				<ArrowLeft class="mr-2 size-4" /> Back to Thread
			</Button>
		</a>
		<div>
			<h1 class="text-2xl font-bold">Delete Thread</h1>
			<p class="text-muted-foreground">This action cannot be undone.</p>
		</div>
	</div>

	{#if loading}
		<p>Loading...</p>
	{:else}
		<Card.Root>
			<Card.Content>
				<div class="space-y-6">
					<!-- Preview -->
					<div class="rounded-md bg-muted p-4">
						<h2 class="mb-2 font-semibold">{threadTitle}</h2>
						<p>{threadContent.slice(0, 200)}{threadContent.length > 200 ? '...' : ''}</p>
					</div>

					<p class="text-red-600">
						Are you sure you want to delete this thread? This will also remove all replies.
					</p>

					<div class="flex justify-end gap-4">
						<a href={`/thread/${threadId}`}>
							<Button type="button" variant="outline">Cancel</Button>
						</a>
						<Button onclick={handleDelete} disabled={deleting} variant="destructive">
							<Trash2 class="mr-2 size-4" />
							{deleting ? 'Deleting...' : 'Delete Thread'}
						</Button>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
