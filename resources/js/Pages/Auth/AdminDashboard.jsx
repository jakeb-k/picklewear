import OrdersTable from "@/Components/admin/OrdersTable";
import ProductsTable from "@/Components/admin/ProductsTable";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function AdminDashboard(props) {
    const [tab, setTab] = useState("products");

    return (
        <div className="min-h-screen pt-32 w-11/12 mx-auto">
            <div className="flex items-center space-x-6 text-2xl">
                <h1 className='font-bold text-3xl mr-12'>Admin Dashboard</h1>
                <button
                    onClick={() => setTab("products")}
                    className={`transition-all duration-150 ease-in-out  ${
                        tab == "products" ? "underline" : "text-gray-500 hover:underline"
                    }`}
                >
                    Products
                </button>
                <button
                    onClick={() => setTab("orders")}
                    className={`transition-all duration-150 ease-in-out  ${
                        tab == "orders" ? "underline" : "text-gray-500 hover:underline"
                    }`}
                >
                    Orders
                </button>
            </div>
            <Head title="admin" />
            {tab == "products" ? (
                <>
                    <ProductsTable products={props.products} />
                </>
            ) : (
                <>
                    <OrdersTable orders={props.orders} />
                </>
            )}
        </div>
    );
}
