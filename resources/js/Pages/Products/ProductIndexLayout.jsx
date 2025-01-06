import { Head } from "@inertiajs/react";
import Alert from "@/Components/common/Alert";
import { useState, useEffect } from "react";
import ProductCard from "@/Components/product/ProductCard";
import useFavouritesStore from "@/Stores/useFavouritesStore";
import Select from "react-select";

export default function ProductIndexLayout(props) {
    const [products, setProducts] = useState(props.products);
    const [loading, setLoading] = useState(true);
    const { favourites } = useFavouritesStore();
    const [category, setCategory] = useState(props.category);
    const [sort, setSort] = useState(null); 
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

    
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            width: '18rem',
            cursor: "pointer",
            fontSize: "1rem", // Larger font size
            borderColor: state.isFocused ? "#6B7280" : "#6B7280", // gray-600 colour
            padding: "0.15rem", // py-1 equivalent (1 rem = 16px, so 0.25rem = 4px)
            boxShadow: state.isFocused ? "0 0 0 1px #6B7280" : "none",
            "&:hover": {
                borderColor: "#6B7280", // Ensure hover state matches the colour
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#9CA3AF", // Optional: Gray-400 for placeholder text
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 60, // Set z-index of the dropdown menu higher than z-50
            cursor: "pointer", 
        }),
    };
    
    const handleOnSelectChange = (selectedOption) => {
        setSort(selectedOption);
    };


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
                            {category.charAt(0).toUpperCase() +
                                category.slice(1)}
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
            <div className="flex justify-end pr-16 mb-8 z-50 ">
                <Select
                    name="sort"
                    placeholder='Sort By...'
                    options={[
                        { value: "priceAsc", label: "Price - Low to High" },
                        { value: "priceDesc", label: "Price - High to Low" },
                        { value: "popularity", label: "Popularity" },
                        { value: "discount", label: "Largest Discount" },
                        { value: "arrivals", label: "New Arrivals" },
                        { value: "delivery", label: "Delivery Speed" },
                    ]}
                    onChange={handleOnSelectChange}
                    value={sort}
                    styles={customStyles}
                    isClearable={true}
                />
            </div>
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
                                    <div className="flex-1 max-w-[31.5%]">
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
