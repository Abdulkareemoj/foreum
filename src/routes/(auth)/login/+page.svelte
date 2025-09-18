<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { signInSchema } from '$lib/schemas';
	import { signIn } from '$lib/auth-client';
	import { cn } from '$lib/utils';

	import * as Form from '$components/ui/form';
	import { Input } from '$components/ui/input';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import { Checkbox } from '$components/ui/checkbox';
	import { Label } from '$components/ui/label';
	import * as Alert from '$components/ui/alert';
	import { Loader2 } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let loading = $state(false);
	let serverError = $state<string | null>(null);
	let rememberMe = $state(false);

	const { data } = $props<{
		form: SuperValidated<Infer<typeof signInSchema>>;
		message?: string;
	}>();

	const form = superForm(data.form, {
		validators: zodClient(signInSchema)
	});

	const { form: formData, enhance, submitting, message } = form;
	async function onSubmit() {
		serverError = null;
		try {
			await signIn.email(
				{ email: $formData.email, password: $formData.password, rememberMe },
				{
					onResponse: () => {
						loading = false;
					},
					onRequest: () => {
						loading = true;
					},
					onError: (ctx) => {
						if (ctx.error.status === 403) {
							serverError = 'Please verify your email before signing in.';
						} else {
							serverError = ctx.error.message;
						}
					},
					onSuccess: async () => {
						toast.success('Logged in successfully!');
						goto('/threads');
					}
				}
			);
		} catch (err: any) {
			serverError = err?.message || 'Something went wrong';
		}
	}

	async function handleSocialLogin(provider: 'google' | 'discord') {
		try {
			await signIn.social(
				{ provider, callbackURL: '/dashboard' },
				{
					onResponse: () => {
						loading = false;
					},
					onRequest: () => {
						loading = true;
					},
					onError: (ctx) => {
						toast.error(ctx.error.message);
					},
					onSuccess: async () => {
						goto('/threads');
					}
				}
			);
		} catch (err: any) {
			serverError = err?.message || 'Social login failed';
		}
	}
</script>

<Card.Root class="w-full max-w-md">
	<Card.Header class="space-y-1">
		<Card.Title class="text-center text-2xl font-bold">Sign In</Card.Title>
		<Card.Description class="text-center">
			Enter your details to sign in to your account
		</Card.Description>
	</Card.Header>

	<form on:submit|preventDefault={onSubmit}>
		<Card.Content class="space-y-4">
			{#if serverError}
				<Alert.Root variant="destructive">
					<Alert.Title>Error</Alert.Title>
					<Alert.Description>{serverError}</Alert.Description>
				</Alert.Root>
			{/if}

			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email or Username</Form.Label>
						<Input
							placeholder="Enter your email or username"
							{...props}
							bind:value={$formData.email}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Password</Form.Label>
						<Input
							type="password"
							placeholder="Enter your password"
							{...props}
							bind:value={$formData.password}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="flex items-center gap-2">
				<Checkbox id="remember" bind:checked={rememberMe} />
				<Label for="remember">Remember me</Label>
			</div>

			<Button class="w-full" type="submit" disabled={$submitting}>
				{#if $submitting}
					<Loader2 class="size-5 animate-spin" />
				{:else}
					Login
				{/if}
			</Button>

			<div class="relative my-4">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-300" />
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="bg-background px-2 text-muted-foreground">Or continue with</span>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-3">
				<Button
					variant="outline"
					class={cn('w-full gap-2')}
					onclick={() => handleSocialLogin('google')}
					disabled={$submitting}
				>
					Google
				</Button>

				<Button
					variant="outline"
					class={cn('w-full gap-2')}
					onclick={() => handleSocialLogin('discord')}
					disabled={$submitting}
				>
					Discord
				</Button>
			</div>
		</Card.Content>

		<Card.Footer class="flex flex-col py-4 text-sm text-muted-foreground">
			<div class="flex w-full justify-between">
				<a href="/forgot-password" class="hover:text-primary">Forgot Password?</a>
				<a href="/signup" class="hover:text-primary">Don’t have an account?</a>
			</div>
		</Card.Footer>
	</form>
</Card.Root>
