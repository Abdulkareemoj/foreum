import { redirect } from '@sveltejs/kit';

import { auth } from '$server/auth';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request, url }) => {
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session?.user) {
		throw redirect(303, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	// Check if user has admin or moderator role
	const userRole = session.user.role || 'user';
	const hasAdminAccess = userRole
		.split(',')
		.some((role) => ['admin', 'moderator'].includes(role.trim()));

	if (!hasAdminAccess) {
		throw redirect(303, '/');
	}

	return {
		user: session.user
	};
};
