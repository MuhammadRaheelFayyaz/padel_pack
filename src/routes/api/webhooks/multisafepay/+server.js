export async function POST({ request }) {
	const data = Object.fromEntries(await request.json());

	// ...

	// ...
}