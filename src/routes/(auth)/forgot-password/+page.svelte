<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import * as Alert from '$components/ui/alert';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import * as Form from '$components/ui/form';
	import { Input } from '$components/ui/input';
	import { authClient } from '$lib/auth-client';
	import { forgotPasswordSchema } from '$lib/schemas';

	let loading = $state(false);
	let serverError = $state<string | null>(null);
	let successMessage = $state<string | null>(null);

	let { data } = $props<{
		data: any;
	}>();
	const form = superForm(data.form, { validators: zodClient(forgotPasswordSchema) });
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
			<Alert.Root variant="destructive"
				><Alert.Description>{serverError}</Alert.Description></Alert.Root
			>
		{/if}
		{#if successMessage}
			<Alert.Root><Alert.Description>{successMessage}</Alert.Description></Alert.Root>
		{/if}

		<form method="POST" use:enhance on:submit|preventDefault={onSubmit}>
			<Form.Field {form} name="email">
				<Form.Control>
					<Form.Label>Email</Form.Label>
					<Input type="email" placeholder="Enter your email" />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Button class="w-full" disabled={loading}>
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
