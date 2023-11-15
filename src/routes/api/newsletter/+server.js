import { json } from '@sveltejs/kit';
import axios from 'axios';

export async function POST({ request }) {
    const formData = await request.formData();

    const emails = formData.getAll('email');
    const email = emails.length > 0 ? emails[0] : null;

    const apiUrl = 'https://api.brevo.com/v3/contacts';
    const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;

    const headers = {
        'Api-Key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const data = {
        listIds: [8],
        updateEnabled: false,
        email: email,
    };

    try {
        const response = await axios.post(apiUrl, data, { headers });

        if (response.status === 200) {
            return json({ success: true, message: 'Success' });
        } else {
            return json({ success: false, message: 'Something went wrong' });
        }
    } catch (error) {
        console.error("Error adding email to Brevo:", error.response?.data?.message || error.message);
        return json({ success: false, message: error.response?.data?.message || error.message });
    }
}
