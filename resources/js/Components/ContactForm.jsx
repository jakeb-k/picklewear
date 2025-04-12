import { useForm } from "@inertiajs/react";
import axios from "axios";
import { useState } from "react";

export default function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const { data, setData, processing } = useForm({
        email: "",
        first_name: "",
        last_name: "",
        message: "",
    });

    const handleOnChange = (e) => {
        setData((prevData) => ({
            ...prevData, 
            [e.target.name]: e.target.value, // Dynamically update the field
        }));
    };

    function sendEmail() {
        setLoading(true);
        axios
            .post(route("contact.email"), data)
            .then((response) => {
                setSuccess("Message served! We'll rally back soon!");
            })
            .catch((error) => {
                if (error?.response.status != 422) {
                    setError(
                        "Sorry! Our Carrier Pigeons are currently asleep, try again later.",
                    );
                } else {
                    setError(error?.response.data.errors);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <section id="contact" className="py-8 lg:px-12 rounded-xl max-w-3xl mx-auto space-y-8">
            <h1>Get In Touch</h1>
            <div className="flex items-center justify-between">
                <div className="w-[47.5%] flex flex-col">
                    <label>
                        First Name{" "}
                        <span className="text-base text-red-500 italic">
                            *
                        </span>{" "}
                    </label>
                    <input
                        name="first_name"
                        id="first_name"
                        placeholder="What do people yell when you win?"
                        type="text"
                        required
                        onChange={handleOnChange}
                        value={data.first_name}
                        className={`rounded-lg py-1 px-4 bg-transparent hover:bg-gray-200/50 focus:ring-2 focus:ring-[#FFD100] focus:outline-none transition-all duration-150 ease-in-out ${error?.first_name ? 'border-red-500' : ''}`}
                    />
                </div>
                <div className="w-[47.5%] flex flex-col">
                    <label>Last Name</label>
                    <input
                        name="last_name"
                        placeholder="Last name...unless you're famous"
                        id="last_name"
                        type="text"
                        onChange={handleOnChange}
                        value={data.last_name}
                        className={`rounded-lg py-1 px-4 bg-transparent hover:bg-gray-200/50 focus:ring-2 focus:ring-[#FFD100] focus:outline-none transition-all duration-150 ease-in-out ${error?.last_name ? 'border-red-500' : ''}`}
                    />
                </div>
            </div>
            <div className="flex flex-col">
                <label>
                    Email{" "}
                    <span className="text-base text-red-500 italic">
                        *
                    </span>
                </label>
                <input
                    name="email"
                    id="email"
                    type="email"
                    placeholder="nospamplz@picklers.com"
                    onChange={handleOnChange}
                    value={data.email}
                    className={`rounded-lg py-1 px-4 bg-transparent hover:bg-gray-200/50 focus:ring-2 focus:ring-[#FFD100] focus:outline-none transition-all duration-150 ease-in-out ${error?.email ? 'border-red-500' : ''}`}

                />
            </div>
            <div className="flex flex-col">
                <label>
                    Message{" "}
                    <span className="text-base text-red-500 italic">
                        *
                    </span>
                </label>
                <textarea
                    name="message"
                    id="message"
                    type="text"
                    placeholder="Tell us how we made your day... or ruined it"
                    required
                    onChange={handleOnChange}
                    value={data.message}
                    className={`rounded-lg py-1 px-4 bg-transparent min-h-32 hover:bg-gray-200/50 focus:ring-2 focus:ring-[#FFD100] focus:outline-none transition-all duration-150 ease-in-out ${error?.message ? 'border-red-500' : ''}`}
                />
            </div>
            <div className="flex w-full justify-end items-center space-x-8">
                <p>
                    {success}
                </p>
                <button onClick={() => sendEmail()}
                disabled={success}
                className={`hover:bg-main lg:w-1/4 text-secondary hover:text-secondary border-2 border-secondary transition-all duration-200 ease-in-out italic text-3xl font-bold px-4 py-2 rounded-lg flex items-center justify-center ${success ?'bg-green-500 text-white hover:bg-green-500 hover:text-white' :''}`}>
                    {loading && (<svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-secondary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>)}
                    {success && (<i className="fa-regular fa-circle-check text-white mr-2"></i>)}
                    SEND
                </button>
            </div>
        </section>
    );
}
