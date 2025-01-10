import OrdersTable from "@/Components/admin/OrdersTable";
import ProductsTable from "@/Components/admin/ProductsTable";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import ProductForm from "@/Components/admin/ProductForm";
import { CSSTransition } from "react-transition-group";

export default function AdminDashboard(props) {
    const [tab, setTab] = useState("products");
    const [editItem, setEditItem] = useState(null);
    const [products, setProducts] = useState(props.products);
    const [orders, setOrders] = useState(props.orders);
    const [search, setSearch] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (tab) {
            setEditItem(null);
        }
    }, [tab]);

    useEffect(() => {
        if (search != "") {
            searchItems(tab);
        } else {
            setProducts(props.products);
            setOrders(props.orders)
        }
    }, [search]);

    const searchItems = (type) => {
        const searchRegex = new RegExp(search, "i");

        if (type == "products") {
            setProducts(
                props.products.filter(
                    (product) =>
                        searchRegex.test(product.type) ||
                        searchRegex.test(product.name),
                ),
            );
        } else {
            setOrders(
                props.orders.filter(
                    (order) =>
                        searchRegex.test(order.code) ||
                        searchRegex.test(order.status),
                ),
            );
        }
    };
    // console.log(products);

    const Alert = () => {
        return (
            <div className="border-2 border-main rounded-xl px-8 flex fixed py-4 top-24 right-12 h-8 items-center bg-secondary z-50">
                <i className="fa-regular fa-circle-check text-main mt-1"></i>
                <p className="tracking-wide ml-4 text-main font-oswald">
                    Your product was {isCreating ? "created" : "updated"}.
                </p>
            </div>
        );
    };

    return (
        <div className="min-h-screen pt-32 w-11/12 mx-auto">
            <CSSTransition
                in={showAlert}
                timeout={300}
                classNames="fade"
                unmountOnExit
            >
                <Alert />
            </CSSTransition>
            <div className="flex justify-between">
                <div className="flex space-x-6 text-2xl items-center ">
                    <h1 className="font-bold text-3xl mr-12">
                        Admin Dashboard
                    </h1>
                    <button
                        onClick={() => {
                            setIsCreating(false);
                            setTab("products");
                        }}
                        className={`transition-all duration-150 ease-in-out  ${
                            tab == "products"
                                ? "underline"
                                : "text-gray-500 hover:underline"
                        }`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => {
                            setIsCreating(false);
                            setTab("orders");
                        }}
                        className={`transition-all duration-150 ease-in-out  ${
                            tab == "orders"
                                ? "underline"
                                : "text-gray-500 hover:underline"
                        }`}
                    >
                        Orders
                    </button>
                    {!editItem && (
                        <button
                            onClick={() => {
                                setEditItem(null);
                                setTab("");
                                setIsCreating(true);
                            }}
                            className="p-1 px-3 border-2 rounded-lg border-secondary text-lg font-bold transition-all duration-150 ease-in-out hover:bg-gray-400/50 mr-52"
                        >
                            CREATE
                        </button>
                    )}
                </div>
                <div className="flex justify-end">
                    <div
                        onMouseEnter={() => setIsSearching(true)}
                        onMouseLeave={() => setIsSearching(false)}
                        className={`p-1.5 h-fit mt-auto border border-gray-800 rounded-full hover:bg-gray-200 flex items-center ${isSearching || search != "" ? "w-48" : "w-8"} transition-all duration-150 ease-in-out`}
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            name="search"
                            value={search}
                            onFocus={() => setIsSearching(true)}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`h-3 border-none bg-gray-200 focus:ring-0 ${isSearching || search != "" ? "block w-[10em]" : "hidden"}`}
                        />
                    </div>
                </div>
            </div>
            <Head title="Admin" />
            <hr className="border-gray-400 mt-3" />
            {tab == "products" && (
                <div className="my-10 w-[75%] min-w-[1000px] mx-auto min-h-[100vh]">
                    <ProductsTable
                        products={products}
                        setEditItem={(data) => {
                            setEditItem(data);
                            setTab("");
                        }}
                    />
                </div>
            )}
            {tab == "orders" && (
                <div className="my-10 w-[75%] min-w-[1000px] mx-auto min-h-[100vh]">
                    <OrdersTable orders={orders} />
                </div>
            )}
            {(editItem || isCreating) && (
                <ProductForm
                    isCreating={isCreating}
                    product={editItem}
                    setProducts={(data) => {
                        setProducts(data);
                        setTab("products");
                        setShowAlert(true);
                        setTimeout(() => {
                            setShowAlert(false);
                        }, 3000);
                        setIsCreating(false);
                    }}
                />
            )}
        </div>
    );
}
