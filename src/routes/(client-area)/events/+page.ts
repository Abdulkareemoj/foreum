import { createTRPC } from '$lib/trpc';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const trpc = createTRPC();
	const events = await trpc.events.list.query({ upcoming: true }); // <-- use expected key

	return { events };
};
