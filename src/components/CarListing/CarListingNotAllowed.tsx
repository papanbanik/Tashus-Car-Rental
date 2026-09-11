'use client';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
const CarListingNotAllowed = () => {
  const isIPadPro = useIPadProQuery();
  return (
    <Box className="w-full flex flex-col items-center justify-center">
      <Image src="/Verification/Expired.svg" alt="Picture" width={200} height={200} className="rounded-full" />
      <Typography variant="h1" className={`text-lg md:text-xl lg:text-3xl font-bold py-4`}>
        {`OOPS! You are not allowed to list vehicle in this platform.`}
      </Typography>
      <Typography variant="body1" className={`text-gray-600 text-justify ${isIPadPro ? 'mb-28' : 'mb-2 md:mb-10'} `}>
        {`We regret to inform you that you cannot list a vehicle on Tashus rental platform. However, you can still rent any car available in our extensive collection. 
        If you need further assistance or have any questions, please do not hesitate to contact our support team. Thank you for your understanding and cooperation.`}
      </Typography>
    </Box>
  );
};

export default CarListingNotAllowed;
