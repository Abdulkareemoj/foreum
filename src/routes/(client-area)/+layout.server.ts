import { redirect } from '@sveltejs/kit';

import { auth } from '$server/auth';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request, url }) => {
	const session = await auth.api.getSession({ headers: request.headers });
	const isProfilePage = url.pathname.match(/^\/profile\/[^\\/]+$/);

	// If not logged in, redirect to login page
	if (!session?.user && !isProfilePage) {
		throw redirect(303, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	return {
		user: session?.user
	};
};

//Might need to rewrite middleware for this
