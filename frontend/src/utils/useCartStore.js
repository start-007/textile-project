import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      cart: [],

      // Action: Add or Update Quantity
      addToCart: (product) => 
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id);
          
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id 
                  ? { ...item, quantity: item.quantity + 1 } 
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),

      // Action: Update specific quantity (for inputs/selectors)
      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
          ).filter(item => item.quantity > 0), // Remove if quantity hits 0
        })),

      // Action: Remove item
      removeItem: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      // Action: Clear Cart
      clearCart: () => set({ cart: [] }),
    }),
    { name: 'shopping-cart' } // Unique name for LocalStorage
  )
);