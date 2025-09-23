import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

import { profileSchema } from '$lib/schemas';
import { createTRPC } from '$lib/trpc';
import { normalizeUsername } from '$utils';

export const load = async ({ params }) => {
	const trpc = createTRPC();
	const user = await trpc.user.byUsername.query({ username: params.username });

	if (!user) {
		throw redirect(302, '/404'); // custom not found page
	}

	const form = await superValidate(
		{
			name: user.name || '',
			username: user.username || '',
			displayUsername: user.displayUsername || '',
			image: user.image || '',
			bio: user.profile?.bio || '',
			location: user.profile?.location || '',
			website: user.profile?.website || ''
		},
		zod(profileSchema)
	);

	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(profileSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const trpc = createTRPC();
		const normalizedUsername = normalizeUsername(form.data.username);

		try {
			await trpc.user.updateProfile.mutate({
				...form.data,
				username: normalizedUsername
			});
		} catch (err: any) {
			if (err.message?.includes('Username already taken')) {
				form.errors.username = ['This username is already in use'];
				return fail(409, { form });
			}
			console.error('Profile update failed:', err);
			return fail(500, { form });
		}

		return { form };
	}
};
