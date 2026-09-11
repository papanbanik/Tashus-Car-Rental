import { slides } from '@/types/user-verification/userVerificationTypes';
import { Typography } from '@mui/material';
import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
const VerificationSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    appendDots: (dots: React.ReactNode) => <ul className="text-primary font-bold">{dots}</ul>,
  };

  return (
    <div>
      <Slider {...settings}>
        {slides.map((slides: any, index: number) => (
          <div key={index} className="flex flex-col justify-center items-center">
            <Typography variant="h6" className="text-primary font-bold">
              {slides?.header}
            </Typography>
            <Typography variant="body1">{slides?.subheader}</Typography>
            <div className="flex items-center justify-center mt-4">
              <Image src={slides?.imageUrl} alt={`Image ${index + 1}`} height={500} width={500} className="w-full h-full" />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default VerificationSlider;
