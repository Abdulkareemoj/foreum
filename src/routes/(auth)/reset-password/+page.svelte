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
	import {  resetPasswordSchema } from '$lib/schemas';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	let serverError = $state<string | null>(null);
	let successMessage = $state<string | null>(null);

	let { data } = $props<{
		data: { form: SuperValidated<Infer<typeof resetPasswordSchema>> };
	}>();
	const token = page.url.searchParams.get('token');
	const form = superForm(data.form, {
		validators: zodClient(resetPasswordSchema),
		onSubmit: async ({ formData }) => {
			serverError = null;
			successMessage = null;
			if (!token) {
				// this will be caught by the onError callback
				throw new Error('Invalid or expired reset link.');
			}
			await authClient.resetPassword(
				{
					newPassword: formData.get('password') as string,
					token
				}
			);
		},
		onResult: () => {
			successMessage = 'Password reset successful! Redirecting...';
			setTimeout(() => goto('/login'), 2000);
		},
		onError: (event) => {
			serverError = event.result.error.message;
		}
	});
	const { form: formData, enhance, submitting } = form;
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

		<form method="POST" use:enhance class="space-y-4">
			<Form.Field {form} name="password">
				<Form.Control>
					<Form.Label>New Password</Form.Label>
					<Input type="password" placeholder="Enter new password" bind:value={$formData.password} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="confirmPassword">
				<Form.Control>
					<Form.Label>Confirm Password</Form.Label>
					<Input
						type="password"
						placeholder="Confirm new password"
						bind:value={$formData.confirmPassword}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Button class="w-full" type="submit" disabled={$submitting}>
				{$submitting ? 'Resetting...' : 'Reset Password'}
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
