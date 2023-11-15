import api from '@getneurotic/api';
import { checkRememberToken } from "../../../../../lib/utilities/auth";
import { json } from '@sveltejs/kit';
import axios from 'axios';

export async function POST({ request, params }) {
	const tokens = await checkRememberToken(request.headers.get('remember-token'));
	if (tokens.length === 0) {
		return json(false, { status: 401 });
	}

	const { data, errors } = await validateRequest(request);
	if (errors) {
		return json(errors, { status: 422 });
	}

	return await updateCustomer(params.id, data.months);
}

async function validateRequest(request) {
    const data = Object.fromEntries(await request.formData());
    const errors = {};

    if (!data.months) {
        data.months = [];
    } else {
        data.months = data.months.split(',');
    }

    return { data, errors: Object.keys(errors).length ? errors : null };
}

async function updateCustomer(id, delivery_exceptions) {
	const response = await api.update(id, { delivery_exceptions }, {}).catch(error => ({
		data: error.response.data,
		status: error.response.status,
	}));

    console.log('response', response)

	if (response.status === 422) {
		return json(response.data.errors, { status: response.status });
	}

    const updateCustomerByEmail = await sendEmailToCustomer(response.data)
    console.log(updateCustomerByEmail.status)
    if (response.status === 422) {
		return json(response.data.errors, { status: response.status });
	}

	return json(true);
}

async function sendEmailToCustomer(data) {
    const delivery_exceptions = data.properties?.delivery_exceptions;
    const first_name = data.properties?.first_name;
    const email = data.properties?.email;
    const delivery_exceptions_as_string = JSON.stringify(delivery_exceptions).replaceAll('"', '');

    const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
    const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
    const content = {
        sender: { name: "Padel Pack", email: "info@padelpack.nl" },
        to: [{ email: email }],
        subject: "Maand stopgezet",
        templateId: 4,
        params: { FIRST_NAME: first_name, DELIVERY_EXCEPTIONS: delivery_exceptions_as_string }
    };

    const response = await axios.post(BREVO_API_URL, content, {
        headers: { 'accept': 'application/json', 'api-key': BREVO_API_KEY, 'content-type': 'application/json' }
    });

    return response.status === 200 
        ? json({ success: true, message: 'Activatie-code verzonden' })
        : ''
}
