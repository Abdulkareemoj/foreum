<script lang="ts">
	// In Svelte, we typically handle environment-specific logic in the build process
	// or within the script using import.meta.env for Vite or process.env for webpack/Rollup.
	// However, a common Svelte way to conditionally render based on environment
	// is using a reactive declaration that depends on an environment variable.

	// If you are using Vite:
	const isProduction = import.meta.env.PROD;

	// If you are using webpack or Rollup with environment variables:
	// const isProduction = process.env.NODE_ENV === 'production';

	// In a typical Svelte application, you wouldn't return null from the script block
	// to prevent rendering. You would use a conditional render in the template.
</script>

{#if !isProduction}
	<div
		class="fixed bottom-1 left-1 z-50 flex size-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white"
	>
		<div class="block sm:hidden">xs</div>
		<div class="hidden sm:max-md:block">sm</div>
		<div class="hidden md:max-lg:block">md</div>
		<div class="hidden lg:max-xl:block">lg</div>
		<div class="hidden xl:max-2xl:block">xl</div>
		<div class="hidden 2xl:block">2xl</div>
	</div>
{/if}
