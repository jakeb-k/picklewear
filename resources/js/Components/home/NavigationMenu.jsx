export default function NavigationMenu(props) {
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
            "T-Shirts",
            "Polos",
            "Singlets",
            "Hats",
            "Sunglasses",
            "Shorts",
            "Socks",
            "Hoodies",
            "Accessories",
        ],
    };
    const type = props.type;
    const options = menuOptions.mens;

    return (
        <div className="bg-[#e5e7eb]/90 border-4 border-main rounded-xl rounded-t-none border-t-0 px-8 py-4 w-[75%] left-[12.5%] -bottom-[230%] mx-auto flex">
            <div className="w-[12.5%] mr-24">
                <h3 className="font-bold mb-2">Shop By Price</h3>
                <ul className="text-secondary text-xl space-y-2">
                    <li className="bold">On Sale</li>
                    <li className="hover:underline">$20 or Under</li>
                    <li className="hover:underline">$30 or Under</li>
                    <li className="hover:underline">$40 or Under</li>
                    <li className="hover:underline">Bundle Deals</li>
                </ul>
            </div>
            <div className="w-[25%]">
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
                                    className="flex w-full justify-between mb-2"
                                >
                                    {row.map((option) => (
                                        <p key={option} className="w-[47.5%]">
                                            {option}
                                        </p>
                                    ))}
                                </div>
                            ))}
                </div>
            </div>
            <button className="p-12 ml-auto rounded-xl text-2xl bg-secondary hover:bg-main border-main transition-all duration-150 ease-in-out text-main hover:text-secondary">
                Shop Summer Collection
            </button>
        </div>
    );
}
