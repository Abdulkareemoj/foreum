<script lang="ts">
	import TextEditor from '$components/shared/TextEditor.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { createTRPC } from '$lib/trpc';

	// Props
	export let threadId: string;
	export let onSubmitted: () => void; // callback prop
	const trpc = createTRPC();
	let content = '';

	const createReply = trpc.reply.create.useMutation({
		onMutate: () => {
			// Optimistically add reply
			replies = [
				...replies,
				{
					id: 'temp',
					author: { id: 'me', name: 'You', image: null }, // fallback author info
					content,
					createdAt: new Date()
				}
			];
			content = '';
		},
		onSuccess: () => {
			trpc.reply.list.invalidate({ threadId });
			onSubmitted?.();
		}
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!content.trim()) return;
		createReply.mutate({ threadId, content });
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="mt-4 space-y-2">
	<Textarea
		bind:value={content}
		placeholder="Your reply…"
		on:keydown={(e) => e.ctrlKey && e.key === 'Enter' && handleSubmit(e)}
	/>
	<TextEditor />
	<Button type="submit" disabled={createReply.isLoading}>
		{createReply.isLoading ? 'Replying…' : 'Reply'}
	</Button>
</form>
