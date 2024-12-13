import { Link, Head } from "@inertiajs/react";

import MainProductCard from "@/Components/home/MainProductCard"
import BestSellers from "@/Components/home/BestSellers";
import HomeBackground from "@/../assets/images/splash_bg.webp";
import Slideshow from "@/Components/home/Slideshow";

export default function Home() {
    return (
        <>
        <div className="w-full min-h-screen flex flex-col mt-20 h-fit justify-center overflow-x-hidden"
        style={{backgroundImage: `url(${HomeBackground})` }}>
            <Head title="Home" />
            <div className="ml-12 font-oswald">
                <h1 className='text-main text-5xl w-1/2'>Smash It in Style!</h1>
                <h1 className='text-main text-5xl w-1/2'>Pickleball Gear That’s a <em className="underline">Real Dill!</em></h1>
                <h3 className='text-main text-xl w-1/2 mt-6 font-sans'>Use code REALDILL to relish a 20% discount sitewide until September! Spend $75 or more, and we’ll throw in a free gift—now that's a deal worth grabbing!</h3>
                <div className="mt-8 flex space-x-8">
                    <button className="px-8 font-bold py-4 bg-main rounded-lg w-[150px] hover:bg-secondary hover:text-main border-2 border-main transition-all duration-200 ease-in-out">
                        SALE
                    </button>
                    <button className="px-8 font-bold py-4 bg-main rounded-lg w-[150px] hover:bg-secondary hover:text-main border-2 border-main transition-all duration-200 ease-in-out">
                        POPULAR
                    </button>
                </div>
            </div>
        </div>
        {/* FIRST PRODUCT SECTION  */}
        <div className='mx-12 font-oswald pt-20 pb-40'>
            <h2 className='text-3xl text-secondary italic text-center'>Shop by Category</h2>
            <div className='flex justify-evenly space-x-4 mt-8'>
                <div>
                    <MainProductCard />
                    <p className='ml-4 mt-2 text-lg'>Gear</p>
                    <a className='underline text-base ml-4 hover:text-gray-600/90' href={'#'}>Shop Now</a>
                </div>
                <div>
                    <MainProductCard />
                    <p className='text-left ml-4 mt-2 text-lg'>Hats</p>
                    <a className='underline text-base ml-4 hover:text-gray-600/90' href={'#'}>Shop Now</a>
                </div>
                <div>
                    <MainProductCard />
                    <p className='text-left ml-4 mt-2 text-lg'>Shirts</p>
                    <a className='underline text-base ml-4 hover:text-gray-600/90' href={'#'}>Shop Now</a>
                </div>
                <div>
                    <MainProductCard />
                    <p className='text-left ml-4 mt-2 text-lg'>Shorts</p>
                    <a className='underline text-base ml-4 hover:text-gray-600/90' href={'#'}>Shop Now</a>
                </div>
            </div>
        </div>
        <div className='w-9/12 mx-auto pb-12'>
            <Slideshow /> 
        </div>
        {/* BESTSELLERS */}
        <div className='mx-[5%] font-oswald pt-20 pb-40'>
            <h2 className='text-3xl text-secondary italic text-center mb-8'>Fresh Dills</h2>
            <BestSellers />
        </div>
        </>
    );
}
