<script lang="ts">
	import '../app.css';
	import Header from '$components/shared/Header.svelte';

	let { children } = $props();
</script>

<Header />

{@render children()}
