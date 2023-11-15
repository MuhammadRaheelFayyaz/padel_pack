import api from "@getneurotic/api";
import { json } from '@sveltejs/kit';
import { checkRememberToken } from "$lib/utilities/auth";
import axios from "axios";

export async function POST({ request }) {
    try {
        const { data, errors } = await validateRequest(request);
        if (errors) {
            return json({ status: 422, body: errors });
        }

        // Handle Brevo updates for newsletter
        await handleBrevoUpdates(data.email, data.newsletter, 10); // 10 is the listId for newsletter
        
        // Handle Brevo updates for promotional
        await handleBrevoUpdates(data.email, data.promotional, 12); // 12 is the listId for promotional

        // Send to Api
        const response = await api.update(data.userId, {
            'newsletter': data.newsletter === 'true' ? true : false,
            'promotional': data.promotional === 'true' ? true : false,
        });

        if (response.status === 200) {
            return json({ message: 'Email Preferences updated' });
        } else {
            return json({ error: "Error" }, { status: 404 });
        }

    } catch (error) {
        console.error("Error updating account details:", error);
        return json({ error: "Failed to update account details" }, { status: 500 });
    }
}

async function validateRequest(request) {
    const formData = await request.formData();
    const errors = {};

    const email = formData.get('email');
    const newsletter = formData.get('newsletter');
    const promotional = formData.get('promotional');
    const remember_token = formData.get('remember_token');

    const isValidToken = await checkRememberToken(remember_token);
    if (!isValidToken) {
        errors.message = 'Unauthorized';
    }

    const userId = isValidToken[0].id;
    return {
        data: { email, newsletter, promotional, userId },
        errors: Object.keys(errors).length ? errors : null,
    };
}

async function handleBrevoUpdates(email, toggleValue, listId) {
    const apiUrl = 'https://api.brevo.com/v3/contacts';
    const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;

    const headers = {
        'Api-Key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    let data = {
        email: email,
    };

    if (toggleValue === 'true') {
        data.listIds = [listId];
    } else {
        data.unlinkListIds = [listId];
    }

    try {
        await axios.put(`${apiUrl}/${email}`, data, { headers });
    } catch (error) {
        if (error.response && error.response.data.code === 'document_not_found') {
            console.warn("Contact does not exist in Brevo. Creating contact.");
            try {
                await axios.post(apiUrl, data, { headers });
            } catch (createError) {
                console.error("Error creating contact in Brevo:", createError.response?.data?.message || createError.message);
                throw createError;
            }
        } else {
            console.error("Error updating Brevo list:", error.response?.data?.message || error.message);
            throw error; // Propagate the error to be handled by the calling function
        }
    }
}
