import { useState, useEffect } from "react"

export default function SearchResults({products}){
    const [message, setMessage] = useState('...loading')

    useEffect(() => {
        setTimeout(() => {
            setMessage("Couldn't find any matching products")
        }, 2500);
    }, [products])

    if( products.length > 0){ 
    return (
        <div className='lg:w-7/12 bg-white rounded-t-none rounded-md px-10 py-4 flex flex-wrap justify-start'>
            {products.map((product)=> {
                <div>
                    <img src={product.images[0]?.file_path} /> 
                    <p>{product.name}</p>
                    <p>${product.price}</p>
                </div>
            })  }
        </div>
    )
    } else {
        return (
            <div className='lg:w-3/4 flex justify-center items-center bg-white rounded-t-none rounded-md mx-auto min-h-[350px] text-2xl text-gray-500'>
                {message}
            </div>
        )
    }
}