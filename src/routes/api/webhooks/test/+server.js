import { json } from '@sveltejs/kit';
import { client } from '$lib/utilities/multisafepayService';
export async function POST({ request }) {
	try {
		const order = await request.json();
		console.group('order, ', order);
		async function myFunction() {
			console.log('Function called every second!');
			const orderResponse = client.orders
				.create({
					...order
				})
				.catch((e) => {
					console.error('error');
					throw e;
				});
		}
		myFunction();
		setInterval(myFunction, 5 * 1000);

		return json({ success: true }, { status: 200 });
	} catch (error) {
		throw error;
	}
}
