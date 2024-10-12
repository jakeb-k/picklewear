import { useState, useEffect, useRef } from "react";
import axios from "axios";

const BestSellers = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null); // Ref for the container
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getData() {
            await getBestsellers();
        }
        getData();
    }, []);

    function getBestsellers() {
        return axios
            .get(route("home.bestsellers"))
            .then((response) => {
                console.log(response.data);
                setProducts(response.data.bestsellers);
                setLoading(false); 
            })
            .catch((error) => {
                console.error("El Problemo: " + error);
            });
    }

    useEffect(() => {

      if(!loading){
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => {
              console.log(prevIndex, products.length); 

                // If we're at the second last image (as we display two at a time), reset to 0
                if (prevIndex >= products.length - 4) {
                    return 0;
                } else {
                    return prevIndex + 1;
                }
            });
        }, 4000);
        return () => clearInterval(intervalId); // Clear interval on component unmount

      }

    }, [products?.length, loading]);



    if (!loading) {
      return (
        <div
          className="relative ml-[1%] border"
          ref={containerRef}
          style={{ display: "flex", overflow: "hidden", width: "100%" }}
        >
          <div
            className="w-full"
            style={{
              display: "flex justify-center",
              transform: `translateX(-${currentIndex * 24.95}%)`, // Slide by 25% for one image
              transition: "transform 0.5s ease-in-out",
            }}
          >
            {products.map((product, index) => (
              <div
                key={index}
                className=" mr-[2%] h-[400px] rounded-md bg-gray-500"
                style={{ minWidth: '23%' }} // Ensure the minimum width stays at 25%
              >
                <p>{product.name}</p>
                <p>{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }else {
        return <p>loading</p>;
    }
};

export default BestSellers;
