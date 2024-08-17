import { Link, Head } from "@inertiajs/react";

import MainProductCard from "@/Components/home/MainProductCard"
import MainConveyor from "@/Components/home/MainConveyor";
import HomeBackground from "@/../assets/images/splash_bg.webp";

export default function Home({ auth, laravelVersion, phpVersion }) {

    return (
        <div className="w-full flex flex-col flex-grow justify-end overflow-x-hidden pb-20"
        style={{backgroundImage: `url(${HomeBackground})` }}>
            <Head title="Home" />
            <div className="flex flex-row w-9/12 -pt-20 h-full mx-auto justify-between items-stretch">
                <div className="w-[35%] mt-auto min-h-1/2">
                    <MainProductCard /> 
                </div>
                <div className='flex flex-col justify-between max-h-1/10 w-[60%]'>
                    <MainConveyor type={'Hats'}/>
                    <MainConveyor type={'Shirts'}/>
                </div>
            </div>
        </div>
    );
}
