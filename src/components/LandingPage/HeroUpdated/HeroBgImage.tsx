'use client';
import Image from 'next/image';

const HeroBgImage = () => {
  return (
    <div className="relative w-full md:h-[480px] h-[400px] 2xl:h-[550px] overflow-hidden">
      <Image
        src={'/landingPageNew/landingpageBGnew.webp'}
        alt="Hero Background"
        layout="fill"
        objectFit="cover"
        priority // Ensures the image loads quickly
      />
      {/* <div className="absolute inset-0 bg-black opacity-60"></div> */}
    </div>
  );
};

export default HeroBgImage;
