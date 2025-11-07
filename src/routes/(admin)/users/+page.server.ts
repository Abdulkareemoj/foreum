import { auth } from '$server/auth';

export const actions = {
	deleteUser: async ({ request }) => {
		const session = await auth.api.getSession({ headers: request.headers });

		const canDelete = await auth.api.userHasPermission({
			body: {
				userId: session.user.id,
				permissions: { user: ['delete'] }
			}
		});

		if (!canDelete) {
			return { error: 'Only admins can delete users' };
		}
		// Proceed with deletion
	},

	banUser: async ({ request }) => {
		const session = await auth.api.getSession({ headers: request.headers });

		const canBan = await auth.api.userHasPermission({
			body: {
				userId: session.user.id,
				permissions: { user: ['ban'] }
			}
		});

		if (!canBan) {
			return { error: 'Insufficient permissions' };
		}
		// Both moderators and admins can ban
	}
};
