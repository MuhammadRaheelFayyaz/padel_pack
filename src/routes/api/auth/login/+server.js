import api from '@getneurotic/api';
import bcrypt from 'bcrypt';
import { json } from '@sveltejs/kit';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';
import isStrongPassword from 'validator/lib/isStrongPassword';
import { generateRememberToken } from '../../../../lib/utilities/auth.js';

export async function POST({ request }) {
	try {
		const { data, errors } = await validateRequest(request);

		if (errors) {
			return json({ status: 422, body: errors });
		}

		let customer = await getCustomerByEmail(data.email);
		if (!customer || !verifyPassword(data.password, customer.properties.password)) {
			return json({ email: 'Ongeldig e-mailadres of wachtwoord.' }, { status: 422 });
		}
		const remember_token = generateRememberToken();

		const updateResponse = await api.update(customer.id, { remember_token: remember_token }, { is_active: true });

		if (updateResponse.status >= 400) {
			return json(updateResponse.data, { status: updateResponse.status });
		}

		customer = updateResponse.data;
		delete customer.properties.password;

		return json({ customer, remember: data.remember });
	} catch (error) {
		return json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

async function validateRequest(request) {
	const formData = await request.formData();
	const errors = {};

	const email = formData.get('email');
	if (isEmpty(email) || !isEmail(email)) {
		errors.email = 'Geen gebruiker gevonden met dit e-mailadres.';
	}

	const password = formData.get('password');
	if (isEmpty(password) || !isStrongPassword(password)) {
		errors.password = 'Deze gegevens kloppen niet.';
	}

	const remember = formData.get('remember') || false;

	return {
		data: { email, password, remember },
		errors: Object.keys(errors).length ? errors : null,
	};
}

async function getCustomerByEmail(email) {
	const response = await api.find('customer', [['email', '=', email]], {is_active: true});
	return response.data.items && response.data.items[0];
}

function verifyPassword(inputPassword, storedHashedPassword) {
	return bcrypt.compareSync(inputPassword, storedHashedPassword);
}