import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import TestImage from "@/../assets/images/testing_imgs/test_1.webp";

const RelatedItems = (props) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null); // Ref for the container
    const products = props.relatedItems;
    const [loading, setLoading] = useState(true);

    const navigateToProduct = (id) => {
        router.visit(route("products.show", id));
    };

    useEffect(() => {
        if (!loading) {
            const intervalId = setInterval(() => {
                setCurrentIndex((prevIndex) => {
                    // If we're at the second last image (as we display two at a time), reset to 0
                    if (prevIndex >= products.length - 4) {
                        return 0;
                    } else {
                        return prevIndex + 1;
                    }
                });
            }, 4000);
            return () => clearInterval(intervalId); // Clear interval on component unmount
        }
    }, [products?.length, loading]);

    return (
        <div
            className="relative border pt-2 pb-8"
            ref={containerRef}
            style={{ display: "flex", overflow: "hidden", width: "100%" }}
        >
            <div
                className="w-full flex"
                style={{
                    display: "flex justify-center",
                    transform: `translateX(-${currentIndex * 24.95}%)`, // Slide by 25% for one image
                    transition: "transform 0.5s ease-in-out",
                }}
            >
                {/* bg-gray-100/90 rounded-md overflow-hidden shadow-md shadow-grey-500 cursor-pointer hover:shadow-xl hover:bg-white  */}
                {products.map((product, index) => {
                    const productImg = product.images[0];
                    return (
                        <div
                            key={index}
                            onClick={() => navigateToProduct(product.id)}
                            className="relative max-w-[25%] mr-[2%] min-h-[350px] rounded-md group z-20 cursor-pointer overflow-hidden transition-all duration-150 bg-gray-100/90 hover:bg-white shadow-md hover:shadow-xl"
                            style={{ minWidth: "23%" }} // Ensure the minimum width stays at 23%
                        >
                            <img
                                src={
                                    productImg?.file_path
                                        ? productImg.file_path
                                        : TestImage
                                }
                                className="rounded-md rounded-b-none w-full object-cover product-image"
                            />
                            <div className="relative h-full  px-2">
                                <p className="text-xl text-center pt-4 pb-2">
                                    {product.name}
                                </p>
                                <p className="text-center pb-2">
                                    $
                                    {product.price.toLocaleString(0, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RelatedItems;
