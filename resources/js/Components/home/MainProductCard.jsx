import TestImage from "@/../assets/images/testing_imgs/test_1.webp";

export default function MainProductCard() {
    return (
        <>
            <p className="text-4xl text-main font-oswald mb-2">Popular</p>
            <div className="bg-gray-100/90 rounded-lg overflow-hidden shadow-md shadow-main cursor-pointer hover:bg-white ">
                <img src={TestImage} />
            </div>
        </>
    );
}
