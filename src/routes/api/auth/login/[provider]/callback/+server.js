import api from "@getneurotic/api";
import axios from 'axios';
import { generateRememberToken } from "../../../../../../lib/utilities/auth.js";

export async function GET({ params, url }) {
	const { provider } = params;
	const code = url.searchParams.get('code');

	try {
		const accessToken = await fetchAccessToken(provider, code);
		const userData = await fetchUserData(provider, accessToken);
		const token = await updateOrCreateCustomer(userData.email);

		return new Response(null, {
			status: 302,
			headers: { location: `/account/dashboard?remember_token=${token}` },
		});
	} catch (error) {
		console.error(error);

		return new Response(null, { status: 302, headers: { location: '/login' } });
	}
}

async function fetchAccessToken(provider, code) {
	const redirectUri = `${import.meta.env.VITE_BASE_URL}/api/auth/login/${provider}/callback`;

	// Facebook
	if (provider === 'facebook') {
		const clientId = import.meta.env.VITE_FACEBOOK_APP_ID;
		const clientSecret = import.meta.env.VITE_FACEBOOK_APP_SECRET;

		const response = await axios.get(`https://graph.facebook.com/v12.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`);

		return response.data.access_token;
	}

	// Google
	if (provider === 'google') {
		const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
		const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

		const response = await axios.post('https://oauth2.googleapis.com/token', {
			code,
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uri: redirectUri,
			grant_type: 'authorization_code'
		});

		return response.data.access_token;
	}
}

async function fetchUserData(provider, accessToken) {
	// Facebook
	if (provider === 'facebook') {
		const response = await axios.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);
		return response.data;
	}

	// Google
	if (provider === 'google') {
		const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});

		return response.data;
	}
}

async function updateOrCreateCustomer(email) {
	try {
		const response = await api.find('customer', [['email', '=', email]], { is_active: true });
		const customer = response.data.items[0] || null;
		const remember_token = generateRememberToken();

		if (customer && customer.remember_token !== remember_token) {
			await api.update(customer.id, { remember_token }, {});
		} else if (!customer) {
			await api.create('customer', { email, remember_token }, { is_active: true });
		}

		return remember_token;
	} catch (error) {
		console.error(error);
		throw error;
	}
}