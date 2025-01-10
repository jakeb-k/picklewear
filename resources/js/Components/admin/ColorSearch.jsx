import React, { useState } from "react";
import tinycolor from "tinycolor2";

const ColourSearch = () => {
    const [query, setQuery] = useState("");
    const [filteredColours, setFilteredColours] = useState([]);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setQuery(value);

        // Check if the input is a valid colour name
        if (value) {
            const isValid = tinycolor(value).isValid();
            const suggestions = isValid ? [value] : [];
            setFilteredColours(suggestions);
        } else {
            setFilteredColours([]);
        }
    };

    return (
        <div className="p-5 flex items-center space-x-4 h-16">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    placeholder="Search colour names..."
                    className="rounded-md py-1 px-2 w-full text-base pr-8 focus:ring-secondary focus:border-secondary"
                />

                <p className="bg-secondary text-main hover:bg-main hover:text-secondary transition-all duration-150 ease-in-out absolute right-0 top-0 h-full min-w-8 text-lg flex flex-col justify-center items-center rounded-r-md border-2 border-secondary cursor-pointer">
                    +
                </p>
            </div>
            <div className="flex flex-wrap">
                {filteredColours.map((colour, index) => (
                    <div
                        key={index}
                        className={`rounded-full relative mr-8 p-2 w-12 h-12 border mb-2 transition-all border-black duration-150 ease-in-out cursor-pointer`}
                        style={{
                            background: tinycolor(colour).toHexString(),
                        }}
                        title={colour}
                    />
                ))}
            </div>
        </div>
    );
};

export default ColourSearch;
