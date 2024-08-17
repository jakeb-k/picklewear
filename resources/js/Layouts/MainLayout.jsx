import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import Dropdown from "@/Components/Dropdown";

import Logo from "@/../assets/images/pickleLogo.png";
export default function MainLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="flex flex-col min-h-screen sm:pt-0 bg-gray-200 relative">
            <div className='fixed w-full'>
                <div className="w-full bg-main text-secondary flex flex-row justify-around py-2">
                    <div>FREE SHIPPING STOREWIDE</div>
                    <div className="flex flex-row space-x-8 justify-end w-1/2">
                        <div>
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </div>
                        <Link href={route("dashboard")}> About </Link>
                        <Link href={route("dashboard")}> Contact </Link>
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
                                <Link href={route("login")}>Log in</Link>
                                <Link href={route("register")}>Register</Link>
                            </>
                        )}
                    </div>
                </div>
                <div className=" p-2 flex flex-row rounded-b-xl border-4 border-t-0 border-main justify-between w-10/12 mx-auto bg-secondary text-main font-oswald">
                    <div className="flex flex-row w-2/5 justify-start space-x-8 items-center">
                        <img src={Logo} className="w-24 h-auto" />
                        <div>
                            <p className="text-4xl">Picklewear</p>
                        </div>
                    </div>
                    <div className="flex flex-row w-full space-x-28 justify-center items-center text-3xl">
                        <div>Mens</div>
                        <div>Womens</div>
                        <div>Children</div>
                        <div>Accessories</div>
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
