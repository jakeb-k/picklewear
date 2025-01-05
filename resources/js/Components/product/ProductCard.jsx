import { router } from "@inertiajs/react";
import TestImage from "@/../assets/images/testing_imgs/test_1.webp";

export default function ProductCard(props) {
    const product = props.product;
    const productImg = product.images ? product.images[0] : null;

    const navigateToProduct = (id) => {
      router.visit(route('products.show', id))
    }

    return (
        <div
            onClick={() => navigateToProduct(product.id)}
            className="relative max-w-[325px] mr-[2%] min-h-[350px] rounded-md bg-white hover:bg-gray-500/50 group z-20 cursor-pointer overflow-hidden transition-all duration-300"
            style={{ minWidth: "30.75%" }} // Ensure the minimum width stays at 23%
        >
            <div className="absolute inset-0 bg-gray-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
            <img
                src={productImg?.file_path ? productImg.file_path : TestImage}
                className="rounded-md rounded-b-none w-full object-cover bg-white"
            />
            <div className="relative h-full bg-white px-2">
                <p className="text-xl text-center pt-4 pb-2">{product.name}</p>
                <p className="text-center pb-2">${product.price}</p>
            </div>
        </div>
    );
}
