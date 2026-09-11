'use client';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import ReviewCard from './ReviewCard';
import reviewsData from './reviews.json';

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border-2 border-primary text-primary rounded-full flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-colors duration-200"
  >
    <FaChevronRight size={14} />
  </button>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border-2 border-primary text-primary rounded-full flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-colors duration-200"
  >
    <FaChevronLeft size={14} />
  </button>
);

export default function GoogleReview() {
  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1, arrows: false } },
    ],
  };

  return (
    <div className="w-full relative px-4">
      <Slider {...settings}>
        {reviewsData.map((review) => (
          <div key={review.id} className="px-2 py-2">
            <ReviewCard
              name={review.name}
              date={review.date}
              rating={review.rating}
              review={review.review}
              profilePhoto={review?.profilePhoto}
              vehiclePhoto={review?.vehiclePhoto}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
