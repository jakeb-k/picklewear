import { Head, usePage } from "@inertiajs/react";
import moment from "moment";
import { useState } from "react";
import tinycolor from "tinycolor2";
import TestImage from "@/../assets/images/testing_imgs/test_1.webp"; 

export default function OrderShowLayout(props) {
    const [loading, setLoading] = useState(false);
    const order_products = props.order.products;
    const order = props.order;
    const customer = props.order.user ?? props.order.customer;
    const isAdmin = usePage().props.auth?.roles?.some(
        (role) => role == "admin",
    );

    return (
        <>
            <Head title={order.code} />
            <div className="bg-white max-w-[500px] p-8 mb-24 mt-40 mx-auto rounded-lg drop-shadow-lg">
                <div className="text-xl flex items-center">
                    <a
                        href={
                            isAdmin
                                ? route("admin.dashboard")
                                : route("profile.edit")
                        }
                    >
                        <i class="fa-solid fa-arrow-left border-main border rounded-full cursor-pointer p-1.5 py-1 hover:bg-secondary text-main transition-all duration-150 ease-in-out"></i>
                    </a>
                    <p className="ml-4">Order Details - {order.code} - {moment(order.created_at).format('DD/MM/YY')}</p>
                    {isAdmin && (
                        <>
                            <div className="ml-6 px-4 py-0.5 border-2 rounded-full border-main font-bold text-base">
                                {order.status}
                            </div>
                            <div className="flex ml-auto w-1/6 justify-end space-x-2">
                                <i class="fa-regular fa-envelope border-main border rounded-full cursor-pointer p-1.5 py-1 hover:bg-secondary text-main transition-all duration-150 ease-in-out"></i>
                                <i
                                    className={`transition-all duration-150 ease-in-out cursor-pointer fa-solid fa-check rounded-full p-1.5 border border-secondary py-1 ${order.status == "Delivered" ? "hover:text-gray-800 hover:bg-white text-white bg-green-400 " : "hover:bg-green-400 hover:text-white "}`}
                                ></i>
                            </div>
                        </>
                    )}
                </div>
                <p className="mt-2">
                    Recipient:
                    <b className="ml-1">
                        {customer.first_name + " " + customer.last_name}
                    </b>
                </p>
                <p className="mt-2">
                    Mobile: <b className="ml-1">0{customer.mobile}</b>
                </p>
                <p className="mt-2">
                    Delivery Address:
                    <b className="ml-1">
                        {order.locations[0]
                            ? Object.values(order.locations[0]).join(" ")
                            : "-"}
                    </b>
                </p>
                <p className="mt-2">
                    Estimated Delivery:{" "}
                    {moment(order.created_at)
                        .add(parseInt(order.expected_delivery_range), "days")
                        .format("Do MMM YY")}
                        {" - "}
                    {moment(order.created_at)
                        .add(parseInt(order.expected_delivery_range + 7), "days")
                        .format("Do MMM YY")}
                </p>
                <p className="mt-2">
                    Total:{" "}
                    <b className="ml-1 font-roboto_mono">
                        $
                        {order.total.toLocaleString(0, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </b>
                </p>
                <hr className="my-4" />
                <p className="text-lg">Items</p>
                {!loading && order_products.length > 0 ? (
                    <div
                        id="show-scroll"
                        className=" px-4 w-full overflow-x-hidden"
                    >
                        {order_products.map((item, index) => {
                            let hex = tinycolor(item.pivot.color);
                            return (
                                <div
                                    key={index}
                                    className="relative w-full border-b border-gray-400 mb-4 py-4"
                                >
                                    <div className=" py-4 flex justify-between items-center">
                                        <img
                                            className="shadow-lg rounded-xl max-w-[150px] h-full border-2 border-main"
                                            src={
                                                item.images[0]?.file_path ?? TestImage
                                            }
                                        />
                                        <div className="w-[57.5%] space-y-6">
                                            <a className='hover:underline hover:text-main' href={item.url}>{item.name}</a>
                                            <div className="flex space-x-6 items-center">
                                                <p className="font-roboto_mono">
                                                    $
                                                    {(
                                                        item.price *
                                                        item.pivot.quantity
                                                    ).toLocaleString(0, {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
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
                                            <div className="flex space-x-6">
                                                <p className=" flex justify-center text-lg text-center">
                                                    Size:{" "}
                                                    <b className="ml-1">
                                                        {item.pivot.size}{" "}
                                                    </b>
                                                </p>
                                                <p className=" flex justify-center text-lg text-center">
                                                    Quantity:{" "}
                                                    <b className="ml-1">
                                                        {" "}
                                                        {
                                                            item.pivot.quantity
                                                        }{" "}
                                                    </b>
                                                </p>
                                            </div>
                                        </div>
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
            </div>
        </>
    );
}
