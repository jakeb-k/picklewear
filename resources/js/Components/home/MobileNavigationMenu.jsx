import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import SearchResults from "./SearchResults";
import { Link, useForm } from "@inertiajs/react";
import { CSSTransition } from "react-transition-group";

export default function MobileNavigationMenu({ closeMenu, setIsQuerying, ...props }) {
    const menuOptions = {
        mens: [
            "T-Shirts",
            "Polos",
            "Singlets",
            "Visors & Hats",
            "Shorts",
            "Track Pants",
            "Hoodies",
            "Button Downs",
            "Zips",
        ],
        womens: [
            "Dresses",
            "Tank Tops",
            "Leggings",
            "Sleeveless",
            "Visors & Hats",
            "Sun Shirts",
            "Skorts",
            "Headbands",
            "Sweat Shirts",
        ],
        kids: [
            "Polos",
            "T-Shirts",
            "Long-Sleeves",
            "Shorts",
            "Skorts",
            "Leggings",
            "Track Pants",
            "Hoodies",
            "Jackets",
            "Socks",
            "Sun Hats",
            "Visors",
            "Headbands",
            "Wristbands",
        ],
        gear: [
            "Sunglasses",
            "Socks",
            "Headbands",
            "Wristbands",
            "Accessories",
            "Shorts",
            "Covers",
            "Bags",
            "Sleeves",
            "Ankle Braces",
        ],
    };
    const [type, setType] = useState(props.type);
    const [expanded, setExpanded] = useState([]);

    useEffect(() => {
        setType(props.type);
        setOptions(menuOptions[props.type]);
    }, [props.type]);

    const [options, setOptions] = useState(menuOptions[type]);

    const Options = ({ type }) => (
        <div className="flex flex-wrap text-secondary text-sm p-4 pt-2">
            {menuOptions[type] &&
                menuOptions[type]
                    .reduce((rows, key, index) => {
                        const chunkIndex = Math.floor(index / 2);
                        if (!rows[chunkIndex]) {
                            rows[chunkIndex] = []; // start a new chunk
                        }
                        rows[chunkIndex].push(key);
                        return rows;
                    }, [])
                    .map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="flex w-full justify-between"
                        >
                            {row.map((option) => (
                                <a
                                    key={option}
                                    href={
                                        route("products.index", type) +
                                        "?type=" +
                                        encodeURIComponent(option.toLowerCase())
                                    }
                                    className="line-link-mobile text-left border-4 w-1/2 mt-4 underline"
                                >
                                    {option}
                                </a>
                            ))}
                        </div>
                    ))}
        </div>
    );


    return (
        <div className="fixed inset-0 top-[87.5px] bg-black/40 z-10 overflow-y-auto">
            <div className="bg-[#e5e7eb] drop-shadow-2xl min-h-full rounded-t-none border-t-0 py-4 w-[75%] z-20">

                <div className="flex items-center justify-between px-4 space-x-8">
                    <button onClick={setIsQuerying} className="w-32 font-bold px-2 py-1 rounded-lg text-xl mb-4 border-2 border-main bg-secondary text-main">
                        Search
                    </button>{" "}
                    <Link href={route("products.index", "favourites")} className="w-32 font-bold px-2 py-1 rounded-lg text-xl mb-4 border-2 border-main bg-secondary text-main">
                        Favourites
                    </Link>
                </div>

                <div className="px-4">
                    <h3 className="font-bold text-xl mb-2">Shop By Price</h3>
                    <ul className="text-secondary text-xl flex flex-wrap justify-between">
                        <a
                            className="w-1/2"
                            href={
                                route("products.index", type) +
                                "?type=" +
                                "sale"
                            }
                        >
                            <li className="underline line-link-mobile">
                                On Sale
                            </li>
                        </a>
                        <a
                            className="w-1/2"
                            href={
                                route("products.index", type) +
                                "?type=" +
                                "sale20"
                            }
                        >
                            <li className="underline line-link-mobile">
                                $20 or Under
                            </li>
                        </a>
                        <a
                            className="w-1/2"
                            href={
                                route("products.index", type) +
                                "?type=" +
                                "sale30"
                            }
                        >
                            <li className="underline line-link-mobile">
                                $30 or Under
                            </li>
                        </a>
                        <a
                            className="w-1/2"
                            href={
                                route("products.index", type) +
                                "?type=" +
                                "sale40"
                            }
                        >
                            <li className="underline line-link-mobile">
                                $40 or Under
                            </li>
                        </a>
                        <a
                            className="w-1/2"
                            href={
                                route("products.index", type) +
                                "?type=" +
                                "sale50"
                            }
                        >
                            <li className="underline line-link-mobile">
                                $50 or Under
                            </li>
                        </a>
                    </ul>
                </div>
                <div className="">
                    <h3 className="font-bold text-xl my-2 ml-4">
                        Shop By Category
                    </h3>
                    <div
                        onClick={() => {
                            if (expanded.includes("mens")) {
                                setExpanded(
                                    expanded.filter((item) => item !== "mens"),
                                );
                            } else {
                                setExpanded([...expanded, "mens"]);
                            }
                        }}
                        className={`w-full border-b border-main text-main flex flex-row justify-between px-8 py-2 bg-secondary`}
                    >
                        <p className="w-20">Mens</p>
                        <i
                            className={`fa-solid fa-chevron-down hover:bg-gray-700 hover:text-main duration-150 transition-all ease-in-out cursor-pointer p-1 rounded-full ${expanded.includes("mens") ? "rotate-180" : "rotate-0"}`}
                        ></i>
                    </div>

                    <AnimatePresence mode="wait" initial={false}>
                        {expanded.includes("mens") && (
                            <motion.div
                                key="mens-options"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}
                                className="overflow-hidden"
                            >
                                <Options type={"mens"} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div
                        onClick={() => {
                            if (expanded.includes("womens")) {
                                setExpanded(
                                    expanded.filter(
                                        (item) => item !== "womens",
                                    ),
                                );
                            } else {
                                setExpanded([...expanded, "womens"]);
                            }
                        }}
                        className="w-full border-b border-main text-main flex flex-row justify-between px-8 py-2 bg-secondary"
                    >
                        <p className="w-20">Womens</p>
                        <i
                            className={`fa-solid fa-chevron-down hover:bg-gray-700 hover:text-main duration-150 transition-all ease-in-out cursor-pointer p-1 rounded-full ${expanded.includes("womens") ? "rotate-180" : "rotate-0"}`}
                        ></i>
                    </div>

                    <AnimatePresence mode="wait" initial={false}>
                        {expanded.includes("womens") && (
                            <motion.div
                                key="womens-options"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}
                                className="overflow-hidden"
                            >
                                <Options type={"womens"} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div
                        onClick={() => {
                            if (expanded.includes("kids")) {
                                setExpanded(
                                    expanded.filter((item) => item !== "kids"),
                                );
                            } else {
                                setExpanded([...expanded, "kids"]);
                            }
                        }}
                        className="w-full border-b border-main text-main flex flex-row justify-between px-8 py-2 bg-secondary"
                    >
                        <p className="w-20">Kids</p>
                        <i
                            className={`fa-solid fa-chevron-down hover:bg-gray-700 hover:text-main duration-150 transition-all ease-in-out cursor-pointer p-1 rounded-full ${expanded.includes("kids") ? "rotate-180" : "rotate-0"}`}
                        ></i>
                    </div>

                    <AnimatePresence mode="wait" initial={false}>
                        {expanded.includes("kids") && (
                            <motion.div
                                key="kids-options"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}
                                className="overflow-hidden"
                            >
                                <Options type={"kids"} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div
                        onClick={() => {
                            if (expanded.includes("gear")) {
                                setExpanded(
                                    expanded.filter((item) => item !== "gear"),
                                );
                            } else {
                                setExpanded([...expanded, "gear"]);
                            }
                        }}
                        className="w-full border-b border-main text-main flex flex-row justify-between px-8 py-2 bg-secondary"
                    >
                        <p className="w-20">Gear</p>
                        <i
                            className={`fa-solid fa-chevron-down hover:bg-gray-700 hover:text-main duration-150 transition-all ease-in-out cursor-pointer p-1 rounded-full ${expanded.includes("gear") ? "rotate-180" : "rotate-0"}`}
                        ></i>
                    </div>

                    <AnimatePresence mode="wait" initial={false}>
                        {expanded.includes("gear") && (
                            <motion.div
                                key="gear-options"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}
                                className="overflow-hidden"
                            >
                                <Options type={"gear"} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="flex flex-wrap text-secondary text-xl">
                        {options &&
                            options
                                .reduce((rows, key, index) => {
                                    const chunkIndex = Math.floor(index / 2);
                                    if (!rows[chunkIndex]) {
                                        rows[chunkIndex] = []; // start a new chunk
                                    }
                                    rows[chunkIndex].push(key);
                                    return rows;
                                }, [])
                                .map((row, rowIndex) => (
                                    <div
                                        key={rowIndex}
                                        className="flex w-full justify-between"
                                    >
                                        {row.map((option) => (
                                            <a
                                                key={option}
                                                href={
                                                    route(
                                                        "products.index",
                                                        type,
                                                    ) +
                                                    "?type=" +
                                                    encodeURIComponent(
                                                        option.toLowerCase(),
                                                    )
                                                }
                                                className="w-[47.5%] line-link-mobile py-1"
                                            >
                                                {option}
                                            </a>
                                        ))}
                                    </div>
                                ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
