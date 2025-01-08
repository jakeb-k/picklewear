import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";
import moment from "moment";

export default function Edit({
    auth,
    mustVerifyEmail,
    status,
    orders
}) {
    return (
        <div className="py-24">
            <Head title="Profile" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 ">
                <div className="mb-6">
                    <h1 className="text-3xl mr-12">{auth.user.name}</h1>
                    <div className="bg-gray-300 h-0.5 rounded-lg w-full mt-4" />
                </div>
                <div className="space-y-6">
                    <div className="flex justify-between space-x-[2.5%]">
                        <div className="p-4 sm:p-8 bg-white w-1/2 shadow sm:rounded-lg flex-1">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className=""
                            />
                        </div>
                        <div id="show-scroll" className="p-4 sm:p-8 bg-white w-1/2 shadow sm:rounded-lg flex-1 h-[450px] overflow-y-scroll">
                            <p className='text-lg'> Past Orders</p>
                            <div className="flex flex-col space-y-6 mt-4">
                                {orders.map((order) => {
                                    return (
                                        <a
                                            key={order.code}
                                            href={route("orders.show", order)}
                                            className="rounded-lg w-full flex items-center justify-between border border-gray-600 px-2 py-2 hover:bg-gray-200 transition-color duration-150 ease-in-out"
                                        >
                                            <p className="flex-1">
                                                {order.code}
                                            </p>
                                            <p className="px-2 py-0.5 min-w-24 mr-6 text-center border-2 rounded-full border-main font-bold text-base">
                                                {order.status}
                                            </p>
                                            <p className="flex-1 text-center">
                                                <b> ETA:</b>{" "}
                                                {moment(order.created_at)
                                                    .add(
                                                        parseInt(
                                                            order.expected_delivery_range,
                                                        ),
                                                        "days",
                                                    )
                                                    .format("DD/MM/YY")}
                                            </p>
                                            <p className="font-roboto_mono text-right flex-1">
                                                $
                                                {(order.total).toLocaleString(0, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </p>
                                            <p></p>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between space-x-[2.5%]">
                        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg flex-1">
                            <UpdatePasswordForm />
                        </div>

                        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg flex-1">
                            <DeleteUserForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
