import useCartStore from "@/Stores/useCartStore";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState, forwardRef } from "react";
import tinycolor from "tinycolor2";

const ShoppingCart = forwardRef(({ handleCartClose }, ref) => {
    const { user } = usePage().props.auth;
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { products, setProducts } = useCartStore();

    // Function to update the quantity of a product by cartItemId
    const updateQuantity = (cartItemId, quantity) => {
        setCartItems((prevCartItems) => {
            const updatedCartItems = prevCartItems.map((item) =>
                item.cartItemId === cartItemId ? { ...item, quantity } : item
            );
            return updatedCartItems;
        });
    }

    const removeItem = (cartItemId) => {
        setLoading(true);
        setCartItems((prevCartItems) => {
            const updatedCartItems = prevCartItems.filter(
                (item) => item.cartItemId !== cartItemId
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

    function routeToCheckout() {
        axios.post(route('checkout'), { cart: cartItems }, {
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            const checkoutUrl = response.data.url;
            // Redirect the browser to the Stripe checkout page
            window.location.href = checkoutUrl;
        }).catch((error) => {
            console.error(error);
        });
    }

    return (
        <div ref={ref} className="fixed flex w-full min-h-screen z-40">
            <div className="w-2/3 min-h-screen  bg-black/50 "></div>
            <div className="w-1/3 min-h-screen relative py-10 bg-gray-100 min-w-[450px]">
                <div className="flex justify-between items-center text-3xl ml-10">
                    <p>{user ? user.first_name + "'s Cart " : "Your Cart"} </p>
                    <button
                        onClick={() => setItemsAndClose()}
                        className="border-2 rounded-full border-black px-3 py-0 h-7 hover:bg-secondary hover:text-main duration-150 transition-all ease-in-out relative -top-6 -left-8"
                    >
                        <i className="fa-solid fa-x text-sm absolute top-0.5 left-[27.5%]"></i>
                    </button>
                </div>
                {!loading && cartItems.length > 0 ? (
                    <div
                        id="show-scroll"
                        className="max-h-[550px] px-8 w-full overflow-y-scroll overflow-x-hidden"
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
                                            className="shadow-lg rounded-xl w-[37.5%] h-full border-2 border-main"
                                            src={item.image?.file_path ?? ''}
                                        />
                                        <div className="w-[57.5%] space-y-6">
                                            <p>{item.name}</p>
                                            <div className='flex space-x-6 items-center'>
                                                <p>${item.price}</p>
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
                                                        if (item.quantity > 1) {
                                                            updateQuantity(
                                                                item.cartItemId,
                                                                item.quantity -
                                                                    1
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
                                                            item.quantity + 1
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
                        <p className="text-2xl mb-12">Your Cart is Empty!</p>
                        <p className="italic text-lg">
                            Add some items to get started!
                        </p>
                    </div>
                )}

                {cartItems.length > 0 && (
                    <div className='w-full flex justify-center'>
                        <button onClick={() => routeToCheckout()} className="absolute bottom-4 hover:bg-secondary hover:text-main hover:border-2 hover:border-main transition-all duration-200 ease-in-out text-3xl font-bold px-4 py-2 border-2  border-black rounded-lg text-nowrap">
                            Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});

export default ShoppingCart;
