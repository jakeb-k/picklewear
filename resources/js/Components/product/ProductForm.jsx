import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function ProductForm(props) {
    const { product } = props;
    const { data, setData } = useForm({
        name: product.name,
        price: product.price,
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

    useEffect(() => {
        if(data.discount > 100){
            setData('discount', 100)
        }
    }, [data.discount])

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
                {/* <div className="flex-1">
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
                            className="rounded-md py-2 px-4 w-full text-xl pl-8"
                            placeholder="Enter the products name"
                            value={data.price}
                        />
                        <p className="bg-secondary text-main absolute left-0 top-0 h-full min-w-8 text-2xl flex flex-col justify-center items-center rounded-l-lg">
                            $
                        </p>
                    </div>
                </div> */}
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
        </div>
    );
}
