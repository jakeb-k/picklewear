import TestImage from "@/../assets/images/testing_imgs/test_1.webp";
import { Link } from "@inertiajs/react";

export default function MainProductCard({ name, price, discount }) {
    return (
        <>
            <Link href={'#'}> 
                <div className="bg-gray-100/90 rounded-msm overflow-hidden shadow-md shadow-grey-500 cursor-pointer hover:bg-white text-center">
                    <img src={TestImage} />
                    <p>{name}</p>
                    {price && (<span>

                        {discount ? (
                            <p>
                                <span className="line-through">${price}</span>
                                <span className='font-bold'>${price * discount}</span>
                            </p>
                        ) : (
                            <p className='font-bold'>${price}</p>
                        )}
                    </span>)}
                </div>
            </Link>
        </>
    );
}
