<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { createTRPC } from '$lib/trpc';

	import * as Chat from '$lib/components/ui/chat';
	import * as EmojiPicker from '$lib/components/ui/emoji-picker';
	import * as Popover from '$lib/components/ui/popover';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { SmilePlusIcon, SendIcon, PhoneIcon, InfoIcon, VideoIcon } from '@lucide/svelte';

	import { cn } from '$lib/utils';
	import MessageAttachments from '$lib/components/shared/MessageAttachments.svelte';

	const trpc = createTRPC();

	let message = $state('');
	let open = $state(false);

	let conversationData: any = $state(null);
	let messages: any[] = $state([]);

	const conversationId = $derived(page.params.conversationId);

	const initials = (name: string) =>
		name
			.split(' ')
			.map((n) => n[0])
			.join('');

	const time = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

	onMount(async () => {
		if (!conversationId) return;

		const res = await trpc.messaging.getConversation.query({ conversationId });

		conversationData = res;
		messages = res.messages;
	});

	async function sendMessage() {
		if (!message.trim() || !conversationId) return;

		const content = message;
		message = '';

		// optimistic update
		messages.push({
			id: crypto.randomUUID(),
			senderId: conversationData.currentUserId,
			content: content,
			createdAt: new Date()
		});

		// actual send
		await trpc.messaging.sendMessage.mutate({
			conversationId,
			content: content
		});
	}

	function formatShortTime(date: Date) {
		return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
	}
</script>

{#if !conversationData}
	<p class="p-10 text-center text-muted-foreground">Loading conversation...</p>
{:else}
	<!-- TOP BAR -->
	<div class="w-full border border-border">
		<div class="flex place-items-center justify-between border-b bg-background p-2">
			<div class="flex place-items-center gap-2">
				<Avatar.Root>
					<Avatar.Image src={conversationData.otherUser.img} />
					<Avatar.Fallback>
						{initials(conversationData.otherUser.name)}
					</Avatar.Fallback>
				</Avatar.Root>

				<div class="flex flex-col">
					<span class="text-sm font-medium">
						{conversationData.otherUser.name}
					</span>
					<span class="text-xs">
						Active {conversationData.otherUser.lastActive}s ago
					</span>
				</div>
			</div>

			<div class="flex place-items-center">
				<Button variant="ghost" size="icon" class="rounded-full">
					<PhoneIcon />
				</Button>
				<Button variant="ghost" size="icon" class="rounded-full">
					<VideoIcon />
				</Button>
				<Button variant="ghost" size="icon" class="rounded-full">
					<InfoIcon />
				</Button>
			</div>
		</div>

		<!-- MESSAGE LIST -->
		<Chat.List class="max-h-[calc(100vh-180px)] space-y-3 overflow-y-auto p-3">
			{#each messages as msg (msg.id)}
				{@const mine = msg.senderId === conversationData.currentUserId}
				{@const sender = mine ? conversationData.currentUser : conversationData.otherUser}

				<Chat.Bubble variant={mine ? 'sent' : 'received'}>
					<Chat.BubbleAvatar>
						<Chat.BubbleAvatarImage src={sender.img} />
						<Chat.BubbleAvatarFallback>
							{initials(sender.name)}
						</Chat.BubbleAvatarFallback>
					</Chat.BubbleAvatar>

					<Chat.BubbleMessage class="flex flex-col gap-1">
						{#if msg.content}
							<p>{msg.content}</p>
						{/if}
						{#if msg.attachments?.length}
							<MessageAttachments attachments={msg.attachments} />
						{/if}
						<div class="text-xs group-data-[variant='sent']/chat-bubble:text-end">
							{formatShortTime(new Date(msg.createdAt))}
						</div>
					</Chat.BubbleMessage>
				</Chat.Bubble>
			{/each}
		</Chat.List>

		<!-- Input -->
		<form
			onsubmit={(e) => {
				e.preventDefault();
				sendMessage();
			}}
			class="flex items-center gap-2 p-3"
		>
			<EmojiPicker.Root
				onSelect={(e) => {
					message += e.emoji;
					open = false;
				}}
			>
				<Popover.Root bind:open>
					<Popover.Trigger
						class={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'rounded-full')}
					>
						<SmilePlusIcon />
					</Popover.Trigger>
					<Popover.Content class="p-0">
						<EmojiPicker.Search />
						<EmojiPicker.List class="h-[200px]" />
					</Popover.Content>
				</Popover.Root>
			</EmojiPicker.Root>

			<Input bind:value={message} class="flex-1 rounded-full" placeholder="Type a message..." />

			<Button type="submit" size="icon" class="rounded-full" disabled={!message}>
				<SendIcon />
			</Button>
		</form>
	</div>
{/if}
