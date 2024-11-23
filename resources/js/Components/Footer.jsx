import { useState } from "react";
import Logo from "@/../assets/images/pickleLogo.png";
import ZipLogo from "@/../assets/images/icons/zip.svg";

export default function Footer() {
    const [email, setEmail] = useState("");
    const clothing = [
        "Hats",
        "Shirts",
        "Shorts",
        "Hoodies",
        "Polos",
        "Glasses",
    ];
    const gear = [
        "Gloves",
        "Balls",
        "Glasses",
        "Socks",
        "Wristbands",
        "Headbands",
    ];
    const help = ["Shipping", "Returns", "Privacy", "Contact"];
    const account = ["Track Order", "Favourites", "My Details"];

    return (
        <div className="bg-secondary text-main w-full py-8 px-4">
            <div className="flex w-full flex-row-reverse px-12 justify-between">
                <div className="flex flex-row w-fit space-x-2 items-start">
                    <img src={Logo} className="w-12 h-auto" />
                    <div>
                        <p className="text-xl font-bevan tracking-wider mt-2">
                            Picklewear
                        </p>
                    </div>
                </div>

                <div className="flex w-[35%]">
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
                            Account
                        </p>
                        <div className="flex flex-col space-y-2">
                            {account.map((cat, index) => {
                                return (
                                    <p key={index} className="">
                                        <a className="hover:font-bold cursor-pointer w-fit hover:underline transition-all duration-150 ease-in-out">
                                            {cat}
                                        </a>
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="w-[45%]">
                    <p className="text-3xl font-oswald tracking-wider">
                        Be the first to know!
                    </p>
                    <p className="text-lg mt-2 font-light tracking-wide">
                        Receive email updates about our latest events, newest
                        products and exclusive discounts
                    </p>
                    <div className="relative w-2/3 mt-6">
                        <input
                            className="py-2 w-full px-4 rounded-md bg-white border-main border-2 text-black focus:border-main focus:ring-main"
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                        />
                        <button className="absolute w-[50px] right-0 h-full rounded-r-md border border-main text-black hover:bg-main transition-all duration-300">
                            <i className="fa-solid fa-arrow-right"></i>
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
            <div className="flex flex-row-reverse justify-between px-12 items-center mt-8 -mb-2">
                <div className="flex space-x-4 text-3xl border-[3px] border-main p-3 pt- relative items-center">
                    <i className="fa-brands fa-cc-visa"></i>

                    <i className="fa-brands fa-cc-mastercard"></i>

                    <i className="fa-brands fa-cc-amex"></i>

                    <i class="fa-brands fa-cc-jcb"></i>

                    <img className='w-[42px] h-[42px]' src={ZipLogo} /> 

                    <i className="fa-brands fa-apple-pay"></i>

                    <i className="fa-brands fa-google"></i>
                    <p className="text-sm px-2 absolute flex items-center -top-6 left-0 bg-secondary">
                        Secure Checkout By{" "}
                        <i className="fa-brands fa-stripe text-4xl mx-2 mt-0.5"></i>{" "}
                        With
                    </p>
                </div>
                <div className="text-right w-[62.5%] mt-4">
                    <p>
                        All Rights Reserved | © JK Web Dev |{" "}
                        {new Date().getFullYear()}{" "}
                    </p>
                </div>
            </div>
        </div>
    );
}
