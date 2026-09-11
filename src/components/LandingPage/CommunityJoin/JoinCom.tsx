'use client';
'use client';
import { Box, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

const JoinCom: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const [animationTriggered, setAnimationTriggered] = useState(false);
  const text = `Join Tashus, your gateway to hassle-free travel! Cruise through Sydney, Melbourne, Brisbane, and more with our eco-friendly car rental and rental services. Whether it's a quick ride or a long journey, we promise seamless experiences. Unlock our diverse fleet today and reserve your ride effortlessly!`;
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animationTriggered) {
          let currentIndex = 0;
          const interval = setInterval(() => {
            setTypedText((prevText) => {
              if (currentIndex === text.length) {
                clearInterval(interval);
                setAnimationTriggered(true); // Animation has been triggered
                return prevText;
              }
              currentIndex++;
              return text.substring(0, currentIndex);
            });
          }, 25); // Typing speed in milliseconds

          return () => clearInterval(interval);
        }
      },
      { threshold: 0.5 }
    );

    if (boxRef.current) {
      observer.observe(boxRef.current);
    }

    return () => {
      if (boxRef.current) {
        observer.unobserve(boxRef.current);
      }
    };
  }, [animationTriggered]); // Run effect only when animationTriggered changes

  return (
    <Box className="flex-1 text-center my-20 lg:mb-20 mt-8 lg:min-h-[220px]" ref={boxRef}>
      <Box>
        <Typography variant="h1" className="font-bold text-black text-center mb-8 text-[24px] lg:text-[40px]">
          Join our expanding network of <br></br> <span className="text-primary">Car Rental</span>
          <span className="text-success"> & </span>
          <span className="text-primary">Rental Service </span>
          provider
        </Typography>
      </Box>
      <Typography variant="body1" className="text-gray-600 mb-4 text-lg lg:text-xl">
        {/* {typedText} */}
        {`Join Tashus, your gateway to hassle-free travel. Cruise through Sydney, Melbourne, Brisbane, and more with our eco-friendly car rental and
        rental services. Whether it's a quick ride or a long journey, we promise seamless experiences. Unlock our diverse fleet today and reserve your
        ride effortlessly!`}
      </Typography>
    </Box>
  );
};

export default JoinCom;
