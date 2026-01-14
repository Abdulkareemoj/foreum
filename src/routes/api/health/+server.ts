import { performHealthCheck } from '$server/lib/health';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const health = await performHealthCheck();
	const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 503 : 503;

	return new Response(JSON.stringify(health), {
		status: statusCode,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
