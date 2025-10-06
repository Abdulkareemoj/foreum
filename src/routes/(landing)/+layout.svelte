<script lang="ts">
	import Header from '$components/shared/Header.svelte';

	let { children } = $props();
</script>

<Header />

{@render children()}
