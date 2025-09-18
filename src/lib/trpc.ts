import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { browser } from '$app/environment';
import type { AppRouter } from '$server/trpc/routers';
import superjson from 'superjson';

function getBaseUrl() {
	if (browser) return '';
	return 'http://localhost:5173'; // Replace with your production URL if deploying
}

export function createTRPC() {
	return createTRPCClient<AppRouter>({
		links: [
			httpBatchLink({
				url: `${getBaseUrl()}/api/trpc`, // This will be relative to the SvelteKit app's base URL
				transformer: superjson
			})
		]
	});
}
