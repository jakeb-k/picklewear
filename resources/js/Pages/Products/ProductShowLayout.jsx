import { Head } from "@inertiajs/react";
import moment from "moment";
import { useState } from "react";
import tinycolor from "tinycolor2";
import useCartStore from "@/Stores/useCartStore";
import { v4 as uuidv4 } from "uuid";
import RelatedItems from "@/Components/product/RelatedProducts";
import { CSSTransition } from "react-transition-group";

export default function ProductShowLayout(props) {
    const product = props.product;
    const relatedItems = props.relatedItems;
    console.log(product);
    const colors =
        props.product.options
            .find((option) => option.type === "color")
            ?.values?.split(".") || [];
    const { images } = props.product;
    const sizes = ["XS", "S", "M", "L", "XL"];
    const [selectedSize, setSelectedSize] = useState("M");
    const [displayImage, setDisplayImage] = useState(images[0]);
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [quantity, setQuantity] = useState(1);
    const [showAlert, setShowAlert] = useState(false); 

    const { addProduct, products } = useCartStore();

    const addToCart = (product) => {
        setShowAlert(false); 
        let productData = {
            ...product,
            color: selectedColor,
            size: selectedSize,
            quantity: quantity,
            image: images[0],
            cartItemId: uuidv4(),
        };
        addProduct(productData);
        setShowAlert(true)
        setTimeout(() => {
            setShowAlert(false); 
        }, 2500);
    };

    const Alert = () => {
        return(
            <div className='border-2 border-main rounded-xl px-8 flex fixed py-4 top-24 right-12 h-8 items-center bg-secondary'>
                <i class="fa-regular fa-circle-check text-main mt-1"></i>
                <p className='tracking-wide ml-4 text-main font-oswald'> Your item/s have been added to the cart. </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-24 mx-24">
            <Head title={product.name} />
            <CSSTransition
                in={showAlert}
                timeout={300}
                classNames="fade"
                unmountOnExit
            >
                <Alert /> 
            </CSSTransition>
            
            <div className="flex mt-20">
                
                <div className="flex justify-between items-center w-[47.5%] ">
                    <div className="w-[20%] space-y-8">
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
                    <div className="w-[75%]">
                        <img
                            src={displayImage.file_path}
                            className="w-full min-h-[450px] rounded-md object-contain"
                        />
                    </div>
                </div>

                <div className="w-[45%] ml-auto flex flex-col justify-start">
                    <p className="text-3xl font-oswald">{product.name}</p>
                    <p className="mt-6">
                        <span className="text-lg line-through">
                            ${(product.price + product.price * 0.2).toFixed(2)}{" "}
                        </span>{" "}
                        <span className="text-2xl font-bold ml-12">
                            ${product.price}
                        </span>
                    </p>
                    <div className="w-full my-4 border border-gray-400 mx-auto"></div>
                    {product.options.length > 0 && (
                        <>
                            <p className="font-bold">Options</p>
                            <div className="flex flex-wrap w-full mb-4">
                                {colors.length > 0 &&
                                    colors.map((color, index) => {
                                        let hex = tinycolor(color);
                                        return (
                                            <div
                                                onClick={() =>
                                                    setSelectedColor(color)
                                                }
                                                key={index}
                                                style={{
                                                    backgroundColor:
                                                        hex.toHexString(),
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
                                                onClick={() =>
                                                    setSelectedSize(size)
                                                }
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
                        </>
                    )}
                    <p>{product.description}</p>
                    <p className="italic my-4">
                        {" "}
                        Will arrive between the{" "}
                        {moment().add(7, "days").format("Do MMM YY") +
                            " to the " +
                            moment()
                                .add(product.delivery_date, "days")
                                .format("Do MMM YY")}{" "}
                    </p>
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
                            <p className="border-y-2 flex justify-center border-black bg-white p-2 px-6 text-2xl w-16 text-center">
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
                        <button
                            onClick={() => addToCart(product)}
                            className="hover:bg-secondary hover:text-main hover:border-2 hover:border-main transition-all duration-200 ease-in-out text-3xl font-bold px-4 py-2 border-2 border-black bg-main rounded-lg text-nowrap"
                        >
                            Add To Cart
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-8 font-oswald py-10">
                <h2 className="text-2xl text-secondary italic text-left mb-8">
                    You might also like...
                </h2>
                <RelatedItems relatedItems={relatedItems} />
            </div>
        </div>
    );
}
