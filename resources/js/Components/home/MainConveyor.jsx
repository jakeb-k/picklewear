import Image1 from "@/../assets/images/testing_imgs/test_1.webp";
import Image2 from "@/../assets/images/testing_imgs/test_2.webp";
import Image3 from "@/../assets/images/testing_imgs/test_3.webp";

export default function MainConveyor({type}) {
    return (
        <div className='relative'>
            <p className='text-3xl text-main font-oswald inline'>{ type}</p>
            <div className="bg-gray-100/90 rounded-lg overflow-hidden shadow-md shadow-main cursor-pointer flex flex-row justify-evenly relative ">

                <img
                    src={Image1}
                    className="w-1/4 max-h-1/3 hover:bg-white"
                />
                <img
                    src={Image2}
                    className="w-1/4 max-h-1/3 hover:bg-white"
                />
                <img
                    src={Image3}
                    className="w-1/4 max-h-1/3 hover:bg-white"
                />
                <img
                    src={Image1}
                    className="w-1/4 max-h-1/3 hover:bg-white"
                />
            </div>
        </div>
    );
}
