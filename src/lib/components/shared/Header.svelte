<script lang="ts">
	import { Button } from '$components/ui/button';
	import Logo from './Logo.svelte';
</script>

<nav class="sticky top-0 z-50 border-b border-border bg-background">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<Logo />

			<div class="hidden items-center space-x-8 md:flex">
				<a href="/features" class="text-muted-foreground transition-colors hover:text-foreground"
					>Features</a
				>
				<a href="/pricing" class="text-muted-foreground transition-colors hover:text-foreground"
					>Pricing</a
				>
				<a href="/docs" class="text-muted-foreground transition-colors hover:text-foreground"
					>Documentation</a
				>
				<Button
					size="xl"
					href="/threads"
					variant="ghost"
					class="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
				>
					Get Started
				</Button>
			</div>
		</div>
	</div>
</nav>
