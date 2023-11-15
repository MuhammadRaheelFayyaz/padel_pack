import api from '@getneurotic/api';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';
import isStrongPassword from 'validator/lib/isStrongPassword';
import { json } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import axios from 'axios';

export async function POST({ request }) {
    const data = await request.formData();
	let errors = {};

    const email = data.get('email');
    const password = data.get('password');
    const password_confirmation = data.get('password_confirmation');

	// Validate Input
    errors = validateInput(email, password, password_confirmation);
	if (Object.keys(errors).length) return json(errors, { status: 422 });

	// Create Customer
    errors = await createCustomer({ email, password });
	if (Object.keys(errors).length) return json(errors, { status: 422 });

	return json({ success: true }, { status: 200 });
}

function validateInput(email, password, password_confirmation) {
	const errors = {};

    if (isEmpty(email)) errors.email = 'Email is required.';
    else if (!isEmail(email)) errors.email = 'Email is invalid.';

    if (isEmpty(password)) errors.password = 'Password is required.';
    else if (!isStrongPassword(password, { minLength: 8, minSymbols: 1, minUppercase: 1 })) errors.password = 'Password must be strong.';

    if (isEmpty(password_confirmation)) errors.password_confirmation = 'Password confirmation is required.';
    else if (password !== password_confirmation) errors.password_confirmation = 'Passwords do not match.';

	return errors;
}

async function createCustomer({ email, password }) {
	const errors = {};

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const activationCode = crypto.randomBytes(5).toString('hex').toUpperCase();

        await api.create('customer', { email: email, password: hashedPassword, activation_code: activationCode }, { is_active: true });

        const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
        const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
        const data = {
            sender: { name: "Padel Pack", email: "info@padelpack.nl" },
            to: [{ email: email }],
            subject: "Activeer uw Padel Pack account",
            templateId: 7,
            params: { EMAIL: email, ACTIVATION_CODE: activationCode }
        };

        const response = await axios.post(BREVO_API_URL, data, {
            headers: { 'accept': 'application/json', 'api-key': BREVO_API_KEY, 'content-type': 'application/json' }
        });

        return response.status === 200 
            ? json({ success: true, message: 'Activatie-code verzonden' }) 
            : json({ success: false, message: 'Error in Brevo API' });
    } catch (error) {
        if (error.response?.status === 422) {
			errors.email = 'The email has already been taken.';
			return errors;
		} else {
			console.error(error.response || error);
			throw error;
		}
    }
}
