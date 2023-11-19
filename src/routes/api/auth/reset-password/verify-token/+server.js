import api from '@getneurotic/api';
import { json } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export async function POST({ request }) {
    const data = await request.formData();
    const token = data.get('token');
    const newPassword = data.get('password');
    const confirmPassword = data.get('confirm_password');

    if (!token || !newPassword || !confirmPassword) {
        return json({ error: "Missing required fields." }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
        return json({ error: "Passwords do not match." }, { status: 400 });
    }

    try {
        const customer = await api.find('customer', [['reset_password_token', '=', token], ['reset_password_end_date', '>', new Date()]]);

        if (customer && customer.data.items.length > 0) {
            const userId = customer.data.items[0].id; // Assuming the customer object has an 'id' property

            // Hash the new password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            // Update the customer's password in the database
            const response = await api.update(userId, {
                'password': hashedPassword,
                'reset_password_end_date': '',
                'reset_password_token': ''
            });

            if (response.status === 200) {
                return json({ success: true, message: "Password reset successfully" }, { status: 200 });
            } else {
                return json({ success: false, error: "Error updating password" }, { status: 500 });
            }

        } else {
            return json({ success: false, error: "Invalid or expired token. Please request a new reset link." }, { status: 401 });
        }

    } catch (error) {
        return json({ error: "Error resetting password" }, { status: 500 });
    }
}
