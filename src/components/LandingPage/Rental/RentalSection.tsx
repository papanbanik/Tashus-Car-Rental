'use client';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useModalContext } from '@/context/ModalProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { Box, Typography, useMediaQuery } from '@mui/material';
import Button from '@mui/material/Button';
import Image from 'next/image';
import React from 'react';

const RentalSection: React.FC = () => {
  const isSmallScreen = useMediaQuery('(max-width:800px)');

  const { isModalOpen, openModal } = useModalContext();
  const {
    userCred: { loggedIn },
  } = useUserCredContext();
  const { handlePublicListingButton } = useCarListingContext();

  return (
    <Box className="flex flex-col-reverse lg:flex-row justify-between items-center p-4 mb-24 mt-14 md:mt-16">
      <Box className="flex-1 text-center lg:text-right lg:pr-8">
        <Box>
          <Typography variant="h2" className="font-bold text-black mt-5 lg:mt-0 text-center lg:text-right mb-8 text-[32px] lg:text-[48px] ">
            Your <span className="text-primary">vehicle </span>
            <span className="text-black">can help you </span>
            <span className="text-primary">earn money</span>
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" className="text-gray-600 mb-4 text-[16px] lg:text-[20px]">
            Your vehicle has the potential to become a source of income for you. Discover how you can turn your car into a moneymaker.
          </Typography>

          <Button onClick={handlePublicListingButton} variant="contained" color="primary" className="search normal-case text-[14px] lg:text-[16px]">
            Rent Your Car
          </Button>
        </Box>
      </Box>
      <Box className="flex-1 lg:pl-8">
        <Image
          src="/Rental/Tashus-Your-vehicle-can-help-you-earn-money.svg"
          alt="Your vehicle can help you earn money Tashus"
          className="max-w-full h-auto rounded-lg"
          width={isSmallScreen ? 320 : 620}
          height={isSmallScreen ? 320 : 620}
        />
      </Box>
    </Box>
  );
};

export default RentalSection;
