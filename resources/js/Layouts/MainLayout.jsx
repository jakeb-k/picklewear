import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import Dropdown from "@/Components/Dropdown";
import Cart from "@/../assets/images/icons/Cart";
import User from "@/../assets/images/icons/User";
import QuestionMark from "@/../assets/images/icons/QuestionMark";
import Mail from "@/../assets/images/icons/Mail";
import Instagram from "@/../assets/images/icons/Instagram";

import Logo from "@/../assets/images/pickleLogo.png";

export default function MainLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="flex flex-col min-h-screen sm:pt-0 bg-gray-200 relative">
            <div className="fixed w-full">
                <div className="w-full bg-main text-secondary flex py-1">
                    <div className="font-bold  justify-center w-full text-center ml-12">
                        FREE SHIPPING STOREWIDE
                    </div>
                    <div className="flex absolute w-fit right-0 space-x-6 mr-12">
                        <Link href={route("dashboard")}>
                            <QuestionMark className="w-6 h-6" stroke="#fff" />
                        </Link>
                        <Link href={route("dashboard")}>
                            <Mail className="w-6 h-6" stroke="#fff" />
                        </Link>
                        <Link href={route("dashboard")}>
                            <Instagram className="w-6 h-6" stroke="#fff" />
                        </Link>
                    </div>
                </div>
                <div className=" p-1 flex flex-row border-4 border-t-0 border-main justify-start items-center w-full mx-auto bg-secondary text-main font-oswald space-x-16">
                    <div className="flex flex-row w-fit justify-end space-x-2 pl-12 items-center">
                        <img src={Logo} className="w-12 h-auto" />
                        <div>
                            <p className="text-xl font-bevan tracking-wider">
                                Picklewear
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-row w-fit space-x-16 items-center text-lg">
                        <div>Mens</div>
                        <div>Womens</div>
                        <div>Children</div>
                        <div>Accessories</div>
                    </div>
                    <div className="flex flex-row space-x-8 justify-end pr-32 w-1/2">
                        <div>
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </div>
                        {auth?.user ? (
                            <>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                >
                                    Logout
                                </Link>
                                <Link href={route("login")}>Favs</Link>
                            </>
                        ) : (
                            <>
                                <Link href={route("login")}>
                                    <User className="w-6 h-6" stroke="#fff" />
                                </Link>
                                <Link href={route("register")}>
                                    <Cart className="w-6 h-6" stroke="#fff" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-grow">{children}</div>
            <footer className="w-full bg-gray-800 text-white absolute bottom-0">
                {auth?.user ? (
                    <Link href={route("logout")} method="post" as="button">
                        Logout
                    </Link>
                ) : (
                    <div className="w-1/3 flex flex-row justify-center space-x-8">
                        <Link href={route("login")}>Log in</Link>
                        <Link href={route("register")}>Register</Link>
                    </div>
                )}
            </footer>
        </div>
    );
}
