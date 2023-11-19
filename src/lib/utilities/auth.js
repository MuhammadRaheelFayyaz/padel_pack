import api from "@getneurotic/api";
import crypto from 'crypto';

export async function checkRememberToken(token) {
    return (await api.find('customer', [
        ['remember_token', '=', token],
    ], { is_active: true })).data.items;
}

export function generateRememberToken() {
	return crypto.randomBytes(32).toString('hex');
}