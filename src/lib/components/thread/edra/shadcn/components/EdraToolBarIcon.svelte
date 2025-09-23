<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import type { EdraCommand } from '../../commands/types.js';
	import type { Editor } from '@tiptap/core';
 import * as icons from '@lucide/svelte';
	import EdraToolTip from './EdraToolTip.svelte';

	interface Props {
		class?: string;
		command: EdraCommand;
		editor: Editor;
		style?: string;
		onclick?: () => void;
	}

	const { class: className = '', command, editor, style, onclick ,...props}: Props = $props();

	const Icon = icons[command.iconName as keyof typeof icons];
	const shortcut = command.shortCuts ? ` (${command.shortCuts[0]})` : '';

	const isActive = $derived.by(() => editor.isActive(command.name) || command.isActive?.(editor));
</script>

<EdraToolTip content={command.label} shortCut={shortcut}>
	<Button
		variant="ghost"
		size="icon"
		class={cn(isActive && 'bg-muted', className)}
		onclick={() => {
			if (onclick !== undefined) onclick();
			else command.action(editor);
		}}
		{style}
	>
		<Icon {...props} />
	</Button>
</EdraToolTip>
