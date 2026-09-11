'use client';
import { useEffect, useState } from 'react';
import SearchSection from './searchSection';
const images = ['/Hero/10502.jpg', '/Hero/83838.webp'];

export function HeroSliderComponent2() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative w-full h-[450px] overflow-hidden">
        {images.map((imageUrl: string, index: number) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-1'
            }`}
            style={{
              backgroundImage: `url(${imageUrl})`,
            }}
          >
            <div className="absolute inset-0 bg-black opacity-60"></div>
          </div>
        ))}
      </div>
      <div className="absolute top-[12%] lg:top-[25%] z-30 p-4 text-center w-full flex justify-center items-center">
        <div className="max-w-screen-md">
          <p className="text-white text-3xl lg:text-5xl font-semibold leading-tight m-0">Rent Instantly & Hit the Road</p>
          <p className="text-white lg:text-base mt-4 leading-relaxed text-sm hidden lg:flex">
            In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a
            typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available.
          </p>
          <p className="text-white lg:text-base mt-4 leading-relaxed text-sm lg:hidden">
            In publishing and graphic design, Lorem ipsum is a placeholder text commonly
          </p>
          <div className="flex flex-row justify-center items-center gap-4 mt-4">
            <button
              className="text-white lg:font-medium text-sm lg:py-3 py-2 px-2 lg:px-6 rounded-lg shadow-md transition-colors"
              style={{
                backgroundColor: '#800080',
              }}
              onClick={() => alert('Button 1 clicked')}
            >
              Browse All Vehicle
            </button>
            {/* <p className="my-0 text-base lg:text-lg font-bold">OR</p>
          <button
            className="text-white lg:font-medium text-sm lg:py-3 py-2 px-2 lg:px-6 rounded-lg shadow-md hover:bg-purple-700 transition-colors"
            style={{
              backgroundColor: '#800080',
            }}
            onClick={() => alert('Button 2 clicked')}
          >
            List Your Car
          </button> */}
          </div>
        </div>
      </div>

      {/* _________________________________________________________ */}

      <SearchSection />
    </div>
  );
}
