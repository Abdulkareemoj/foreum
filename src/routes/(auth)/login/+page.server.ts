import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { signInSchema } from '$lib/schemas';
import { auth } from '$server/auth';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await auth.api.getSession({ headers: event.request.headers });
	if (session) {
		throw redirect(302, '/threads');
	}
	const form = await superValidate(zod(signInSchema));
	return { form };
};
