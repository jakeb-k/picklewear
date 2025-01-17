import React, { useState } from "react";
import tinycolor from "tinycolor2";

const ColorSearch = ({addColor}) => {
    const [query, setQuery] = useState("");
    const [filteredColors, setFilteredColors] = useState([]);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setQuery(value);

        // Check if the input is a valid color name
        if (value) {
            const isValid = tinycolor(value).isValid();
            const suggestions = isValid ? [value] : [];
            setFilteredColors(suggestions);
        } else {
            setFilteredColors([]);
        }
    };

    return (
        <div className="p-5 flex items-center space-x-4 h-16">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && filteredColors.length > 0) {
                            addColor(filteredColors);
                            setQuery("");
                        }
                    }}
                    onChange={handleSearch}
                    placeholder="Search colour names..."
                    className="rounded-md py-1 px-2 w-full text-base pr-8 focus:ring-secondary focus:border-secondary"
                />

                <button onClick={() => {
                    if(filteredColors.length > 0){
                        addColor(filteredColors)
                        setQuery("")
                    }
                }} className={` text-main  transition-all duration-150 ease-in-out absolute right-0 top-0 h-full min-w-8 text-lg flex flex-col justify-center items-center rounded-r-md border-2 border-secondary ${filteredColors.length > 0 ? 'bg-secondary hover:bg-main hover:text-secondary cursor-pointer' : 'bg-secondary/50 cursor-not-allowed'}`}>
                    +
                </button>
            </div>
            <div className="flex flex-wrap">
                {filteredColors.map((color, index) => (
                    <div
                        key={index}
                        className={`rounded-full relative mr-8 p-2 w-12 h-12 border mb-2 transition-all border-black duration-150 ease-in-out cursor-pointer`}
                        style={{
                            background: tinycolor(color).toHexString(),
                        }}
                        title={color}
                    />
                ))}
            </div>
        </div>
    );
};

export default ColorSearch;
