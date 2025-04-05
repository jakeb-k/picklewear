import DataTable from "react-data-table-component";
import TestImage from "@/../assets/images/testing_imgs/test_1.webp";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ProductsTable({ setEditItem, ...props }) {
    const [success, setSuccess] = useState(null);
    const [products, setProducts] = useState(props.products);

    const [data, setData] = useState(
        products.map((product) => {
            const id = products.id;
            const image =
                product.images.length > 0
                    ? product.images[0]
                    : "/images/placeholder.jpg";
            const code = product.id.toString().padStart(4, "0"); // Format product code
            const name = product.name;
            const price = product.price;
            const type = product.type;
            const tags = product.tags ?? [];
            const options = product.options;
            const route = `/product/${product.id}`; // Link to view product details
            const available = product.available;

            return {
                id,
                image,
                code,
                name,
                price,
                type,
                tags,
                options,
                available,
                route,
            };
        }),
    );

    useEffect(() => {
        setData(
            products.map((product) => {
                const id = product.id;
                const image =
                    product.images.length > 0 ? product.images[0] : null;
                const code = product.id.toString().padStart(4, "0"); // Format product code
                const name = product.name;
                const price = product.price;
                const categoryTag = product?.tags?.find((tag) => tag.type === "category");
                const type = categoryTag && categoryTag.name && categoryTag.name.en
                    ? categoryTag.name.en.charAt(0).toUpperCase() + categoryTag.name.en.slice(1)
                    : null; 
                const tags = product.tags ?? [];
                const options = product.options;
                const route = `/product/${product.id}`; // Link to view product details
                const available = product.available;

                return {
                    ...product,
                    id,
                    image,
                    code,
                    name,
                    price,
                    type,
                    tags,
                    options,
                    available,
                    route,
                };
            }),
        );
    }, [products]);

   const setAvailability = (id) => {
    console.log('bang');
        axios
            .post(route("product.available", id))
            .then((response) => {
                setProducts(response.data.products);
                setSuccess("The availability of your product was updated");
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function deleteProduct(product) {
        Swal.fire({
            title: "Are you sure?",
            text: `You are deleting ${product.name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(route("product.destroy", product.id))
                    .then((response) => {
                        setProducts(response.data.products);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        });
    }

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
        headCells: {
            style: {
                justifyContent: "center",
                textAlign: "center",
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
                justifyContent: "center",
                textAlign: "center",
            },
        },
    };

    const columns = [
        {
            name: "Image",
            cell: (row) => <img className='h-32' src={row.image?.file_path ?? TestImage} />,
            width: "15%",
        },
        {
            name: "Code",
            selector: (row) => row.code,
            cell: (row) => <p className='text-lg'>#{row.code}</p>,
            sortable: true,
            width: "7.5%",
        },
        {
            name: "Name",
            selector: (row) => row.name,
            cell: (row) => <p className='text-lg'>{row.name}</p>,
            sortable: true,
            width: "17.5%",
        },
        {
            name: "Price",
            selector: (row) => row.price,
            sortable: true,
            width: "10%",
            cell: (row) => (
                <p className="text-right font-roboto_mono text-lg">${row.price?.toFixed(2)}</p>
            ),
        },
        {
            name: "Type",
            selector: (row) => row.type,
            sortable: true,
            width: "10%",
        },
        {
            name: "Tags",
            selector: (row) =>
                row.tags?.map((tag) => {
                    return (
                        row.tags ? 
                        tag.name.en.charAt(0).toUpperCase() +
                        tag.name.en.slice(1) +
                        " ," : ''
                    );
                }),
            sortable: false,
            cell: (row) => (
                <p>
                    {row.tags.map((tag, index) => {
                        const isLast = index === row.tags.length - 1;
                        return (
                            tag.name.en.charAt(0).toUpperCase() +
                            tag.name.en.slice(1) +
                            (isLast ? "" : ", ")
                        );
                    })}
                </p>
            ),
            width: "12.5%",
        },
        {
            name: "Actions",
            selector: (row) => row.available,
            cell: (row) => (
                <div className="flex items-center space-x-2 text-xl">
                    <a href={row.route} target="_blank">
                        <i className="transition-all duration-150 ease-in-out cursor-pointer fa-regular fa-eye hover:bg-gray-800 hover:text-white rounded-full p-2"></i>
                    </a>
                    <i
                        onClick={() => setAvailability(row.id)}
                        className={`transition-all duration-150 ease-in-out cursor-pointer fa-regular fa-circle-check rounded-full p-1.5 ${
                            row.available
                                ? "hover:text-gray-800 hover:bg-white text-white bg-green-400"
                                : "hover:bg-green-400 hover:text-white"
                        }`}
                    ></i>
                    <i
                        onClick={() => setEditItem(row)}
                        className="transition-all duration-150 ease-in-out cursor-pointer fa-solid fa-pen-to-square hover:bg-gray-800 hover:text-white rounded-full p-2"
                    ></i>
                    <i
                        onClick={() => deleteProduct(row)}
                        className="transition-all duration-150 ease-in-out cursor-pointer fa-solid fa-trash hover:bg-red-600 hover:text-white rounded-full 
                    p-2"
                    ></i>
                </div>
            ),
            width: "37.5%",
        },
    ];

    return (
        <div className="rounded-lg shadow-lg bg-white">
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
