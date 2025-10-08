<script lang="ts">
	import Footer from '$components/shared/Footer.svelte';
	import Header from '$components/shared/Header.svelte';
	let { children } = $props();
</script>

<Header />
<main class="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
	{@render children()}
</main>
<Footer />
