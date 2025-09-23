<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { Button } from '$components/ui/button';
	import * as Dialog from '$components/ui/dialog';
	import { Textarea } from '$components/ui/textarea';
	import { createTRPC } from '$lib/trpc';

	export let open = false;
	export let onClose: () => void;
	export let targetId: string; // threadId or replyId
	export let type: 'thread' | 'reply' = 'thread';

	const trpc = createTRPC();
	let reason = '';
	let details = '';
	let loading = false;

	async function submitReport() {
		try {
			loading = true;
			await trpc.moderation.createReport.mutate({ report, type, reason, details });
			toast.success('Report submitted');
			onClose();
		} catch {
			toast.error('Failed to submit report');
		} finally {
			loading = false;
		}
	}
</script>

<Dialog.Root bind:open on:close={onClose}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Report {type}</Dialog.Title>
		</Dialog.Header>

		<div class="space-y-4">
			<select bind:value={reason} class="w-full rounded border px-3 py-2">
				<option disabled selected value="">Select a reason</option>
				<option value="spam">Spam</option>
				<option value="abuse">Abuse</option>
				<option value="off-topic">Off-topic</option>
				<option value="other">Other</option>
			</select>
			<Textarea bind:value={details} placeholder="Additional details (optional)" />
		</div>

		<Dialog.Footer>
			<Button variant="ghost" on:click={onClose}>Cancel</Button>
			<Button on:click={submitReport} disabled={!reason || loading}>
				{loading ? 'Submitting...' : 'Submit'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
