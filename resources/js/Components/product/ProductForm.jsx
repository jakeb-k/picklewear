import { useForm } from "@inertiajs/react";
import axios from "axios";
import { useEffect } from "react";
import Select from "react-select";

export default function ProductForm({setProducts, ...props}) {
    const { product } = props;
    const { data, setData } = useForm({
        name: product.name,
        price: product.price,
        type: { value: product.type, label: product.type },
        url: product.url,
        delivery_date: product.delivery_date,
        discount: product.discount ?? 0,
        description: product.description,
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleOnSelectChange = (selectedOption) => {
        setData((prevData) => ({
            ...prevData,
            type: selectedOption,
        }));
    };

    function updateProduct(product){
        axios.post(route('product.update', product), data)
        .then((response) => {
            setProducts(response.data.products); 
        })
        .catch((error) => {
            console.error(error)
        })
    }

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            fontSize: "1.25rem", // Larger font size
            "&:hover": {
                borderColor: "#6B7280",
            },
            borderColor: state.isFocused ? "#6B7280" : "#6B7280", // gray-600 colour
            padding: "0.25rem", // py-1 equivalent (1 rem = 16px, so 0.25rem = 4px)
            boxShadow: state.isFocused ? "0 0 0 1px #6B7280" : "none",
            "&:hover": {
                borderColor: "#6B7280", // Ensure hover state matches the colour
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#9CA3AF", // Optional: Gray-400 for placeholder text
        }),
    };

    useEffect(() => {
        if (data.discount > 100) {
            setData("discount", 100);
        }
    }, [data.discount]);

    return (
        <div className="min-w-[450px] w-[70%] bg-white shadow-lg rounded-lg p-8 mx-auto my-6 space-y-8">
            <div className="flex items-center space-x-[5%]">
                <div className="flex-1">
                    <p className="text-base">
                        Name:{" "}
                        <span className="text-red-500 text-sm italic">
                            (required)
                        </span>
                    </p>
                    <input
                        name="name"
                        type="text"
                        onChange={handleOnChange}
                        required
                        className="rounded-md py-2 px-4 w-full text-xl"
                        placeholder="Enter the products name"
                        value={data.name}
                    />
                </div>
                <div className="flex-1">
                    <p className="text-base">
                        Type:{" "}
                        <span className="text-red-500 text-sm italic">
                            (required)
                        </span>
                        <Select
                            name="type"
                            options={[
                                { value: "paddles", label: "Paddles" },
                                { value: "accessories", label: "Accessories" },
                                { value: "court", label: "Court" },
                                { value: "kit", label: "Kit" },
                                { value: "clothing", label: "Clothing" },
                            ]}
                            onChange={handleOnSelectChange}
                            value={data.type}
                            styles={customStyles}
                        />
                    </p>
                </div>
            </div>
            {/* URL */}
            <div className="w-full">
                <p className="text-base">
                    URL:{" "}
                    <span className="text-red-500 text-sm italic">
                        (required)
                    </span>
                </p>
                <input
                    name="url"
                    type="text"
                    onChange={handleOnChange}
                    required
                    className="rounded-md py-2 px-4 w-full text-sm"
                    placeholder="Enter the products link"
                    value={data.url}
                />
            </div>
            {/* TYPE, DELIVERY RANGE, DISCOUNT */}
            <div className="flex items-center justify-between">
                <div className="w-fit">
                    <p className="text-base text-nowrap">
                        Delivery Range:{" "}
                        <span className="text-red-500 text-sm italic">
                            (required)
                        </span>
                    </p>
                    <div className="relative">
                        <input
                            name="delivery_date"
                            type="number"
                            min={0}
                            onChange={handleOnChange}
                            required
                            className="rounded-md py-2 px-4 w-full text-xl pl-8"
                            placeholder="Enter the products name"
                            value={data.delivery_date}
                        />
                        <p className="bg-secondary text-main absolute right-0 top-0 h-full min-w-8 text-xl px-2 flex flex-col justify-center items-center rounded-r-lg">
                            Days
                        </p>
                    </div>
                </div>
                <div className="w-fit">
                    <p className="text-base">
                        Price:{" "}
                        <span className="text-red-500 text-sm italic">
                            (required)
                        </span>
                    </p>
                    <div className="relative">
                        <input
                            name="price"
                            type="number"
                            min={0}
                            onChange={handleOnChange}
                            required
                            className="rounded-md py-2 px-4 w-full text-xl  max-w-44 pl-12"
                            placeholder="Enter the products name"
                            value={data.price}
                        />
                        <p className="bg-secondary text-main absolute left-0 top-0 h-full min-w-8 text-2xl flex flex-col justify-center items-center rounded-l-lg">
                            $
                        </p>
                    </div>
                </div>

                <div className="w-fit">
                    <p className="text-base">Discount:</p>
                    <div className="relative">
                        <input
                            name="discount"
                            type="number"
                            min={0}
                            max={100}
                            onChange={handleOnChange}
                            required
                            className="rounded-md py-2 px-4 w-28 text-xl"
                            value={data.discount}
                        />
                        <p className="bg-secondary text-main absolute right-0 top-0 h-full min-w-8 text-xl px-2 flex flex-col justify-center items-center rounded-r-lg">
                            %
                        </p>
                    </div>
                </div>
                <div className="flex w-[25%] text-nowrap">
                    <p className="text-lg pt-4">
                        Total Price:{" "}
                        <b>
                            {" "}
                            $
                            {(
                                data.price -
                                data.price * (data.discount / 100)
                            ).toFixed(2)}{" "}
                        </b>{" "}
                    </p>
                    <p className="text-lg w-fit pt-4 text-red-500 italic ml-1">
                        {" "}
                        (- ${(data.price * (data.discount / 100)).toFixed(2)})
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-[5%]">
                <div className="flex-1">
                    <p className="text-base">
                        Description:{" "}
                        <span className="text-red-500 text-sm italic">
                            (required)
                        </span>
                    </p>
                    <textarea
                        name="description"
                        type="text"
                        onChange={handleOnChange}
                        required
                        className="rounded-md py-2 px-4 w-full text-base min-h-40"
                        placeholder="Enter the products name"
                        value={data.description}
                    />
                </div>
            </div>
            <div className="w-full flex justify-end">
                <button onClick={() => updateProduct(product)} className="p-2 px-10 border-2 rounded-lg border-secondary bg-main text-lg font-bold transition-all duration-150 ease-in-out hover:bg-secondary hover:text-main">
                    UPDATE
                </button>
            </div>
        </div>
    );
}
