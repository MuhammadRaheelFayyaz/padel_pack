import {client} from '$lib/utilities/multisafepayService'
import {json} from "@sveltejs/kit";

const customers=[
  {
    id:1,
    properties:{
      recurring_id:'azbkvpE0up4'
    }
  },
  {
    id:2,
    properties:{
      recurring_id:'azbkvpE0up4'
    }
  },
  {
    id:3,
    properties:{
      recurring_id:null
    }
  },
]


const createSchedulePayments= async(customerId,recurring_id)=>{
  if(recurring_id){
    // console.log(customer)
    try{
      return await client.orders.create(
        {
          "type": "direct",
          "order_id": `${customerId}-${Date.now()}`,
          "currency": "EUR",
          "amount": 1000,
          "gateway": "iDEAL",
          "description": "Subsequent recurring payments order, using a token",
          "payment_options": {
            "notification_method": "POST",
            "notification_url": "https://www.example.com/webhooks/payment",
            "redirect_url": "https://www.example.com/order/success",
            "cancel_url": "https://www.example.com/order/failed"
          },
          "recurring_model": "unscheduled",
          "recurring_id": recurring_id,
          "customer": {
            "reference": customerId
          }
        }
      )
    }catch (error) {
      throw error
    }

  }
}

export async function  GET (){
  try {
  const results = await Promise.allSettled(customers.map(async (customer) => {
    try {
      return await createSchedulePayments(customer.id, customer.properties.recurring_id);
    } catch (error) {
      return { status: 'rejected', reason: error };
    }
  }));

  console.log('All promises settled:', results);
  return json({
    success:true,
    data: results
  })
} catch (error) {
  console.error('Error:', error);
  return error
}

}

