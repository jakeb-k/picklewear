import { Head } from "@inertiajs/react";
import { useState } from "react";
import tinycolor from "tinycolor2";

export default function ProductShowLayout(props) {
    const product = props.product;
    const colors = props.product.options
        .find((option) => option.type == "color")
        .values.split(".");
    const { images } = props.product;
    const sizes = ["XS", "S", "M", "L", "XL"];
    const [selectedSize, setSelectedSize] = useState("M");
    const [displayImage, setDisplayImage] = useState(images[0]);
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [quantity, setQuantity] = useState(1);

    console.log(colors);

    return (
        <div className="min-h-screen py-24 mx-24">
            <Head title="" />
            <div className="flex mt-20">
                <div className="w-[10%] space-y-8 ">
                    {images.map((image) => {
                        return (
                            <img
                                onClick={() => setDisplayImage(image)}
                                key={image.id}
                                src={image.file_path}
                                className={`w-full max-h-[250px] rounded-md cursor-pointer ${
                                    displayImage.id != image.id
                                        ? "opacity-70 hover:opacity-100"
                                        : "border border-main"
                                }`}
                            />
                        );
                    })}
                </div>
                <div className="w-[37.5%] ml-12">
                    <img
                        src={displayImage.file_path}
                        className="w-full min-h-[450px] rounded-md object-contain"
                    />
                </div>
                <div className="w-[45%] ml-auto flex flex-col justify-start">
                    <p className="text-xl font-oswald">{product.name}</p>
                    <p className="mt-6">
                        <span className="text-lg line-through">
                            ${(product.price + product.price * 0.2).toFixed(2)}{" "}
                        </span>{" "}
                        <span className="text-2xl font-bold ml-12">
                            ${product.price}
                        </span>
                    </p>
                    <div className="w-full my-4 border border-gray-400 mx-auto"></div>
                    <p className="font-bold">Options</p>
                    <div className="flex flex-wrap w-full mb-4">
                        {colors.map((color, index) => {
                            let hex = tinycolor(color);
                            console.log(hex.toHexString());
                            return (
                                <div
                                    onClick={() => setSelectedColor(color)}
                                    key={index}
                                    style={{
                                        backgroundColor: hex.toHexString(),
                                    }}
                                    className={`rounded-full mt-4 mr-4 p-2 w-12 h-12 border transition-all border-black duration-150 ease-in-out cursor-pointer ${
                                        selectedColor == color
                                            ? "border-2"
                                            : "opacity-50 hover:opacity-100 "
                                    }`}
                                ></div>
                            );
                        })}
                    </div>
                    <div className="flex flex-wrap w-full mt-4">
                        <div className="flex">
                            {sizes.map((size, index) => {
                                return (
                                    <div
                                        onClick={() => setSelectedSize(size)}
                                        key={index}
                                        className={`font-bold min-w-8 text-center text-2xl mr-10 cursor-pointer transition-all duration-150 ease-in-out ${
                                            size == selectedSize
                                                ? "border-b-2 border-black pb-1 text-black"
                                                : "border-b-2 border-transparent pb-1 text-gray-500 hover:text-black"
                                        }`}
                                    >
                                        {size}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="w-full my-4 border border-gray-400 mx-auto"></div>
                    <p>{product.description}</p>
                    <div className="mt-auto flex space-x-32 mx-auto">
                        <div className="flex">
                            <button
                                onClick={() => {
                                    if (quantity != 0) {
                                        setQuantity(quantity - 1);
                                    }
                                }}
                                className="rounded-l-xl border-2 border-gray-700 p-1 px-2 text-2xl hover:bg-gray-700 hover:border-main w-10 hover:border-2 duration-150 transition-color ease-in-out hover:text-main"
                            >
                                -
                            </button>
                            <p className="border-y-2 border-black bg-white p-2 px-6 text-2xl w-16 text-center">
                                {quantity}
                            </p>
                            <div></div>
                            <button
                                onClick={() => {
                                    setQuantity(quantity + 1);
                                }}
                                className="rounded-r-xl border-2 border-gray-700 p-1 px-2 text-2xl hover:bg-gray-700 hover:border-main w-10 hover:border-2 duration-150 transition-color ease-in-out hover:text-main"
                            >
                                +
                            </button>
                        </div>
                        <button className="hover:bg-secondary hover:text-main border-2 border-main transition-all duration-200 ease-in-out italic text-3xl font-bold px-4 py-2 bg-main rounded-lg ">
                            Add To Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
