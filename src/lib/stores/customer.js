import { goto } from "$app/navigation";
import { store } from "@getneurotic/svelte";
import axios from "axios";
import { derived, get } from "svelte/store";
import { browser } from '$app/environment';
import cart from './cart.js';



const customer = derived(store, ($store) => {
  const state = $store.customer ? {
    id: $store.customer.id,
    ...$store.customer.properties,
  } : {};

  return {
    ...state,

    get isAuthenticated() {
      return typeof state.id === 'string';
    },

    async set(customer) {
      $store.set('customer', customer);

      // When a customer is set/updated, we should also synchronize the cart.
      if (browser && this.isAuthenticated) {
        try {
          const localCart = JSON.parse(localStorage.getItem('cart')) || [];
		      const remember_token = localStorage.getItem('remember_token');

          if (localCart.length > 0 && remember_token) {
            // If there are items in the local cart, we might want to sync with the server.
            // This could be a call to your server to update the user's cart.
            // Please replace '/api/cart/sync' with your actual API endpoint.
            
            const response = await axios.post('/api/auth/cart', {
              customer_id: this.id,
              remember_token: remember_token,
              cart_items: localCart,
            }, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            if (response.status === 200) {
              console.log('Cart synced successfully:', response.data);
              // Clear the local cart after successful sync
              localStorage.setItem('cart', JSON.stringify([]));
            } else {
              console.error('Error syncing cart:', response.status, response.data);
            }

            // After successful sync, you might want to clear the local cart as it's now stored on the server.
            localStorage.setItem('cart', JSON.stringify([]));
          }
        } catch (error) {
          console.error("Error syncing cart with server:", error);
          // Handle your error appropriately.
        }
      }
    },

    logout() {
			axios.post('/api/auth/logout', {
				user_id: this.id,
				customer_id: this.id,
				remember_token: this.remember_token,
			}).then(({ data }) => {
				if (data) {
					this.set(null);
					goto('/login');
					localStorage.removeItem('remember_token');
					sessionStorage.removeItem('remember_token');
					window.location.href = '/login';
				}
			});
		}
  };
});

// Listen for changes in the cart and trigger the customer data update
cart.subscribe(() => {
  if (customer.isAuthenticated) {
    customer.set(get(store).customer); // re-sync customer data when cart changes
  }
});

export default customer;
