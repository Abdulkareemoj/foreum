<script lang="ts">
	import { CheckCircle, Loader2, XCircle } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import AvatarUpload from '$components/thread/AvatarUpload.svelte';
	import { Button } from '$components/ui/button';
	import * as Form from '$components/ui/form';
	import { Input } from '$components/ui/input';
	import { Textarea } from '$components/ui/textarea';
	import { isUsernameAvailable } from '$lib/auth-client';
	import { profileSchema } from '$lib/schemas';
	import { createTRPC } from '$lib/trpc';
	import { normalizeUsername } from '$utils';

	// ✅ use $props instead of export let
	let { data } = $props<{ data: import('./$types').PageData }>();

	const form = superForm(data.form, {
		validators: zodClient(profileSchema),
		onResult: ({ result }) => {
			if (result.status === 200) {
				toast.success('Profile updated successfully!');
			} else if (result.status >= 400) {
				toast.error(result.message ?? 'Failed to update profile.');
			}
		}
	});

	const { form: formData, enhance } = form;
	const trpc = createTRPC();

	let usernameStatus: 'available' | 'unavailable' | 'checking' | null = $state<any>(null);
	let usernameTimeout: ReturnType<typeof setTimeout>;
	let loading = $state(false);

	// ✅ reactive check for username availability
	$effect(() => {
		if ($formData.username) {
			clearTimeout(usernameTimeout);
			usernameTimeout = setTimeout(async () => {
				usernameStatus = 'checking';
				try {
					const res = await isUsernameAvailable({ username: $formData.username });
					usernameStatus = res.data?.available ? 'available' : 'unavailable';
				} catch {
					usernameStatus = null;
				}
			}, 500);
		}
	});

	async function handleSubmit() {
		if (usernameStatus === 'unavailable') {
			toast.error('Username is already taken.');
			return;
		}

		loading = true;
		try {
			await trpc.user.updateProfile.mutate({
				...$formData,
				username: normalizeUsername($formData.username)
			});
			toast.success('Profile updated successfully!');
		} catch {
			toast.error('Failed to update profile. Please try again.');
		} finally {
			loading = false;
		}
	}
</script>

<div class="container mx-auto max-w-2xl py-8">
	<h1 class="mb-6 text-3xl font-bold">Edit Profile</h1>

	<form use:enhance onsubmit={handleSubmit} class="space-y-6">
		<!-- Avatar -->
		<Form.Field {form} name="image">
			<Form.Control>
				{#snippet children()}
					<Form.Label>Profile Picture</Form.Label>
					<AvatarUpload value={$formData.image} on:change={(e) => ($formData.image = e.detail)} />
				{/snippet}
			</Form.Control>
		</Form.Field>

		<!-- Name -->
		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Name</Form.Label>
					<Input placeholder="e.g. John Doe" {...props} bind:value={$formData.name} />
				{/snippet}
			</Form.Control>
		</Form.Field>

		<!-- Username with availability -->
		<Form.Field {form} name="username">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Username</Form.Label>
					<div class="relative flex items-center">
						<Input placeholder="Choose a username" class="pr-10" bind:value={$formData.username} />
						{#if usernameStatus === 'checking'}
							<Loader2 size={18} class="absolute right-3 animate-spin text-muted-foreground" />
						{:else if usernameStatus === 'available'}
							<CheckCircle size={18} class="absolute right-3 text-green-500" />
						{:else if usernameStatus === 'unavailable'}
							<XCircle size={18} class="absolute right-3 text-red-500" />
						{/if}
					</div>
				{/snippet}
			</Form.Control>
		</Form.Field>

		<!-- Bio -->
		<Form.Field {form} name="bio">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Bio</Form.Label>
					<Textarea placeholder="Tell us about yourself" {...props} bind:value={$formData.bio} />
				{/snippet}
			</Form.Control>
		</Form.Field>

		<!-- Location -->
		<Form.Field {form} name="location">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Location</Form.Label>
					<Input placeholder="e.g. Lagos, Nigeria" {...props} bind:value={$formData.location} />
				{/snippet}
			</Form.Control>
		</Form.Field>

		<!-- Website -->
		<Form.Field {form} name="website">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Website</Form.Label>
					<Input placeholder="https://yourwebsite.com" {...props} bind:value={$formData.website} />
				{/snippet}
			</Form.Control>
		</Form.Field>

		<div class="flex justify-end gap-4">
			<Button type="submit" disabled={loading || usernameStatus === 'unavailable'}>
				{#if loading}
					<Loader2 size={16} class="animate-spin" />
				{:else}
					Save Changes
				{/if}
			</Button>
		</div>
	</form>
</div>
