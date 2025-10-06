<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import DragHandle from '$components/thread/edra/drag-handle.svelte';
	import { Edra, EdraToolbar, EdraBubbleMenu } from '$components/thread/edra/shadcn';
	import { createTRPC } from '$lib/trpc';
	import type { Editor } from '@tiptap/core';

	// Props
	export let threadId: string;
	export let onSubmitted: () => void; // callback prop
	const trpc = createTRPC();
	let content: string = '<p></p>';
	let isLoading = false;

	let editor: Editor | undefined;
	let showToolBar = true;
	let showSlashCommands = true;
	let showLinkBubbleMenu = true;
	let showTableBubbleMenu = true;

	const onUpdate = ({ editor }: { editor: Editor }) => {
		content = editor.getHTML();
	};

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!content.trim() || content === '<p></p>') return;

		isLoading = true;
		try {
			await trpc.reply.create.mutate({ threadId, content });
			// Reset content and editor
			content = '<p></p>';
			editor?.commands.setContent(content);
			// Notify parent
			onSubmitted?.();
		} catch (error) {
			console.error('Failed to submit reply:', error);
			// Optionally, show an error to the user
		} finally {
			isLoading = false;
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="mt-4 space-y-2">
	{#if editor && showToolBar}
		<div class="rounded-t border-x border-t">
			<div class="overflow-x-auto">
				<div class="min-w-full">
					<EdraToolbar class="flex-nowrap px-2 py-1" {editor} />
				</div>
			</div>
		</div>
		<EdraBubbleMenu {editor} />
		<DragHandle {editor} />
	{/if}
	<div class="rounded-b border">
		<Edra
			class="h-40 overflow-auto p-4"
			bind:editor
			{content}
			{showSlashCommands}
			{showLinkBubbleMenu}
			{showTableBubbleMenu}
			{onUpdate}
		/>
	</div>

	<Button type="submit" disabled={isLoading}>
		{isLoading ? 'Replying…' : 'Reply'}
	</Button>
</form>
