import { Link, router, useForm, usePage } from "@inertiajs/react";
import Logo from "@/../assets/images/pickleLogo.png";
import { useState, useRef, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import Footer from "@/Components/Footer";
import ShoppingCart from "@/Components/ShoppingCart";
import SearchResults from "@/Components/home/SearchResults";
import NavigationMenu from "@/Components/home/NavigationMenu";
import { motion } from "motion/react";
import MobileNavigationMenu from "@/Components/home/MobileNavigationMenu";
export default function MobileLayout({ children }) {
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
            className="flex flex-col min-h-screen sm:pt-0 bg-gray-200 relative"
        >
            <CSSTransition
                in={isQuerying}
                timeout={300}
                classNames="fade"
                unmountOnExit
            >
                <SearchBar />
            </CSSTransition>
            <div className="fixed w-full z-50">
                <div className="w-full bg-main text-secondary flex h-10">
                    <div className="mx-auto w-[400px] overflow-x-hidden mt-2">
                        <div className=" text-nowrap promo-message  animate-scroll space-x-[300px] relative flex flex-row justify-start items-center ">
                            {promos.map((promo, index) => (
                                <p key={index} className="font-bold text-lg">
                                    {promo}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center  w-fit right-0 space-x-4 mr-4">
                        <Link href={route("products.index", "favourites")}>
                            <i className="fa-regular fa-heart text-secondary text-2xl hover:text-white transition-all duration-150 ease-in-out"></i>
                        </Link>
                        <Link href={"/faqs"}>
                            <i className="fa-regular fa-circle-question text-secondary text-2xl hover:text-white transition-all duration-150 ease-in-out "></i>
                        </Link>
                        <Link href={"/faqs#contact"}>
                            <i className="fa-regular fa-envelope text-secondary text-2xl hover:text-white transition-all duration-150 ease-in-out"></i>
                        </Link>
                    </div>
                </div>
                <div className="p-1 flex flex-row items-center w-full h-[60px] bg-secondary text-main relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex flex-col justify-between w-6 h-[19px] focus:outline-none z-50 ml-4"
                    >
                        <span
                            className={`h-0.5 bg-main transition-transform duration-300 ease-in-out ${
                                menuOpen
                                    ? "rotate-[50deg] translate-y-[9px]"
                                    : ""
                            }`}
                        />
                        <span
                            className={`h-0.5 bg-main transition-opacity duration-300 ${
                                menuOpen ? "opacity-0" : "opacity-100"
                            }`}
                        />
                        <span
                            className={`h-0.5 bg-main transition-transform duration-300 ease-in-out ${
                                menuOpen ? "-rotate-[50deg] -translate-y-2" : ""
                            }`}
                        />
                    </button>
                    <div
                        onClick={() => routeToHome()}
                        className="flex cursor-pointer flex-row w-fit justify-end space-x-2 items-center ml-4 mr-2"
                    >
                        <img src={Logo} className="w-12 h-auto" />
                        <div>
                            <p className="text-xl font-bevan tracking-wider">
                                Picklewear
                            </p>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center space-x-4 pr-4">
                        <button onClick={() => setCartOpen(true)}>
                            <i className="fa-solid fa-cart-shopping text-white text-2xl hover:text-main"></i>
                        </button>

                        {auth?.user ? (
                            <>
                                <Link href={route("profile.edit")}>
                                    <i className="fa-regular fa-user text-white text-2xl hover:text-main"></i>
                                </Link>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                >
                                    <i className="fa-solid fa-right-from-bracket text-2xl text-white hover:text-main"></i>
                                </Link>
                            </>
                        ) : (
                            <Link href={route("login")}>
                                <i className="fa-regular fa-user text-white text-2xl hover:text-main"></i>
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
                    <MobileNavigationMenu
                        type={'all'}
                        setIsQuerying={() => setIsQuerying(true)}
                        closeMenu={() => setMenuOpen(false)}
                    />
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
