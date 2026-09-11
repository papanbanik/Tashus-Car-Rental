'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface CampaignSliderProps {
  slides: (string | JSX.Element)[];
}

const CampaignSlider: React.FC<CampaignSliderProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full h-[220px] lg:h-[250px] overflow-hidden rounded-2xl">
      <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className="min-w-full flex items-center justify-center h-[220px] lg:h-[250px]" // Ensure consistent height for both small and large screens
          >
            {typeof slide === 'string' ? (
              <div className="relative w-full h-full flex justify-center items-center overflow-hidden rounded-2xl">
                <Image src={slide} alt={`Slide ${index + 1}`} layout="fill" objectFit="cover" className="rounded-2xl" />
              </div>
            ) : (
              slide
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignSlider;
