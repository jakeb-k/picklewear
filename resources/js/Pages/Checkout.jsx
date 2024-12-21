import LoadingIcon from "@/Components/common/LoadingIcon";
import useCartStore from "@/Stores/useCartStore";
import { Head, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import tinycolor from "tinycolor2";
import { CSSTransition } from "react-transition-group";

export default function Checkout(props) {
    const [error, setError] = useState({});
    const { user } = usePage().props.auth;
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);
    const { products, setProducts } = useCartStore();
    const { data, setData } = useForm({
        first_name: user?.first_name ?? "",
        last_name: user?.last_name ?? "",
        mobile: user?.mobile ?? "",
        street_name: "",
        state: "",
        suburb: "",
        postcode: "",
        discount: 0,
    });
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

    const setItemsAndClose = () => {
        setProducts(cartItems);
        handleCartClose();
    };
    useEffect(() => {
        setCartItems(products);
        setLoading(false);
    }, []);
    useEffect(() => {
        setProducts(cartItems);
    }, [cartItems]);

    // function routeToCheckout() {
    //     axios.post(route('checkout'), { cart: cartItems }, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //     }).then((response) => {
    //         const checkoutUrl = response.data.url;
    //         // Redirect the browser to the Stripe checkout page
    //         window.location.href = checkoutUrl;
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    // }

    const handleOnChange = (e) => {
        setData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value, // Dynamically update the field
        }));
    };

    const PromoCode = ({ handleDiscount }) => {
        const [code, setCode] = useState("");
        const [success, setSuccess] = useState(false);
        const [loading, setLoading] = useState(false);

        function checkPromoCode() {
            setLoading(true);
            axios
                .post(route("promo.check"), { code: code })
                .then((response) => {
                    setLoading(false);
                    setSuccess(true);
                    handleDiscount(response.data.discount);
                })
                .catch((error) => {
                    setError(true);
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        return (
            <div className="bg-gray-200 border-main border-2 rounded-lg p-4 my-4">
                <p className="text-xs italic mb-4">
                    Discount codes can expire or stop working anytime, no
                    promises, no guarantees. If it's not working, it's just not
                    your lucky day. Try again next time!
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
                        className={`absolute w-[50px] right-0 h-full rounded-r-md border border-main text-black hover:bg-main transition-all duration-300 ${success ? "bg-green-500" : ""}`}
                    >
                        {!loading && !success && (
                            <i className="fa-solid fa-arrow-right"></i>
                        )}
                        {loading && <LoadingIcon />}
                        {!loading && success && (
                            <i className="fa-solid fa-check text-white"></i>
                        )}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex justify-between min-h-screen py-24 px-32 mt-12">
            <Head title="Checkout" />
            <div className="w-[60%]">
                <div className="bg-white p-8 rounded-lg drop-shadow-lg ">
                    <p className="text-xl mb-2">Contact Information</p>
                    <div className="w-full flex xl:flex-row flex-col xl:space-x-4 xl:space-y-0 space-y-4 mt-2">
                        <input
                            name="first_name"
                            id="first_name"
                            placeholder="First name*"
                            type="text"
                            required
                            onChange={handleOnChange}
                            value={data.first_name}
                            className={`rounded-lg py-1 px-4 bg-transparent hover:bg-gray-200/50 focus:ring-2 focus:ring-[#FFD100] focus:outline-none transition-all duration-150 ease-in-out ${error?.first_name ? "border-red-500" : ""}`}
                        />
                        <input
                            name="last_name"
                            id="last_name"
                            placeholder="Last name*"
                            type="text"
                            required
                            onChange={handleOnChange}
                            value={data.last_name}
                            className={`rounded-lg py-1 px-4 bg-transparent hover:bg-gray-200/50 focus:ring-2 focus:ring-[#FFD100] focus:outline-none transition-all duration-150 ease-in-out ${error?.last_name ? "border-red-500" : ""}`}
                        />
                        <div className="relative">
                            <input
                                name="mobile"
                                id="mobile"
                                placeholder="Mobile Number*"
                                type="text"
                                required
                                onChange={handleOnChange}
                                value={data.mobile}
                                className={`rounded-lg py-1 px-4 pl-12 bg-transparent hover:bg-gray-200/50 focus:ring-2 focus:ring-[#FFD100] focus:outline-none transition-all duration-150 ease-in-out xl:w-auto w-full ${error?.mobile ? "border-red-500" : ""}`}
                            />
                            <p className="absolute left-0 top-0 flex flex-col justify-center px-2 h-full border-r border-gray-500">
                                +61{" "}
                            </p>
                        </div>
                    </div>
                    <p className="text-xl mt-8 mb-2">Address</p>
                    <div className="relative">
                        <input
                            name="street_name"
                            id="street_name"
                            placeholder="Enter your address"
                            type="text"
                            required
                            onChange={handleOnChange}
                            value={data.street_name}
                            className={`rounded-lg py-1 px-4 w-2/3 pl-8 bg-transparent hover:bg-gray-200/50 focus:ring-2 focus:ring-[#FFD100] focus:outline-none transition-all duration-150 ease-in-out ${error?.first_name ? "border-red-500" : ""}`}
                        />
                        <p className="absolute left-0 top-0 h-full flex flex-col justify-center px-2">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-lg drop-shadow-lg mt-8">
                    <p className="text-xl">Cart</p>
                    {!loading && cartItems.length > 0 ? (
                        <div
                            id="show-scroll"
                            className=" px-8 w-full overflow-x-hidden"
                        >
                            {cartItems.map((item, index) => {
                                let hex = tinycolor(item.color);
                                return (
                                    <div
                                        key={index}
                                        className="relative w-full border-b border-gray-400 mb-4 py-4"
                                    >
                                        <div className=" py-4 flex justify-between items-center">
                                            <img
                                                className="shadow-lg rounded-xl w-[22.5%] h-full border-2 border-main"
                                                src={
                                                    item.image?.file_path ?? ""
                                                }
                                            />
                                            <div className="w-[57.5%] space-y-6">
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
                                                        className={`rounded-full  p-2 w-4 h-4 border transition-all border-black duration-150 ease-in-out cursor-pointer`}
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
                                        <div className="absolute top-[35%] -right-2">
                                            <button
                                                onClick={() => {
                                                    removeItem(item.cartItemId);
                                                }}
                                                className="border-2 rounded-full border-black px-2 py-0 h-5 hover:bg-secondary hover:text-red-500 duration-150 transition-all ease-in-out relative"
                                            >
                                                <i className="fa-solid fa-minus text-xs absolute top-0 left-[17.5%]"></i>
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

            <div className="bg-white p-8 rounded-lg drop-shadow-lg w-[37.5%]">
                <p className="text-2xl">Summary</p>
                <div className="flex justify-between mt-8">
                    <p>Subtotal</p>
                    <p className="font-bold font-roboto_mono text-lg">
                        ${" "}
                        {cartItems.reduce(
                            (total, item) => total + item.price * item.quantity,
                            0,
                        )}
                    </p>
                </div>
                <div className="flex justify-between mt-8">
                    <div>
                        Promo Code{" "}
                        <i
                            onClick={() => setExpanded(!expanded)}
                            class={`fa-solid fa-chevron-down hover:bg-gray-700 hover:text-main duration-150 transition-all ease-in-out cursor-pointer p-1 rounded-full ${expanded ? "rotate-180" : "rotate-0"}`}
                        ></i>
                    </div>
                    <p className="font-bold font-roboto_mono text-lg">
                        ${" "}
                        {data.discount.toLocaleString(0, {
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
                    <PromoCode />
                </CSSTransition>
                <div className="flex justify-between mt-8 mb-4">
                    <p>Tax (10%)</p>
                    <p className="font-bold font-roboto_mono text-lg">
                        ${" "}
                        {cartItems
                            .reduce(
                                (total, item) =>
                                    (total + item.price * item.quantity) * 0.1,
                                0,
                            )
                            .toFixed(2)}
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
                                    (total + item.price * item.quantity) * 0.1,
                                0,
                            )
                        ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}
