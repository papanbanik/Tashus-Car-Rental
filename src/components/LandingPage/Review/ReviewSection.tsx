'use client';
import { Box, Container, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { reviews } from './Review';

const ReviewSection: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [reviewsPerPage, setReviewsPerPage] = useState<number>(0);

  const handleNext = () => {
    setStartIndex((prevIndex) => Math.min(prevIndex + 4, reviews.length - 1));
  };

  const handlePrevious = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 4, 0));
  };

  const getReviewsPerPage = () => {
    if (window.innerWidth >= 1024) {
      return 4;
    } else if (window.innerWidth >= 768) {
      return 2;
    } else {
      return 1;
    }
  };

  const getReviewsPerRow = () => {
    if (reviewsPerPage === 4) {
      return 4;
    } else if (reviewsPerPage === 2) {
      return 2;
    } else {
      return 1;
    }
  };
  const handleResize = () => {
    const newReviewsPerPage = getReviewsPerPage();
    setReviewsPerPage(newReviewsPerPage);
    const maxStartIndex = Math.max(0, reviews.length - newReviewsPerPage);
    setStartIndex((prevIndex) => Math.min(prevIndex, maxStartIndex));
  };
  useEffect(() => {
    setReviewsPerPage(getReviewsPerPage());
    setStartIndex(0);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Container maxWidth="md" className="mt-24 mb-24">
      <Typography variant="h2" className="pb-6 text-black font-bold text-[32px] md:text-[48px] lg:text-[61px] text-center mb-8">
        Hear from <span className="text-primary">our guest</span>
      </Typography>
      <Box className="flex flex-wrap -mx-4">
        {/* {reviews.slice(startIndex, startIndex + 4).map((review, index) => ( */}
        {reviews.slice(startIndex, startIndex + reviewsPerPage).map((review, index) => (
          <Grid item xs={12} sm={6} md={getReviewsPerRow()} key={index} className="pr-4 w-full md:w-1/2 lg:w-1/4">
            <Box className="flex flex-col w-full p-8 border border-gray-200 rounded-lg bg-white hover:bg-purple-200 transition-colors">
              <Box className="flex justify-center mb-4">
                <Image
                  height={32}
                  width={32}
                  src={review.image}
                  alt={`Review from ${review.country}`}
                  className="w-32 h-32 rounded-full -translate-y-1/2"
                />
              </Box>
              <Box className="flex-grow">
                <Typography variant="h6" className="text-[18px] text-center font-bold -mt-20">
                  {review.name}
                </Typography>
                <Typography variant="h6" className="text-[12px] text-center mb-8">
                  {review.country}
                </Typography>
                <Image src="/Review/quotation.svg" alt="Image 1" width={150} height={150} className="absolute -translate-y-20" />
                <Typography variant="body1" className="text-[14px] text-center mb-10 mt-20">
                  {review.review}
                </Typography>
                <Box className="flex justify-center">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index}>{index < review.stars ? <FaStar className="text-warning" /> : <FaRegStar className="text-warning" />}</span>
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Box>
      <Box display="flex" justifyContent="center" mt={2}>
        <button className="border-none bg-transparent mr-12" onClick={handlePrevious}>
          <BsArrowLeft size={50} className="text-primary font-bold" />
          {/* <Image src="/Review/PreviousArrow.svg" alt="Previous" width={50} height={50} /> */}
        </button>
        <button className="border-none bg-transparent" onClick={handleNext}>
          <BsArrowRight size={50} className="text-primary font-bold" />
          {/* <Image src="/Review/NextArrow.svg" alt="Next" width={50} height={50} /> */}
        </button>
      </Box>
    </Container>
  );
};

export default ReviewSection;
