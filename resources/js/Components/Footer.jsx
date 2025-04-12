import { useState } from "react";
import Logo from "@/../assets/images/pickleLogo.png";
import ZipLogo from "@/../assets/images/icons/zip.svg";
import axios from "axios";
import LoadingIcon from "@/Components/common/LoadingIcon";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);

    const handleValidation = () => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setIsInvalid(true);
            setTimeout(() => setIsInvalid(false), 100); // Reset animation after 1 second
        } else {
            setIsInvalid(false);
            
            subscribe();
            setTimeout(() => {
                setLoading(false)
                setSuccess(true)
            }, 2000);
        }
    };

    const clothing = [
        "Hats",
        "Tops",
        "Bottoms",
        "Gear",
    ];

    const help = ["Shipping", "Returns", "Privacy", "Contact"];
    const account = 
    [
        {name: "Past Orders", route: route('profile.edit')},
        {name: "Favourites", route: route('products.index', 'favourites')},
        {name: "My Details", route: route('profile.edit')},
    ];

    function subscribe() {
        setLoading(true);
        axios
            .post(route("subscribe.email"), { email: email })
            .then((response) => {
                setLoading(false);
                setSuccess(true);
            })
            .catch((error) => {
                setIsInvalid(true)
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <div id="footer" className="bg-secondary text-main w-full py-8 px-4">
            <div className="flex w-full lg:flex-row-reverse flex-col lg:px-12 justify-between">
                <div className="flex flex-row w-fit space-x-2 items-start">
                    <img src={Logo} className="w-12 h-auto" />
                    <div>
                        <p className="text-xl font-bevan tracking-wider mt-2">
                            Picklewear
                        </p>
                    </div>
                </div>

                <div className="flex lg:w-[35%] lg:my-0 my-8">
                    <div className="w-1/3 text-left">
                        <p className="text-2xl font-oswald tracking-wider mb-4">
                            Shop
                        </p>

                        <div className="flex flex-col space-y-2">
                            {clothing.map((cat, index) => {
                                return (
                                    <p key={index} className="">
                                        <a className="tracking-wider hover:font-bold cursor-pointer w-fit hover:underline transition-all duration-150 ease-in-out">
                                            {cat}
                                        </a>
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                    <div className="w-1/3 text-left">
                        <p className="text-2xl font-oswald tracking-wider mb-4">
                            Help
                        </p>
                        <div className="flex flex-col space-y-2">
                            {help.map((cat, index) => {
                                let link = cat.toLowerCase();
                                return (
                                    <p key={index} className="">
                                        <a
                                            href={"/faqs#" + link}
                                            className="tracking-wider hover:font-bold cursor-pointer w-fit hover:underline transition-all duration-150 ease-in-out"
                                        >
                                            {cat}
                                        </a>
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                    <div className="w-1/3 text-left">
                        <p className="text-2xl font-oswald tracking-wider mb-4">
                            Account
                        </p>
                        <div className="flex flex-col space-y-2">
                            {account.map((cat, index) => {
                                return (
                                    <p key={index} className="">
                                        <a href={cat.route} className="hover:font-bold cursor-pointer w-fit hover:underline transition-all duration-150 ease-in-out">
                                            {cat.name}
                                        </a>
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="lg:w-[45%]">
                    <p className="text-3xl font-oswald tracking-wider">
                        Be the first to know!
                    </p>
                    <p className="text-lg mt-2 font-light tracking-wide">
                        Receive email updates about our latest events, newest
                        products and exclusive discounts
                    </p>
                    <div
                        className={`relative lg:w-2/3 mt-6 ${
                            (isInvalid || error) ? "animate-wiggle" : ""
                        }`}
                    >
                        <input
                            className={`py-2 w-full px-4 rounded-md bg-white border-main border-2 text-black focus:border-main focus:ring-main `}
                            type="email"
                            id="sub-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                            required={true}
                        />
                        <button
                            onClick={handleValidation}
                            className={`absolute w-[50px] right-0 h-full rounded-r-md border border-main text-black hover:bg-main transition-all duration-300 ${success ? 'bg-green-500' : ''}`}
                        >
                            {(!loading && !success)&&  (
                                <i className="fa-solid fa-arrow-right"></i>
                            ) }
                            {loading && (
                                    <LoadingIcon />
                            )}
                            {(!loading && success)&&  (
                               <i className="fa-solid fa-check text-white"></i>
                            ) }

                        </button>
                    </div>
                    <div className="flex space-x-8 text-3xl p-3 pt-8">
                        <i className="fa-regular fa-envelope hover:text-white transition-all duration-150 ease-in-out cursor-pointer"></i>

                        <i className="fa-brands fa-instagram hover:text-white transition-all duration-150 ease-in-out cursor-pointer"></i>

                        <i className="fa-brands fa-x-twitter hover:text-white transition-all duration-150 ease-in-out cursor-pointer"></i>

                        <i className="fa-brands fa-facebook-f hover:text-white transition-all duration-150 ease-in-out cursor-pointer"></i>

                        <i className="fa-brands fa-tiktok hover:text-white transition-all duration-150 ease-in-out cursor-pointer"></i>
                    </div>
                </div>
            </div>
            <div className="flex lg:flex-row-reverse flex-col justify-between lg:px-12 px-6 items-center mt-8 -mb-2">
                <div className="flex space-x-4 text-3xl border-[3px] border-main p-3 pt- relative items-center">
                    <i className="fa-brands fa-cc-visa lg:text-base text-sm"></i>

                    <i className="fa-brands fa-cc-mastercard lg:text-base text-sm"></i>

                    <i className="fa-brands fa-cc-amex lg:text-base text-sm"></i>

                    <i className="fa-brands fa-cc-jcb lg:text-base text-sm"></i>

                    <img className="w-[42px] h-[42px]" src={ZipLogo} />

                    <i className="fa-brands fa-apple-pay lg:text-base text-sm"></i>

                    <i className="fa-brands fa-google lg:text-base text-sm"></i>
                    <p className="text-sm px-2 absolute flex items-center -top-6 left-0 bg-secondary">
                        Secure Checkout By{" "}
                        <i className="fa-brands fa-stripe text-4xl mx-2 mt-0.5"></i>{" "}
                        With
                    </p>
                </div>
                <div className="lg:text-right lg:w-[62.5%] lg:text-base text-sm mt-4">
                    <p>
                        All Rights Reserved | © JK Web Dev |{" "}
                        {new Date().getFullYear()}{" "}
                    </p>
                </div>
            </div>
        </div>
    );
}
