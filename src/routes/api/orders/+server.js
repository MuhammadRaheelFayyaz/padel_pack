import api from "@getneurotic/api";
import { json } from "@sveltejs/kit";
import isEmpty from 'validator/lib/isEmpty';

export async function POST({ request }) {
    let { data, errors } = await validateRequest(request);
	console.log('in api ....')

    if (errors) {
        return json({ status: 422, body: errors });
    }

    // Update customer details and add product to customer
    errors = updateCustomer(data);
    if (Object.keys(errors).length) return json(errors, { status: 422 });

    return json({ success: true, data }, { status: 200 });
}

async function validateRequest(request) {
	const formData = await request.formData();
	const errors = {};
  
	const first_name = formData.get('first_name');
	if (isEmpty(first_name)) {
	  errors.first_name = 'Vul een voornaam in.';
	}
  
	const last_name = formData.get('last_name');
	if (isEmpty(last_name)) {
	  errors.last_name = 'Vul een achternaam in.';
	}
  
	const postal_code = formData.get('postal_code');
	if (isEmpty(postal_code)) {
	  errors.postal_code = 'Vul een postcode in.';
	}
  
	const housenumber = formData.get('housenumber');
	if (isEmpty(housenumber)) {
	  errors.housenumber = 'Vul een huisnummer in.';
	}
  
	const address = formData.get('address');
	if (isEmpty(address)) {
	  errors.address = 'Vul een straatnaam in.';
	}
  
	const city = formData.get('city');
	if (isEmpty(city)) {
	  errors.city = 'Vul een stad in.';
	}
  
	const country = formData.get('country');
	if (isEmpty(country)) {
	  errors.country = 'Selecteer een land.';
	}
  
	const phone = formData.get('phone');
	if (isEmpty(phone)) {
	  errors.phone = 'Vul een telefoonnummer in.';
	}
  
	const agreement = formData.get('agreement');
	if (!agreement) {
	  errors.agreement = 'Please agree to our general agreements.';
	}
  
	const deliveryAddress = formData.get('deliveryAddress');
  
	// Define fields for delivery address
	const deliveryFields = [
	  'delivery_first_name',
	  'delivery_last_name',
	  'delivery_postal_code',
	  'delivery_housenumber',
	  'delivery_address',
	  'delivery_city',
	  'delivery_country',
	  'delivery_phone',
	];
  
	const newsletter = formData.get('newsletter') === 'true' ? true : false;

	const products = JSON.parse(formData.get('products'));

	const data = {
		customerId: formData.get('customer_id'),
		first_name,
		last_name,
		postal_code,
		housenumber,
		address,
		city,
		country,
		phone,
		newsletter,
		products
	};
  
	// Include delivery address fields if deliveryAddress is true
	if (deliveryAddress === 'true') {
	  	for (const field of deliveryFields) {
			data[field] = formData.get(field);
	  	}
	}
  
	return {
	  	data,
	  	errors: Object.keys(errors).length ? errors : null,
	};
}

async function updateCustomer( data ) {	
    const productId = data.products[0].product.id;
    const customerId = data.customerId;

    const response = await api.update(customerId, {
        // Customer details
        'first_name': data.first_name,
        'last_name': data.last_name,
        'phone': `0${data.phone}`,
        'postal_code': data.postal_code,
        'housenumber': data.housenumber,
        'address': data.address,
        'city': data.city,
        'country': data.country,

        // Newsletter
        'newsletter': data.newsletter === 'true' ? true : false,

        // Products
        'products': [productId],

        // Delivery details
        'delivery_first_name': data.delivery_first_name ?? null,
        'delivery_last_name': data.delivery_last_name ?? null,
        'delivery_postal_code': data.delivery_postal_code ?? null,
        'delivery_housenumber': data.delivery_housenumber ?? null,
        'delivery_address': data.delivery_address ?? null,
        'delivery_city': data.delivery_city ?? null,
        'delivery_country': data.delivery_country ?? null,
        'delivery_phone': data.delivery_phone ?? null,
    });

    return response.status === 200 
    ? json({ success: true, message: 'Customer updated' }) 
    : json({ success: false, message: 'Error updating customer' });
}