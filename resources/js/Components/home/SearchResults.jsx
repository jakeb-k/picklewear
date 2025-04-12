import axios from "axios";
import { useState, useEffect } from "react";
import TestImage from "@/../assets/images/testing_imgs/test_1.webp";

export default function SearchResults({ query }) {
    const [message, setMessage] = useState("...loading");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    async function searchProducts(query) {
        return axios
            .get(route("products.search", query))
            .then((response) => {
                setProducts(response.data.products);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        setLoading(true);
        async function getData() {
            await searchProducts(query);
        }
        getData();
    }, [query]);

    useEffect(() => {
        setTimeout(() => {
            setMessage("Couldn't find any matching products");
        }, 2500);
    }, [products]);

    return (
        <div
            id="show-scroll"
            className="lg:w-3/4 mx-auto h-[75vh] bg-white rounded-t-none rounded-md px-10 py-4 overflow-y-scroll"
        >
            {products.length > 0 && !loading ? (
                <div className="flex flex-row flex-wrap justify-start w-full ">
                    {products.map((product) => (
                        <a
                            href={route("products.show", product.id)}
                            className="flex flex-col relative lg:w-[30%] mr-[2.5%] mb-4 p-4 min-h-[250px] text-center rounded-md bg-white hover:bg-gray-200/25 group z-20 cursor-pointer overflow-hidden transition-all duration-300"
                        >
                            {" "}
                            {/* Adjusted width and added bottom margin */}
                            <div className="absolute inset-0 bg-gray-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                            <img
                                className="w-full"
                                src={product.images[0]?.file_path ?? TestImage}
                            />
                            <div className='mt-auto'>
                                <p className="font-bold z-30">
                                    {product.name}
                                </p>
                                <p className="z-30 font-roboto_mono">
                                    ${product.price.toFixed(2)}
                                </p>
                            </div>
                            <div className='flex flex-row flex-wrap z-30 mt-4'>
                                {product.tags.map((tag) => 
                                    <div className='rounded-2xl bg-gray-300 text-black font-bold mr-2 mt-2 w-fit px-2'>
                                        {tag.name.en}
                                    </div>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <p>{message}</p>
            )}
        </div>
    );
}
