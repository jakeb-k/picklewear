import LoadingIcon from "@/Components/common/LoadingIcon";
import useCartStore from "@/Stores/useCartStore";
import { Head, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import tinycolor from "tinycolor2";
import { CSSTransition } from "react-transition-group";
import discountCodes from "@/utils/discountCodes";
import AddressSearch from "@/Components/common/AddressSearch";
import TestImage from "@/../assets/images/testing_imgs/test_1.webp";

export default function Checkout(props) {
    const [errors, setErrors] = useState({});
    const { user } = usePage().props.auth;
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [initialLocation, setInitialLocation] = useState(null);
    const { products, setProducts } = useCartStore();
    const { data, setData } = useForm({
        first_name: user?.first_name ?? "",
        last_name: user?.last_name ?? "",
        mobile: user?.mobile ?? "",
        street: props.locations ? props.locations[0]?.street : "",
        state: props.locations ? props.locations[0]?.state : "",
        city: props.locations ? props.locations[0]?.city : "",
        postcode: props.locations ? props.locations[0]?.postcode : "",
        discount: 0,
        discountAmount: 0,
    });

    const [code, setCode] = useState("");
    const [promoError, setPromoError] = useState(false);
    const [promoSuccess, setPromoSuccess] = useState(false);
    const [promoLoading, setPromoLoading] = useState(false);

    // Function to update the quantity of a product by cartItemId
    const updateQuantity = (cartItemId, quantity) => {
        setCartItems((prevCartItems) => {
            const updatedCartItems = prevCartItems.map((item) =>
                item.cartItemId === cartItemId ? { ...item, quantity } : item,
            );
            return updatedCartItems;
        });
    };

    const removeItem = (cartItemId) => {
        setLoading(true);
        setCartItems((prevCartItems) => {
            const updatedCartItems = prevCartItems.filter(
                (item) => item.cartItemId !== cartItemId,
            );
            return updatedCartItems;
        });
        setLoading(false);
    };

    useEffect(() => {
        setCartItems(products);
        const loc = props.locations?.[0];
        if (loc) {
            const parts = [
                loc.street,
                loc.city,
                loc.state,
                loc.postcode,
            ].filter(Boolean);
            setInitialLocation(parts.join(" ") + ", Australia");
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        setProducts(cartItems);
    }, [cartItems]);

    function routeToCheckout() {
        setCheckoutLoading(true);
        const total =
            cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0,
            ) +
            cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0,
            ) *
                0.1 -
            data.discountAmount;

        axios
            .post(
                route("checkout.store"),
                { ...data, cart: cartItems, total: total },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            )
            .then((response) => {
                const checkoutUrl = response.data.url;
                // Redirect the browser to the Stripe checkout page
                window.location.href = checkoutUrl;
            })
            .catch((error) => {
                console.error(error);
                setErrors(error.response.data.errors);
                const detailsSection = document.getElementById("details");
                detailsSection.scrollIntoView({ behavior: "smooth", block: "start" });
            })
            .finally(() => {
                setCheckoutLoading(false);
            });
    }

    const handleOnChange = (e) => {
        setData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value, // Dynamically update the field
        }));
    };

    const handleDiscount = (discountData) => {
        console.log(discountData);
        const total = cartItems.reduce(
            (total, item) => total + item.price * item.quantity * discountData,
            0,
        );
        setData({
            ...data,
            discountAmount: total.toFixed(2),
            discount: discountData,
        });
    };

    const handleAddressSelect = (addressData) => {
        const { suggestion, postalCode } = addressData;
        const terms = suggestion.terms;
    
        const street = terms.find((t, i) => i > 0 && isNaN(t.value))?.value || "";
        const streetSecond = terms.find((t, i) => i > 1 && isNaN(t.value) && t.value !== street)?.value || "";
        const city = terms.at(-3)?.value || "";
        const state = terms.at(-2)?.value || "";
    
        setData({
            ...data,
            street: `${street} ${streetSecond}`.trim(),
            city,
            state,
            postcode: postalCode,
        });
    };

    function checkPromoCode() {
        setPromoLoading(true);
        setPromoError(false);
        setPromoSuccess(false);

        setTimeout(() => {
            const discount = discountCodes.find((item) => item.name === code);
            console.log(discount);
            if (discount) {
                setPromoSuccess(true);
                handleDiscount(discount.value);
                setPromoError(false);
            } else {
                setPromoSuccess(false);
                setPromoError(true);
            }

            setPromoLoading(false);
        }, 1000);
    }
 console.log(cartItems)
    return (
        <div className="flex lg:flex-row flex-col justify-between min-h-screen py-24 lg:px-32 px-8 mt-12">
            <Head title="Checkout" />
            <div className="lg:w-[60%]">
                <div id="details" className="bg-white p-8 rounded-lg drop-shadow-lg ">
                    <p className="text-xl mb-2">Contact Information</p>
                    <div className="w-full flex items-center lg:flex-wrap xl:flex-row flex-col flex-nowrap xl:space-y-0 mt-2">
                        <input
                            name="first_name"
                            id="first_name"
                            placeholder="First name*"
                            type="text"
                            required
                            onChange={handleOnChange}
                            value={data.first_name}
                            className={`rounded-lg py-1 px-4 lg:w-auto w-full bg-transparent hover:bg-gray-200/50 lg:mr-4 h-fit focus:ring-2 focus:ring-[#FFD100] focus:outline-none transition-all duration-150 ease-in-out ${errors?.first_name ? "border-2 border-red-500" : ""}`}
                        />
                        <input
                            name="last_name"
                            id="last_name"
                            placeholder="Last name*"
                            type="text"
                            required
                            onChange={handleOnChange}
                            value={data.last_name}
                            className={`rounded-lg py-1 px-4  lg:w-auto w-full bg-transparent lg:mt-0 mt-4 hover:bg-gray-200/50 h-fit lg:mr-4 focus:ring-2 focus:ring-[#FFD100] focus:outline-none transition-all duration-150 ease-in-out ${errors?.last_name ? "border-2 border-red-500" : ""}`}
                        />
                        <div className="relative h-fit xl:pt-0 pt-4">
                            <input
                                name="mobile"
                                id="mobile"
                                placeholder="412 345 678*"
                                type="text"
                                required
                                onChange={handleOnChange}
                                value={data.mobile}
                                className={`rounded-lg py-1 px-4 pl-12 bg-transparent hover:bg-gray-200/50 mr-4 focus:ring-2 focus:ring-[#FFD100] focus:outline-none transition-all duration-150 ease-in-out xl:w-auto w-full ${errors?.mobile ? "border-2 border-red-500" : ""}`}
                            />
                            <p className="absolute bottom-0 left-0 h-fit flex flex-col justify-center px-2 py-1 border-r border-gray-500">
                                +61
                            </p>
                        </div>
                    </div>

                    <p className="text-xl mt-8 mb-2">Address</p>
                    <div className="relative">
                        <AddressSearch
                            onAddressSelect={handleAddressSelect}
                            errors={errors}
                            initialLocation={initialLocation}
                        />
                    </div>
                </div>
                <div className="bg-white p-8 rounded-lg drop-shadow-lg mt-8">
                    <p className="text-xl">Cart</p>
                    {!loading && cartItems.length > 0 ? (
                        <div
                            id="show-scroll"
                            className="lg:px-8 px-4 w-full overflow-x-hidden"
                        >
                            {cartItems.map((item, index) => {
                                let hex = tinycolor(item.color);
                                return (
                                    <div
                                        key={index}
                                        className="relative w-full border-b border-gray-400 mb-4 py-4"
                                    >
                                        <div className="py-4 flex lg:flex-row flex-col lg:justify-between lg:items-center">
                                            <img
                                                className="shadow-lg rounded-xl lg:w-[22.5%] h-full border-2 border-main"
                                                src={item.image.file_path}
                                            />
                                            <div className="lg:w-[57.5%] lg:mt-0 mt-4 space-y-6">
                                                <p>{item.name}</p>
                                                <div className="flex space-x-6 items-center">
                                                    <p className="font-roboto_mono">
                                                        ${item.price}
                                                    </p>
                                                    <p>{item.size}</p>
                                                    <div
                                                        style={{
                                                            backgroundColor:
                                                                hex.toHexString(),
                                                        }}
                                                        className={`rounded-full p-2 w-4 h-4 border transition-all border-black duration-150 ease-in-out cursor-pointer`}
                                                    ></div>
                                                </div>
                                                <div className="flex">
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                item.quantity >
                                                                1
                                                            ) {
                                                                updateQuantity(
                                                                    item.cartItemId,
                                                                    item.quantity -
                                                                        1,
                                                                );
                                                            }
                                                        }}
                                                        className="rounded-l-xl border-2 border-gray-700  px-2 text-lg hover:bg-gray-700 hover:border-main w-10 hover:border-2 duration-150 transition-color ease-in-out hover:text-main"
                                                    >
                                                        -
                                                    </button>
                                                    <p className="border-y-2 flex justify-center border-black bg-white  px-6 text-lg w-6 text-center">
                                                        {item.quantity}
                                                    </p>
                                                    <div></div>
                                                    <button
                                                        onClick={() => {
                                                            updateQuantity(
                                                                item.cartItemId,
                                                                item.quantity +
                                                                    1,
                                                            );
                                                        }}
                                                        className="rounded-r-xl border-2 border-gray-700  px-2 text-lg hover:bg-gray-700 hover:border-main w-10 hover:border-2 duration-150 transition-color ease-in-out hover:text-main"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute lg:top-[35%] top-[85.5%] -right-4 lg:-right-2">
                                            <button
                                                onClick={() => {
                                                    removeItem(item.cartItemId);
                                                }}
                                                className="border-2 rounded-full border-black lg:px-2 px-3 py-0 lg:h-5 h-8 hover:bg-secondary hover:text-red-500 duration-150 transition-all ease-in-out relative"
                                            >
                                                <i className="fa-solid fa-minus text-xs lg:absolute lg:top-0 lg:left-[17.5%]"></i>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-1/2 flex flex-col justify-center text-center text-gray-700">
                            <p className="text-2xl mb-12">
                                Your Cart is Empty!
                            </p>
                            <p className="italic text-lg">
                                Add some items to get started!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white p-8 rounded-lg drop-shadow-lg lg:w-[37.5%] lg:mt-0 mt-4 h-fit">
                <p className="text-2xl">Summary</p>
                <div className="flex justify-between mt-8">
                    <p>Subtotal</p>
                    <p className="font-bold font-roboto_mono text-lg">
                        ${" "}
                        {cartItems
                            .reduce(
                                (total, item) =>
                                    total + item.price * item.quantity,
                                0,
                            )
                            .toLocaleString(0, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                    </p>
                </div>
                <div className="flex justify-between mt-8">
                    <div onClick={() => setExpanded(!expanded)}>
                        Promo Code{" "}
                        {data.discount
                            ? "(" + data.discount * 100 + "%" + ") "
                            : ""}
                        <i
                            className={`fa-solid fa-chevron-down hover:bg-gray-700 hover:text-main duration-150 transition-all ease-in-out cursor-pointer p-1 rounded-full ${expanded ? "rotate-180" : "rotate-0"}`}
                        ></i>
                    </div>
                    <p className="font-bold font-roboto_mono text-lg">
                        - ${""}
                        {data.discountAmount?.toLocaleString(0, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </p>
                </div>
                <CSSTransition
                    in={expanded}
                    timeout={300}
                    classNames="fade"
                    unmountOnExit
                >
                    <div className="bg-gray-200 border-main border-2 rounded-lg p-4 my-4">
                        <p className="text-xs italic mb-4">
                            Discount codes can expire or stop working anytime,
                            no promises, no guarantees. If it's not working,
                            it's just not your lucky day. Try again next time!
                        </p>
                        <div className="relative">
                            <input
                                className={`py-2 w-full px-4 rounded-md bg-white border-main border-2 text-black focus:border-main focus:ring-main `}
                                type="code"
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Enter Code"
                                required={true}
                            />
                            <button
                                onClick={checkPromoCode}
                                className={`absolute w-[50px] right-0 h-full rounded-r-md border border-main text-black hover:bg-main transition-all duration-300 ${promoSuccess ? "bg-green-500" : ""} ${promoError ? "bg-red-500" : ""}`}
                            >
                                {!promoLoading &&
                                    !promoSuccess &&
                                    !promoError && (
                                        <i className="fa-solid fa-arrow-right"></i>
                                    )}
                                {promoLoading && <LoadingIcon />}
                                {!promoLoading && promoSuccess && (
                                    <i className="fa-solid fa-check text-white"></i>
                                )}
                                {!promoLoading && promoError && (
                                    <i className="fa-solid fa-x text-white"></i>
                                )}
                            </button>
                        </div>
                    </div>
                </CSSTransition>
                <div className="flex justify-between mt-8 mb-4">
                    <p>Tax (10%)</p>
                    <p className="font-bold font-roboto_mono text-lg">
                        ${" "}
                        {(
                            cartItems.reduce(
                                (total, item) =>
                                    total + item.price * item.quantity,
                                0,
                            ) * 0.1
                        ).toFixed(2)}
                    </p>
                </div>
                <hr className="border-gray-500 border-dashed" />
                <div className="flex justify-between mt-4">
                    <p className="text-lg font-bold">Total</p>
                    <p className="font-bold font-roboto_mono text-lg">
                        ${" "}
                        {(
                            cartItems.reduce(
                                (total, item) =>
                                    total + item.price * item.quantity,
                                0,
                            ) +
                            cartItems.reduce(
                                (total, item) =>
                                    total + item.price * item.quantity,
                                0,
                            ) *
                                0.1 -
                            data.discountAmount
                        ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </p>
                </div>
                <div className="w-full flex justify-center">
                    <button
                        onClick={() => routeToCheckout()}
                        className="hover:bg-secondary mt-8 hover:text-main hover:border-2 hover:border-main transition-all duration-200 ease-in-out text-xl font-bold px-4 py-2 border-2 border-black bg-main rounded-lg text-nowrap w-2/3 flex justify-center items-center space-x-1"
                    >
                        <p>CHECKOUT</p>
                        {checkoutLoading && (
                            <div>
                                <LoadingIcon />
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
