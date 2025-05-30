import { Head } from "@inertiajs/react";
import moment from "moment";
import { useState, useRef, useEffect } from "react";
import tinycolor from "tinycolor2";
import useCartStore from "@/Stores/useCartStore";
import { v4 as uuidv4 } from "uuid";
import RelatedItems from "@/Components/product/RelatedProducts";
import { CSSTransition } from "react-transition-group";
import TestImage from "@/../assets/images/testing_imgs/test_1.webp";

export default function ProductShowLayout(props) {
    const product = props.product;
    const relatedItems = props.relatedItems;
    const colors =
        props.product.options
            .find((option) => option.type === "color")
            ?.values?.split(".") || [];
    const { images } = props.product;
    const sizes = ["XS", "S", "M", "L", "XL"];
    const [selectedSize, setSelectedSize] = useState("M");
    const [displayImage, setDisplayImage] = useState(images[0]);
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [quantity, setQuantity] = useState(1);
    const [showAlert, setShowAlert] = useState(false);
    const [crumbs, setCrumbs] = useState(
        JSON.parse(sessionStorage.getItem("crumbs")) ?? null,
    );
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);
    const { addProduct } = useCartStore();
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const isClothing = product.tags
        .filter((tag) => tag.type === "category")
        .find((tag) => tag.name.en === "mens" || tag.name.en === "womens");
    const addToCart = (product) => {
        setShowAlert(false);
        let productData = {
            ...product,
            price: product.discount
                ? (
                      product.price -
                      product.price * product.discount
                  ).toLocaleString(0, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                  })
                : product.price,
            color: selectedColor,
            size: selectedSize,
            quantity: quantity,
            image: images[0],
            cartItemId: uuidv4(),
        };
        addProduct(productData);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 2500);
    };
    const textareaRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            // Reset height to auto to calculate new height correctly
            textarea.style.height = "auto";
            // Set height based on scrollHeight
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, []);

    const incrementIndex = (direction) => {
        setCurrentIndex((prevIndex) => {
            if (direction === 1) {
                return prevIndex >= images.length - 1 ? 0 : prevIndex + 1;
            } else {
                return prevIndex <= 0 ? images.length - 1 : prevIndex - 1;
            }
        });
    };

    const Alert = () => {
        return (
            <div className="border-2 border-main rounded-xl px-8 flex fixed py-4 lg:top-24 top-28 lg:right-12 lg:left-auto lg:translate-x-0 left-1/2 transform -translate-x-1/2 lg:h-8 h-16 lg:w-fit w-full items-center bg-secondary z-[999]">
                <i className="fa-regular fa-circle-check text-main mt-1"></i>
                <p className="tracking-wide ml-4 text-main font-oswald">
                    Your item/s have been added to the cart.
                </p>
            </div>
        );
    };

    return (
        <div className="min-h-screen py-24 lg:mx-24 mx-8">
            <Head title={product.name} />
            <CSSTransition
                in={showAlert}
                timeout={300}
                classNames="fade"
                unmountOnExit
            >
                <Alert />
            </CSSTransition>
            {crumbs && (
                <div className="flex mt-12 justify-between items-center mb-4">
                    <p className="font-oswald text-3xl">
                        <a
                            className="text-gray-400 hover:text-black duration-150 ease-in-out transition-all"
                            href={route("index")}
                        >
                            Home{" "}
                        </a>
                        <a
                            className="text-gray-400 hover:text-black duration-150 ease-in-out transition-all"
                            href={route("products.index", crumbs.category)}
                        >
                            {" / "}
                            {crumbs.category.charAt(0).toUpperCase() +
                                crumbs.category.slice(1)}
                        </a>
                        {crumbs.type && (
                            <a
                                className="text-gray-400 hover:text-black duration-150 ease-in-out transition-all"
                                href={
                                    route("products.index", crumbs.category) +
                                    "?type=" +
                                    encodeURIComponent(
                                        crumbs.type.toLowerCase(),
                                    )
                                }
                            >
                                {" "}
                                /{" "}
                                {crumbs.type.charAt(0).toUpperCase() +
                                    crumbs.type.slice(1)}
                            </a>
                        )}
                    </p>
                </div>
            )}

            <div
                className={`flex lg:flex-row flex-col ${!crumbs ? "mt-12" : ""} relative`}
            >
                <div className="flex lg:flex-row flex-col justify-between items-center lg:w-[47.5%] ">
                    {images.length <= 3 ? (
                        <div className="lg:w-[20%] flex lg:flex-col flex-row lg:space-y-8">
                            {images.map((image) => {
                                return (
                                    <img
                                        onClick={() => setDisplayImage(image)}
                                        key={image.id}
                                        src={image.file_path ?? TestImage}
                                        className={`lg:w-full w-1/3 max-h-[250px] rounded-md cursor-pointer ${
                                            displayImage.id != image.id
                                                ? "opacity-70 hover:opacity-100"
                                                : "border border-main"
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={() => incrementIndex(-1)}
                                className="absolute transform top-1/2 -rotate-90 lg:rotate-0 -translate-y-1/2 lg:translate-x-0 lg:-top-0 lg:left-1/2 -left-4 bg-white border border-main rounded-full px-2 py-1 text-black z-20"
                            >
                                ▲
                            </button>
                            <div className="relative lg:h-[600px] lg:py-0 lg:vertical-shadow lg:w-[300px] overflow-scroll flex flex-col items-center">
                                <div
                                    ref={containerRef}
                                    className="flex flex-row lg:flex-col transition-transform duration-500 ease-in-out"
                                    style={{
                                        transform: isMobile
                                            ? `translateX(-${currentIndex * 128}px)`
                                            : `translateY(-${currentIndex * 208}px)`,
                                    }}
                                >
                                    {images.map((image, idx) => (
                                        <img
                                            onClick={() =>
                                                setDisplayImage(image)
                                            }
                                            key={idx}
                                            src={image.file_path ?? TestImage}
                                            alt="Product"
                                            className={`lg:w-full w-1/3 max-h-[200px] rounded-md cursor-pointer lg:mr-0 mr-2 mb-2 ${
                                                displayImage.id != image.id
                                                    ? "opacity-70 hover:opacity-100"
                                                    : "border border-main"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => incrementIndex(1)}
                                className="absolute lg:top-auto lg:rotate-0 top-1/2 transform -translate-y-1/2 -rotate-90 lg:right-1/2 lg:translate-x-1/2 -right-4 lg:-bottom-4 bg-white border border-main rounded-full px-2 py-1 text-black z-20"
                            >
                                ▼
                            </button>
                        </div>
                    )}
                    <div className="lg:w-[75%]">
                        <img
                            src={displayImage?.file_path ?? TestImage}
                            className="w-full max-h-[450px] rounded-md object-contain"
                        />
                    </div>
                </div>

                <div className="lg:w-[45%] lg:ml-auto flex flex-col justify-start">
                    <p className="text-3xl font-oswald">{product.name}</p>
                    <p className="mt-6">
                        {product.discount > 0 && (
                            <span className="text-lg line-through">
                                ${product.price.toFixed(2)}
                            </span>
                        )}
                        <span
                            className={`text-2xl font-bold ${product.discount ? "ml-6" : ""}`}
                        >
                            $
                            {product.discount
                                ? (
                                      product.price -
                                      product.price * product.discount
                                  ).toLocaleString(0, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                  })
                                : product.price}
                        </span>
                    </p>
                    <div className="w-full my-4 border border-gray-400 mx-auto"></div>
                    {product.options.length > 0 && (
                        <>
                            <p className="font-bold">Options</p>
                            <div className="flex flex-wrap w-full mb-4">
                                {colors.length > 0 &&
                                    colors.map((color, index) => {
                                        let hex = tinycolor(color);
                                        return (
                                            <div
                                                onClick={() =>
                                                    setSelectedColor(color)
                                                }
                                                key={index}
                                                style={{
                                                    backgroundColor:
                                                        hex.toHexString(),
                                                }}
                                                className={`rounded-full mt-4 mr-4 p-2 w-12 h-12 border transition-all border-black duration-150 ease-in-out cursor-pointer ${
                                                    selectedColor == color
                                                        ? "border-2"
                                                        : "opacity-50 hover:opacity-100 "
                                                }`}
                                            ></div>
                                        );
                                    })}
                            </div>
                            {isClothing && (
                                <>
                                    <div className="flex flex-wrap w-full mt-4">
                                        <div className="flex">
                                            {sizes.map((size, index) => {
                                                return (
                                                    <div
                                                        onClick={() =>
                                                            setSelectedSize(
                                                                size,
                                                            )
                                                        }
                                                        key={index}
                                                        className={`font-bold min-w-8 text-center text-2xl mr-10 cursor-pointer transition-all duration-150 ease-in-out ${
                                                            size == selectedSize
                                                                ? "border-b-2 border-black pb-1 text-black"
                                                                : "border-b-2 border-transparent pb-1 text-gray-500 hover:text-black"
                                                        }`}
                                                    >
                                                        {size}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="w-full my-4 border border-gray-400 mx-auto"></div>
                        </>
                    )}
                    <textarea
                        ref={textareaRef}
                        value={product.description}
                        disabled={true}
                        style={{ height: "auto" }}
                        className="h-full resize-none p-0 py-2 mb-6 overflow-visible w-full bg-transparent cursor-default pointer-events-none border-none text-black auto-resize"
                    ></textarea>
                    {!product.available && (
                        <p className="italic font-bold text-lg">
                            Currently out of stock — we know, it's a real
                            dill-emma. Sorry for the heartbreak, we'll restock
                            soon!
                        </p>
                    )}
                    <p className="italic my-4">
                        <b>
                            Will be delivered between{" "}
                            {product.delivery_date
                                ? moment()
                                      .add(product.delivery_date || 0, "days")
                                      .format("Do MMM YYYY") +
                                  " and " +
                                  moment()
                                      .add(
                                          parseInt(product.delivery_date) + 7 ||
                                              0,
                                          "days",
                                      )
                                      .format("Do MMM YYYY")
                                : ""}
                        </b>
                    </p>
                    <div className="mt-auto flex lg:flex-row flex-col lg:space-x-32 lg:mx-auto lg:space-y-0 space-y-8">
                        <div className="flex">
                            <button
                                onClick={() => {
                                    if (quantity != 0) {
                                        setQuantity(quantity - 1);
                                    }
                                }}
                                className={`rounded-l-xl border-2 border-gray-700 p-1 px-2 text-2xl w-10 duration-150 transition-color ease-in-out  ${!product.available ? "cursor-not-allowed" : " hover:bg-gray-700 hover:border-main hover:text-main 10 hover:border-2"}`}
                            >
                                -
                            </button>
                            <p className="border-y-2 flex justify-center border-black bg-white p-2 px-6 text-2xl w-16 text-center">
                                {quantity}
                            </p>
                            <div></div>
                            <button
                                onClick={() => {
                                    setQuantity(quantity + 1);
                                }}
                                className={`rounded-r-xl border-2 border-gray-700 p-1 px-2 text-2xl w-10 duration-150 transition-color ease-in-out  ${!product.available ? "cursor-not-allowed" : " hover:bg-gray-700 hover:border-main hover:text-main 10 hover:border-2"}`}
                            >
                                +
                            </button>
                        </div>
                        <button
                            disabled={!product.available}
                            onClick={() => addToCart(product)}
                            className={`transition-all duration-200 ease-in-out text-3xl font-bold px-4 py-2 rounded-lg text-nowrap ${!product.available ? "bg-gray-400 border border-black cursor-not-allowed" : "bg-main hover:bg-secondary hover:text-main hover:border-main border-2 border-black  hover:border-2 "}`}
                        >
                            Add To Cart
                        </button>
                    </div>
                </div>
            </div>
            <div className="lg:mt-8 font-oswald py-10">
                <h2 className="text-2xl text-secondary italic text-left mb-8">
                    You might also like...
                </h2>
                <RelatedItems relatedItems={relatedItems} />
            </div>
        </div>
    );
}
