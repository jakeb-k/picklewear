import Checkbox from "@/Components/common/Checkbox";
import InputError from "@/Components/common/InputError";
import InputLabel from "@/Components/common/InputLabel";
import PrimaryButton from "@/Components/common/PrimaryButton";
import SecondaryButton from "@/Components/common/SecondaryButton";
import TextInput from "@/Components/common/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { router } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="w-full flex-grow flex flex-col justify-center items-center min-h-screen">
            <Head title="Log in" />

            <div className='lg:w-1/3 p-6 my-auto sm:max-w-md bg-white shadow-md overflow-hidden sm:rounded-lg mx-auto'>
                {status && (
                    <div className="mb-4 font-medium text-sm text-green-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="email" value="Email" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="block mt-4">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                            />
                            <span className="ms-2 text-sm text-gray-600">
                                Remember me
                            </span>
                        </label>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Forgot your password?
                            </Link>
                        )}
                        <div className="flex">
                            <SecondaryButton onClick={(e) => {
                                e.preventDefault();
                                router.visit(route('register'))
                                }} 
                            className="ms-4" disabled={processing}>
                                Register
                            </SecondaryButton>
                            <PrimaryButton className="ms-4" disabled={processing}>
                                Log in
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
