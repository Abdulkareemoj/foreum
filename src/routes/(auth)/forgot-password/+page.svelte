<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import * as Alert from '$components/ui/alert';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import * as Form from '$components/ui/form';
	import { Input } from '$components/ui/input';
	import { authClient } from '$lib/auth-client';
	import { forgotPasswordSchema } from '$lib/schemas';
	import { CheckCheckIcon, CircleAlert } from '@lucide/svelte';

	let loading = $state(false);
	let serverError = $state<string | null>(null);
	let successMessage = $state<string | null>(null);
	const { data } = $props<{
		form: SuperValidated<Infer<typeof forgotPasswordSchema>>;
		message?: string;
	}>();
	const form = superForm(data.form, {
		validators: zodClient(forgotPasswordSchema)
	});
	const { form: formData, enhance } = form;

	async function onSubmit() {
		serverError = null;
		successMessage = null;
		try {
			await authClient.requestPasswordReset(
				{
					email: $formData.email,
					redirectTo: `${window.location.origin}/reset-password`
				},
				{
					onSuccess: () => {
						successMessage = 'Password reset link sent! Check your inbox.';
					},
					onError: (ctx) => {
						serverError = ctx.error.message;
					}
				}
			);
		} catch (err: any) {
			serverError = err.message || 'Something went wrong';
		} finally {
			loading = false;
		}
	}
</script>

<Card.Root class="w-full max-w-md">
	<Card.Header class="space-y-1">
		<Card.Title class="text-center text-2xl font-bold">Forgot Password</Card.Title>
		<Card.Description class="text-center">
			Enter your email and we'll send you a reset link
		</Card.Description>
	</Card.Header>

	<Card.Content class="space-y-4">
		{#if serverError}
			<Alert.Root class="border-destructive" variant="destructive">
				<CircleAlert /><Alert.Title>Error</Alert.Title><Alert.Description
					>{serverError}</Alert.Description
				></Alert.Root
			>
		{/if}
		{#if successMessage}
			<Alert.Root class="border-green-600 text-green-600 dark:border-green-400 dark:text-green-400"
				><CheckCheckIcon />
				<Alert.Title>Success</Alert.Title>
				<Alert.Description>{successMessage}</Alert.Description></Alert.Root
			>
		{/if}

		<form on:submit|preventDefault={onSubmit}>
			<Form.Field {form} name="email">
				<Form.Control>
					<Form.Label>Email</Form.Label>
					<Input type="email" placeholder="Enter your email" bind:value={$formData.email} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Button class="w-full" type="submit" disabled={loading}>
				{loading ? 'Sending...' : 'Send Reset Link'}
			</Button>
		</form>
	</Card.Content><Card.Footer class="flex flex-col py-4 text-sm text-muted-foreground">
		<div class="flex w-full justify-between">
			<a href="/login" class="hover:text-primary">Remember Your Password?</a>
			<a href="/signup" class="hover:text-primary">Don’t have an account?</a>
		</div>
	</Card.Footer>
</Card.Root>
