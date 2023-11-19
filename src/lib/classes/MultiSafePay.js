const MSP = {};

const API_KEY = import.meta.env.MSP_API_KEY;

MSP.createInitialPayment = async (customerId) => {
	try {
		const response = await axios.post(`https://testapi.multisafepay.com/v1/json/orders?api_key=${API_KEY}`, {
			"type": "redirect",
			"gateway": "IDEAL",
			"order_id": "activation-direct-debit-" + customerId,
			"currency": "EUR",
			"amount": 0,
			"description": "Activatie automatische incasso.",
			"payment_options": {
				"notification_method": "POST",
				"notification_url": "https://www.padelpack.nl/webhooks/payment",
				"redirect_url": "https://www.padelpack.nl/account/dashboard",
				"cancel_url": "https://www.padelpack.nl/account/dashboard"
			},
			"recurring_model": "unscheduled",
			"customer": {
				"reference": customerId,
			},
		});

		return response.data;
	} catch (error) {
		console.error('Error: ' + error);
		throw error;
	}
}

MSP.createPayment = async ({ customerId, recurringId, amount, orderId, description }) => {
	try {
		const response = await axios.post(`https://testapi.multisafepay.com/v1/json/orders?api_key=${API_KEY}`, {
			"type": "direct",
			"order_id": orderId,
			"currency": "EUR",
			"amount": amount,
			"description": description,
			"payment_options": {
				"notification_method": "POST",
				"notification_url": "https://www.padelpack.nl/webhooks/payment",
				"redirect_url": "https://www.padelpack.nl/account/dashboard",
				"cancel_url": "https://www.padelpack.nl/account/dashboard"
			},
			"recurring_model": "unscheduled",
			"recurring_id": recurringId,
			"customer": {
				"reference": customerId,
			}
		});

		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export default MSP;