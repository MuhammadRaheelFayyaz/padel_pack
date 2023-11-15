import axios from 'axios';
import api from '@getneurotic/api';
import { json } from '@sveltejs/kit';

export async function POST({ request, url }) {
	const formData = Object.fromEntries(await request.formData());

	const { customer_id } = formData;
	if (!customer_id) {
		return json({ customer_id: 'Customer ID is required.' }, { status: 422 });
	}

	const customer = await api.get(customer_id);
	if (!customer) {
		return json({ customer_id: 'Customer not found.' }, { status: 404 });
	}

	if (!customer.properties.multisafepay_recurring_id) {
		const initialPayment = await axios.post('', {
			"type": "redirect",
			"gateway": "IDEAL",
			"order_id": "activation-direct-debit",
			"currency": "EUR",
			"amount": 0,
			"description": "Activatie automatische incasso.",
			"payment_options": {
				"notification_method": "POST",
				"notification_url": "https://www.padelpack.nl/api/webhooks/payment",
				"redirect_url": "https://www.padelpack.nl/account/dashboard",
				"cancel_url": "https://www.padelpack.nl/account/dashboard"
			},
			"recurring_model": "unscheduled",
			"customer": {
				"reference": customer.id,
			},
		});

		// Get Order
		if (response.data.success) {
			const order = await axios.get('https://testapi.multisafepay.com/v1/json/orders/${order.data.id}', {
				params: { api_key: VITE_MULTISAFEPAY_API_KEY },
			});

			if (order.data.success) {
				await api.update(customer.id, { multisafepay_recurring_id: order.data.recurring_id });
			}
		}
	}


}