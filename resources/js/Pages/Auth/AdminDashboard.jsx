import OrdersTable from "@/Components/admin/OrdersTable";
import ProductsTable from "@/Components/admin/ProductsTable";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import ProductForm from "@/Components/product/ProductForm";
import { CSSTransition } from "react-transition-group";

export default function AdminDashboard(props) {
    const [tab, setTab] = useState("products");
    const [editItem, setEditItem] = useState(null);
    const [products, setProducts] = useState(props.products);
    const [showAlert, setShowAlert] = useState(false);
    useEffect(() => {
        if (tab) {
            setEditItem(null);
        }
    }, [tab]);

    const Alert = () => {
        return (
            <div className="border-2 border-main rounded-xl px-8 flex fixed py-4 top-24 right-12 h-8 items-center bg-secondary z-50">
                <i className="fa-regular fa-circle-check text-main mt-1"></i>
                <p className="tracking-wide ml-4 text-main font-oswald">
                    {" "}
                    Your product was updated.{" "}
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
            <div className="flex space-x-6 items-center ">
                <div className="flex space-x-6 text-2xl">
                    <h1 className="font-bold text-3xl mr-12">
                        Admin Dashboard
                    </h1>
                    <button
                        onClick={() => setTab("products")}
                        className={`transition-all duration-150 ease-in-out  ${
                            tab == "products"
                                ? "underline"
                                : "text-gray-500 hover:underline"
                        }`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => setTab("orders")}
                        className={`transition-all duration-150 ease-in-out  ${
                            tab == "orders"
                                ? "underline"
                                : "text-gray-500 hover:underline"
                        }`}
                    >
                        Orders
                    </button>
                </div>
                {!editItem && (
                    <button className="p-2 px-6 border-2 rounded-lg border-secondary text-lg font-bold transition-all duration-150 ease-in-out hover:bg-gray-400/50 mr-52">
                        CREATE
                    </button>
                )}
            </div>
            <Head title="Admin" />
            <hr className="border-gray-400 mt-3" />
            {tab == "products" && (
                <div className="my-10 w-fit mx-auto min-h-[100vh]">
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
                <div className="my-10 w-fit mx-auto min-h-[100vh]">
                    <OrdersTable orders={props.orders} />
                </div>
            )}
            {editItem && (
                <ProductForm
                    product={editItem}
                    setProducts={(data) => {
                        setProducts(data);
                        setTab("products");
                        setShowAlert(true);
                        setTimeout(() => {
                            setShowAlert(false)
                        }, 3000);
                    }}
                />
            )}
        </div>
    );
}
