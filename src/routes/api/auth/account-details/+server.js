import api from "@getneurotic/api";
import { json } from '@sveltejs/kit';
import { checkRememberToken } from "$lib/utilities/auth";
import isEmpty from 'validator/lib/isEmpty';

export async function POST({ request }) {
    try {
		const { data, errors } = await validateRequest(request);
		if (errors) {
			return json({ status: 422, body: errors });
		}

        const response = await api.update(data.userId, {
            'first_name': data.first_name,
            'last_name': data.last_name,
            'phone': `0${data.phone}`,
        });
        if (response.status === 200) {
            return json({message: 'Account details updated' });
        } else {
            return json({ error: "User not found" }, { status: 404 });
        }

    } catch (error) {
        console.error("Error updating account details:", error);
        return json({ error: "Failed to update account details" }, { status: 500 });
    } 
}

async function validateRequest(request) {
	const formData = await request.formData();
	const errors = {};  

	const first_name = formData.get('first_name');
	if (isEmpty(first_name)) {
		errors.first_name = 'Vul een voornaam in.';
	}

    const last_name = formData.get('last_name');
	if (isEmpty(last_name)) {
		errors.last_name = 'Vul een achternaam in.';
	}

	const phone = formData.get('phone');
	if (isEmpty(phone)) {
		errors.phone = 'Vul een telefoonnummer in.';
	}

	const remember_token = formData.get('remember_token');

    const isValidToken = await checkRememberToken(remember_token);
    if (!isValidToken) {
        errors.message = 'Unauthorized';
    }

    const userId = isValidToken[0].id;

	return {
		data: { first_name, last_name, phone, userId },
		errors: Object.keys(errors).length ? errors : null,
	};
}