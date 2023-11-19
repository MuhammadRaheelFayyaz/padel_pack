// api/auth/activate/+server.js
import api from '@getneurotic/api';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const { searchParams } = url;
	const email = searchParams.get('email');
	const activation_code = searchParams.get('activation_code');

	// Validate input
	if (!email || !activation_code) {
		return json({ error: "No email or activation code found." }, { status: 400 });
	}

	try {
		// Find customer by email
		let customer = await api.find('customer', [['email', '=', email]]);

		if (!customer.data.items.length) return json({ error: "Customer not found" }, { status: 400 });
		customer = customer.data.items.find(item => item.properties.activation_code === activation_code);

		// Update customer Neurotic
		const updatedCustomer = await api.update(customer.id, { email_verified_at: new Date() });
		if (updatedCustomer.status !== 200) return json({ error: "Customer not updated" }, { status: 400 });        

		return json({ success: true, message: 'Account activated' });

	} catch (error) {
		console.error(error.response || error);
		return json({ error: "Authentication failed" }, { status: 500 });
	}
}