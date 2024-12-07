import OrdersTable from "@/Components/admin/OrdersTable";
import ProductsTable from "@/Components/admin/ProductsTable";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import ProductForm from "@/Components/product/ProductForm";

export default function AdminDashboard(props) {
    const [tab, setTab] = useState("products");
    const [editItem, setEditItem] = useState(null);

    useEffect(() => {
        if (tab) {
            setEditItem(null);
        }
    }, [tab]);

    return (
        <div className="min-h-screen pt-32 w-11/12 mx-auto">
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
                <button className="p-2 px-6 border-2 rounded-lg border-secondary text-lg font-bold transition-all duration-150 ease-in-out hover:bg-gray-400/50 mr-52">
                    CREATE
                </button>
            </div>
            <Head title="Admin" />
            <hr className="border-gray-400 mt-3" />
            {tab == "products" && (
                <div className="my-10 w-fit mx-auto min-h-[100vh]">
                    <ProductsTable
                        products={props.products}
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
            {editItem && <ProductForm product={editItem} />}
        </div>
    );
}
