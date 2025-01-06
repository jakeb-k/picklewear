import { router } from "@inertiajs/react";
import TestImage from "@/../assets/images/testing_imgs/test_1.webp";
import useFavouritesStore from "@/Stores/useFavouritesStore";
export default function ProductCard(props) {
    const product = props.product;
    const productImg = product.images ? product.images[0] : null;
    const { addFavourite, removeFavourite, favourites } = useFavouritesStore();

    const navigateToProduct = (id) => {
        router.visit(route("products.show", id));
    };

    function setFavourite(product) {
        favourites.some((fav) => fav.id == product.id) ? removeFavourite(product.id) :  addFavourite(product);
    }

    return (
        <div
            onClick={() => navigateToProduct(product.id)}
            className="relative min-h-[350px] rounded-md bg-white hover:bg-gray-500/50 group z-20 cursor-pointer overflow-hidden transition-all duration-300 w-full"// Ensure the minimum width stays at 23%
        >
            <div className="absolute inset-0 bg-gray-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
            <i
                onClick={(e) => {
                    e.stopPropagation();
                    setFavourite(product)
                }}
                className={
                    `text-3xl top-2 right-4 ${favourites.some((fav) => fav.id == product.id) ? 'fa-solid': 'fa-regular' } fa-heart absolute hover:text-main transition-all duration-150 ease-in-out z-30 pointer-events-auto`
                }
            />
            <img
                src={productImg?.file_path ? productImg.file_path : TestImage}
                className="rounded-md rounded-b-none w-full object-cover bg-white px-4"
            />
            <div className="relative h-full bg-white px-2">
                <p className="text-xl text-center pt-4 pb-2">{product.name}</p>
                <p className="text-center pb-2">${product.price}</p>
            </div>
        </div>
    );
}
