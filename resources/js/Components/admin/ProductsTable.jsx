import DataTable from "react-data-table-component";
import moment from "moment";

export default function ProductsTable(props) {
    const products = props.products;
    const processedData = products.map((product) => {
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
            image,
            code,
            name,
            price,
            type,
            tags,
            options,
            route,
        };
    });
    console.log(products);

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
            name: "",
            cell: (row) => <img src={row.image?.file_path} />,
            width: "200px",
        },
        {
            name: "Code",
            selector: (row) => row.code,
            cell: (row) => <p>#{row.code}</p>,
            sortable: true,
            width: "100px",
        },
        {
            name: "Name",
            selector: (row) => row.name,
            cell: (row) => <p>{row.name}</p>,
            sortable: true,
            width: "175px",
        },
        {
            name: "Price",
            selector: (row) => row.price,
            sortable: true,
            width: "100px",
            cell: (row) => (
                <p className="text-right">${row.price?.toFixed(2)}</p>
            ),
        },
        {
            name: "Type",
            selector: (row) => row.type,
            sortable: true,
            width: "125px",
        },
        {
            name: "Tags",
            selector: (row) => row.tags.join(", "),
            sortable: false,
            cell: (row) => <p>{row.tags.join(", ")}</p>,
            width: "100px",
        },
        {
            name: "Actions",
            selector: (row) => row.available,
            cell: (row) => (
                <div className="flex items-center space-x-2 text-xl">
                    <a href={row.route}
                        target="_blank"
                    >
                        <i className="transition-all duration-150 ease-in-out cursor-pointer fa-regular fa-eye hover:bg-gray-800 hover:text-white rounded-full p-2"></i>
                    </a>
                    <i
                        className={`transition-all duration-150 ease-in-out cursor-pointer fa-regular fa-circle-check rounded-full p-1.5 ${
                            !row.available
                                ? "hover:text-gray-800 hover:bg-white text-white bg-green-400"
                                : "hover:bg-green-400 hover:text-white"
                        }`}
                    ></i>
                    <i className="transition-all duration-150 ease-in-out cursor-pointer fa-solid fa-pen-to-square hover:bg-gray-800 hover:text-white rounded-full p-2"></i>
                    <i className="transition-all duration-150 ease-in-out cursor-pointer fa-solid fa-trash hover:bg-red-600 hover:text-white rounded-full 
                    p-2"></i>

                </div>
            ),
            width: "250px",
        },
    ];

    return (
        <div className="rounded-lg shadow-lg">
            <DataTable
                columns={columns}
                data={processedData}
                pagination
                paginationPerPage={10}
                customStyles={customStyles}
            />
        </div>
    );
}
