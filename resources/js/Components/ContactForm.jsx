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
        setData([e.target.name], e.target.value);
    };

    function sendEmail(){
        setLoading(true); 
        axios.post(route('contact.email'), data)
        .then((response) => {
            setSuccess("Message served! We'll rally back soon!")
        })
        .catch((error) => {
            if(error.status != 422){
                setError('Sorry! Our Carrier Pigeons are currently asleep, try again later.')
            } else {
                setError(error);
            }
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <section className="py-8 px-12 rounded-xl max-w-3xl mx-auto space-y-8">
            <h1>Get In Touch</h1>
            <div className="flex items-center justify-between">
                <div className="w-[47.5%] flex flex-col">
                    <label>
                        First Name{" "}
                        <span className="text-base text-red-500 italic">
                            (required)
                        </span>{" "}
                    </label>
                    <input
                        name="first_name"
                        id="first_name"
                        placeholder='What do people yell when you win?'
                        type="text"
                        required
                        onChange={handleOnChange}
                        value={data.first_name}
                        className="rounded py-1 px-4 bg-transparent hover:bg-gray-200/50 focus:ring-2 focus:ring-[#FFD100] focus:outline-none transition-all duration-150 ease-in-out"
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
                        className="rounded py-1 px-4 bg-transparent hover:bg-gray-200/50 focus:ring-2 focus:ring-[#FFD100] focus:outline-none transition-all duration-150 ease-in-out"
                    />
                </div>
            </div>
            <div className="flex flex-col">
                <label>
                    Email{" "}
                    <span className="text-base text-red-500 italic">
                        (required)
                    </span>
                </label>
                <input
                    name="last_name"
                    id="last_name"
                    type="text"
                    placeholder='nospamplz@picklers.com'
                    onChange={handleOnChange}
                    value={data.last_name}
                    className="rounded py-1 px-4 bg-transparent hover:bg-gray-200/50 focus:ring-2 focus:ring-[#FFD100] focus:outline-none transition-all duration-150 ease-in-out"
                />
            </div>
            <div className="flex flex-col">
                <label>
                    Message{" "}
                    <span className="text-base text-red-500 italic">
                        (required)
                    </span>
                </label>
                <textarea
                    name="message"
                    id="message"
                    type="text"
                    placeholder='Tell us how we made your day... or ruined it'
                    required
                    onChange={handleOnChange}
                    value={data.message}
                    className="rounded py-1 px-4 bg-transparent min-h-32 hover:bg-gray-200/50 focus:ring-2 focus:ring-[#FFD100] focus:outline-none transition-all duration-150 ease-in-out"
                />
            </div>
        </section>
    );
}
