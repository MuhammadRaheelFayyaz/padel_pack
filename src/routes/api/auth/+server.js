import api from '@getneurotic/api';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
    const token = url.searchParams.get('token');
	if (!token) {
        return json({ error: "Token not provided" }, { status: 400 });
    }

    try {
        const response = await api.find('customer', { remember_token: token });
		
        const customerData = response.data.items.find(item => item.properties.remember_token === token);
        if (customerData) {
            const { password, ...properties } = customerData.properties;
			customerData.properties = properties;

            return json(customerData, { status: 200 });
        }

        return json({ error: "Unauthorized" }, { status: 401 });
    } catch (error) {
        return json({ error: "Authentication failed" }, { status: 500 });
    }
}
