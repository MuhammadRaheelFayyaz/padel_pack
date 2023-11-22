import api from '@getneurotic/api';
import { json } from '@sveltejs/kit';


export async function GET(){
	try{
		const customerId='654e6158a98f9';
		const customer=await api.get(customerId)
		// const response = await api.update(customerId, {
		// 	...customer.data,
		// "recurring_id":"azbkvpE0up4"
		// } ,{});

		return json(
			{
				data: customer.data,
				success:true
			}
		)
	}catch(e){
		console.error('error',e)
	}
}


export async function POST({ request }) {
	try {
		const body = await request.json();
		let paymentStatus=body.payment_methods[0].status

		if(paymentStatus ==='completed'){
			let recurring_id=body.payment_details.recurring_id??'azbkvpE0up4'
			const order_id=body.order_id
			const order=order_id.split('-')
			const customer_id=order[0]
			const product_id=order[1]
			await api.update(customer_id,{recurring_id})
			await getCustomerData('654e6158a98f9')
		}
		return json({ success: true }, { status: 200 });
	} catch (error) {
		console.error('Error processing webhook:', error);
		return json({ success: false }, { status: 500 });
	}
}