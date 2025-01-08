import InputError from "@/Components/common/InputError";
import InputLabel from "@/Components/common/InputLabel";
import PrimaryButton from "@/Components/common/PrimaryButton";
import TextInput from "@/Components/common/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import AddressSearch from "@/Components/common/AddressSearch";
import { useEffect, useState } from "react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
    location,
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            first_name: user.first_name,
            last_name: user.last_name,
            mobile: user.mobile,
            email: user.email,
            street: location[0]?.street,
            city: location[0]?.city,
            state: location[0]?.state,
            postcode: location[0]?.postcode,
        });
    
    const [initialLocation, setInitialLocation] = useState(null)

    useEffect(() => {
        if(location){
            setInitialLocation( location[0]?.street + " " + location[0]?.city + " " + location[0]?.state + " " + location[0]?.postcode)
        }
    }, [])

    const submit = (e) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    const handleAddressSelect = (addressData) => {
        const { suggestion, postalCode } = addressData;
        setData({
            ...data,
            street: suggestion.terms[0].value + " " + suggestion.terms[1].value,
            city: suggestion.terms[2].value,
            state: suggestion.terms[3].value,
            postcode: postalCode,
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="flex justify-between space-x-[2.5%]">
                    <div className="flex-1">
                        <InputLabel htmlFor="first_name" value="First Name" />

                        <TextInput
                            id="first_name"
                            className="mt-1 block w-full"
                            value={data.first_name}
                            onChange={(e) =>
                                setData("first_name", e.target.value)
                            }
                            required
                            isFocused
                            autoComplete="first_name"
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>
                    <div className="flex-1">
                        <InputLabel htmlFor="name" value="Last Name" />

                        <TextInput
                            id="last_name"
                            className="mt-1 block w-full"
                            value={data.last_name}
                            onChange={(e) =>
                                setData("last_name", e.target.value)
                            }
                            required
                            isFocused
                            autoComplete="last_name"
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}
                <div className="relative">
                    <InputLabel value="Address" />
                    <AddressSearch
                        onAddressSelect={handleAddressSelect}
                        errors={errors}
                        initialLocation={initialLocation}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
