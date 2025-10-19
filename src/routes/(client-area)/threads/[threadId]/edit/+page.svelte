<script lang="ts">
	import { ArrowLeft, Save } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import { Input } from '$components/ui/input';
	import { Label } from '$components/ui/label';
	import * as Select from '$components/ui/select';
	import { Textarea } from '$components/ui/textarea';
	import { createTRPC } from '$lib/trpc';

	let currentUser = $derived(page.data.user);

	let { data } = $props<{ data: { threadId: string } }>();
	const threadId = data.threadId;

	const trpc = createTRPC();

	let loading = $state(true);
	let saving = $state(false);
	let title = $state('');
	let content = $state('');
	let categoryId = $state('');
	let categories = $state<{ id: string; name: string }[]>([]);

	$effect(() => {
		(async () => {
			try {
				const thread = await trpc.thread.byId.query({ id: threadId });
				if (!thread) {
					toast.error('Thread not found');
					goto('/threads');
					return;
				}
				title = thread.title;
				content = thread.content;
				categoryId = thread.category?.id ?? '';

				categories = await trpc.category.list.query();
			} catch (err) {
				console.error(err);
				toast.error('Failed to load thread');
				goto('/threads');
			} finally {
				loading = false;
			}
		})();
	});

	async function handleSave(e: Event) {
		e.preventDefault();
		saving = true;
		try {
			await trpc.thread.update.mutate({ id: threadId, title, content, categoryId });
			toast.success('Thread updated successfully');
			goto(`/threads/${threadId}`);
		} catch (err) {
			console.error(err);
			toast.error('Failed to update thread');
		} finally {
			saving = false;
		}
	}
</script>

<div class="container mx-auto max-w-3xl px-4 py-8">
	<div class="mb-8 flex flex-col gap-4">
		<a href={`/threads/${threadId}`} class="inline-flex items-center text-sm text-muted-foreground">
			<Button variant="ghost" size="sm">
				<ArrowLeft class="mr-2 size-4" /> Back to Thread
			</Button>
		</a>
		<h1 class="text-2xl font-bold">Edit Thread</h1>
	</div>

	{#if loading}
		<p>Loading...</p>
	{:else}
		<form onsubmit={handleSave}>
			<Card.Root>
				<Card.Content class="space-y-6">
					<div class="space-y-2">
						<label for="title" class="text-sm font-medium">Title</label>
						<Input id="title" bind:value={title} placeholder="Thread title" required />
					</div>

					<div class="space-y-2">
						<label for="content" class="text-sm font-medium">Content</label>
						<Textarea
							id="content"
							bind:value={content}
							placeholder="Write your thread..."
							rows={6}
							required
						/>
					</div>

					<div class="space-y-2">
						<Label class="text-sm font-medium">Category</Label>
						<Select.Root type="single" bind:value={categoryId}>
							<Select.Trigger />
							<Select.Content>
								{#each categories as cat}
									<Select.Item value={cat.id}>{cat.name}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					<div class="flex justify-end gap-4">
						<a href={`/threads/${threadId}`}>
							<Button type="button" variant="outline">Cancel</Button>
						</a>
						<Button type="submit" disabled={saving}>
							<Save class="mr-2 size-4" />
							{saving ? 'Saving...' : 'Save Changes'}
						</Button>
					</div>
				</Card.Content>
			</Card.Root>
		</form>
	{/if}
</div>
