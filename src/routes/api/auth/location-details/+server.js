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
            'address': data.address,
            'housenumber': data.housenumber,
            'postal_code': data.postal_code,
            'city': data.city,
            'country': data.country,
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

	const address = formData.get('address');
	if (isEmpty(address)) {
		errors.address = 'Vul een adres in.';
	}

    const housenumber = formData.get('housenumber');
	if (isEmpty(housenumber)) {
		errors.housenumber = 'Vul een huisnummer in.';
	}

	const postal_code = formData.get('postal_code');
	if (isEmpty(postal_code)) {
		errors.postal_code = 'Vul een postcode in.';
	}

    const city = formData.get('city');
	if (isEmpty(city)) {
		errors.city = 'Vul een stad in.';
	}

    const country = formData.get('country');
	if (isEmpty(country)) {
		errors.country = 'Vul een land in.';
	}

	const remember_token = formData.get('remember_token');

    const isValidToken = await checkRememberToken(remember_token);

    if (!isValidToken) {
        errors.message = 'Unauthorized';
    }

    const userId = isValidToken[0].id;
	return {
		data: { address, housenumber, postal_code, city, country, userId },
		errors: Object.keys(errors).length ? errors : null,
	};
}