import { auth } from '$server/auth';

export async function GET({ request }) {
	return auth.handler(request);
}

export async function POST({ request }) {
	return auth.handler(request);
}
