import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";
import { motion } from "motion/react";

const BestSellers = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null); // Ref for the container
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getData() {
            await getBestsellers();
        }
        getData();
    }, []);

    function getBestsellers() {
        return axios
            .get(route("home.bestsellers"))
            .then((response) => {
                setProducts(response.data.bestsellers);
                setLoading(false);
            })
            .catch((error) => {
                console.error("El Problemo: " + error);
            });
    }

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

    const incrementIndex = (direction) => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex >= products.length - 4) {
                return 0;
            } else if (prevIndex >= products.length - 4) {
                return 0;
            } else {
                return prevIndex + direction;
            }
        });
    };
    const isMobile = window.innerWidth < 640; // Tailwind 'sm' breakpoint

    const slideAmount = isMobile ? 102 : 24.95;

    if (!loading) {
        return (
            <div className="relative">
                <motion.button
                    onClick={() => incrementIndex(-1)}
                    className="z-10 absolute top-[40%] -left-5 px-2 bg-white border-2 text-black text-2xl border-main rounded-lg hover:bg-secondary group duration-150 transition-all ease-in-out"
                    whileTap={{ scale: 0.85 }}
                    transition={{ duration: 0 }}
                >
                    <i className="fa-solid fa-caret-left group-hover:text-main duration-150 text-3xl transition-all ease-in-out"></i>
                </motion.button>

                <div
                    className="ml-[1%] border pt-2 pb-8 side-shadow relative flex overflow-hidden w-full"
                    ref={containerRef}
                >
                    <div
                        className="w-full flex"
                        style={{
                            display: "flex justify-center",
                            transform: `translateX(-${currentIndex * slideAmount}%)`, // Slide by 25% for one image
                            transition: "transform 0.5s ease-in-out",
                        }}
                    >
                        {products.map((product, index) => {
                            let productImg = product.images[0];
                            return (
                                <div
                                    key={index}
                                    onClick={() =>
                                        navigateToProduct(product.id)
                                    }
                                    className="relative mr-[2%] min-h-[350px] rounded-md bg-gray-100/90 hover:bg-white shadow-md hover:shadow-xl group  cursor-pointer overflow-hidden transition-all duration-150 ease-in-out pb-12 lg:min-w-[23%] min-w-full"
                                >
                                    <img
                                        src={productImg.file_path}
                                        className="rounded-md rounded-b-none w-full object-cover product-image pb-8"
                                    />
                                    <div className="px-2 absolute bottom-2 text-center w-full">
                                        <p className="text-xl text-center pt-4 pb-2">
                                            {product.name}
                                        </p>
                                        <p className="text-center pb-2 font-roboto_mono">
                                            ${product.price}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <motion.button
                    onClick={() => incrementIndex(1)}
                    className="z-10 absolute top-[40%] -right-5 px-3 bg-white border-2 text-black text-3xl border-main rounded-lg hover:bg-secondary group duration-150 transition-all ease-in-out"
                    whileTap={{ scale: 0.85 }}
                    transition={{ duration: 0 }}
                >
                    <i className="fa-solid fa-caret-right group-hover:text-main duration-150 transition-all ease-in-out"></i>
                </motion.button>
            </div>
        );
    } else {
        return <p>loading</p>;
    }
};

export default BestSellers;
