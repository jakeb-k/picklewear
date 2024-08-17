import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";

export default function MainLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="flex flex-col min-h-screen sm:pt-0 bg-gray-100 relative">
            <nav className="w-full bg-gray-800 text-white">
                {auth?.user ? (
                    <Link href={route("logout")} method="post" as="button">
                        Log Out
                    </Link>
                ) : (
                    <div className="w-1/3 flex flex-row justify-center space-x-8">
                        <Link href={route("login")}>Log in</Link>
                        <Link href={route("register")}>Register</Link>
                    </div>
                )}
            </nav>
            <div className="flex flex-col flex-grow">{children}</div>
            <footer className="w-full bg-gray-800 text-white absolute bottom-0">
                {auth?.user ? (
                    <Link href={route("logout")} method="post" as="button">Logout</Link>
                ) : (
                    <div className="w-1/3 flex flex-row justify-center space-x-8">
                        <Link href={route("login")}>Log in</Link>
                        <Link href={route("register")}>Register</Link>
                    </div>
                )}
            </footer>
        </div>
    );
}
