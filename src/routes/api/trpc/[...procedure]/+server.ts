import type { RequestHandler } from './$types';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '$server/trpc/routers';
import { createContext } from '$server/trpc/context';

const handler: RequestHandler = async (event) => {
	try {
		return fetchRequestHandler({
			endpoint: '/api/trpc',
			req: event.request,
			router: appRouter,
			createContext: () => createContext(event),
			onError: ({ error, path }) => {
				console.error(`❌ tRPC Error on ${path}:`, error);
			}
		});
	} catch (error) {
		console.error('❌ Unexpected Error in tRPC handler:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};

export const GET = handler;
export const POST = handler;
