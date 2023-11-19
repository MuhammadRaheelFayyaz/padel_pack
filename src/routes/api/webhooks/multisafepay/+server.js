import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	try {
		const body = await request.json();
		console.log('Webhook Payload:', body.payment_methods[0].status, body.payment_details);
		let paymentStatus=body.payment_methods[0].status
		let recurring_id=body.payment_details.recurring_id??'azbkvpE0up4'
		return json({ success: true }, { status: 200 });
	} catch (error) {
		console.error('Error processing webhook:', error);
		return json({ success: false }, { status: 500 });
	}
}
