<script lang="ts">
	
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Alert from '$components/ui/alert';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import { Spinner } from '$lib/components/ui/spinner';
	import { authClient } from '$lib/auth-client';

	let verifying = $state(true);
	let error = $state<string | null>(null);
	let success = $state<string | null>(null);
	let loading = $state(true);
	const email = $derived(page.url.searchParams.get('email') || '');
	onMount(async () => {
		const token = page.url.searchParams.get('token');

		if (!token) {
			error = 'Invalid verification link.';
			verifying = false;
			return;
		}

		try {
			await authClient.verifyEmail({
				query: { token }
			});
			success = 'Your email has been verified successfully!';
			setTimeout(() => goto('/threads'), 2000);
		} catch (err: any) {
			error = err?.message || 'Failed to verify email. Please try again.';
		} finally {
			verifying = false;
		}
	});

	async function handleResend() {
		loading = true;
		try {
			await authClient.sendVerificationEmail({ email: email });
			success = 'Verification email resent! Please check your inbox.';
			error = null;
		} catch (err: any) {
			error = err?.message || 'Failed to resend verification email.';
		} finally {
			loading = false;
		}
	}
</script>

<Card.Root class="mx-auto mt-20 w-full max-w-md">
	<Card.Header class="space-y-2 text-center">
		<Card.Title class="text-xl font-semibold">Email Verification</Card.Title>
		<Card.Description>Please wait while we verify your email address.</Card.Description>
	</Card.Header>

	<Card.Content class="space-y-4 text-center">
		{#if verifying}
			<div class="flex items-center justify-center gap-2 text-muted-foreground">
				<Spinner class="animate-spin" size={20} />
				<span>Verifying your email...</span>
			</div>
		{/if}
		{#if error}
			<Alert.Root variant="destructive">
				<Alert.Title>Verification Failed</Alert.Title>
				<Alert.Description>{error}</Alert.Description>
			</Alert.Root>

			<div class="mt-4 flex justify-center">
				<Button onclick={handleResend} disabled={loading}>
					{#if loading}
						Sending...
					{:else}
						Resend Verification Email
					{/if}
				</Button>
			</div>
		{/if}

		{#if success}
			<Alert.Root>
				<Alert.Title>Success</Alert.Title>
				<Alert.Description>{success}</Alert.Description>
			</Alert.Root>
		{/if}
	</Card.Content>
</Card.Root>
