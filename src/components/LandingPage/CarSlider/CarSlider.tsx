'use client';
import { CarSliderList } from '@/types/landingPageTypes';
import { handleFooterRedirection } from '@/utils/Functions/searchCommonFn';
import { carsSliderList } from '@/utils/Lists/landingPage';
import { Theme, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

const CarSlider = () => {
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const numVisibleCars = isSmallScreen ? 3 : 6;
  const settings = {
    infinite: true,
    speed: 700,
    slidesToShow: numVisibleCars,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: 'ease-in-out',
    rtl: true,
  };
  return (
    <div className="relative  overflow-hidden md:mx-auto    commonMarginBottom">
      <Typography className="lg:text-2xl text-xl font-semibold mb-4 text-gray-800">Browse Categories</Typography>
      {/* <p className="text-start font-semibold text-base lg:text-2xl my-0 py-4">Browse Categories</p> */}
      <Slider {...settings}>
        {carsSliderList?.map((vehicle: CarSliderList, index: number) => {
          const { value, image, alt, title } = vehicle;
          const targetUrl = handleFooterRedirection({
            city: 'Sydney',
            address: 'Sydney, New South Wales, Australia',
            source: 'slider',
            vehicleType: value,
          });
          return (
            <div key={index}>
              <Link
                href={targetUrl}
                className="flex flex-col items-center justify-center cursor-pointer hover:opacity-90 transition-opacity no-underline"
              >
                {/* Circle Image Container */}
                <div className="relative md:w-[115px] w-[90px] h-[90px] md:h-[115px] rounded-full bg-white shadow-secondary overflow-hidden mb-4 flex justify-center items-center p-3">
                  <Image src={image} alt={alt} layout="intrinsic" width={115} height={115} objectFit="cover" />
                </div>
                {/* Title below the Circle Image */}
                <div className="text-center text-black text-xs md:text-sm">{title}</div>
              </Link>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default CarSlider;
