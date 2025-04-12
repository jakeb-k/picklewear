import { Link, Head } from "@inertiajs/react";
import MainProductCard from "@/Components/home/MainProductCard";
import BestSellers from "@/Components/home/BestSellers";
import HomeBackground from "@/../assets/images/splash_bg.webp";
import Slideshow from "@/Components/home/Slideshow";
import { motion } from "motion/react";

export default function Home() {
    return (
        <>
            <div
                className="w-full lg:min-h-screen py-20 pb-40 lg:pb-0 lg:py-0 flex flex-col mt-20 h-fit lg:justify-center lg:pt-0  overflow-x-hidden"
                style={{ backgroundImage: `url(${HomeBackground})` }}
            >
                <Head title="Home" />
                <motion.div
                    initial={{ transform: "translateY(100%)", opacity: 0 }}
                    animate={{ transform: "translateY(0%)", opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div className="lg:ml-12 px-6 lg:px-0 font-oswald">
                        <div>
                            <h1 className="text-main text-5xl  lg:w-1/2">
                                Smash It in Style!
                            </h1>
                            <h1 className="text-main lg:text-5xl my-8 lg:my-0 lg:w-1/2">
                                Pickleball Gear That’s a{" "}
                                <em className="underline">Real Dill!</em>
                            </h1>
                        </div>
                        <h3 className="text-main text-xl tex lg:w-1/2 mt-6 font-sans">
                            Use code REALDILL to relish a 15% discount sitewide
                            until September! Spend $75 or more, and we’ll throw
                            in a free gift—now that's a deal worth grabbing!
                        </h3>
                        <div className="mt-8 flex space-x-8 justify-center lg:justify-start">
                            <a
                                href={route("products.index", "sale")}
                                className="px-8 font-bold py-4 text-center bg-main rounded-lg w-[150px] hover:bg-secondary hover:text-main border-2 border-main transition-all duration-200 ease-in-out"
                            >
                                SALE
                            </a>
                            <a
                                href={route("products.index", "popular")}
                                className="px-8 font-bold py-4 text-center bg-main rounded-lg w-[150px] hover:bg-secondary hover:text-main border-2 border-main transition-all duration-200 ease-in-out"
                            >
                                POPULAR
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
            {/* FIRST PRODUCT SECTION  */}
            <div className="lg:mx-12 mx-4 font-oswald pt-20 lg:pb-40 pb-20">
                <h2 className="text-3xl text-secondary italic text-center">
                    Shop by Category
                </h2>
                <motion.div
                    className="card"
                    initial={{
                        opacity: 0,
                        y: 50,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0, // Slide in to its original position
                        transition: {
                            duration: 0.7, // Animation duration
                        },
                    }}
                    viewport={{ once: true }}
                >
                    <div className="flex lg:justify-evenly lg:flex-nowrap flex-wrap lg:space-x-4 space-x-2 mt-8">
                        <div className='lg:w-auto w-[47.5%] lg:mb-0 mb-4'>
                            <MainProductCard type={"gear"} />
                            <p className="ml-4 mt-2 text-lg">Gear</p>
                            <a
                                className="underline text-base ml-4 hover:text-gray-600/90"
                                href={
                                    route("products.index", "gear") +
                                    "?tag=true"
                                }
                            >
                                Shop Now
                            </a>
                        </div>
                        <div className='lg:w-auto w-[47.5%] lg:mb-0 mb-4'>
                            <MainProductCard type={"hats"} />
                            <p className="text-left ml-4 mt-2 text-lg">Hats</p>
                            <a
                                className="underline text-base ml-4 hover:text-gray-600/90"
                                href={
                                    route("products.index", "hats") +
                                    "?tag=true"
                                }
                            >
                                Shop Now
                            </a>
                        </div>
                        <div className='lg:w-auto w-[47.5%] lg:mb-0 mb-4'>
                            <MainProductCard type={"tops"} />
                            <p className="text-left ml-4 mt-2 text-lg">
                                Shirts
                            </p>
                            <a
                                className="underline text-base ml-4 hover:text-gray-600/90"
                                href={
                                    route("products.index", "tops") +
                                    "?tag=true"
                                }
                            >
                                Shop Now
                            </a>
                        </div>
                        <div className='lg:w-auto w-[47.5%] lg:mb-0 mb-4'>
                            <MainProductCard type={"bottoms"} />
                            <p className="text-left ml-4 mt-2 text-lg">
                                Shorts
                            </p>
                            <a
                                className="underline text-base ml-4 hover:text-gray-600/90"
                                href={
                                    route("products.index", "bottoms") +
                                    "?tag=true"
                                }
                            >
                                Shop Now
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
            <div className="lg:w-9/12 w-11/12 mx-auto lg:pb-12">
                <Slideshow />
            </div>
            {/* BESTSELLERS */}
            <div className="mx-[5%] font-oswald pt-20 pb-40">
                <h2 className="text-3xl text-secondary italic text-center mb-8">
                    Fresh Dills
                </h2>
                <BestSellers />
            </div>
        </>
    );
}
