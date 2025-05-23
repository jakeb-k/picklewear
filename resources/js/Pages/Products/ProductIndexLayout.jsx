import { Head } from "@inertiajs/react";
import Alert from "@/Components/common/Alert";
import { useState, useEffect } from "react";
import ProductCard from "@/Components/product/ProductCard";
import useFavouritesStore from "@/Stores/useFavouritesStore";
import Select from "react-select";
import ProductColorFilter from "@/Components/product/ProductColorFilter";
import ProductPriceFilter from "@/Components/product/ProductPriceFilter";

export default function ProductIndexLayout(props) {
    const [products, setProducts] = useState(props.products);
    const [loading, setLoading] = useState(true);
    const { favourites } = useFavouritesStore();
    const [sort, setSort] = useState(null);
    const [colorFilters, setColorFilters] = useState([]);
    const [priceFilter, setPriceFilter] = useState(null);
    const [productChunks, setChunks] = useState({});
    const [colorOptions, setColorOptions] = useState(null);
    const [page, setPage] = useState(1);

    const category = props.category;
    const type = props.type;

    const [shownProductChunks, setShownProductChunks] = useState([]);

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

    const updateColorFilters = (newFilter) => {
        setColorFilters((prevFilters) => {
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

    const removeFilter = (oldFilter) => {
        setColorFilters((prevFilters) => {
            const updatedFilters = prevFilters.filter(
                (prevFilter) => prevFilter.name != oldFilter.name,
            );
            return [...updatedFilters];
        });
    };

    useEffect(() => {
        if (sessionStorage.getItem("crumbs")) {
            sessionStorage.removeItem("crumbs");
        }
        const crumbs = {
            category: category,
            type: type,
        };

        sessionStorage.setItem("crumbs", JSON.stringify(crumbs));
    }, []);

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
    }, [category, favourites, products]);

    useEffect(() => {
        const rowsPerPage = 2;
        if (productChunks.length > 0) {
            const newChunks = productChunks.slice(
                (page - 1) * rowsPerPage,
                page * rowsPerPage,
            );
            setShownProductChunks(newChunks);
        }
    }, [page, productChunks]);

    useEffect(() => {
        setLoading(true);
        if (sort) {
            sortProducts();
        }
        setLoading(false);
    }, [sort]);

    useEffect(() => {
        if (colorFilters.length > 0) {
            const filteredProducts = filterProductsByColor(products);
            setChunks(chunkProducts(filteredProducts));
        } else if (priceFilter) {
            const filteredProducts = filterProductsByPrice(products);
            setChunks(chunkProducts(filteredProducts));
        } else {
            setChunks(chunkProducts(products));
        }
    }, [colorFilters]);

    useEffect(() => {
        if (priceFilter) {
            const filteredProducts = filterProductsByPrice(products);
            setChunks(chunkProducts(filteredProducts));
        } else if (colorFilters.length > 0) {
            const filteredProducts = filterProductsByColor(products);
            setChunks(chunkProducts(filteredProducts));
        } else {
            setChunks(chunkProducts(products));
        }
    }, [priceFilter]);

    function sortProducts() {
        console.log("Sorting products by: ", sort.value);
        let sortedProducts = [];

        switch (sort.value) {
            case "priceAsc":
                sortedProducts = products.sort(
                    (a, b) => a.price - b.price,
                );
                break;
            case "priceDesc":
                sortedProducts = products.sort(
                    (a, b) => b.price - a.price,
                );
                break;
            case "popularity":
                sortedProducts = products.sort(
                    (a, b) => b.order_count - a.order_count,
                );
                break;
            case "discount":
                sortedProducts = products.sort(
                    (a, b) => b.discount - a.discount,
                );
                break;
            case "arrivals":
                sortedProducts = products.sort((a, b) => {
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
                sortedProducts = products.sort(
                    (a, b) => a.delivery_date - b.delivery_date,
                );
                break;
            default:
                console.error("Invalid sort option");
                return;
        }

        console.log(sortedProducts); 
        // Update the state with sorted products and re-chunk them
        setProducts(sortedProducts);
        setChunks(chunkProducts(sortedProducts));
    }

    function filterProductsByColor(products, isFiltered = false) {
        let filterNames = colorFilters.map((filter) => filter.name);
        let filteredProducts = [];
        products.map((product) => {
            product.options.map((option) => {
                let options = option.values.split(".");
                const isFiltered = options.some((option) =>
                    filterNames.includes(option),
                );
                if (isFiltered) filteredProducts.push(product);
            });
        });
        if (priceFilter && !isFiltered) {
            filteredProducts = filterProductsByPrice(filteredProducts);
        }
        return filteredProducts;
    }

    function filterProductsByPrice(products, isFiltered = false) {
        let priceRange = priceFilter.value;
        let filteredProducts = products.filter((product) => {
            return (
                product.price >= priceRange.min &&
                product.price <= priceRange.max
            );
        });
        if (colorFilters.length > 0 && !isFiltered) {
            filteredProducts = filterProductsByColor(filteredProducts, true);
        }
        return filteredProducts;
    }

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            width: "20rem",
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
            <div className="lg:mx-24 mx-8">
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
                    <p className="font-oswald lg:text-3xl text-xl">
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
                                /{" "}
                                {type.includes("sale") ? (
                                    <>
                                        Under{" "}
                                        <span className="font-roboto_mono">
                                            ${+type.slice(4)}
                                        </span>
                                    </>
                                ) : (
                                    type.charAt(0).toUpperCase() + type.slice(1)
                                )}
                            </a>
                        )}
                    </p>
                    {!loading && (
                        <p className="font-oswald lg:text-3xl text-xl italic text-gray-500">
                            {productChunks.reduce(
                                (count, group) => count + group.length,
                                0,
                            )}{" "}
                            items found
                        </p>
                    )}
                </div>
            </div>
            <hr className=" bg-gray-400 lg:my-8 my-4 h-0.5 lg:mx-16 mx-8" />
            <div className="flex lg:flex-row flex-col justify-between lg:px-16 px-8 mb-8">
                <div className="flex flex-wrap">
                    {colorFilters.map((filter) => {
                        return (
                            <div className="px-2 py-0.5 mb-2 bg-white rounded-sm flex h-fit space-x-2 mr-3">
                                <p className="font-oswald text-lg">
                                    {filter.type.charAt(0).toUpperCase() +
                                        filter.type.slice(1)}
                                    :{" "}
                                    {filter.name.charAt(0).toUpperCase() +
                                        filter.name.slice(1)}
                                </p>
                                <button
                                    className="bg-gray-200 h=fit px-1 text-gray-600 hover:bg-gray-300 duration-150 transition-color ease-in-out"
                                    onClick={() => {
                                        removeFilter(filter);
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        );
                    })}
                    {priceFilter && (
                        <div className="px-2 py-0.5 mb-2 bg-white rounded-sm flex h-fit space-x-2 mr-3">
                            <p className="font-oswald text-lg">
                                {priceFilter.type.charAt(0).toUpperCase() +
                                    priceFilter.type.slice(1)}
                                :{" "}
                                {priceFilter.name.charAt(0).toUpperCase() +
                                    priceFilter.name.slice(1)}
                            </p>
                            <button
                                className="bg-gray-200 h=fit px-1 text-gray-600 hover:bg-gray-300 duration-150 transition-color ease-in-out"
                                onClick={() => {
                                    setChunks(chunkProducts(products));
                                    setPriceFilter(null);
                                }}
                            >
                                X
                            </button>
                        </div>
                    )}
                </div>
                {products.length > 0 && (
                    <div className="flex justify-end z-30 ">
                        <Select
                            name="sort"
                            placeholder="Sort By..."
                            options={[
                                {
                                    value: "priceAsc",
                                    label: "Price - Low to High",
                                },
                                {
                                    value: "priceDesc",
                                    label: "Price - High to Low",
                                },
                                { value: "popularity", label: "Popularity" },
                                {
                                    value: "discount",
                                    label: "Largest Discount",
                                },
                                { value: "arrivals", label: "New Arrivals" },
                                { value: "delivery", label: "Delivery Speed" },
                            ]}
                            onChange={handleOnSelectChange}
                            value={sort}
                            styles={customStyles}
                            isClearable={true}
                        />
                    </div>
                )}
            </div>
            {!loading && (
                <main className="flex lg:flex-row flex-col lg:space-x-6 mx-4 lg:mx-16">
                    {products.length > 0 ? (
                        <>
                            <section id="filters" className="bg-white p-8 rounded-lg drop-shadow-lg lg:w-[24.5%] h-fit">
                                {/* COLOR FILTER */}
                                <ProductColorFilter
                                    colorOptions={colorOptions}
                                    updateFilters={updateColorFilters}
                                    colorFilters={colorFilters.filter(
                                        (filter) => filter.type == "color",
                                    )}
                                />
                                <div className="bg-gray-400 h-[0.5px] my-4" />
                                <ProductPriceFilter
                                    updateFilters={setPriceFilter}
                                    min={10}
                                    max={
                                        products.sort(
                                            (a, b) => b.price - a.price,
                                        )[0].price + 10
                                    }
                                />
                                <div className="bg-gray-400 h-[0.5px] my-4" />
                            </section>
                            <section className="lg:w-[75.5%] w-full lg:mt-0 mt-4 space-y-6">
                                {shownProductChunks.map((chunk, index) => (
                                    <div
                                        key={index}
                                        className="flex lg:flex-row flex-col justify-start gap-[3%] w-full"
                                    >
                                        {chunk.map((product) => (
                                            <div
                                                key={product.id}
                                                className="flex-1 lg:max-w-[31.5%] flex-col"
                                            >
                                                <ProductCard
                                                    product={product}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                                <div className="flex space-x-2 justify-center">
                                    {Array.from({
                                        length: Math.ceil(
                                            productChunks.length / 2,
                                        ),
                                    }).map((_, index) => (
                                        <a
                                            href="#filters"
                                            key={index}
                                            onClick={() => setPage(index + 1)}
                                            className={`px-3 py-1 rounded ${page === index + 1 ? "bg-black text-white" : "bg-gray-200 border border-black hover:bg-main hover:text-black transition-all duration-150 ease-in-out"}`}
                                        >
                                            {index + 1}
                                        </a>
                                    ))}
                                </div>
                            </section>
                        </>
                    ) : (
                        <div className="text-center w-full text-2xl">
                            No Products Found :(
                        </div>
                    )}
                </main>
            )}
        </div>
    );
}
