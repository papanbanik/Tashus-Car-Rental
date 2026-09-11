'use client';
import { Box, Collapse, List, ListItem, ListItemText, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import cardData from './cardData';
function TopPlacesCard() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    '/Images/Sydney/Tashus-Sydney-cover2.jpg',
    '/Images/Sydney/Tashus-Sydney-cover3.jpg',
    '/Images/Sydney/white-concrete-structure-beside-body-water.jpg',
  ];

  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeDevice = useMediaQuery(theme.breakpoints.up('lg'));
  const [currentCard, setCurrentCard] = useState(0);

  useEffect(() => {
    const cardInterval = setInterval(() => {
      setCurrentCard((prevCard) => (prevCard + 1) % cardData.length);
    }, 5000);

    return () => clearInterval(cardInterval);
  }, [cardData.length]);
  return (
    <div className="commonMarginBottom mt-2">
      <Box>
        <Typography variant="h2" className="font-bold text-black text-center mb-0 lg:mb-4 text-[24px] lg:text-[40px]">
          <span className="text-primary">Top </span>
          <span className="text-black">places to visit in </span>
          <span className="text-primary">Australia</span>
        </Typography>
      </Box>
      {isLargeDevice ? (
        // Large devices: Use the existing slider for larger devices
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch lg:justify-between max-w-[800px] mx-auto relative mt-8">
          <div className="lg:w-1/2 lg:flex-shrink-0 lg:overflow-hidden lg:relative sm:w-full flex flex-col min-h-[270px]">
            {cardData.map((card, index) => (
              <div
                key={index}
                className={`w-full h-full transition-transform duration-1000 ease-in-out transform ${
                  index === currentCard ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                } rounded absolute top-0 left-0`}
              >
                <Image src={card.cardImage} alt={card.alt} layout="fill" objectFit="cover" className="rounded" />
              </div>
            ))}
          </div>

          <div className="lg:w-1/2 p-4 pr-10 lg:flex flex-col justify-center bg-white overflow-hidden rounded lg:z-10">
            <Typography variant="h2" className="text-lg lg:text-xl font-bold mb-2 text-center lg:text-left">
              {cardData[currentCard].title}
            </Typography>
            <p className="text-base text-center lg:text-left">{cardData[currentCard].text}</p>
          </div>
        </div>
      ) : (
        // Small devices: Display cards one at a time
        <div className=" mx-8 mt-4">
          <div className="w-full h-full transition-transform duration-1000 ease-in-out transform">
            <Image
              src={cardData[currentCard].cardImage}
              alt="Card Image"
              layout="responsive"
              width={500}
              height={300}
              className="rounded max-h-[350px]"
            />
            <div className="p-4 bg-white rounded">
              <Typography variant="h2" className="text-lg lg:text-xl font-bold mb-1 text-center lg:text-center">
                {cardData[currentCard].title}
              </Typography>
              <p className="text-base text-center lg:text-left">{cardData[currentCard].text}</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center mt-4">
        {cardData.map((_, index) => (
          <div
            key={index}
            style={{ backgroundColor: index === currentCard ? '#800080' : 'rgba(128, 0, 128, 0.5)' }}
            className="w-4 h-4 rounded-full cursor-pointer mx-2"
            onClick={() => setCurrentCard(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default TopPlacesCard;
