'use client';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';

const vehicles = [
  { image: '/CarSlider/Tashus-hybrid.webp', title: 'Hybrid' },
  { image: '/CarSlider/Tashus-sedan.webp', title: 'Sedan' },
  { image: '/CarSlider/Tashus-SUV.webp', title: '4 Wheel Drive' },
  { image: '/CarSlider/Tashus-pickUp.webp', title: 'Pickup truck' },
  { image: '/CarSlider/Tashus-jeep.webp', title: 'SUV' },
  { image: '/CarSlider/small_car.png', title: 'Van' },
];

const CarsliderComponent2 = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    rtl: true,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 7,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <div className="relative max-w-[1200px] overflow-hidden md:mx-auto mx-2 my-24">
      <p className="text-start font-semibold lg:text-[32px] text-[24px]">Browse Categoriesz</p>
      <Slider {...settings}>
        {vehicles.map((vehicle, index) => (
          <div key={index} className="p-1 lg:p-0.5 xl:p-2">
            <div className="md:w-[190px] md:h-[220px] sm:w-[150px] sm:h-[200px] bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col items-center justify-center">
              {/* Circle image container */}
              <div className="relative w-[115px] h-[115px] rounded-full overflow-hidden mb-4">
                <Image src={vehicle.image} alt={vehicle.title} layout="intrinsic" width={115} height={115} objectFit="cover" />
              </div>
              {/* Title below the circle */}
              <div className="p-2 text-center text-black sm:text-sm">{vehicle.title}</div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CarsliderComponent2;
