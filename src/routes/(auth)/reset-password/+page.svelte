<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Alert from '$components/ui/alert';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import * as Form from '$components/ui/form';
	import { Input } from '$components/ui/input';
	import { authClient } from '$lib/auth-client';
	import { resetPasswordSchema } from '$lib/schemas';

	let loading = $state(false);
	let serverError = $state<string | null>(null);
	let successMessage = $state<string | null>(null);

	let { data } = $props<{
		data: any;
	}>();
	const token = page.url.searchParams.get('token');
	const form = superForm(data.form, { validators: zodClient(resetPasswordSchema) });
	const { form: formData, enhance } = form;

	async function onSubmit() {
		serverError = null;
		successMessage = null;
		if (!token) {
			serverError = 'Invalid or expired reset link.';
			return;
		}
		try {
			await authClient.resetPassword(
				{
					newPassword: $formData.password,
					token
				},
				{
					onSuccess: async () => {
						successMessage = 'Password reset successful!';
						setTimeout(() => goto('/login'), 2000);
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
		<Card.Title class="text-center text-2xl font-bold">Reset Password</Card.Title>
		<Card.Description class="text-center">
			Enter your new password to reset your account
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
			<Form.Field {form} name="password">
				<Form.Control
					><Form.Label>New Password</Form.Label>
					<Input type="password" placeholder="Enter new password" />
				</Form.Control><Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="confirmPassword">
				<Form.Control>
					<Form.Label>Confirm Password</Form.Label>
					<Input type="password" placeholder="Confirm new password" /></Form.Control
				>
				<Form.FieldErrors />
			</Form.Field>

			<Button class="w-full" disabled={loading}>
				{loading ? 'Resetting...' : 'Reset Password'}
			</Button>
		</form>
	</Card.Content>
	<Card.Footer class="flex flex-col py-4 text-sm text-muted-foreground">
		<div class="flex w-full justify-between">
			<a href="/login" class="hover:text-primary">Remember Your Password?</a>
			<a href="/signup" class="hover:text-primary">Don’t have an Account?</a>
		</div>
	</Card.Footer>
</Card.Root>
