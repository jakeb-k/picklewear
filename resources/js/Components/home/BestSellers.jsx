import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";

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
                console.log(response.data);
                setProducts(response.data.bestsellers);
                setLoading(false);
            })
            .catch((error) => {
                console.error("El Problemo: " + error);
            });
    }

    const navigateToProduct = (id) => {
      router.visit(route('products.show', id))
    }

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

    if (!loading) {
        return (
            <div
                className="relative ml-[1%] border"
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
                    {products.map((product, index) => {
                        let productImg = product.images[0];
                        return (
                            <div
                                onClick={() => navigateToProduct(product.id)}
                                className="relative mr-[2%] min-h-[450px] rounded-md bg-white hover:bg-gray-500/50 group z-20 cursor-pointer overflow-hidden transition-all duration-300"
                                style={{ minWidth: "23%" }} // Ensure the minimum width stays at 23%
                            >
                                <div className="absolute inset-0 bg-gray-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                                <img
                                    src={productImg.file_path}
                                    className="rounded-md rounded-b-none w-full object-cover"
                                />
                                <div className="relative h-full bg-white">
                                    <p>{product.name}</p>
                                    <p>{product.price}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    } else {
        return <p>loading</p>;
    }
};

export default BestSellers;
