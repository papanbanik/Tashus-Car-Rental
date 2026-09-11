'use client';
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { FaCopy } from 'react-icons/fa';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Box, IconButton, Link, Theme, Typography, useMediaQuery } from '@mui/material';

interface VoucherProps {
  code: string;
  discount: number;
  expirationDate: string;
  svgPath: string;
  text: string; // Path to the SVG file
}

const Voucher: React.FC<VoucherProps> = ({ code, text, discount, expirationDate, svgPath }) => {
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '200px' }} className="flex flex-col lg:flex-row items-start p-4 mx-4  bg-white rounded-md sm:flex-col  max-w-[650px] ">
      <div className="flex-shrink-0 lg:ml-5 my-auto mx-auto w-[154px]">
        <Image alt="Coupon Image" width={isSmallScreen ? 100 : 320} height={isSmallScreen ? 80 : 200} src={svgPath} className="w-full h-auto" />
      </div>
      <div className="mx-10 flex flex-col items-center lg:items-start">
        <div className={`text-center lg:text-left mt-2 lg:mt-0 mb-0 lg:mb-2`}>
          <Typography variant="h4" className="text-primary" component="div">
            <span className="font-bold italic sm:text-2xl lg:text-3xl">{discount}% OFF</span>
          </Typography>
        </div>
        <Typography variant="body2" className={`text-center lg:text-left text-sm mb-2 sm:text-xs lg:text-sm`}>
          {text}
        </Typography>
        <Typography variant="h6" component="div" className={`text-center lg:text-left font-semibold text-sm mb-2 sm:text-base  xl:text-md`}>
          {isCopied ? (
            <span className="text-success text-md">Copied!</span>
          ) : (
            <div className="flex items-center">
              <span>Code: {code}</span>{' '}
              <CopyToClipboard text={code} onCopy={handleCopy}>
                <span className="ml-2 cursor-pointer text-primary">
                  <FaCopy />
                </span>
              </CopyToClipboard>
            </div>
          )}
        </Typography>
        <Link href="/promotion">
          <button className={`bg-primary text-white px-4 py-2 rounded-md mb-2 lg:mb-0`} style={{ cursor: 'pointer' }}>
            View More
          </button>
        </Link>
      </div>
    </div>
  );
};

const VoucherList: React.FC = () => {
  // Array of voucher details
  const voucherDetails = [
    {
      code: 'TASHUS1st ',
      text: 'Get 5% Discount on your first ride. Get the coupon now.Get 20% Discount on your first ride. Get the coupon now.',
      discount: 5,
      expirationDate: '2023-12-31',
      svgPath: '/Images/CouponImage/coupon.svg',
    },
    {
      code: 'TASHUS20O',
      text: 'Get 10% Discount on your first ride. Get the coupon now.Get 20% Discount on your first ride. Get the coupon now.',
      discount: 10,
      expirationDate: '2023-12-31',
      svgPath: '/Images/CouponImage/coupon.svg',
    },
    {
      code: 'TASHU78',
      text: 'Get 15% Discount on your first ride. Get the coupon now.Get 20% Discount on your first ride. Get the coupon now.',
      discount: 15,
      expirationDate: '2023-12-31',
      svgPath: '/Images/CouponImage/coupon.svg',
    },
    {
      code: 'TASHUSFml',
      text: 'Get 20% Discount on your first ride. Get the coupon now.Get 20% Discount on your first ride. Get the coupon now.',
      discount: 20,
      expirationDate: '2023-12-31',
      svgPath: '/Images/CouponImage/coupon.svg',
    },
    {
      code: 'TASHUS25',
      text: 'Get 25% Discount on your first ride. Get the coupon now.Get 20% Discount on your first ride. Get the coupon now.',
      discount: 25,
      expirationDate: '2023-12-31',
      svgPath: '/Images/CouponImage/coupon.svg',
    },
    {
      code: 'TASHUSLOy',
      text: 'Get 23% Discount on your first ride. Get the coupon now.Get 20% Discount on your first ride. Get the coupon now.',
      discount: 23,
      expirationDate: '2023-12-31',
      svgPath: '/Images/CouponImage/coupon.svg',
    },
  ];

  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.slickNext();
      }
    }, 3000); // Adjust the auto sliding interval in milliseconds

    return () => clearInterval(interval);
  }, []); // Ensure the dependency array is empty to run the effect only once

  const settings = {
    dots: true,
    infinite: true,
    speed: 2800,
    slidesToShow: 2,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1240,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          variableWidth: true,
          centerMode: true,
          centerPadding: '50px',
        },
      },
      {
        breakpoint: 1239,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          // Custom styles for small screens
          customStyles: {
            dots: {
              marginTop: '20px', // Adjust the margin-top for the dots
            },
          },
        },
      },
    ],
  };

  return (
    <Slider className="mb-16 mt-8 lg:mt-0" ref={sliderRef} {...settings}>
      {voucherDetails.map((voucher, index) => (
        <div key={index} className="flex justify-center">
          <Voucher {...voucher} />
        </div>
      ))}
    </Slider>
  );
};

export default VoucherList;
