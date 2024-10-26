import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
    persist(
        (set) => ({
            products: [],
            setProducts: (products) => set({ products }),
            addProduct: (product) =>
                set((state) => {
                    const existingProduct = state.products.find(
                        (p) =>
                            p.id === product.id &&
                            p.color === product.color &&
                            p.size === product.size
                    );

                    if (existingProduct) {
                        return {
                            products: state.products.map((p) =>
                                p.id === product.id &&
                                p.color === product.color &&
                                p.size === product.size
                                    ? {
                                          ...p,
                                          quantity:
                                              p.quantity + product.quantity,
                                      }
                                    : p
                            ),
                        };
                    }

                    return {
                        products: [
                            ...state.products,
                            { ...product, quantity: product.quantity },
                        ],
                    };
                }),
        }),
        {
            name: "cart-storage", // Key for storing in localStorage
            // storage: sessionStorage, // Uncomment if you prefer sessionStorage
        }
    )
);

export default useCartStore;
