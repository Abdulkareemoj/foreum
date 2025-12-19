// routes/(client-area)/events/+page.ts
import { createTRPC } from '$lib/trpc';

const trpc = createTRPC();

export async function load() {
	const events = await trpc.events.list.query();
	return { events };
}
