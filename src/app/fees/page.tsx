import React from 'react';
import Image from 'next/image';
import FeesPage from '@/components/Help/FeesPage/FeesPage';
const DOMAIN = `${process.env.NEXT_PUBLIC_DOMAIN}`;
export const metadata = {
  title: `Tashus | Additional Fees`,
  description: `Discover all additional fees applicable for your car rental with Tashus. Get transparent details on cancellations, damages, late returns, and more to plan your journey hassle-free.`,
  alternates: {
    canonical: `${DOMAIN}/fees`,
  },
};

function page() {
  return (
    <>
      <div className="relative w-full h-[300px] 2xl:h-[500px] lg:h-[350px] min:h-[250px]">
        <Image src="/Images/feesCoverImage.webp" alt="Cover Image" layout="fill" objectFit="cover" />
        {/* Black overlay */}
        <div className="absolute inset-0 bg-black opacity-60"></div>
        {/* Centered text */}
        <div className="absolute inset-0 flex top-10 justify-center text-white font-bold text-3xl md:text-2xl lg:text-4xl 2xl:text-6xl text-center">
          <p className="leading-tight">
            Tashus vehicle Rental Fees <br /> and Additional Charges
          </p>
        </div>
      </div>

      <div className="lg:px-32 xl:px-52 md:px-24 px-2 mt-10 max-w-[1600px] mx-auto min-h-screen">
        {/* <LoginPopUpLandingPage /> */}
        {/* <LoginPopupLandingPageNew /> */}
        <FeesPage />
      </div>
    </>
  );
}

export default page;
