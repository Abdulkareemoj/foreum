<script lang="ts">
	import { browser } from '$app/environment';
	import type { Content, Editor } from '@tiptap/core';
	import type { Transaction } from '@tiptap/pm/state';
	import { Edra, EdraToolbar, EdraBubbleMenu } from '$components/thread/edra/shadcn';
	import defaultContent from '$components/thread/edra/default_content';
	import DragHandle from '$components/thread/edra/drag-handle.svelte';

	import { ArrowLeft } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { goto } from '$app/navigation';
	import { Button } from '$components/ui/button';
	import * as Form from '$components/ui/form';
	import { Input } from '$components/ui/input';
	import MultiSelect from '$components/ui/multi-select/multi-select.svelte';
	import * as Select from '$components/ui/select';
	import { threadSchema } from '$lib/schemas';
	import { createTRPC } from '$lib/trpc';

	let { data } = $props<{
		data: {
			form: SuperValidated<Infer<typeof threadSchema>>;
			message?: string;
		};
	}>();

	const form = superForm(data.form, {
		dataType: 'json',
		taintedMessage: null,
		validators: zodClient(threadSchema)
	});
	const { form: formData, errors, enhance } = form;

	const trpc = createTRPC();

	let tagOptions = $state<{ label: string; value: string }[]>([]);
	let categories = $state<Awaited<ReturnType<typeof trpc.category.list.query>>>([]);
	let creating = $state(false);

	// Load categories + tags
	$effect(() => {
		(async () => {
			const cats = await trpc.category.list.query();
			const fetchedTags = await trpc.tag.list.query();

			categories = cats;
			tagOptions = fetchedTags.map((t) => ({
				label: t.name,
				value: t.id
			}));
		})();
	});

	async function handleSubmit() {
		if (!$formData.title.trim() || editor?.isEmpty || !$formData.categoryId) {
			toast.error('Please fill in all required fields');
			return;
		}

		creating = true;
		try {
			const result = await trpc.thread.create.mutate({
				title: $formData.title,
				content: $formData.content,
				categoryId: $formData.categoryId,
				tags: $formData.tags
			});
			toast.success('Thread created successfully!');
			goto(`/threads/${result.id}`);
		} catch (err) {
			console.error(err);
			toast.error('Failed to create thread');
		} finally {
			creating = false;
		}
	}

	// Editor states
	let content = $state<Content>();
	let editor = $state<Editor>();
	let showToolBar = $state(true);
	let showSlashCommands = $state(true);
	let showLinkBubbleMenu = $state(true);
	let showTableBubbleMenu = $state(true);

	$effect(() => {
		$inspect('[DEBUG] Content', content);
		localStorage.setItem('edra-content', JSON.stringify(content));
	});

	if (browser) {
		const rawDataString = localStorage.getItem('edra-content');

		if (rawDataString === null) {
			content = defaultContent;
		} else {
			const rawData: Content = JSON.parse(rawDataString);
			content = rawData;
		}
		$formData.content = content;
	}

	function onUpdate(props: { editor: Editor; transaction: Transaction }) {
		content = props.editor.getJSON();
		$formData.content = content;
	}
</script>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<a href="/threads" class="mb-6 inline-flex items-center">
		<Button variant="ghost" size="sm">
			<ArrowLeft class="mr-2 size-4" /> Back to Threads
		</Button>
	</a>

	<h1 class="mb-6 text-3xl font-bold">Create New Thread</h1>

	<form onsubmit={handleSubmit} class="space-y-6">
		<!-- Title -->
		<Form.Field {form} name="title">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Title</Form.Label>
					<Input {...props} bind:value={$formData.title} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<!-- Tags + Category -->
		<div class="flex flex-col space-y-2">
			<Form.Field {form} name="tags">
				<Form.Control>
					{#snippet children()}
						<Form.Label>Tags</Form.Label>
						<MultiSelect
							options={tagOptions}
							value={$formData.tags?.map((t) => ({ value: t, label: t })) ?? []}
							onChange={(v) => {
								$formData.tags = v.map((t) => t.value);
							}}
							placeholder="Select tags..."
							creatable
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="categoryId">
				<Form.Control>
					<Select.Root type="single" bind:value={$formData.categoryId}>
						<Select.Trigger
							class="w-full focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:focus-visible:ring-indigo-500/40"
						>
							{$formData.categoryId
								? categories.find((cat) => cat.id === $formData.categoryId)?.name
								: 'Select a category'}
						</Select.Trigger>
						<Select.Content>
							{#each categories as category (category.id)}
								<Select.Item value={category.id}>{category.name}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<!-- Content -->
		<Form.Field {form} name="content">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Content</Form.Label>
					<!-- <Textarea {...props} class="mb-2" bind:value={$formData.content} /> -->

					{#if editor && showToolBar}
						<div class="rounded-t border-x border-t">
							<!-- Default Edra toolbar -->
							<div class="overflow-x-auto">
								<div class="min-w-full">
									<EdraToolbar class="flex-nowrap px-2 py-1" {editor} />
								</div>
							</div>
						</div>
						<!-- Add bubble menu -->
						<EdraBubbleMenu {editor} />
						<DragHandle {editor} />
					{/if}
					<div class="rounded-b border">
						<Edra
							class="h-80 overflow-auto"
							bind:editor
							{content}
							{showSlashCommands}
							{showLinkBubbleMenu}
							{showTableBubbleMenu}
							{onUpdate}
						/>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="flex justify-end gap-4">
			<Button type="button" variant="outline" onclick={() => goto('/threads')}>Cancel</Button>
			<Button type="submit" disabled={creating}>
				{creating ? 'Creating...' : 'Create Thread'}
			</Button>
		</div>
	</form>
</div>
