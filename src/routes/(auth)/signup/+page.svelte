<script lang="ts">
	import { CheckCheckIcon,CheckCircle, CircleAlert, Loader2, X, XCircle } from '@lucide/svelte';
	import { username } from 'better-auth/plugins';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { goto } from '$app/navigation';
	import * as Alert from '$components/ui/alert';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import * as Form from '$components/ui/form';
	import { Input } from '$components/ui/input';
	import { isUsernameAvailable,signUp } from '$lib/auth-client';
	import { signUpSchema } from '$lib/schemas';

	let image = $state<File | null>(null);
	let imagePreview = $state<string | null>(null);

	let loading = $state(false);
	let serverError = $state<string | null>(null);
	let successMessage = $state<string | null>(null);

	// username availability state
	// TODO: probably check length and valid chars before calling API
	let usernameStatus = $state<'available' | 'unavailable' | 'checking' | null>(null);
	let usernameError = $state<string | null>(null);

	const { data } = $props<{
		form: SuperValidated<Infer<typeof signUpSchema>>;
		message?: string;
	}>();

	const form = superForm(data.form, {
		validators: zodClient(signUpSchema)
	});

	const { form: formData, enhance } = form;

	function handleImageChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			image = file;
			const reader = new FileReader();
			reader.onloadend = () => {
				imagePreview = reader.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function removeImage() {
		image = null;
		imagePreview = null;
	}

	async function convertImageToBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	//real-time username check with debounce
	let usernameTimeout: ReturnType<typeof setTimeout>;
	$effect(() => {
		if ($formData.username) {
			clearTimeout(usernameTimeout);
			usernameTimeout = setTimeout(async () => {
				usernameStatus = 'checking';
				usernameError = null;
				try {
					const res = await isUsernameAvailable({ username: $formData.username });
					if (res.data?.available) {
						usernameStatus = 'available';
					} else {
						usernameStatus = 'unavailable';
						usernameError = 'Username is already taken';
					}
				} catch (err) {
					usernameStatus = null;
					usernameError = 'Could not verify username';
				}
			}, 500);
		}
	});

	async function handleSignUp() {
		loading = true;
		serverError = null;
		successMessage = null;

		try {
			await signUp.email({
				email: $formData.email,
				password: $formData.password,
				name: $formData.name,

				username: $formData.username.toLowerCase(),
				displayUsername: $formData.username,
				image: image ? await convertImageToBase64(image) : '',
				callbackURL: '/threads',
				fetchOptions: {
					onResponse: () => {
						loading = false;
					},
					onRequest: () => {
						loading = true;
					},
					onError: (ctx) => {
						serverError = ctx.error.message;
					},
					onSuccess: async () => {
						successMessage = 'Account created successfully!';
						setTimeout(() => goto('/threads	'), 1500);
					}
				}
			});
		} catch (err) {
			serverError = (err as Error)?.message || 'Something went wrong';
		} finally {
			loading = false;
		}
	}
</script>

<Card.Root class="mx-auto w-full max-w-md">
	<Card.Header class="space-y-1">
		<Card.Title class="text-center text-2xl font-bold">Sign Up</Card.Title>
		<Card.Description class="text-center">
			Enter your details to create a new account
		</Card.Description>
	</Card.Header>

	<form on:submit|preventDefault={handleSignUp}>
		<Card.Content class="space-y-4">
			<!-- Alerts -->
			{#if serverError}
				<Alert.Root class="border-destructive" variant="destructive">
					<CircleAlert /><Alert.Title>Error</Alert.Title>
					<Alert.Description>{serverError}</Alert.Description>
				</Alert.Root>
			{/if}

			{#if successMessage}
				<Alert.Root
					class="border-green-600 text-green-600 dark:border-green-400 dark:text-green-400"
				>
					<CheckCheckIcon />
					<Alert.Title>Success</Alert.Title>
					<Alert.Description>{successMessage}</Alert.Description>
				</Alert.Root>
			{/if}
			<!-- Full Name -->
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Full Name</Form.Label>
						<Input placeholder="e.g. John Doe" {...props} bind:value={$formData.name} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Username with availability indicator -->
			<Form.Field {form} name="username">
				<Form.Control>
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
				</Form.Control>
				<Form.FieldErrors />
				{#if usernameError}
					<p class="mt-1 text-sm text-red-500">{usernameError}</p>
				{/if}
			</Form.Field>

			<!-- Email -->
			<Form.Field {form} name="email">
				<Form.Control>
					<Form.Label>Email</Form.Label>
					<Input type="email" placeholder="Enter your email" bind:value={$formData.email} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Password -->
			<Form.Field {form} name="password">
				<Form.Control>
					<Form.Label>Password</Form.Label>
					<Input type="password" placeholder="Create a password" bind:value={$formData.password} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Confirm Password -->
			<Form.Field {form} name="confirmPassword">
				<Form.Control>
					<Form.Label>Confirm Password</Form.Label>
					<Input
						type="password"
						placeholder="Confirm your password"
						bind:value={$formData.confirmPassword}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Profile Image -->
			<div class="grid gap-2">
				<Form.Field {form} name="image">
					<Form.Control>
						<Form.Label>Profile Image (optional)</Form.Label>

						<div class="flex items-end gap-4">
							{#if imagePreview}
								<div class="relative h-16 w-16 overflow-hidden rounded-sm">
									<img
										src={imagePreview}
										alt="Profile preview"
										class="h-full w-full object-cover"
									/>
								</div>
							{/if}
							<div class="flex w-full items-center gap-2">
								<Input
									id="image"
									type="file"
									accept="image/*"
									on:change={handleImageChange}
									class="w-full"
								/>
								{#if imagePreview}
									<X class="cursor-pointer" on:click={removeImage} />
								{/if}
							</div>
						</div>
					</Form.Control><Form.FieldErrors />
				</Form.Field>
			</div>

			<Button class="w-full" type="submit" disabled={loading || usernameStatus === 'unavailable'}>
				{#if loading}
					<Loader2 size={16} class="animate-spin" />
				{:else}
					Create an account
				{/if}
			</Button>
		</Card.Content>
	</form>

	<Card.Footer class="flex justify-center">
		<a href="/login" class="pt-5 text-sm text-muted-foreground hover:text-primary">
			Already have an account? Sign In
		</a>
	</Card.Footer>
</Card.Root>
