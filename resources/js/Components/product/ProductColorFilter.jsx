import { useState, useEffect } from "react";
import tinycolor from "tinycolor2";
import { CSSTransition } from "react-transition-group";

export default function ProductColorFilter({ updateFilters, ...props }) {
    const colorOptions = props.colorOptions;
    const currentFilters = props.colorFilters; 
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            <div className="flex justify-between items-center">
                <p className="text-2xl ">Color</p>
                <i
                    onClick={() => setExpanded(!expanded)}
                    className={`text-2xl fa-solid fa-chevron-down hover:bg-gray-700 hover:text-main duration-150 transition-all ease-in-out cursor-pointer p-1 py-0 rounded-full ${expanded ? "rotate-180" : "rotate-0"}`}
                ></i>
            </div>
            <CSSTransition
                in={expanded}
                timeout={300}
                classNames="fade"
                unmountOnExit
            >
                <div className="flex flex-wrap justify-start w-full mb-4">
                    {colorOptions.length > 0 &&
                        colorOptions.map((color, index) => {
                            let hex = tinycolor(color);
                            return (
                                <div
                                    onClick={() => updateFilters({name: color, type: 'color'})}
                                    key={index}
                                    style={{
                                        backgroundColor: hex.toHexString(),
                                    }}
                                    className={`rounded-full mt-4 mr-4 p-2 w-12 h-12 border transition-all border-black duration-150 ease-in-out cursor-pointer ${
                                        currentFilters?.find((filter) => filter.name == color)
                                            ? "border-2"
                                            : "opacity-50 hover:opacity-100 "
                                    }`}
                                ></div>
                            );
                        })}
                </div>
            </CSSTransition>
        </>
    );
}
