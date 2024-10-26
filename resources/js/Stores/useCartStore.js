import { create } from "zustand";
import { persist } from 'zustand/middleware';

const useCartStore = create(
    persist(
        (set) => ({
            products: [],
      
            setProducts: (products) => set({ products }),
            addProduct: (product) =>
                set((state) => ({
                    products: [...state.products, { ...product }],
                })),
        }),
        {
            name: 'cart-storage', // Unique name for localStorage key
            // Optionally configure storage location (default is localStorage)
            // storage: sessionStorage, // Uncomment to use sessionStorage instead
        }
    )
);

export default useCartStore;