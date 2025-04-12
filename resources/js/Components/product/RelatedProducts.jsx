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

    const isMobile = window.innerWidth < 640; // Tailwind 'sm' breakpoint

    const slideAmount = isMobile ? 102 : 24.95;
    return (
        <div
            className="relative border pt-2 pb-8 flex overflow-hidden w-full"
            ref={containerRef}
        >
            <div
                className="w-full flex lg:flex-nowrap flex-wrap"
                style={{
                    display: "flex justify-center",
                    transform: `translateX(-${currentIndex * slideAmount}%)`, // Slide by 25% for one image
                    transition: "transform 0.5s ease-in-out",
                }}
            >
                {products.map((product, index) => {
                    const productImg = product.images[0];
                    return (
                        <div
                            key={index}
                            onClick={() => navigateToProduct(product.id)}
                            className="relative lg:max-w-[25%] lg:min-w-[23%] w-[47.5%] lg:mt-0 mt-2 mr-[2%] lg:min-h-[350px] min-h-[250px] rounded-md group z-20 cursor-pointer overflow-hidden transition-all duration-150 bg-gray-100/90 hover:bg-white shadow-md hover:shadow-xl"
                        >
                            <img
                                src={
                                    productImg?.file_path
                                        ? productImg.file_path
                                        : TestImage
                                }
                                className="rounded-md rounded-b-none w-full object-cover product-image"
                            />
                            <div className="relative h-full px-2">
                                <p className="text-xl text-center pt-4 pb-2">
                                    {product.name}
                                </p>
                                <p className="text-center pb-2">
                                    $
                                    <span className="font-roboto_mono">
                                        {product.price.toLocaleString(0, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
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
