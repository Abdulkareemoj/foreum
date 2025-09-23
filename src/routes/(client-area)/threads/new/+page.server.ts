import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { threadSchema } from '$lib/schemas';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(threadSchema))
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, threadSchema);
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// Parse the JSON content from the editor
			const content = JSON.parse(form.data.content);

			const trpc = createTRPC();
			await trpc.thread.create.mutate({
				...form.data,
				content: content
			});
		} catch (error) {
			return fail(500, {
				form,
				message: 'Failed to create thread'
			});
		}

		throw redirect(303, '/threads');
	}
};
