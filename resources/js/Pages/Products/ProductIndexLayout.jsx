import { Head } from "@inertiajs/react";
import Alert from "@/Components/common/Alert";
import { useState, useEffect } from "react";
import ProductCard from "@/Components/product/ProductCard";
import useFavouritesStore from "@/Stores/useFavouritesStore";
import Select from "react-select";
import ProductColorFilter from "@/Components/product/ProductColorFilter";

export default function ProductIndexLayout(props) {
    const [products, setProducts] = useState(props.products);
    const [loading, setLoading] = useState(true);
    const { favourites } = useFavouritesStore();
    const [sort, setSort] = useState(null);
    const [filters, setFilters] = useState([]);
    const [productChunks, setChunks] = useState({});
    const [colorOptions, setColorOptions] = useState(null);

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
    const getColors = (products) => {
        const colors = [];
        products.map((product) => {
            let options = product.options.find(
                (option) => option.type == "color",
            );
            if (options) {
                options = options.values.split(".");
                options.forEach((option) => {
                    if (!colors.includes(option)) {
                        colors.push(option);
                    }
                });
            }
        });
        return colors;
    };

    const updateFilters = (newFilter) => {
        setFilters((prevFilters) => {
            const newFilterExists = prevFilters.some(
                (prevFilter) => prevFilter.name == newFilter.name,
            );
            if (newFilterExists) {
                const updatedFilters = prevFilters.filter(
                    (prevFilter) => prevFilter.name != newFilter.name,
                );
                return [...updatedFilters];
            } else {
                return [...prevFilters, newFilter];
            }
        });
    };

    useEffect(() => {
        if (category === "favourites") {
            setProducts(favourites);
            setChunks(chunkProducts(favourites));
            setColorOptions(getColors(favourites));
        } else {
            setChunks(chunkProducts(products));
            setColorOptions(getColors(products));
        }
        setLoading(false);
    }, [category, favourites]);

    useEffect(() => {
        setLoading(true);
        if (sort) {
            sortProducts();
        }
        setLoading(false);
    }, [sort]);

    useEffect(() => {
        if (filters.length > 0) {
            filterProducts();
        } else {
            setChunks(chunkProducts(products));
        }
    }, [filters]);

    function sortProducts() {
        let sortedProducts = [];

        switch (sort.value) {
            case "priceAsc":
                sortedProducts = [...products].sort(
                    (a, b) => a.price - b.price,
                );
                break;
            case "priceDesc":
                sortedProducts = [...products].sort(
                    (a, b) => b.price - a.price,
                );
                break;
            case "popularity":
                sortedProducts = [...products].sort(
                    (a, b) => b.order_count - a.order_count,
                );
                break;
            case "discount":
                sortedProducts = [...products].sort(
                    (a, b) => b.discount - a.discount,
                );
                break;
            case "arrivals":
                sortedProducts = [...products].sort((a, b) => {
                    const now = new Date().getTime();
                    const diffA = Math.abs(
                        new Date(a.created_at).getTime() - now,
                    );
                    const diffB = Math.abs(
                        new Date(b.created_at).getTime() - now,
                    );

                    return diffA - diffB;
                });
                break;
            case "delivery":
                sortedProducts = [...products].sort(
                    (a, b) => a.delivery_date - b.delivery_date,
                );
                break;
            default:
                console.error("Invalid sort option");
                return;
        }

        // Update the state with sorted products and re-chunk them
        setProducts(sortedProducts);
        setChunks(chunkProducts(sortedProducts));
    }
    
    function filterProducts() {
        let filterNames = filters.map((filter) => filter.name);
        let filteredProducts = [];
        products.map((product) => {
            product.options.map((option) => {
                let options = option.values.split(".");
                const isFiltered = options.some((option) =>
                    filterNames.includes(option),
                );
                console.log(isFiltered + '\n' + options)
                if (isFiltered) filteredProducts.push(product);
            });
        });
        setChunks(chunkProducts(filteredProducts));
    }

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            width: "18rem",
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
                    placeholder="Sort By..."
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
                <main className="flex space-x-6 mx-16">
                    <section className="bg-white p-8 rounded-lg drop-shadow-lg w-[24.5%]">
                        {/* COLOR FILTER */}
                        <ProductColorFilter
                            colorOptions={colorOptions}
                            updateFilters={updateFilters}
                            filters={filters.filter(
                                (filter) => filter.type == "color",
                            )}
                        />
                        <hr className="bg-gray-400 h-0.5 my-4" />
                    </section>
                    <section className="w-[75.5%] space-y-6">
                        {productChunks.map((chunk, index) => (
                            <div
                                key={index}
                                className="flex justify-start gap-[3%] w-full"
                            >
                                {chunk.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex-1 max-w-[31.5%]"
                                    >
                                        <ProductCard product={product} />
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
