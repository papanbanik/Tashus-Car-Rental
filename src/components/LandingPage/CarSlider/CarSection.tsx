'use client';
import { Box, Theme, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import React, { useRef } from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { cars } from './Cars';

const CarSection: React.FC = () => {
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const numVisibleCars = isSmallScreen ? 3 : 4;
  const sliderRef = useRef<Slider>(null);

  const handlePrevious = () => {
    sliderRef.current?.slickNext();
  };

  const handleNext = () => {
    sliderRef.current?.slickPrev();
  };

  const sliderSettings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: numVisibleCars,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    rtl: true,
  };

  const renderedCars = cars.map((car, index) => (
    <Box key={index}>
      <Image height={isSmallScreen ? 75 : 200} width={200} className="w-full  object-contain" src={car.image} alt={car.alt} />
      <Typography variant="body1" align="center" className="font-semibold text-xs md:text-lg">
        {car.name}
      </Typography>
    </Box>
  ));

  return (
    <Box style={{ backgroundColor: '#F6F1F6', margin: '0 ' }} className="container shadow-lg mx-auto p-4 rounded-2xl lg:mb-24 lg:mt-0 ">
      <Typography variant="h2" className=" text-black text-center mt-6 md:mt-12 mb-8 lg:text-[40px] text-[24px] font-bold">
        Select the{' '}
        <span className="text-primary">
          ideal vehicle
          <br />
        </span>
        <span className="text-black">for your </span>
        <span className="text-primary">Journey</span>
      </Typography>
      <Slider {...sliderSettings} ref={sliderRef}>
        {renderedCars}
      </Slider>
      <Box className="mb-2 md:mb-4" display="flex" justifyContent="center" mt={4}>
        <button className="border-none bg-transparent mr-10" onClick={handlePrevious}>
          <BsArrowLeft size={isSmallScreen ? 25 : 50} className="text-primary font-bold" />
          {/* <Image src="/CarSlider/PreviousArrow.svg" alt="Previous" width={50} height={50} /> */}
        </button>
        <button className="border-none bg-transparent" onClick={handleNext}>
          <BsArrowRight size={isSmallScreen ? 25 : 50} className="text-primary font-bold" />
          {/* <Image src="/CarSlider/NextArrow.svg" alt="Next" width={50} height={50} /> */}
        </button>
      </Box>
    </Box>
  );
};

export default CarSection;
