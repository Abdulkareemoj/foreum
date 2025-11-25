import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

import { eventSchema } from '$lib/schemas';
import { createTRPC } from '$lib/trpc';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(eventSchema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(eventSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const trpc = createTRPC();

		// server-side create
		try {
			const created = await trpc.events.create.mutate(form.data);
			throw redirect(302, `/events/${created.id}`);
		} catch (err: unknown) {
			console.error('Failed to create event', err);
			return fail(500, { form, error: 'Failed to create event' });
		}
	}
};
