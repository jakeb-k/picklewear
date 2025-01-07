import { create } from "zustand";
import { persist } from "zustand/middleware";

const useFavouritesStore = create(
    persist(
        (set) => ({
            favourites: [],
            setFavourites: (favourites) => set({ favourites }),
            addFavourite: (favourite) =>
                set((state) => {
                    return {
                        favourites: [...state.favourites, { ...favourite }],
                    };
                }),
            removeFavourite: (id) =>
                set((state) => ({
                    favourites: state.favourites.filter(
                        (favourite) => favourite.id !== id,
                    ),
                })),
        }),
        {
            name: "favs-storage", // Key for storing in localStorage
        },
    ),
);

export default useFavouritesStore;
