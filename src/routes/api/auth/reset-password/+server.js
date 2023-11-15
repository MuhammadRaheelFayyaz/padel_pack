import api from '@getneurotic/api';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';
import { json } from '@sveltejs/kit';
import crypto from 'crypto';
import axios from 'axios';

export async function POST({ request }) {
    const data = await request.formData();
    const errors = {};

    const email = data.get('email');
    validateInput(email, errors);

    let customer = await getCustomerByEmail(email);
    if (!customer) {
        return json({ email: 'Dit e-mailadres is niet bekend.' }, { status: 422 });
    }

    // Generate a unique token for password reset
    const resetToken = crypto.randomBytes(20).toString('hex');
    const tokenExpiryDate = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Save the token and expiry date in the database
    await api.update(customer.id, {
        reset_password_token: resetToken,
        reset_password_end_date: tokenExpiryDate
    });

    // Send an email to the user with the reset link using Brevo
    await sendPasswordResetEmail(email, resetToken);

    return Object.keys(errors).length > 0 
        ? json(errors, { status: 422 }) 
        : json({ success: true });
}

function validateInput(email, errors) {
    if (isEmpty(email)) errors.email = 'Email is required.';
    else if (!isEmail(email)) errors.email = 'Email is invalid.';
}

async function getCustomerByEmail(email) {
    const response = await api.find('customer', [['email', '=', email]], {is_active: true});

    return response.data.items && response.data.items[0];
}

async function sendPasswordResetEmail(email, resetToken) {
    const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
    const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
    const resetURL = `http://localhost:5173/wachtwoord-reset?token=${resetToken}`;
    
    const data = {
        sender: { name: "Padel Pack", email: "info@padelpack.nl" },
        to: [{ email: email }],
        subject: "Wachtwoord reset aanvraag",
        templateId: 8,
        params: { EMAIL: email, RESET_URL: resetURL }
    };

    await axios.post(BREVO_API_URL, data, {
        headers: { 'accept': 'application/json', 'api-key': BREVO_API_KEY, 'content-type': 'application/json' }
    });
}
