export const prerender = false;

export async function load({ url }) {
	return { token: url.searchParams.get('token') };
}