import api from '@getneurotic/api';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const data = await request.json();

	const id = data.customer_id;
	const remember_token = data.remember_token;

	const response = await api.get(id);
	if (response.data?.id !== id || response.data?.properties.remember_token !== remember_token) {
		return json(false);
	}
	const updateResponse = await api.update(id, {
		'remember_token': '',
	});

	return json(true);
}