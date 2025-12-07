<script lang="ts">
	import { CheckCheckIcon, CircleCheck, CircleAlert, X, CircleX } from '@lucide/svelte';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import * as Alert from '$components/ui/alert';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import * as Form from '$components/ui/form';
	import { Input } from '$components/ui/input';
	import { Spinner } from '$lib/components/ui/spinner';
	import { isUsernameAvailable, signUp } from '$lib/auth-client';
	import { signUpSchema } from '$lib/schemas';

	let imagePreview = $state<string | null>(null);
	let files = $state<FileList | undefined>(undefined);
	const image = $derived(files?.[0]);
	let serverError = $state<string | null>(null);
	let successMessage = $state<string | null>(null);
	let usernameStatus = $state<'available' | 'unavailable' | 'checking' | null>(null);
	let usernameError = $state<string | null>(null);

	const { data } = $props<{
		form: SuperValidated<Infer<typeof signUpSchema>>;
		message?: string;
	}>();

	const form = superForm(data.form, {
		validators: zodClient(signUpSchema),
		onSubmit: async ({ formData }) => {
			serverError = null;
			successMessage = null;

			try {
				await signUp.email({
					email: formData.get('email') as string,
					password: formData.get('password') as string,
					name: formData.get('name') as string,
					username: (formData.get('username') as string).toLowerCase(),
					displayUsername: formData.get('username') as string,
					image: image ? await convertImageToBase64(image) : ''
				});
			} catch (err) {
				serverError = (err as Error)?.message || 'An unexpected error occurred.';
				throw err;
			}
		},
		onResult: () => {
			// form will be reset, and we'll show a message asking the user to check their email.
			successMessage = 'Account created! Please check your inbox to verify your email.';
		},
		onError: (event) => {
			//  catch errors from the submission, including the one we re-throw.
			serverError = event.result.error.message;
		},
		resetForm: true
	});

	const { form: formData, enhance } = form;

	$effect(() => {
		if (image) {
			const reader = new FileReader();
			reader.onloadend = () => {
				imagePreview = reader.result as string;
			};
			reader.readAsDataURL(image);
		} else {
			imagePreview = null;
		}
	});

	function removeImage() {
		files = undefined;
	}

	async function convertImageToBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	//  real-time username check with debounce
	let usernameTimeout: ReturnType<typeof setTimeout>;
	$effect(() => {
		const username = $formData.username;
		clearTimeout(usernameTimeout);

		if (!username) {
			usernameStatus = null;
			usernameError = null;
			return;
		}

		if (username.length < 3 || username.length > 20) {
			usernameStatus = 'unavailable';
			usernameError = 'Username must be 3-20 characters long.';
			return;
		}

		if (!/^[a-zA-Z0-9_]+$/.test(username)) {
			usernameStatus = 'unavailable';
			usernameError = 'Username can only contain letters, numbers, and underscores.';
			return;
		}

		usernameTimeout = setTimeout(async () => {
			usernameStatus = 'checking';
			usernameError = null;
			try {
				const res = await isUsernameAvailable({ username });
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
	});

</script>

<Card.Root class="mx-auto w-full max-w-md">
	<Card.Header class="space-y-1">
		<Card.Title class="text-center text-2xl font-bold">Sign Up</Card.Title>
		<Card.Description class="text-center">
			Enter your details to create a new account
		</Card.Description>
	</Card.Header>
	
	<form method="POST" use:enhance>
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
							<Spinner size={18} class="absolute right-3 animate-spin text-muted-foreground" />
						{:else if usernameStatus === 'available'}
							<CircleCheck size={18} class="absolute right-3 text-green-500" />
						{:else if usernameStatus === 'unavailable'}
							<CircleX size={18} class="absolute right-3 text-red-500" />
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

						<div class="flex flex-col items-center justify-center gap-4">
							<div class="flex w-full items-center gap-2">
								<Input
									id="image"
									name="image"
									type="file"
									accept="image/*"
									bind:files
									class="w-full"
								/>
							</div>
							{#if imagePreview}
								<div class="flex w-full justify-center gap-4">
									<div class="relative flex size-25 overflow-hidden rounded-sm">
										<img
											src={imagePreview}
											alt="Profile preview"
											class="h-full w-full object-cover"
										/>
									</div>
									<X class="cursor-pointer" onclick={removeImage} />
								</div>
							{/if}
						</div>
					</Form.Control><Form.FieldErrors />
				</Form.Field>
			</div>

			<Button class="w-full" type="submit" disabled={$formData.submitting || usernameStatus === 'unavailable'}>
				{#if $formData.submitting}
					<Spinner size={16} class="animate-spin" />
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
