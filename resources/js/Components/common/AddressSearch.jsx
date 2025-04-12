import { useEffect } from "react";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";

const AddressSearch = ({ onAddressSelect, errors, initialLocation = '' }) => {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            componentRestrictions: { country: "au" }, // Restrict results to Australia
        },
        debounce: 300,
    });

    useEffect(() => {
        if(initialLocation){
            setValue(initialLocation, false); 
        }
    },[initialLocation])

    const handleInputChange = (e) => {
        setValue(e.target.value);
    };

    const handleSuggestionClick = async (suggestion) => {
        setValue(suggestion.description, false);
        clearSuggestions();

        // Use the included script to get place details
        const service = new google.maps.places.PlacesService(
            document.createElement("div"),
        );
        service.getDetails(
            { placeId: suggestion.place_id },
            (result, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    const postalCode = result.address_components.find(
                        (component) => component.types.includes("postal_code"),
                    )?.long_name;
                    onAddressSelect({
                        suggestion, postalCode
                    });
                } else {
                    console.error("Failed to retrieve place details:", status);
                }
            },
        );
    };

    return (
        <div className="relative z-50 mt-1">
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    disabled={!ready}
                    placeholder="Enter an address"
                    className={`rounded-lg py-1 px-4 w-full lg:min-w-[410px] pl-8 bg-transparent hover:bg-gray-200/50 focus:ring-2 focus:ring-[#FFD100] focus:outline-none transition-all duration-150 ease-in-out ${errors?.address ? "border-red-500" : ""}`}
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
                            onClick={() => {
                                console.log(suggestion);
                                handleSuggestionClick(suggestion);
                            }}
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
