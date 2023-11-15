import api from '@getneurotic/api';
import { json } from '@sveltejs/kit';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';
import { checkRememberToken } from "$lib/utilities/auth";

export async function POST({ request }) {
	try {
		const { data, errors } = await validateRequest(request);

		if (errors) {
			return json({ status: 422, body: errors });
		}

		const isValidToken = await checkRememberToken(data.remember_token);
		if (!isValidToken) {
			errors.message = 'Unauthorized';
		}

		let customer = await getCustomerByEmail(data.email);
		if (!customer) {
			return json({ message: 'Geen gebruiker gevonden' }, { status: 422 });
		}

		const updateResponse = await api.update(customer.id, { products: null });
		if (updateResponse.status >= 400) {
			return json(updateResponse.data, { status: updateResponse.status });
		}

        return json({ message: 'Subscription canceled' }, { status: 200 });
	} catch (error) {
		return json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

async function validateRequest(request) {
	const formData = await request.formData();
	const errors = {};

	const remember_token = formData.get('remember_token');

	const email = formData.get('email');
	if (isEmpty(email) || !isEmail(email)) {
		errors.email = 'Geen gebruiker gevonden met dit e-mailadres.';
	}

	return {
		data: { email, remember_token },
		errors: Object.keys(errors).length ? errors : null,
	};
}

async function getCustomerByEmail(email) {
	const response = await api.find('customer', [['email', '=', email]]);
	return response.data.items && response.data.items[0];
}