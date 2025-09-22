<script lang="ts">
	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';

	import TailwindIndicator from '$components/shared/tailwind-indicator.svelte';
	import { Toaster } from '$components/ui/sonner';

	let { children } = $props();
</script>

<ModeWatcher />
<TailwindIndicator />

<Toaster />
{@render children?.()}
