<script lang="ts">
	import { Button } from '$components/ui/button';
	import { Input } from '$components/ui/input';

	export let value: string | null = null;
	export let onChange: (url: string) => void;

	let preview: string | null = value;

	async function handleFileChange(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		// Show preview immediately
		preview = URL.createObjectURL(file);

		// ⬇️ Replace with real upload (Supabase, S3, Cloudinary, etc.)
		// For now we simulate upload with a fake URL
		const uploadedUrl = preview;
		if (onChange) {
			onChange(uploadedUrl);
		}
	}
</script>

<div class="flex flex-col items-center gap-4">
	<div class="size-24 overflow-hidden rounded-full border">
		{#if preview}
			<img src={preview} alt="Avatar" class="size-full object-cover" />
		{:else}
			<div class="flex h-full w-full items-center justify-center text-muted-foreground">
				No Image
			</div>
		{/if}
	</div>

	<Input
		type="file"
		accept="image/*"
		class="hidden"
		id="avatarInput"
		on:change={handleFileChange}
	/>
	<Button
		type="button"
		variant="outline"
		on:click={() => document.getElementById('avatarInput')?.click()}
	>
		Change Avatar
	</Button>
</div>
