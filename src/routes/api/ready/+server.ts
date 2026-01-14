import { performReadinessCheck } from '$server/lib/health';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const ready = await performReadinessCheck();
	const statusCode = ready.status === 'healthy' ? 200 : 503;

	return new Response(JSON.stringify(ready), {
		status: statusCode,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
