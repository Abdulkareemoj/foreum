import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { resetPasswordSchema } from '$lib/schemas';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(resetPasswordSchema));
	return { form };
};
