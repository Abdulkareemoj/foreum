import { appRouter } from '$server/trpc/routers';
import type { RequestHandler } from './$types';

interface RouterProcedure {
	name: string;
	type: 'query' | 'mutation' | 'subscription';
	description?: string;
	input?: string;
	output?: string;
}

interface RouterNode {
	name: string;
	procedures: RouterProcedure[];
	description?: string;
}

/**
 * Extract route information from tRPC router
 */
function extractRouterInfo(router: any, prefix = ''): RouterNode[] {
	const nodes: RouterNode[] = [];

	for (const [key, value] of Object.entries(router)) {
		if (!value || typeof value !== 'object') continue;

		const fullPath = prefix ? `${prefix}.${key}` : key;

		// Check if it's a nested router
		if ('_def' in value && 'routes' in value._def) {
			const nestedRoutes = value._def.routes as Record<string, any>;
			const procedures: RouterProcedure[] = [];

			for (const [procKey, procValue] of Object.entries(nestedRoutes)) {
				if (!procValue || typeof procValue !== 'object') continue;

				const procDef = (procValue as any)._def;
				if (!procDef) continue;

				const procedure: RouterProcedure = {
					name: procKey,
					type: procDef.meta?.type || 'query'
				};

				procedures.push(procedure);
			}

			if (procedures.length > 0) {
				nodes.push({
					name: fullPath,
					procedures,
					description: `${key} router`
				});
			}
		}
	}

	return nodes;
}

export const GET: RequestHandler = async () => {
	try {
		const routes = extractRouterInfo(appRouter._def.routes);

		const documentation = {
			title: 'Foreum tRPC API Documentation',
			version: '1.0.0',
			description: 'Complete tRPC router documentation with all available endpoints',
			baseUrl: '/api/trpc',
			routers: routes,
			usage: {
				query: 'GET /api/trpc/[router].[procedure]?input={...}',
				mutation: 'POST /api/trpc/[router].[procedure]',
				example: 'GET /api/trpc/thread.list'
			},
			note: 'All tRPC calls are handled through the unified endpoint. Use the httpBatchLink client for proper type-safe access.'
		};

		return new Response(JSON.stringify(documentation, null, 2), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=3600'
			}
		});
	} catch (error) {
		console.error('Failed to generate tRPC docs:', error);
		return new Response(
			JSON.stringify({
				error: 'Failed to generate documentation',
				message: error instanceof Error ? error.message : 'Unknown error'
			}),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
};
