import api from '@getneurotic/api';
import { json } from '@sveltejs/kit';
import { checkRememberToken } from "$lib/utilities/auth";

export async function POST({request}) {
    try {
        const { data, errors } = await validateRequest(request, 'POST');
        if (errors) {
            return json(errors, { status: 422 });
        }
        // Assuming data.cartItems is an array of items, and we're interested in the first one.
        const cartProductId = data.cartItems[0].product.id;

        const updateResponse = await api.update(data.customer_id, { cart_items: [cartProductId] }, { is_active: true });

        if (updateResponse.status === 200) {
            return json({ message: 'Customer cart updated successfully.' });
        } else {
            console.error("Error response from API:", updateResponse);
            return json({ error: "Error updating customer cart" }, { status: updateResponse.status });
        }
    } catch (error) {
        console.error("Error in POST method:", error);
        return json({ error: "Failed to update account details" }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { data, errors } = await validateRequest(request, 'DELETE');
        if (errors) {
            return json(errors, { status: 422 });
        }

        const response = await api.update(data.customer_id, { cart_items: data.cartItems }, { is_active: false });

        if (response.status === 200) {
            return json({ message: 'Item removed from cart successfully.' });
        } else {
            console.error("Error response from API:", response);
            return json({ error: "Error removing item from cart" }, { status: response.status });
        }
    } catch (error) {
        console.error("Error in DELETE method:", error);
        return json({ error: "Failed to remove item from cart" }, { status: 500 });
    }
}

async function validateRequest(request, method) {
    const errors = {};
    let data = {};
    let customer_id;
    let product_id;

    if (method === 'POST') {
        try {
            data = await request.json();

        } catch (error) {
            console.error('Error parsing JSON:', error);
            errors.jsonParseError = 'Invalid JSON content received.';
            return { errors };
        }

        // Validate the remember token.
        if (!data.remember_token) {
            errors.noToken = 'No token provided.';
            return { errors };
        }

        const isValidToken = await checkRememberToken(data.remember_token);
        if (!isValidToken) {
            errors.invalidToken = 'Unauthorized access.';
            return { errors };
        }

        customer_id = data.customer_id ?? '';

        // Additional validations for data can be added here.
    } else if (method === 'DELETE') {
        const queryParams = request.url.searchParams;
        const remember_token = queryParams.get('rememberToken');
        product_id = queryParams.get('productId');

        const isValidToken = await checkRememberToken(remember_token);

        if (!isValidToken) {
            errors.invalidToken = 'Unauthorized access.';
            return { errors };
        }
        customer_id = isValidToken[0].id;
    }

    return {
        data: {
            customer_id: customer_id ?? null,
            cartItems: data.cart_items ?? '',
            product_id: product_id ?? '',
        },
        errors: Object.keys(errors).length ? errors : null,
    };
}
