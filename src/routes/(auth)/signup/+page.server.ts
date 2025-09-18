import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { signUpSchema } from '$lib/schemas';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(signUpSchema));
	return { form, message: null };
};
