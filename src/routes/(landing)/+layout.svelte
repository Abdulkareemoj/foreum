<script lang="ts">
	import Footer from '$components/shared/Footer.svelte';
	import Header from '$components/shared/Header.svelte';

	let { children } = $props();
</script>

<Header />

{@render children()}
<Footer />
