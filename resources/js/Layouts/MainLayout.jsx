import { Link, router, useForm, usePage } from "@inertiajs/react";
import Logo from "@/../assets/images/pickleLogo.png";
import { useState, useRef, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import Footer from "@/Components/Footer";
import ShoppingCart from "@/Components/ShoppingCart";
import SearchResults from "@/Components/home/SearchResults";
import NavigationMenu from "@/Components/home/NavigationMenu";
import { motion } from 'motion/react'; 
export default function MainLayout({ children }) {
    const { auth } = usePage().props;
    const [promos, setPromos] = useState([
        "AUSTRALIAS BEST PICKLEBALL SHOP",
        "FREE SHIPPING STOREWIDE!",
        "SPEND $100 AND GET 10% OFF",
        "USE CODE SECRETPICKLES FOR 5% OFF",
    ]);
    const { data, setData } = useForm({
        query: "",
    });
    const inputRef = useRef(null);

    const [isQuerying, setIsQuerying] = useState(false);

    const handleQueryState = () => {
        setIsQuerying(!isQuerying);
    };

    const [cartOpen, setCartOpen] = useState(false);

    const [menuOpen, setMenuOpen] = useState(false);
    const [menuType, setMenuType] = useState("");

    const handleInputChange = (e) => {
        setData("query", e.target.value);
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [data.query]);

    const routeToHome = () => {
        router.visit(route("index"));
    };

    const SearchBar = () => {
        return (
            <div className="bg-gray-800/50 min-h-screen fixed z-[99] w-full pt-8">
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
                <CSSTransition
                    in={data.query != ""}
                    timeout={300}
                    classNames="fade"
                    unmountOnExit
                >
                    <SearchResults query={data.query} />
                </CSSTransition>
            </div>
        );
    };
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col min-h-screen sm:pt-0 bg-gray-200 relative">
            <CSSTransition
                in={isQuerying}
                timeout={300}
                classNames="fade"
                unmountOnExit
            >
                <SearchBar />
            </CSSTransition>
            <div
                onMouseLeave={() => {
                    setMenuType("");
                    setMenuOpen(false);
                }}
                className="fixed w-full z-50"
            >
                <div className="w-full bg-main text-secondary flex h-7">
                    <div className="mx-auto w-[400px] overflow-x-hidden">

                            <div
                                className=" text-nowrap promo-message  animate-scroll space-x-[300px] relative flex flex-row justify-start items-center "
                            >
                                {promos.map((promo, index) => (
                                    <p key={index} className="font-bold text-lg">{promo}</p>
                                ))}
                            </div>
                    </div>
                    <div className="flex absolute w-fit right-0 space-x-6 mr-12">
                        
                        <Link href={route("products.index", "favourites")}>
                            <i className="fa-regular fa-heart text-secondary text-xl hover:text-white transition-all duration-150 ease-in-out"></i>
                        </Link>
                        <Link href={"/faqs"}>
                            <i className="fa-regular fa-circle-question text-secondary text-xl hover:text-white transition-all duration-150 ease-in-out "></i>
                        </Link>
                        <Link href={"/faqs#contact"}>
                            <i className="fa-regular fa-envelope text-secondary text-xl hover:text-white transition-all duration-150 ease-in-out"></i>
                        </Link>
                    </div>
                </div>
                <div className=" p-1 flex flex-row justify-between items-center w-full mx-auto bg-secondary text-main font-oswald space-x-16">
                    <div className="flex flex-row ml-12 space-x-24">
                        <div
                            onClick={() => routeToHome()}
                            className="flex cursor-pointer flex-row w-fit justify-end space-x-2  items-center"
                        >
                            <img src={Logo} className="w-12 h-auto" />
                            <div>
                                <p className="text-xl font-bevan tracking-wider">
                                    Picklewear
                                </p>
                            </div>
                        </div>
                        <div
                            onMouseEnter={() => setMenuOpen(true)}
                            className="flex flex-row w-fit space-x-16 items-center text-2xl"
                        >
                            <div
                                className={`cursor-pointer transition-all duration-150 ease-in-out ${
                                    menuType == "mens" ? "underline" : ""
                                }`}
                                onMouseEnter={() => setMenuType("mens")}
                            >
                                <a href={route("products.index", "mens")}>
                                    Mens
                                </a>
                            </div>
                            <div
                                className={`cursor-pointer transition-all duration-150 ease-in-out ${
                                    menuType == "womens" ? "underline" : ""
                                }`}
                                onMouseEnter={() => setMenuType("womens")}
                            >
                                <a href={route("products.index", "womens")}>
                                    Womens{" "}
                                </a>
                            </div>
                            <div
                                className={`cursor-pointer transition-all duration-150 ease-in-out ${
                                    menuType == "kids" ? "underline" : ""
                                }`}
                                onMouseEnter={() => setMenuType("kids")}
                            >
                                <a href={route("products.index", "kids")}>
                                    Kids
                                </a>
                            </div>
                            <div
                                className={`cursor-pointer transition-all duration-150 ease-in-out ${
                                    menuType == "gear" ? "underline" : ""
                                }`}
                                onMouseEnter={() => setMenuType("gear")}
                            >
                                <a href={route("products.index", "gear")}>
                                    Gear
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row space-x-8 justify-end pr-10 w-1/2 items-center">
                        <div className="relative flex flex-row items-center">
                            <i
                                onClick={handleQueryState}
                                className="fa-solid fa-magnifying-glass text-2xl cursor-pointer absolute right-2 hover:text-white"
                            ></i>
                        </div>
                        {auth?.user ? (
                            <>
                                {auth.user.is_admin ? (
                                    <Link href="/admin">Admin</Link>
                                ) : (
                                    ""
                                )}
                                <Link href={route("profile.edit")}>
                                    <i className="fa-regular fa-user text-white text-2xl hover:text-main"></i>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href={route("login")}>
                                    <i className="fa-regular fa-user text-white text-2xl hover:text-main"></i>
                                </Link>
                            </>
                        )}
                        {!auth?.user?.is_admin && (
                            <button onClick={() => setCartOpen(true)}>
                                <i className="fa-solid fa-cart-shopping text-white text-2xl hover:text-main"></i>
                            </button>
                        )}

                        {auth?.user && (
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                            >
                                <i className="fa-solid fa-right-from-bracket text-2xl text-white hover:text-main"></i>
                            </Link>
                        )}
                    </div>
                </div>
                <CSSTransition
                    in={menuOpen}
                    timeout={300}
                    classNames="fade"
                    unmountOnExit
                >
                    <NavigationMenu type={menuType} closeMenu={() => setMenuOpen(false)} />
                </CSSTransition>
            </div>
            <div>{children}</div>
            <Footer />
            <CSSTransition
                in={cartOpen}
                timeout={300}
                classNames="fade"
                unmountOnExit
            >
                <ShoppingCart handleCartClose={() => setCartOpen(false)} />
            </CSSTransition>
        </motion.div>
    );
}
