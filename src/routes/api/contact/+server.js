import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';
import fetch from 'node-fetch';
import { json } from '@sveltejs/kit';

export async function POST({request}) {    
    const data = await request.formData();
	const errors = {};

	const first_name = data.get('first_name') ?? '';
	const last_name = data.get('last_name') ?? '';
	const email = data.get('email') ?? '';
	const phone = data.get('phone') ?? '';
	const message = data.get('message') ?? '';

    if (isEmpty(first_name)) {
		errors.first_name = 'U heeft geen voornaam ingevuld.';
	}
	if (isEmpty(last_name)) {
		errors.last_name = 'U heeft geen achternaam ingevuld.';
	}
	if (isEmpty(phone)) {
		errors.phone = 'U heeft geen telefoonnummer ingevuld.';
	}
	if (isEmpty(email) || !isEmail(email)) {
		errors.email = 'Voer een geldig e-mailadres in.';
	}
	if (isEmpty(message)) {
		errors.message = 'U heeft geen bericht ingevuld.'; 
	}

	if (Object.values(errors).length) {
		return json(errors, { status: 422 });
	}

    const emailData = {
        to: [{
            email: email,
            name: `${first_name} ${last_name}`
        }],
        sender: {
            email: 'info@padelpack.nl',
            name: 'Padel Pack'
        },
        subject: 'Nieuw bericht contactformulier',
        htmlContent: `
            <p><strong>Naam:</strong> ${first_name} ${last_name}</p>
            <p><strong>Telefoonnummer:</strong> ${phone}</p>
            <p><strong>E-mailadres:</strong> ${email}</p>
            <p>${message}</p>
        `
    };

    const brevoAPIURL = 'https://api.brevo.com/v3/smtp/email';
    const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;

    const response = await fetch(brevoAPIURL,
        {
            method: 'POST',
            headers: {
                'api-key': BREVO_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData),
        }
    );

	const success = response.status === 200;

	return json({ success, message: success ? 'success' : await response.json() });
}