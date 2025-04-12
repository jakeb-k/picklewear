import { useState, useEffect } from "react";
import MultiRangeSlider from "multi-range-slider-react";

import { CSSTransition } from "react-transition-group";

export default function ProductPriceFilter({ min, max, updateFilters }) {
    const [minValue, setMinValue] = useState(min);
    const [maxValue, setMaxValue] = useState(max);
    const [expanded, setExpanded] = useState(false);

    const handleInput = (e) => {
        setMinValue(e.minValue);
        setMaxValue(e.maxValue);
    };

    useEffect(() => {
        if (minValue != min || maxValue != max) {
            updateFilters({
                name:
                    "$" +
                    minValue.toLocaleString(0, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }) +
                    "- $" +
                    maxValue.toLocaleString(0, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }),
                value: { min: minValue, max: maxValue },
                type: "Price",
            });
        }
    }, [minValue, maxValue]);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <p className="text-2xl ">Price</p>
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
                <div className="w-full max-w-md mx-auto">
                    <div className="flex justify-between">
                        <p>
                            Min: $
                            <span className='font-roboto_mono'>
                                {minValue.toLocaleString(0, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </span>
                        </p>
                        <p>
                            Max: $
                            <span className='font-roboto_mono'>
                                {maxValue.toLocaleString(0, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </span>
                        </p>
                    </div>
                    <MultiRangeSlider
                        min={min}
                        max={max}
                        step={0.01}
                        ruler={false} // Set to true if you want to display a ruler
                        label={false} // Show labels on the slider
                        barInnerColor="#9f9f9f" // Tailwind 'blue-500'
                        thumbLeftColor="#FFD100"
                        thumbRightColor="#FFD100"
                        onInput={handleInput}
                    />
                </div>
            </CSSTransition>
        </>
    );
}
