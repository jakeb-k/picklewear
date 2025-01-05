import { Head } from "@inertiajs/react";
import Alert from "@/Components/common/Alert";
import { useState } from "react";
import MainProductCard from "@/Components/home/MainProductCard";
import ProductCard from "@/Components/product/ProductCard";

export default function ProductIndexLayout(props) {
    const [products, setProducts] = useState(props.products);
    const category = props.category;
    const type = props.type;

    // Function to chunk products into groups of 3
    const chunkProducts = (products) => {
        const chunks = [];
        for (let i = 0; i < products.length; i += 3) {
            chunks.push(products.slice(i, i + 3));
        }
        return chunks;
    };

    const productChunks = chunkProducts(products);

    console.log(products);

    return (
        <div className="min-h-screen py-24">
            <div className="mx-24">
                <Head title={"Category"} />

                <Alert />

                <div className="flex mt-12 justify-between items-center">
                    <p className="font-oswald text-3xl">
                        <a
                            className="text-gray-400 hover:text-black duration-150 ease-in-out transition-all"
                            href={route("index")}
                        >
                            Home /{" "}
                        </a>
                        {category}
                    </p>
                    <p className="font-oswald text-3xl italic text-gray-500">
                        {products.length} items found
                    </p>
                </div>

               
            </div>
            <hr className=" bg-gray-400 my-8 h-0.5 mx-16" />
            <main className="flex space-x-6 mr-16">
                <section className="bg-white p-8 rounded-r-lg drop-shadow-lg w-[19.5%]"></section>
                <section className="w-[80.5%] flex flex-wrap space-y-6">
                    {productChunks.map((chunk, index) => (
                        <div
                            key={index}
                            className="flex justify-start gap-6 w-full"
                        >
                            {chunk.map((product) => (
                                <ProductCard
                                    product={product}
                                    key={product.id}
                                />
                            ))}
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}
