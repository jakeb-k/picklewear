import { router } from "@inertiajs/react";
import TestImage from "@/../assets/images/testing_imgs/test_1.webp";
import useFavouritesStore from "@/Stores/useFavouritesStore";
export default function ProductCard(props) {
    const product = props.product;
    const productImg = product.images ? product.images[0] : null;
    const { addFavourite, removeFavourite, favourites } = useFavouritesStore();

    function setFavourite(product) {
        favourites.some((fav) => fav.id == product.id)
            ? removeFavourite(product.id)
            : addFavourite(product);
    }

    return (
        <a
            href={route("products.show", product.id)}
            className="relative min-h-[350px] h-full rounded-md py-12 pb-4 bg-white group z-20 cursor-pointer overflow-hidden transition-all duration-300 w-full flex flex-col justify-evenly mb-8"
        >
            <div className="absolute inset-0 bg-gray-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
            <i
                onClick={(e) => {
                    e.preventDefault(); 
                    e.stopPropagation();
                    setFavourite(product);
                }}
                className={`text-3xl top-2 right-4 ${favourites.some((fav) => fav.id == product.id) ? "fa-solid" : "fa-regular"} fa-heart absolute hover:text-main transition-all duration-150 ease-in-out z-30 pointer-events-auto`}
            />
            <img
                src={productImg?.file_path ? productImg.file_path : TestImage}
                className="rounded-md rounded-b-none w-full object-cover bg-white px-4"
            />
            <div className="flex flex-col justify-center bg-white px-2 h-24">
                <p className="text-xl text-center pt-4 pb-2">{product.name}</p>
                <div className="flex justify-center mt-auto font-roboto_mono">
                    <p
                        className={`text-center pb-2 font-roboto_mono mt-auto ${product.discount > 0 ? "line-through text-base" : ""}`}
                    >
                        $
                        {product.price.toLocaleString(0, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </p>
                    {product.discount > 0 && (
                        <p
                            className={`text-center font-roboto-mono pb-2 mt-auto ml-4 font-bold`}
                        >
                            $
                            {(
                                product.price -
                                product.price * (product.discount)
                            ).toLocaleString(0, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </p>
                    )}
                </div>
            </div>
        </a>
    );
}
