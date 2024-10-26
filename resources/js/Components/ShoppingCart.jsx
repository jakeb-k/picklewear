import useCartStore from "@/Stores/useCartStore";
import { usePage } from "@inertiajs/react";

export default function ShoppingCart({handleCartClose, ...props}) {
    const { user } = usePage().props.auth;
    const { products, updateQuantity, removeProduct, clearProducts } =
        useCartStore();

    return (
        <div className='fixed flex w-full min-h-screen z-40'>
            <div className="w-2/3 min-h-screen  bg-black/50 "></div>
            <div className="w-1/3 min-h-screen p-10 bg-gray-100">
            
            <div className='flex justify-between items-center text-3xl'>
                <p>{user ? user.first_name + "'s Cart " : "Your Cart"} </p>
                <button onClick={() => handleCartClose()} className='border-2 rounded-full border-black pb-1 px-3 hover:bg-secondary hover:text-main duration-150 transition-all ease-in-out'><i class="fa-solid fa-x text-xl"></i></button>
            </div>
            </div>

        </div>
    );
}
