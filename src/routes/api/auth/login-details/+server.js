import api from "@getneurotic/api";
import { json } from '@sveltejs/kit';
import { checkRememberToken } from "$lib/utilities/auth";
import isEmpty from 'validator/lib/isEmpty';
import isStrongPassword from 'validator/lib/isStrongPassword';
import bcrypt from 'bcrypt';

export async function POST({ request }) {
    const { data, errors } = await validateInput(request);
    if (errors) {
        return json({ status: 422, body: errors });
    }

    let customer = await getCustomerByEmail(data.email);

    if (!customer || !verifyPassword(data.password, customer.properties.password)) {
        return json({ password: 'Dit wachtwoord is niet bekend.' }, { status: 422 });
    } 
    if (errors) {
        return json({ status: 422, body: errors });
    }
    
    const hashedNewPassword = await bcrypt.hash(data.new_password, 10);
    const response = await api.update(customer.id, {
        'password': hashedNewPassword,
    });

    if (response.status === 200) {
        return json({message: 'Account details updated' });
    } else {
        return json({ error: "User not found" }, { status: 404 });
    }

    // return Object.keys(errors).length > 0 
    //     ? json(errors, { status: 422 }) 
    //     : json({ success: statusCode === 200 });
}

async function validateInput(request) {
	const formData = await request.formData();
	const errors = {}; 

    const email = formData.get('email');

    const password = formData.get('password');
	if (isEmpty(password)) {
		errors.password = 'Vul uw huidige wachtwoord in.';
	}

    const new_password = formData.get('new_password');
	if (isEmpty(new_password) || !isStrongPassword(new_password, { minLength: 8, minSymbols: 1, minUppercase: 1 })) {
		errors.new_password = 'Uw wachtwoord is niet sterk genoeg.';
	}

    const confirm_new_password = formData.get('confirm_new_password');
	if (isEmpty(confirm_new_password) || !isStrongPassword(confirm_new_password)) {
		errors.confirm_new_password = 'Uw wachtwoord is niet sterk genoeg.';
	}
    if (confirm_new_password !== new_password) {
        errors.confirm_new_password = 'Wachtwoorden zijn niet gelijk.';
    }

    const remember_token = formData.get('remember_token');

    const isValidToken = await checkRememberToken(remember_token);
    if (!isValidToken) {
        errors.message = 'Unauthorized';
    }

	return {
		data: { email, password, new_password },
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