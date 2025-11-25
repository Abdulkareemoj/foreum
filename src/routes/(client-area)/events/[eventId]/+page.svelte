<script lang="ts">
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import * as Avatar from '$components/ui/avatar';
	import { createTRPC } from '$lib/trpc';
	import { format } from 'date-fns';
	import { renderTipTap } from '$utils';

	interface Props {
		data: { event: any; attendees: any[] };
	}

	let { data }: Props = $props();

	let event = $state(data.event);
	let attendees = $state(data.attendees ?? []);
	let rsvpLoading = $state(false);
	let myStatus = $state<string | null>(null);

	const trpc = createTRPC();

	async function rsvp(status: 'going' | 'maybe' | 'not_going') {
		rsvpLoading = true;
		try {
			await trpc.events.rsvp.mutate({ eventId: event.id, status });
			attendees = await trpc.events.attendees.query({ eventId: event.id });
			myStatus = status;
		} catch (err) {
			console.error('Failed to RSVP', err);
		} finally {
			rsvpLoading = false;
		}
	}
</script>

w
<div class="container mx-auto max-w-4xl space-y-6 p-6">
	{#if !event}
		<p class="text-muted-foreground">Event not found.</p>
	{:else}
		<Card.Root>
			{#if event.coverImage}
				<div class="h-48 overflow-hidden rounded-t">
					<img src={event.coverImage} class="h-48 w-full object-cover" alt={event.title} />
				</div>
			{/if}

			<Card.Header class="flex items-start justify-between gap-4">
				<div class="min-w-0">
					<h1 class="text-2xl font-bold">{event.title}</h1>
					<div class="text-sm text-muted-foreground">
						{format(new Date(event.startsAt), 'PPP p')} — {format(new Date(event.endsAt), 'PPP p')}
						<span> • </span>
						{#if event.eventType === 'virtual'}Virtual{:else if event.eventType === 'physical'}Physical{:else if event.eventType === 'hybrid'}Hybrid{:else}Other{/if}
					</div>
				</div>

				<div class="flex items-center gap-3">
					{#if event.eventType === 'virtual' || event.virtualUrl}
						<a
							class="hidden sm:inline-block"
							href={event.virtualUrl}
							target="_blank"
							rel="noreferrer"
						>
							<Button>Join Event</Button>
						</a>
					{/if}
					<div class="inline-flex gap-2">
						<Button
							variant={myStatus === 'going' ? 'secondary' : 'ghost'}
							on:click={() => rsvp('going')}
							disabled={rsvpLoading}>Going</Button
						>
						<Button
							variant={myStatus === 'maybe' ? 'secondary' : 'ghost'}
							on:click={() => rsvp('maybe')}
							disabled={rsvpLoading}>Maybe</Button
						>
						<Button
							variant={myStatus === 'not_going' ? 'destructive' : 'ghost'}
							on:click={() => rsvp('not_going')}
							disabled={rsvpLoading}>Not Going</Button
						>
					</div>
				</div>
			</Card.Header>

			<Card.Content>
				{#if event.physicalLocation}
					<div class="mb-4">
						<h3 class="text-sm font-medium">Location</h3>
						<p class="text-sm text-muted-foreground">{event.physicalLocation}</p>
						<!-- Optional: embed map using a component -->
					</div>
				{/if}

				<div class="prose dark:prose-invert max-w-none">
					{@html renderTipTap(event.description)}
				</div>

				<div class="mt-6">
					<h3 class="mb-2 text-sm font-medium">Attendees ({attendees.length})</h3>
					<div class="flex flex-wrap gap-2">
						{#each attendees as a}
							<div class="flex items-center gap-2 rounded border px-2 py-1">
								<Avatar.Root class="h-6 w-6">
									<Avatar.Image src={a.user?.image} />
									<Avatar.Fallback>{a.user?.name?.[0] || 'U'}</Avatar.Fallback>
								</Avatar.Root>
								<div class="text-sm">{a.user?.name}</div>
								<div class="ml-2 text-xs text-muted-foreground">• {a.status}</div>
							</div>
						{/each}
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
