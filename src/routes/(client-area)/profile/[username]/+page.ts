export async function load({ params, url }) {
	// console.log('Profile load - URL:', url.pathname);
	// console.log('Profile load - Params:', params);
	return {
		username: params.username
	};
}
