import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { verifyEmailSchema } from '$lib/schemas';

export const load = async () => {
	const form = await superValidate(zod(verifyEmailSchema));
	return { form };
};
