import {
	adminClient,
	emailOTPClient,
	oneTapClient,
	usernameClient
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/svelte';

import { PUBLIC_BETTER_AUTH_URL, PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';

export const authClient = createAuthClient({
	/** The base URL of the server (optional if you're using the same domain) */
	baseURL: PUBLIC_BETTER_AUTH_URL,
	plugins: [
		adminClient(),
		oneTapClient({
			clientId: PUBLIC_GOOGLE_CLIENT_ID!,
			promptOptions: {
				maxAttempts: 1
			}
		}),
		emailOTPClient(),
		usernameClient()
	]
});

export const {
	signUp,
	signIn,
	signOut,
	useSession,
	getSession,
	forgetPassword,
	resetPassword,
	isUsernameAvailable,
	sendVerificationEmail,
	requestPasswordReset
} = authClient;
