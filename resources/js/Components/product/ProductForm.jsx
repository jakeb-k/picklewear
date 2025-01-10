import { useForm } from "@inertiajs/react";
import axios from "axios";
import moment from "moment";
import { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import tinycolor from "tinycolor2";

export default function ProductForm({
    setProducts,
    isCreating = false,
    ...props
}) {
    const { product } = props;
    const [images, setImages] = useState(product?.images ?? []);
    const [colorOptions, setColorOptions] = useState(
        product.options.some((option) => option.type == "color")
            ? product.options
                  .find((option) => option.type == "color")
                  .values.split(".")
            : [],
    );
    const { data, setData } = useForm({
        name: product?.name ?? "",
        price: product?.price ?? "",
        type: { value: product?.type ?? "", label: product?.type },
        url: product?.url ?? "",
        delivery_date: product?.delivery_date ?? "",
        discount: product?.discount ?? 0,
        description: product?.description ?? "",
        images: product?.images ?? [],
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

    function updateProduct(product) {
        //Create new form data object to put files in
        const formData = new FormData();
        //append files to files [] - will send an array of file objects
        images.forEach((image, index) => {
            formData.append("images[]", image); // Use 'files[]' to ensure array format
        });
        Object.entries(data).forEach(([key, value]) => {
            if (key == "type") {
                formData.append(key, value["value"]);
            } else {
                formData.append(key, value);
            }
        });
        formData.append("data", data);
        if (isCreating) {
            axios
                .post(route("product.store", product), formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((response) => {
                    setProducts(response.data.products);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            formData.append("_method", "PUT");
            axios
                .post(route("product.update", product), formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((response) => {
                    setProducts(response.data.products);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            fontSize: "1.25rem", // Larger font size
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

    const ImageUploader = ({
        updateImages,
        images,
        setImages,
        defaultImages,
    }) => {
        // Set default images
        useEffect(() => {
            if (defaultImages && defaultImages.length > 0) {
                setImages(defaultImages); // Preload default images
            }
        }, [defaultImages, setImages]);

        const handleDrop = (event) => {
            event.preventDefault();
            const files = Array.from(event.dataTransfer.files);
            const newImages = files
                .slice(0, 3 - images.length)
                .map((file) => file);
            setImages((prev) => {
                const updatedImages = [...prev, ...newImages];
                updateImages(updatedImages);
                return updatedImages;
            });
        };

        const handleRemove = (index) => {
            setImages((prev) => {
                const updatedImages = prev.filter((_, i) => i !== index);
                updateImages(updatedImages);
                return updatedImages;
            });
        };

        const handleFileInput = (event) => {
            const files = Array.from(event.target.files);
            const newImages = files
                .slice(0, 3 - images.length)
                .map((file) => file);
            setImages((prev) => {
                const updatedImages = [...prev, ...newImages];
                updateImages(updatedImages);
                return updatedImages;
            });
        };

        return (
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="flex flex-col items-center min-w-[350px] border-2 border-dashed border-gray-400 rounded-lg p-5 py-10"
            >
                <div className="text-center cursor-pointer w-full">
                    {images.length < 3 ? (
                        <>
                            <p className="flex items-center text-gray-600">
                                Drag & drop images here, or click to upload
                            </p>
                            <input
                                type="file"
                                name="images[]"
                                multiple
                                onChange={handleFileInput}
                                className="hidden"
                                id="fileInput"
                            />
                            <label
                                htmlFor="fileInput"
                                className="text-blue-500 cursor-pointer hover:underline"
                            >
                                Browse
                            </label>
                        </>
                    ) : (
                        <p className="flex items-center text-gray-600">
                            Image limit reached (3)
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap gap-4 mt-4">
                    {images.map((file, index) => (
                        <div key={index} className="relative w-56 h-56">
                            <img
                                src={
                                    file.file_path // If it's a default image, use its URL
                                        ? file.file_path
                                        : URL.createObjectURL(file) // Otherwise, create an object URL
                                }
                                alt={file.file_name || `Uploaded ${index}`}
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                                onClick={() => handleRemove(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-w-[750px] w-[70%] bg-white shadow-lg rounded-lg p-8 mx-auto my-6">
            <div className="flex items-center space-x-[5%] mb-6">
                <div className="flex-1">
                    <p className="flex items-center text-base">
                        Name:{" "}
                        <span className="text-red-500 text-3xl italic">*</span>
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
                    <div className="text-base">
                        <p className="flex items-center">
                            Type
                            <span className="text-red-500 text-3xl italic">
                                *
                            </span>
                        </p>
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
                    </div>
                </div>
            </div>
            {/* URL */}
            <div className="w-full mb-6">
                <p className="flex items-center text-base">
                    URL: <span className="text-red-500 text-3xl italic">*</span>
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
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center justify-between w-3/5">
                    <div className="w-[30%]">
                        <p className="flex items-center text-sm text-nowrap">
                            Delivery Range:{" "}
                            <span className="text-red-500 text-3xl italic">
                                *
                            </span>
                        </p>
                        <div className="relative">
                            <input
                                name="delivery_date"
                                type="number"
                                min={0}
                                onChange={handleOnChange}
                                required
                                className="rounded-md py-2 px-4 w-full text-xl "
                                value={data.delivery_date}
                                placeholder="7"
                            />
                            <p className="bg-secondary text-main absolute right-0 top-0 h-full min-w-8 text-xl px-2 flex flex-col justify-center items-center rounded-r-lg">
                                Days
                            </p>
                        </div>
                    </div>
                    <div className="w-[30%]">
                        <p className="flex items-center text-base">
                            Price:{" "}
                            <span className="text-red-500 text-3xl italic">
                                *
                            </span>
                        </p>
                        <div className="relative">
                            <input
                                name="price"
                                type="number"
                                min={0}
                                onChange={handleOnChange}
                                required
                                className="rounded-md py-2 px-4 w-full text-xl max-w-44 pl-12"
                                value={data.price}
                                placeholder="0.00"
                            />
                            <p className="bg-secondary text-main absolute left-0 top-0 h-full min-w-8 text-2xl flex flex-col justify-center items-center rounded-l-lg">
                                $
                            </p>
                        </div>
                    </div>

                    <div className="w-[30%]">
                        <p className="flex items-center text-base mb-2">
                            Discount:
                        </p>
                        <div className="relative">
                            <input
                                name="discount"
                                type="number"
                                min={0}
                                max={100}
                                onChange={handleOnChange}
                                required
                                className="rounded-md py-2 px-4 w-full text-xl"
                                value={data.discount}
                            />
                            <p className="bg-secondary text-main absolute right-0 top-0 h-full min-w-8 text-xl px-2 flex flex-col justify-center items-center rounded-r-lg">
                                %
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-[40%]">
                    <div className="flex text-nowrap pl-8 text-left">
                        <p className="text-base pt-4">
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
                        <p className="text-base w-fit pt-4 text-red-500 italic ml-1">
                            {" "}
                            (- $
                            {(data.price * (data.discount / 100)).toFixed(2)})
                        </p>
                    </div>
                    <div className="flex text-nowrap pl-8">
                        <p className="text-base pt-4">
                            Will Arrive Between: <br />
                            <b>
                                {data.delivery_date
                                    ? moment()
                                          .add(data.delivery_date || 0, "days")
                                          .format("Do MMM YYYY") +
                                      " and " +
                                      moment()
                                          .add(
                                              parseInt(data.delivery_date) +
                                                  7 || 0,
                                              "days",
                                          )
                                          .format("Do MMM YYYY")
                                    : ""}
                            </b>{" "}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-[5%] mb-6">
                <div className="flex-1">
                    <p className="flex items-center text-base">
                        Description:{" "}
                        <span className="text-red-500 text-3xl italic">*</span>
                    </p>
                    <textarea
                        name="description"
                        type="text"
                        onChange={handleOnChange}
                        required
                        className="rounded-md py-2 px-4 w-full text-base min-h-40"
                        placeholder="Enter the products description"
                        value={data.description}
                    />
                </div>
            </div>
            <hr className="border-gray-400 mb-6" />
            <p>Colors</p>
            <div className="flex flex-wrap w-full mt-3">
                {colorOptions.length > 0 &&
                    colorOptions.map((color, index) => {
                        let hex = tinycolor(color);
                        return (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: hex.toHexString(),
                                }}
                                className={`rounded-full relative mr-8 p-2 w-12 h-12 border mb-2 transition-all border-black duration-150 ease-in-out cursor-pointer`}
                            >
                                <button
                                    onClick={() => {}}
                                    className="border-2 rounded-full border-black flex flex-col text-center justify-center py-0.5 px-1 hover:bg-secondary hover:text-red-500 duration-150 transition-all ease-in-out absolute -top-2 -right-5"
                                >
                                    <i className="fa-solid fa-minus text-xs"></i>
                                </button>
                            </div>
                        );
                    })}
                <div
                    className={`rounded-full relative mr-6 w-12 h-12 border-[3.25px] border-dotted transition-all border-black duration-150 ease-in-out cursor-pointer text-3xl flex flex-col justify-center text-center hover:bg-gray-200`}
                >
                   +
                </div>
            </div>
            <hr className="border-gray-400 my-6" />

            <ImageUploader
                updateImages={(data) => setData("images", data)}
                images={images}
                defaultImages={product?.images}
                setImages={setImages}
            />
            <div className="w-full flex justify-end">
                <button
                    onClick={() => updateProduct(product)}
                    className="p-2 px-10 border-2 rounded-lg border-secondary bg-main text-lg font-bold transition-all duration-150 ease-in-out hover:bg-secondary hover:text-main"
                >
                    UPDATE
                </button>
            </div>
        </div>
    );
}
