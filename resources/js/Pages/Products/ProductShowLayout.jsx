import { Head } from "@inertiajs/react";
import { useState } from "react";
import tinycolor from "tinycolor2";

export default function ProductShowLayout(props) {
    const product = props.product;
    const colors = props.product.options
        .find((option) => option.type == "color")
        .values.split(".");
    const { images } = props.product;
    const [displayImage, setDisplayImage] = useState(images[0]);
    const [selectedColor, setSelectedColor] = useState(null);

    console.log(colors);

    return (
        <div className="min-h-screen py-24 mx-24">
            <Head title="" />
            <div className="flex mt-20 items-center">
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
                <div className="w-[45%] ml-auto">
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
                    <p className="font-bold">Color </p>
                    <div className="flex flex-wrap w-full">
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
                                    className={`rounded-full mt-4 mr-4 p-2 w-12 h-12 border transition-all border-black duration-150 ease-in-out cursor-pointer ${selectedColor == color ? 'border-2' : 'opacity-50 hover:opacity-100 '}`}
                                ></div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
