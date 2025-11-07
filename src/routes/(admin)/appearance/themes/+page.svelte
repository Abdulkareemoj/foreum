<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Palette, Check } from '@lucide/svelte';

	const themes = [
		{
			name: 'Emerald Default',
			description: 'The default Foreum theme.',
			active: true,
			primaryColor: '#059669'
		},
		{
			name: 'Blue Ocean',
			description: 'A cool, professional blue theme.',
			active: false,
			primaryColor: '#3b82f6'
		},
		{
			name: 'Sunset Red',
			description: 'A warm, vibrant red and orange theme.',
			active: false,
			primaryColor: '#ef4444'
		}
	];

	let activeTheme = $state(themes.find((t) => t.active)?.name || themes[0].name);

	function activateTheme(themeName: string) {
		activeTheme = themeName;
		// Logic to apply theme...
		alert(`Theme "${themeName}" activated!`);
	}
</script>

<div class="space-y-6 p-6">
	<h1 class="text-2xl font-semibold">Theme Management</h1>
	<p class="text-sm text-muted-foreground">Select and customize the visual theme for your forum.</p>

	<div class="grid gap-6 md:grid-cols-3">
		{#each themes as theme}
			<Card.Root class="flex flex-col justify-between">
				<Card.Header>
					<div class="flex items-center justify-between">
						<Card.Title>{theme.name}</Card.Title>
						<div
							class="size-6 rounded-full border"
							style={`background-color: ${theme.primaryColor};`}
						></div>
					</div>
					<Card.Description>{theme.description}</Card.Description>
				</Card.Header>
				<Card.Footer class="pt-0">
					{#if theme.name === activeTheme}
						<Button disabled variant="secondary" class="w-full">
							<Check class="mr-2 size-4" /> Active
						</Button>
					{:else}
						<Button variant="outline" class="w-full" on:click={() => activateTheme(theme.name)}>
							Activate
						</Button>
					{/if}
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
</div>
