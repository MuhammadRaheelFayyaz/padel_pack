import MultiSafepayClient from '@multisafepay/api-wrapper';
const API_KEY = import.meta.env.VITE_MULTISAFEPAY_API_KEY;

export const client = new MultiSafepayClient(API_KEY, { environment: 'test' });
