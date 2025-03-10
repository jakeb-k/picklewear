import TestImage from "@/../assets/images/testing_imgs/test_1.webp";
import { Link } from "@inertiajs/react";

export default function MainProductCard({ type }) {
    return (
        <>
            <Link href={route('products.index', type)+ "?tag=true"}> 
                <div className="bg-gray-100/90 rounded-md overflow-hidden shadow-md shadow-grey-500 cursor-pointer hover:shadow-xl hover:bg-white text-center transition-all duration-150 ease-in-out">
                    <img src={TestImage} />
                </div>
            </Link>
        </>
    );
}
