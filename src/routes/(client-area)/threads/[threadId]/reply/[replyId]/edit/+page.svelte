<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	import { goto } from '$app/navigation';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import { Textarea } from '$components/ui/textarea';
	import { createTRPC } from '$lib/trpc';

	let { data } = $props<{ data: { threadId: string; replyId: string } }>();
	const { threadId, replyId } = data;

	const trpc = createTRPC();

	let loading = $state(true);
	let saving = $state(false);
	let replyContent = $state('');

	// ✅ Load reply when mounted
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

	async function handleSave() {
		saving = true;
		try {
			await trpc.reply.update.mutate({ id: replyId, content: replyContent });
			toast.success('Reply updated');
			goto(`/thread/${threadId}`);
		} catch (err) {
			console.error(err);
			toast.error('Failed to update reply');
		} finally {
			saving = false;
		}
	}
</script>

<div class="container mx-auto max-w-3xl px-4 py-8">
	<Button
		variant="ghost"
		size="sm"
		href={`/thread/${threadId}`}
		class="inline-flex items-center text-sm text-muted-foreground"
	>
		<ArrowLeft class="mr-2 size-4" /> Back to Thread
	</Button>

	<h1 class="my-6 text-2xl font-bold">Edit Reply</h1>

	{#if loading}
		<p>Loading…</p>
	{:else}
		<Card.Root>
			<Card.Content class="space-y-6">
				<Textarea bind:value={replyContent} class="w-full" rows={6} />
				<div class="flex justify-end gap-4">
					<a href={`/thread/${threadId}`}>
						<Button type="button" variant="outline">Cancel</Button>
					</a>
					<Button onclick={handleSave} disabled={saving}>
						{saving ? 'Saving…' : 'Save Changes'}
					</Button>
				</div>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
