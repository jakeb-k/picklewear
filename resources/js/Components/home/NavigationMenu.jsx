import { useState, useEffect } from "react";

export default function NavigationMenu({ closeMenu, ...props }) {
    const menuOptions = {
        mens: ["T-Shirts", "Singlets", "Visors & Hats", "Shorts", "Hoodies"],
        womens: ["T-Shirts", "Singlets", "Leggings", "Visors & Hats", "Skorts"],
        accessories: [
            "Sunglasses",
            "Socks",
            "Headbands",
            "Wristbands",
            "Hats",
            "Visors",
        ],
        gear: ["Balls", "Bags", "Water Bottles", "Courts", "Covers"],
    };
    const [type, setType] = useState(props.type);
    const typeIndex = Object.keys(menuOptions).indexOf(type) + 1;
    const leftValue = `${typeIndex * 5}%`;
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
<div
    style={{ left: leftValue }}
    className="absolute bg-[#e5e7eb] drop-shadow-2xl rounded rounded-t-none border-t-0 px-8 py-4 w-fit  flex z-20"
>
                <div className="mr-24">
                    <h3 className="font-bold text-xl mb-2">Shop By Price</h3>
                    <ul className="text-secondary text-xl space-y-4">
                        <a
                            href={
                                route("products.index", type) +
                                "?type=" +
                                "sale"
                            }
                        >
                            <li className="bold line-link">On Sale</li>
                        </a>
                        <a
                            href={
                                route("products.index", type) +
                                "?type=" +
                                "sale20"
                            }
                        >
                            <li className="line-link">$20 or Under</li>
                        </a>
                        <a
                            href={
                                route("products.index", type) +
                                "?type=" +
                                "sale30"
                            }
                        >
                            <li className="line-link">$30 or Under</li>
                        </a>
                        <a
                            href={
                                route("products.index", type) +
                                "?type=" +
                                "sale40"
                            }
                        >
                            <li className="line-link">$40 or Under</li>
                        </a>
                        <a
                            href={
                                route("products.index", type) +
                                "?type=" +
                                "sale50"
                            }
                        >
                            <li className="line-link">$50 or Under</li>
                        </a>
                    </ul>
                </div>
                <div className="">
                    <h3 className="font-bold text-xl mb-2">Shop By Category</h3>
                    <div className=" text-secondary text-xl">
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
                                        className="flex flex-col w-full justify-between"
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
                                                className="line-link py-1"
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
