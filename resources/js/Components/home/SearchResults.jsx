import axios from "axios";
import { useState, useEffect } from "react";

export default function SearchResults({ query }) {
    const [message, setMessage] = useState("...loading");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    async function searchProducts(query) {
        return axios
            .get(route("products.search", query))
            .then((response) => {
                setProducts(response.data.products);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        setLoading(true);
        async function getData() {
            await searchProducts(query);
        }
        getData();
    }, [query]);

    useEffect(() => {
        setTimeout(() => {
            setMessage("Couldn't find any matching products");
        }, 2500);
    }, [products]);

    return (
        <div className="lg:w-3/4 mx-auto h-[75vh] bg-white rounded-t-none rounded-md px-10 py-4">
            {products.length > 0 && !loading ? (
               <div className='flex flex-row flex-wrap justify-start w-full'>
               {products.map((product) => (
                   <div className="flex flex-col w-[30%] mr-[2.5%] mb-4 p-4 min-h-[250px text-center"> {/* Adjusted width and added bottom margin */}
                       <img className='w-full' src={product.images[0]?.file_path} />
                       <p className='font-bold'>{product.name}</p>
                       <p className='mt-auto'>${product.price}</p>
                   </div>
               ))}
           </div>
            ) : (
                <p>{message}</p>
            )}
        </div>
    );
}
