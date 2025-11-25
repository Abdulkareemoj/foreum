<script lang="ts">
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import { format } from 'date-fns';

	interface Props {
		data: { events: any[] };
	}

	let { data }: Props = $props();
	let events = $derived(data.events ?? []);
</script>

<div class="container mx-auto max-w-6xl space-y-6 p-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold">Events</h1>
		<div class="flex items-center gap-3">
			<a href="/events/new"><Button>Create event</Button></a>
		</div>
	</div>

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#if events.length === 0}
			<Card.Root>
				<Card.Content class="py-8 text-center text-muted-foreground">
					No upcoming events.
				</Card.Content>
			</Card.Root>
		{:else}
			{#each events as e}
				<a href={`/events/${e.id}`} class="block">
					<Card.Root class="h-full transition hover:shadow-md">
						{#if e.coverImage}
							<div class="h-40 overflow-hidden rounded-t">
								<img src={e.coverImage} class="h-40 w-full object-cover" alt={e.title} />
							</div>
						{/if}
						<Card.Content>
							<div class="flex items-start justify-between gap-3">
								<div class="min-w-0">
									<h3 class="truncate font-semibold">{e.title}</h3>
									<p class="mt-1 line-clamp-2 text-sm text-muted-foreground">
										{e.description}
									</p>
								</div>
							</div>

							<div class="mt-4 flex items-center justify-between text-sm text-muted-foreground">
								<div>
									<div>{format(new Date(e.startsAt), 'PPP p')}</div>
								</div>

								<div class="flex items-center gap-2">
									{#if e.eventType === 'virtual'}
										<span class="inline-flex items-center rounded bg-muted/50 px-2 py-0.5 text-xs"
											>Virtual</span
										>
									{:else if e.eventType === 'physical'}
										<span class="inline-flex items-center rounded bg-muted/50 px-2 py-0.5 text-xs"
											>Physical</span
										>
									{:else if e.eventType === 'hybrid'}
										<span class="inline-flex items-center rounded bg-muted/50 px-2 py-0.5 text-xs"
											>Hybrid</span
										>
									{:else}
										<span class="inline-flex items-center rounded bg-muted/50 px-2 py-0.5 text-xs"
											>Other</span
										>
									{/if}
								</div>
							</div>
						</Card.Content>
					</Card.Root>
				</a>
			{/each}
		{/if}
	</div>
</div>
