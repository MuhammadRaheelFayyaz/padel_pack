import MSPClient from '@multisafepay/api-wrapper';
const API_KEY=import.meta.env.VITE_MULTISAFEPAY_API_KEY

export const client = new MSP(API_KEY,);

 export const multisafepayConfig = {
  apiKey:  API_KEY,
  environment: 'test', // 'test' for testing, 'live' for production
  // Add any other necessary configuration options
};


export const initiatePayment = async (orderData) => {
  // Simulate API call
  // In a real scenario, use an HTTP library to communicate with MultiSafepay API
  return {
    payment_url: 'https://www.multisafepay.com/',
    // Include other relevant data from the API response
  };
};