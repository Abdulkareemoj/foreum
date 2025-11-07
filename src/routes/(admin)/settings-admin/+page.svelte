<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Card from '$lib/components/ui/card';
	import { Settings, Mail, Shield } from '@lucide/svelte';

	let settings = {
		forumName: 'Foreum Community',
		forumDescription: 'A modern forum platform.',
		requireEmailVerification: true,
		allowGuestViewing: false,
		smtpHost: 'smtp.example.com'
	};

	async function handleSave() {
		// TODO: Call TRPC mutation
		alert('Settings saved!');
	}
</script>

<div class="space-y-6 p-6">
	<h1 class="text-2xl font-semibold">General Settings</h1>
	<p class="text-sm text-muted-foreground">Configure core application settings and behavior.</p>

	<form on:submit|preventDefault={handleSave} class="space-y-8">
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<Settings class="size-5" /> General
				</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="space-y-2">
					<Label>Forum Name</Label>
					<Input bind:value={settings.forumName} placeholder="Enter forum name" />
				</div>

				<div class="space-y-2">
					<Label>Forum Description</Label>
					<Textarea
						bind:value={settings.forumDescription}
						placeholder="Short description of the community"
					/>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<Shield class="size-5" /> Security & Access
				</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="flex items-center justify-between">
					<Label>Require Email Verification for Sign Up</Label>
					<Switch bind:checked={settings.requireEmailVerification} />
				</div>

				<div class="flex items-center justify-between">
					<Label>Allow Guest Viewing (Public Read Access)</Label>
					<Switch bind:checked={settings.allowGuestViewing} />
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<Mail class="size-5" /> Email Configuration
				</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="space-y-2">
					<Label>SMTP Host</Label>
					<Input bind:value={settings.smtpHost} placeholder="e.g. smtp.resend.com" />
				</div>
				<p class="text-xs text-muted-foreground">
					Note: SMTP credentials should be managed via environment variables.
				</p>
			</Card.Content>
		</Card.Root>

		<div class="flex justify-end">
			<Button type="submit">Save Settings</Button>
		</div>
	</form>
</div>
