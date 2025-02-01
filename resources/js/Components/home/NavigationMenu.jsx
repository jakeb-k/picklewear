import { useState, useEffect } from "react";

export default function NavigationMenu({ closeMenu, ...props }) {
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
            "Long-Sleeve Shirts",
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

    useEffect(() => {
        setType(props.type);
        setOptions(menuOptions[props.type]);
    }, [props.type]);

    const [options, setOptions] = useState(menuOptions[type]);

    return (
        <div
            onMouseOver={(e) => {
                if (e.target === e.currentTarget) {
                    closeMenu();
                }
            }}
            className="absolute bg-black/40 h-screen w-screen z-10"
        >
            <div className="bg-[#e5e7eb] border-4 border-main rounded rounded-t-none border-t-0 px-8 py-4 w-[75%] left-[12.5%] -bottom-[230%] mx-auto flex z-20">
                <div className="w-[12.5%] mr-24">
                    <h3 className="font-bold mb-2">Shop By Price</h3>
                    <ul className="text-secondary text-xl space-y-4">
                        <a
                            href={
                                route("products.index", type) +
                                "?type=" +"sale"
                            }
                        >
                            <li className="bold line-link">On Sale</li>
                        </a>
                        <a
                            href={
                                route("products.index", type) +
                                "?type=" + "sale20"
                            }
                        >
                            <li className="line-link">$20 or Under</li>
                        </a>
                        <a
                            href={
                                route("products.index", type) +
                                "?type=" + "sale30"
                            }
                        >
                            <li className="line-link">$30 or Under</li>
                        </a>
                        <a
                            href={
                                route("products.index", type) +
                                "?type=" + "sale40"
                            }
                        >
                            <li className="line-link">$40 or Under</li>
                        </a>
                        <a
                            href={
                                route("products.index", type) +
                                "?type=" + "sale50"
                            }
                        >
                            <li className="line-link">$50 or Under</li>
                        </a>
                    </ul>
                </div>
                <div className="w-[40%]">
                    <h3 className="font-bold mb-2">Shop By Category</h3>
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
                                                className="w-[47.5%] line-link py-1"
                                            >
                                                {option}
                                            </a>
                                        ))}
                                    </div>
                                ))}
                    </div>
                </div>
                <button className="p-12 ml-auto rounded-xl text-2xl bg-secondary hover:bg-main border-main transition-all duration-150 ease-in-out text-main hover:text-secondary">
                    Shop Summer Collection
                </button>
            </div>
        </div>
    );
}
