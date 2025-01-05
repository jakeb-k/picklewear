import { Head } from "@inertiajs/react";
import Alert from "@/Components/common/Alert";
import { useState } from "react";

export default function ProductIndexLayout(props) {
    const [products, setProducts] = useState(props.products);
    const category = props.category;
    const type = props.type;

    return (
        <div className="min-h-screen py-24 mx-24">
            <Head title={"Category"} />

            <Alert />

            <div className="flex mt-12 justify-between items-center">
                <p className="font-oswald text-3xl">
                    <a
                        className="text-gray-400 hover:text-black duration-150 ease-in-out transition-all"
                        href={route("index")}
                    >
                        Home /
                    </a>{" "}
                    {category}
                </p>
                <p  className="font-oswald text-3xl italic text-gray-500">{products.length} items found</p>
               
            </div>
            <main>
                    <section></section>
                    <section></section>
                </main>
        </div>
    );
}
