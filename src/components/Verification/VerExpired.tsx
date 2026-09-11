'use client';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

const VerExpired = () => {
  const isIPadPro = useIPadProQuery();
  return (
    <Box className="w-full flex flex-col items-center justify-center">
      <Image src="/Verification/Expired.svg" alt="Picture" width={200} height={200} className="rounded-full" />
      <Typography variant="h1" className={`text-lg md:text-xl lg:text-3xl font-bold py-4`}>
        {`OOPS! Verification Link Expired.`}
      </Typography>
      <Typography variant="body1" className={`text-gray-600 text-justify ${isIPadPro ? 'mb-28' : 'mb-2 md:mb-10'} `}>
        {`We regret to inform you that the verification link has expired. Kindly request a new link to proceed with the verification process. Thank you
        for your understanding and cooperation.`}
      </Typography>
    </Box>
  );
};

export default VerExpired;
