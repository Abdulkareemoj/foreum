import { createTRPC } from '$lib/trpc';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const trpc = createTRPC();
	const event = await trpc.events.get.query({ eventId: params.eventId });
	const attendees = await trpc.events.attendees.query({ eventId: params.eventId });
	return { event, attendees };
};
