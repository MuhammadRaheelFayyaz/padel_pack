import { store } from "@getneurotic/svelte";
import { derived, get } from "svelte/store";
import { browser } from '$app/environment';
import axios from "axios";

const defaultValues = {
  items: [],
  isOpen: false,
};

function updateLocalStorage(cartItems) {
  if (browser) {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }
}

const cart = derived(store, ($store) => {
  const state = { ...defaultValues, ...$store.cart };

  return {
    get items() {
      return state.items
        .sort((a, b) => a.product.properties.price - b.product.properties.price)
        .map((item, index) => {
          const price = Number(item.product.properties.price);
          const hasDiscount = index === 0;
          const discountPrice = hasDiscount ? price * 0.5 : price;
          const totalPrice = hasDiscount && item.quantity > 1
            ? discountPrice + price * (item.quantity - 1)
            : discountPrice;

          return { ...item, price, hasDiscount, discountPrice, totalPrice };
        });
    },

    get isOpen() {
      return state.isOpen;
    },

    get totalPrice() {
      return this.items.reduce((total, item) => total + item.totalPrice, 0);
    },

    toggle() {
      state.isOpen = !state.isOpen;
      $store.set("cart", state);
    },

    async add(product) {
      state.items = [{ product, quantity: 1 }];

      state.isOpen = !state.isOpen;

      $store.set("cart", state);

      updateLocalStorage(state.items);
    },

    async remove(product) {
      const index = state.items.findIndex(item => item.product.id === product.id);
      if (index !== -1) {
        state.items[index].quantity -= 1;
        if (state.items[index].quantity <= 0) {
          state.items.splice(index, 1); 
        }
        $store.set("cart", state);

        updateLocalStorage(state.items);

        // try {
        //   const remember_token = localStorage.getItem('remember_token');

        //   await axios.delete(`/api/auth/cart?productId=${product.id}&rememberToken=${remember_token}`)
        //   .then(response => {
        //     // handle success
        //   })
        //   .catch(error => {
        //     console.error("Error removing item from cart:", error);
        //     // handle error
        //   });

        //   // or use axios.post if you handle removal in a different way
        // } catch (error) {
        //   console.error("Failed to remove item from cart on server:", error);
        //   // handle error appropriately
        // }
      }
    },

  };
});

export default cart;
