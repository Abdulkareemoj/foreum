<script lang="ts">
	import Navbar from '$components/shared/Navbar.svelte';

	let { children } = $props();
</script>

<Navbar />
<main class="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
	{@render children()}
</main>
