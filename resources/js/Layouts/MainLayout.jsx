import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function MainLayout({ auth, children }) {
    return (
        <div className="flex flex-col min-h-screen sm:pt-0 bg-gray-100 relative">
             <nav className="w-full bg-gray-800 text-white">
                    {auth?.user ? (
                        <Link
                            href={route("dashboard")}
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <div className='w-1/3 flex flex-row justify-center space-x-8'>
                            <Link
                                href={route("login")}
                            >
                                Log in
                            </Link>
                            <Link
                                href={route("register")}
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </nav>
            <div className='flex flex-col flex-grow'>
                {children}
            </div>
            <footer className="w-full bg-gray-800 text-white absolute bottom-0">
            {auth?.user ? (
                        <Link
                            href={route("dashboard")}
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <div className='w-1/3 flex flex-row justify-center space-x-8'>
                            <Link
                                href={route("login")}
                            >
                                Log in
                            </Link>
                            <Link
                                href={route("register")}
                            >
                                Register
                            </Link>
                        </div>
                    )}
            </footer>
        </div>
    );
}
