'use client';
import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';

const PlacesToVisit = () => {
  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Sample card data with image URLs
  const cards = [
    { id: 1, text: 'Place 1', imgUrl: '/landingPageNew/places/operahouse.png' },
    { id: 1, text: 'Place 1', imgUrl: '/landingPageNew/places/operahouse.png' },
    { id: 1, text: 'Place 1', imgUrl: '/landingPageNew/places/operahouse.png' },
    { id: 1, text: 'Place 1', imgUrl: '/landingPageNew/places/operahouse.png' },
    { id: 1, text: 'Place 1', imgUrl: '/landingPageNew/places/operahouse.png' },
    { id: 1, text: 'Place 1', imgUrl: '/landingPageNew/places/operahouse.png' },
    { id: 1, text: 'Place 1', imgUrl: '/landingPageNew/places/operahouse.png' },
    { id: 1, text: 'Place 1', imgUrl: '/landingPageNew/places/operahouse.png' },
  ];

  return (
    <Slider {...settings} className="px-4">
      {cards.map((card) => (
        <div key={card.id} className="px-2">
          <div className="xl:w-[250px] w-[200px] xl:h-[345px] h-[300px] rounded-lg overflow-hidden relative flex items-end justify-center text-center">
            <Image src={card.imgUrl} alt={card.text} layout="fill" objectFit="cover" objectPosition="center" className="rounded-lg" />
            <p className="absolute bottom-4 text-white font-bold bg-black bg-opacity-50 w-full py-2">{card.text}</p>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default PlacesToVisit;
