import { create } from "zustand";

const useCartStore = create((set) => ({
    products: [],
  
    addProduct: (product) =>
      set((state) => ({
        products: [...state.products, { ...product, quantity: 1 }],
      })),
  
    removeProduct: (productId) =>
      set((state) => ({
        products: state.products.filter((product) => product.id !== productId),
      })),
  
    clearProducts: () =>
      set(() => ({
        products: [],
      })),
  
    updateQuantity: (productId, quantity) =>
      set((state) => ({
        products: state.products.map((product) =>
          product.id === productId
            ? { ...product, quantity: quantity }
            : product
        ),
      })),
  }));
  
  export default useCartStore;