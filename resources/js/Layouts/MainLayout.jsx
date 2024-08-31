import { Link, useForm, usePage } from "@inertiajs/react";
import Logo from "@/../assets/images/pickleLogo.png";
import { useState } from "react";


export default function MainLayout({ children }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        query: ''
    });

    const [isQuerying, setIsQuerying] = useState(true); 

    const handleQueryState = () => {
        setIsQuerying(!isQuerying); 
    }
    //add carusel for query input when doing the top carusel


    return (
        <div className="flex flex-col min-h-screen sm:pt-0 bg-gray-200 relative">
            <div className="fixed w-full">
                <div className="w-full bg-main text-secondary flex py-1">
                    <div className="font-bold  justify-center w-full text-center ml-12">
                        FREE SHIPPING STOREWIDE
                    </div>
                    <div className="flex absolute w-fit right-0 space-x-6 mr-12">
                        <Link href={route("dashboard")}>
                            <i class="fa-regular fa-circle-question text-white text-lg hover:text-black "></i>
                        </Link>
                        <Link href={route("dashboard")}>
                            <i class="fa-regular fa-envelope text-white text-lg hover:text-black"></i>
                        </Link>
                        <Link href={route("dashboard")}>
                            <i class="fa-brands fa-instagram text-white text-lg hover:text-black"></i>
                        </Link>
                    </div>
                </div>
                <div className=" p-1 flex flex-row border-4 border-t-0 border-main justify-start items-center w-full mx-auto bg-secondary text-main font-oswald space-x-16">
                    <div className="flex flex-row w-fit justify-end space-x-2 pl-12 items-center">
                        <img src={Logo} className="w-12 h-auto" />
                        <div>
                            <p className="text-xl font-bevan tracking-wider">
                                Picklewear
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-row w-fit space-x-16 items-center text-lg">
                        <div>Mens</div>
                        <div>Womens</div>
                        <div>Children</div>
                        <div>Accessories</div>
                    </div>
                    <div className="flex flex-row space-x-8 justify-end pr-32 w-1/2 items-center">
                        <div className='relative flex flex-row items-center'>
                            <input 

                             type="text"
                             value={data.query}
                             onChange={(e)=> setData('query', e.target.value)}
                             placeholder={'Search Products'}
                             style={{
                                width: isQuerying ? '300px' : '0px',
                                backgroundColor: isQuerying ? 'white' : 'transparent',
                                transition: 'width 0.3s ease, background-color 0.3s ease',
                              }}
                             className="w-0 rounded bg-transparent border-none focus:ring-0" /> 
                            <i onMouseEnter={handleQueryState}
                                className="fa-solid fa-magnifying-glass text-2xl cursor-pointer absolute right-2"></i>
                        </div>
                        {auth?.user ? (
                            <>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                >
                                    Logout
                                </Link>
                                <Link href={route("login")}>Favs</Link>
                            </>
                        ) : (
                            <>
                                <Link href={route("login")}>
                                    <i class="fa-regular fa-user text-white text-2xl hover:text-main"></i>
                                </Link>
                                <Link href={route("register")}>
                                    <i class="fa-solid fa-cart-shopping text-white text-2xl hover:text-main"></i>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-grow">{children}</div>
            <footer className="w-full bg-gray-800 text-white absolute bottom-0">
                {auth?.user ? (
                    <Link href={route("logout")} method="post" as="button">
                        Logout
                    </Link>
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
