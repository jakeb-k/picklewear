import { useState, useEffect, useRef } from 'react';
import slide1 from '@/../assets/images/splash-slideshow/slide1.webp';
import slide2 from '@/../assets/images/splash-slideshow/slide2.webp';
import slide3 from '@/../assets/images/splash-slideshow/slide3.webp';
import slide4 from '@/../assets/images/splash-slideshow/slide4.webp';
import slide5 from '@/../assets/images/splash-slideshow/slide5.webp';

const Slideshow = () => {
  const images = [slide1, slide4, slide3, slide5, slide2] 
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null); // Ref for the container

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex(prevIndex => {
        // If we're at the second last image (as we display two at a time), reset to 0
        if (prevIndex >= images.length - 2) {
          return 0;
        } else {
          return prevIndex + 1;
        }
      });
    }, 4000);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [images.length]);

  // Get half of the container width dynamically
  const getHalfContainerWidth = () => {
    if (containerRef.current) {
      return containerRef.current.offsetWidth / 2;
    }
    return 0; // Default to 0 if the ref isn't available
  };


  return (
    <div
      ref={containerRef}
      style={{ display: 'flex', overflow: 'hidden', width: '100%' }}
    >
      <div
        style={{
          display: 'flex',
          transform: `translateX(-${currentIndex * getHalfContainerWidth()}px)`,
          transition: 'transform 0.5s ease-in-out',
        }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`slide-${index}`}
            className='w-1/2'
          />
        ))}
      </div>
    </div>
  );
};

export default Slideshow;