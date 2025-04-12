import DataTable from "react-data-table-component";
import moment from "moment";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersTable(props) {
    const [orders, setOrders] = useState(props.orders);
    const [success, setSuccess] = useState(null);
    const [data, setData] = useState(
        orders.map((order) => {
            const code = order.id.toString().padStart(4, "0"); // Format order code
            const status = order.status;
            const userName =
                order.customer?.first_name + " " + order.customer?.last_name; // Full name
            const mobile = order.customer?.mobile; // User email
            const total = order.total; // Order total
            const location = order.locations[0]
                ? Object.values(order.locations[0]).join(" ")
                : "N/A";
            const viewDetails = `/orders/${order.id}`; // Link to view order details
            const createdAt = order.created_at;

            return {
                code,
                status,
                userName,
                mobile,
                total,
                location,
                viewDetails,
                createdAt,
            };
        }),
    );

    function completeOrder(orderId) {
        axios
            .get(route("orders.complete", orderId))
            .then((response) => {
                setSuccess(response.data.message);
                setOrders(response.data.orders); 
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        setData(
            orders.map((order) => {
                const id = order.id; 
                const code = order.code; // Format order code
                const status = order.status;
                const userName =
                    order.customer?.first_name +
                    " " +
                    order.customer?.last_name; // Full name
                const mobile = order.customer?.mobile; // User email
                const total = order.total; // Order total
                const location = order.locations[0]
                    ? Object.values(order.locations[0]).join(" ")
                    : "N/A";
                const viewDetails = `/orders/${order.id}`; // Link to view order details
                const createdAt = order.created_at;

                return {
                    id,
                    code,
                    status,
                    userName,
                    mobile,
                    total,
                    location,
                    viewDetails,
                    createdAt,
                };
            }),
        );
    }, [orders]);

    const customStyles = {
        table: {
            style: {
                borderRadius: "18px",
            },
        },
        header: {
            style: {
                fontSize: "1.5em",
                fontWeight: "bold",
                paddingLeft: "10px",
            },
        },
        headRow: {
            style: {
                backgroundColor: "#f0f0f0",
                borderBottomWidth: "1px",
                borderBottomColor: "#e0e0e0",
            },
        },
        rows: {
            style: {
                minHeight: "56px", // override the row height
                "&:not(:last-of-type)": {
                    borderBottomWidth: "1px",
                    borderBottomColor: "#e0e0e0",
                },
            },
            highlightOnHoverStyle: {
                backgroundColor: "#e8f0fe",
                borderBottomColor: "#FFFFFF",
                outline: "1px solid #FFFFFF",
            },
        },
        pagination: {
            style: {
                borderTopStyle: "solid",
                borderTopWidth: "1px",
                borderTopColor: "#e0e0e0",
            },
        },
        cells: {
            style: {
                paddingLeft: "12px",
                paddingRight: "12px",
            },
        },
    };

    const columns = [
        {
            name: "Code",
            selector: (row) => row.code,
            sortable: true,
            width: "8.3%",
        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: true,
            width: "8.3%",
        },
        {
            name: "Name",
            selector: (row) => row.userName,
            sortable: true,
            width: "14.6%",
        },
        {
            name: "Mobile",
            selector: (row) => "0" + row.mobile,
            sortable: true,
            width: "16.6%",
        },
        {
            name: "Location",
            selector: (row) => row.location ?? "",
            sortable: true,
            cell: (row) => <p className="">{row.location ?? "N/A"}</p>,
            width: "25%",
        },
        {
            name: "Created At",
            selector: (row) => row.createdAt,
            sortable: true,
            cell: (row) => (
                <p className="text-center">
                    {moment(row.createdAt).format("DD/MM/YY")}
                </p>
            ),
            width: "10.4%",
        },
        {
            name: "Total",
            selector: (row) => row.total,
            sortable: true,
            cell: (row) => <p className="text-right">${row.total}</p>,
            width: "8.3%",
        },
        {
            name: "Actions",
            selector: (row) => row.status == "Delivered",
            sortable: true,
            cell: (row) => (
                <div className="flex space-x-4 text-xl">
                    <i
                        onClick={() => {
                            window.location.href = row.viewDetails;
                        }}
                        className="transition-all duration-150 ease-in-out cursor-pointer fa-regular fa-eye hover:bg-gray-800 hover:text-white rounded-full p-1 cursor"
                    ></i>
                    <i  
                        onClick={() => completeOrder(row.id)}
                        className={`transition-all duration-150 ease-in-out cursor-pointer fa-regular fa-circle-check rounded-full p-1 ${row.status == "Completed" ? "hover:text-gray-800 hover:bg-white text-white bg-green-400 " : "hover:bg-green-400 hover:text-white "}`}
                    ></i>
                </div>
            ),
            width: "8.3%",
        },
    ];

    return (
        <div className="rounded-lg shadow-lg">
            <DataTable
                columns={columns}
                data={data}
                pagination
                paginationPerPage={10}
                customStyles={customStyles}
            />
        </div>
    );
}
