import { Head } from "@inertiajs/react";
import Alert from "@/Components/common/Alert";
import { useState, useEffect } from "react";
import ProductCard from "@/Components/product/ProductCard";
import useFavouritesStore from "@/Stores/useFavouritesStore";

export default function ProductIndexLayout(props) {
    const [products, setProducts] = useState(props.products);
    const [loading, setLoading] = useState(true);
    const { favourites } = useFavouritesStore();
    const [category, setCategory] = useState(props.category);
    const [productChunks, setChunks] = useState({});
    const type = props.type;
    // Function to chunk products into groups of 3
    const chunkProducts = (products) => {
        const chunks = [];
        for (let i = 0; i < products.length; i += 3) {
            chunks.push(products.slice(i, i + 3));
        }
        return chunks;
    };

    useEffect(() => {
        if (category === "favourites") {
            setProducts(favourites);
            setChunks(chunkProducts(favourites));
        } else {
            setChunks(chunkProducts(products));
        }
        setLoading(false);
    }, [category, favourites]);

    return (
        <div className="min-h-screen py-24">
            <div className="mx-24">
                <Head
                    title={
                        category.charAt(0).toUpperCase() +
                        category.slice(1) +
                        (type
                            ? " / " +
                              type.charAt(0).toUpperCase() +
                              type.slice(1)
                            : "")
                    }
                />

                <Alert />

                <div className="flex mt-12 justify-between items-center">
                    <p className="font-oswald text-3xl">
                        <a
                            className="text-gray-400 hover:text-black duration-150 ease-in-out transition-all"
                            href={route("index")}
                        >
                            Home{" "}
                        </a>
                        <a
                            className={`${!type ? "" : "text-gray-400 hover:text-black duration-150 ease-in-out transition-all"}`}
                            href={route("products.index", category)}
                        >
                            {" / "}
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </a>
                        {type && (
                            <a
                                className=""
                                href={
                                    route("products.index", category) +
                                    "?type=" +
                                    encodeURIComponent(type.toLowerCase())
                                }
                            >
                                {" "}
                                / {type.charAt(0).toUpperCase() + type.slice(1)}
                            </a>
                        )}
                    </p>
                    <p className="font-oswald text-3xl italic text-gray-500">
                        {products.length} items found
                    </p>
                </div>
            </div>
            <hr className=" bg-gray-400 my-8 h-0.5 mx-16" />
            {!loading && (
                <main className="flex space-x-6 mr-16">
                    <section className="bg-white p-8 rounded-r-lg drop-shadow-lg w-[19.5%]"></section>
                    <section className="w-[80.5%] space-y-6">
                        {productChunks.map((chunk, index) => (
                            <div
                                key={index}
                                className="flex justify-start gap-[3%] w-full"
                            >
                                {chunk.map((product) => (
                                    <div className='flex-1 max-w-[31.5%]'>
                                        <ProductCard
                                            product={product}
                                            key={product.id}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </section>
                </main>
            )}
        </div>
    );
}
