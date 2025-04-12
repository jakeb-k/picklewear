import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function MobileNavigationMenu({ closeMenu, ...props }) {
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
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden flex flex-wrap text-secondary text-sm p-4 pt-2"
        >
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
                                            encodeURIComponent(
                                                option.toLowerCase(),
                                            )
                                        }
                                        className="line-link-mobile text-left border-4 w-1/2 mt-4 underline"
                                    >
                                        {option}
                                    </a>
                                ))}
                            </div>
                        ))}
            </div>
        </motion.div>
    );

    return (
        <div className="fixed inset-0 top-[87.5px] bg-black/40 z-10 overflow-y-auto">
            <div className="bg-[#e5e7eb] drop-shadow-2xl min-h-full rounded-t-none border-t-0 py-4 w-[75%] z-20">
                <div className="px-4">
                    <h3 className="font-bold text-xl mb-2">Shop By Price</h3>
                    <ul className="text-secondary text-xl flex flex-wrap justify-between">
                        <a
                            className='w-1/2'
                            href={
                                route("products.index", type) +
                                "?type=" +
                                "sale"
                            }
                        >
                            <li className="underline line-link-mobile">On Sale</li>
                        </a>
                        <a
                            className='w-1/2'
                            href={
                                route("products.index", type) +
                                "?type=" +
                                "sale20"
                            }
                        >
                            <li className="underline line-link-mobile">$20 or Under</li>
                        </a>
                        <a
                            className='w-1/2'
                            href={
                                route("products.index", type) +
                                "?type=" +
                                "sale30"
                            }
                        >
                            <li className="underline line-link-mobile">$30 or Under</li>
                        </a>
                        <a
                            className='w-1/2'
                            href={
                                route("products.index", type) +
                                "?type=" +
                                "sale40"
                            }
                        >
                            <li className="underline line-link-mobile">$40 or Under</li>
                        </a>
                        <a
                            className='w-1/2'
                            href={
                                route("products.index", type) +
                                "?type=" +
                                "sale50"
                            }
                        >
                            <li className="underline line-link-mobile">$50 or Under</li>
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
                        className="w-full border-b border-main text-main flex flex-row justify-between px-8 py-2 bg-secondary"
                    >
                        <p className="w-20">Mens</p>
                        <i
                            className={`fa-solid fa-chevron-down hover:bg-gray-700 hover:text-main duration-150 transition-all ease-in-out cursor-pointer p-1 rounded-full ${expanded.includes("mens") ? "rotate-180" : "rotate-0"}`}
                        ></i>
                    </div>

                    <AnimatePresence initial={expanded.includes("mens")}>
                        {expanded.includes("mens") && <Options type={"mens"} />}
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

                    <AnimatePresence initial={expanded.includes("womens")}>
                        {expanded.includes("womens") && (
                            <Options type={"womens"} />
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

                    <AnimatePresence initial={expanded.includes("kids")}>
                        {expanded.includes("kids") && <Options type={"kids"} />}
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

                    <AnimatePresence initial={expanded.includes("gear")}>
                        {expanded.includes("gear") && <Options type={"gear"} />}
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
                {/* <a  href={route("products.index", "popular")} className="p-12 ml-auto rounded-xl h-48 my-auto font-oswald tracking-wider text-2xl bg-secondary hover:bg-main border-main transition-all duration-150 ease-in-out text-main hover:text-secondary">
                    Shop Summer Collection
                </a> */}
            </div>
        </div>
    );
}
