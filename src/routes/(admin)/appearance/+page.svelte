<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Palette, Code, ArrowRight } from '@lucide/svelte';
</script>

<div class="space-y-6 p-6">
	<h1 class="text-2xl font-semibold">Appearance Settings</h1>
	<p class="text-sm text-muted-foreground">Customize the look and feel of your forum.</p>

	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Palette class="size-5" /> Theme Selection
				</div>
				<Button href="/admin/appearance/themes" variant="ghost" size="sm">
					Manage Themes <ArrowRight class="ml-2 size-4" />
				</Button>
			</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-4">
			<p class="text-muted-foreground">Select or customize your active theme.</p>
			<div class="flex items-center gap-4">
				<div class="size-10 rounded-full border bg-emerald-500"></div>
				<span class="font-medium">Emerald Default (Active)</span>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center gap-2">
				<Code class="size-5" /> Custom CSS
			</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-4">
			<Textarea placeholder="/* Add custom CSS here */" rows={8} />
		</Card.Content>
	</Card.Root>

	<div class="flex justify-end">
		<Button on:click={() => alert('Appearance saved!')}>Save Appearance</Button>
	</div>
</div>
