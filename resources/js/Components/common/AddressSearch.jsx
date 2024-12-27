import usePlacesAutocomplete from "use-places-autocomplete";

const AddressSearch = ({ onAddressSelect, errors }) => {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            // Restrict the results to Australia
            componentRestrictions: { country: "au" },
        },
    });

    const handleInputChange = (e) => {
        setValue(e.target.value);
    };

    const handleSuggestionClick = async (suggestion) => { 
        setValue(suggestion, false);
        clearSuggestions();
        onAddressSelect({ address: suggestion.description, formattedAddress: suggestion.terms });
    };

    return (
        <div className="relative z-50">
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    disabled={!ready}
                    placeholder="Enter an address"
                    className={`rounded-lg py-1 px-4 w-2/3 min-w-[410px] pl-8 bg-transparent hover:bg-gray-200/50 focus:ring-2 focus:ring-[#FFD100] focus:outline-none transition-all duration-150 ease-in-out ${errors?.first_name ? "border-red-500" : ""}`}
                />

                <p className="absolute left-0 top-0 h-full flex flex-col justify-center px-2">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </p>
            </div>
            {status === "OK" && (
                <div className="relative left-0 w-full bg-white shadow-lg rounded-lg border border-gray-300 max-h-60 overflow-y-auto z-[1000]">
                    {data.map((suggestion) => (
                        <div
                            key={suggestion.place_id}
                            onClick={() =>{
                                console.log(suggestion)
                                handleSuggestionClick(suggestion)}
                            }
                            className="p-2 cursor-pointer hover:bg-gray-100"
                        >
                            {suggestion.description}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddressSearch;
