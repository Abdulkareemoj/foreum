import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { forgotPasswordSchema } from '$lib/schemas';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(forgotPasswordSchema));
	return { form };
};
