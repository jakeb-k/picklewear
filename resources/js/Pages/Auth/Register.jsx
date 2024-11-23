import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
    
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
            onError: (errors) => {
                console.error("Validation errors:", errors);
                // Optionally display errors to the user
                // For example, set them in a state or toast notification
            },
        });
    };

    return (
        <div className="min-h-screen flex flex-col justify-center">
            <Head title="Register" />

            <div className="w-full min-w-[300px] p-6 my-auto sm:max-w-md bg-white shadow-md overflow-hidden sm:rounded-lg mx-auto">
                <form onSubmit={submit}>
                    <div className="flex justify-between">
                        <div className='w-[47.5%]'>
                            <div className='flex flex-row relative'>
                                <InputLabel htmlFor="first_name" value="First Name"/>
                                <span className='text-red-400 text-2xl absolute left-16 top-0 ml-2'>*</span>
                            </div>

                            <TextInput
                                id="first_name"
                                name="first_name"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="first_name"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("first_name", e.target.value)
                                }
                                required
                            />

                            <InputError
                                message={errors.first_name}
                                className="mt-2"
                            />
                        </div>
                        <div className='w-[47.5%]'>
                            <div className='flex flex-row relative'>
                                <InputLabel htmlFor="last_name" value="Last Name"/>
                                <span className='text-red-400 text-2xl absolute left-16 top-0 ml-2'>*</span>
                            </div>

                            <TextInput
                                id="last_name"
                                name="last_name"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="last_name"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("last_name", e.target.value)
                                }
                                required
                            />

                            <InputError
                                message={errors.last_name}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className='flex flex-row relative'>
                            <InputLabel htmlFor="mobile" value="Mobile"/>
                            <span className='text-red-400 text-2xl absolute left-12 top-0 ml-2'>*</span>
                        </div>
                        <TextInput
                            id="mobile"
                            type="text"
                            name="mobile"
                            value={data.mobile}
                            className="mt-1 block w-full"
                            onChange={(e) => setData("mobile", e.target.value)}
                            required
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Email"/>

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <div className='flex flex-row relative'>
                            <InputLabel htmlFor="password" value="Password" />
                            <span className='text-red-400 text-2xl absolute left-16 top-0 ml-2'>*</span>
                        </div>

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <div className='flex flex-row relative'>
                            <InputLabel htmlFor="password_confirmation" value="Password Confirmation" />
                            <span className='text-red-400 text-2xl absolute left-36 top-0 ml-2'>*</span>
                        </div>

                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            required
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        <Link
                            href={route("login")}
                            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Already registered?
                        </Link>

                        <PrimaryButton className="ms-4" disabled={processing}>
                            Register
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
