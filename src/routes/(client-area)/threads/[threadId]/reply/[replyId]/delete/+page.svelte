<script lang="ts">
	import { ArrowLeft, Trash2 } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	import { goto } from '$app/navigation';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import { createTRPC } from '$lib/trpc';

	let { data } = $props<{ data: { threadId: string; replyId: string } }>();
	const { threadId, replyId } = data;

	const trpc = createTRPC();

	let loading = $state(true);
	let deleting = $state(false);
	let replyContent = $state('');

	// ✅ Load reply
	$effect(() => {
		(async () => {
			try {
				const replies = await trpc.reply.list.query({ threadId, limit: 100 });
				const reply = replies.find((r) => r.id === replyId);

				if (!reply) {
					toast.error('Reply not found');
					goto(`/thread/${threadId}`);
					return;
				}

				replyContent = reply.content;
			} catch (err) {
				console.error(err);
				toast.error('Failed to load reply');
				goto(`/thread/${threadId}`);
			} finally {
				loading = false;
			}
		})();
	});

	async function handleDelete() {
		deleting = true;
		try {
			await trpc.reply.delete.mutate({ id: replyId });
			toast.success('Reply deleted successfully');
			goto(`/thread/${threadId}`);
		} catch (err) {
			console.error(err);
			toast.error('Failed to delete reply');
		} finally {
			deleting = false;
		}
	}
</script>

<div class="container mx-auto max-w-3xl px-4 py-8">
	<!-- Header -->
	<div class="mb-8 flex flex-col gap-4">
		<Button
			variant="ghost"
			size="sm"
			href={`/thread/${threadId}`}
			class="inline-flex items-center text-sm text-muted-foreground"
		>
			<ArrowLeft class="mr-2 size-4" /> Back to Thread
		</Button>
		<div>
			<h1 class="text-2xl font-bold">Delete Reply</h1>
			<p class="text-muted-foreground">This action cannot be undone.</p>
		</div>
	</div>

	{#if loading}
		<p>Loading...</p>
	{:else}
		<Card.Root>
			<Card.Content>
				<div class="space-y-6">
					<!-- Reply preview -->
					<div class="rounded-md bg-muted p-4">
						<p>{replyContent}</p>
					</div>

					<p class="text-red-600">
						Are you sure you want to delete this reply? This action is permanent.
					</p>

					<!-- Actions -->
					<div class="flex justify-end gap-4">
						<a href={`/thread/${threadId}`}>
							<Button type="button" variant="outline">Cancel</Button>
						</a>
						<Button onclick={handleDelete} disabled={deleting} variant="destructive">
							<Trash2 class="mr-2 size-4" />
							{deleting ? 'Deleting...' : 'Delete Reply'}
						</Button>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
