import { Link, useForm, usePage } from "@inertiajs/react";
import Logo from "@/../assets/images/pickleLogo.png";
import { useState, useRef, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import Footer from "@/Components/Footer";

export default function MainLayout({ children }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        query: "",
    });
    const inputRef = useRef(null);

    const [isQuerying, setIsQuerying] = useState(false);

    const handleQueryState = () => {
        setIsQuerying(!isQuerying);
    };

    const handleInputChange = (e) => {
        setData("query", e.target.value);
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [data.query]);

    //add carusel for query input when doing the top carusel

    const SearchBar = () => {
        return (
            <div className="bg-gray-800/50 min-h-screen  fixed z-50 w-full pt-8">
                <div className="flex bg-white py-1 justify-center items-center">
                    <i
                        onClick={handleQueryState}
                        className="fa-solid fa-magnifying-glass text-2xl cursor-pointer"
                    ></i>
                    <input
                        ref={inputRef}
                        id="query"
                        name="query"
                        key={"query-input"}
                        className="w-10/12 h-20 pl-12 py-4 text-lg font-oswald bg-white border-none focus:ring-0"
                        type="text"
                        value={data.query}
                        placeholder={"Search our cool store"}
                        onChange={handleInputChange}
                    />
                    <i
                        onClick={handleQueryState}
                        className="fa-solid fa-x text-2xl cursor-pointer"
                    ></i>
                </div>
            </div>
        );
    };
    return (
        <div className="flex flex-col min-h-screen sm:pt-0 bg-gray-200 relative">
            <CSSTransition
                in={isQuerying}
                timeout={300}
                classNames="fade"
                unmountOnExit
            >
                <SearchBar />
            </CSSTransition>
            <div className="fixed w-full z-30">
                <div className="w-full bg-main text-secondary flex py-1">
                    <div className="font-bold  justify-center w-full text-center ml-12">
                        FREE SHIPPING STOREWIDE
                    </div>
                    <div className="flex absolute w-fit right-0 space-x-6 mr-12">
                        <Link href={route("dashboard")}>
                            <i className="fa-regular fa-circle-question text-white text-lg hover:text-black "></i>
                        </Link>
                        <Link href={route("dashboard")}>
                            <i className="fa-regular fa-envelope text-white text-lg hover:text-black"></i>
                        </Link>
                        <Link href={route("dashboard")}>
                            <i className="fa-brands fa-instagram text-white text-lg hover:text-black"></i>
                        </Link>

                        <Link href={route("dashboard")}>
                            <i className="fa-brands fa-x-twitter text-white text-lg hover:text-black"></i>
                        </Link>

                        <Link href={route("dashboard")}>
                            <i className="fa-brands fa-facebook-f text-white text-lg hover:text-black"></i>
                        </Link>

                        <Link href={route("dashboard")}>
                            <i className="fa-brands fa-tiktok text-white text-lg hover:text-black"></i>
                        </Link>
                    </div>
                </div>
                <div className=" p-1 flex flex-row justify-start items-center w-full mx-auto bg-secondary text-main font-oswald space-x-16">
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
                        <div>Gear</div>
                    </div>
                    <div className="flex flex-row space-x-8 justify-end pr-10 w-1/2 items-center">
                        <div className="relative flex flex-row items-center">
                            <i
                                onClick={handleQueryState}
                                className="fa-solid fa-magnifying-glass text-2xl cursor-pointer absolute right-2"
                            ></i>
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
                                    <i className="fa-regular fa-user text-white text-2xl hover:text-main"></i>
                                </Link>
                                <Link href={route("register")}>
                                    <i className="fa-solid fa-cart-shopping text-white text-2xl hover:text-main"></i>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div>{children}</div>
            <Footer />
        </div>
    );
}
