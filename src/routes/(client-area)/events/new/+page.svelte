<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { eventSchema } from '$lib/schemas';
	import { Button } from '$components/ui/button';
	import * as Form from '$components/ui/form';
	import { Input } from '$components/ui/input';
	import { Textarea } from '$components/ui/textarea';
	import * as Select from '$components/ui/select';

	let { data }: { data: { form: SuperValidated<Infer<typeof eventSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(eventSchema)
	});
	const { form: formData, errors, enhance } = form;

	// helper reactive
	const isVirtual = $derived($formData.eventType === 'virtual');
	const isPhysical = $derived($formData.eventType === 'physical');
	const isHybrid = $derived($formData.eventType === 'hybrid');
</script>

<div class="container mx-auto max-w-3xl p-6">
	<h1 class="mb-4 text-2xl font-bold">Create Event</h1>

	<form method="POST" use:enhance class="space-y-6">
		<Form.Field {form} name="title">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Title</Form.Label>
					<Input {...props} bind:value={$formData.title} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="description">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Description</Form.Label>
					<Textarea {...props} bind:value={$formData.description} rows={6} />
				{/snippet}
			</Form.Control><Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="eventType">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Event type</Form.Label>
					<Select.Root type="single" bind:value={$formData.eventType}>
						<Select.Trigger class="w-full">
							{$formData.eventType || 'Select event type'}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="physical">Physical</Select.Item>
							<Select.Item value="virtual">Virtual</Select.Item>
							<Select.Item value="hybrid">Hybrid</Select.Item>
							<Select.Item value="other">Other</Select.Item>
						</Select.Content>
					</Select.Root>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		{#if isPhysical || isHybrid}
			<Form.Field {form} name="physicalLocation">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Physical location (address)</Form.Label>
						<Input {...props} bind:value={$formData.physicalLocation} />
					{/snippet}
				</Form.Control><Form.FieldErrors />
			</Form.Field>
		{/if}

		{#if isVirtual || isHybrid}
			<Form.Field {form} name="virtualUrl">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Virtual URL (Zoom, Meet, etc.)</Form.Label>
						<Input {...props} bind:value={$formData.virtualUrl} placeholder="https://..." />
					{/snippet}
				</Form.Control><Form.FieldErrors />
			</Form.Field>
		{/if}

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Form.Field {form} name="startsAt">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Starts at</Form.Label>
						<Input type="datetime-local" {...props} bind:value={$formData.startsAt} />
					{/snippet}
				</Form.Control><Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="endsAt">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Ends at</Form.Label>
						<Input type="datetime-local" {...props} bind:value={$formData.endsAt} />
					{/snippet}
				</Form.Control><Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Form.Field {form} name="maxAttendees">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Max attendees (optional)</Form.Label>
						<Input type="number" min="1" {...props} bind:value={$formData.maxAttendees} />
					{/snippet}
				</Form.Control><Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="category">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Category (optional)</Form.Label>
						<Input {...props} bind:value={$formData.category} />
					{/snippet}
				</Form.Control><Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="flex items-center justify-end gap-3">
			<a href="/events"><Button variant="outline">Cancel</Button></a>
			<Button type="submit">Create event</Button>
		</div>
	</form>
</div>
