// Import Tailwind CSS
'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { Box, Button, Theme, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ThankYou = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const { handleAddNewListing } = useCarListingContext();
  const {
    userCred: { userId },
  } = useUserCredContext();
  const router = useRouter();
  return (
    <Box
      maxWidth={isSmallScreen ? 320 : 820}
      mx="auto"
      p={0}
      mb={8}
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      className="bg-white rounded-lg shadow-md"
    >
      <Box width="100%" mb={isSmallScreen ? 0 : 4}>
        <Image
          src="/Images/Tashus_thankYou_HandShake.svg"
          alt="Thank You"
          layout="responsive" // Use responsive layout
          width={530} // Set the initial width in pixels
          height={251}
          className="mx-auto"
        />
      </Box>

      <Box>
        <p className="text-md md:text-lg font-bold mb-2 mt-0 px-4 md:px-6 lg:px-8">{`Congratulations! You've become a partner with Tashus!`}</p>
        <p className="text-base mb-2 mt-0 px-4 md:px-6 lg:px-8">
          Your car is now an integral part of our shared adventure. Our dedicated team will review your listing shortly to ensure a seamless
          experience for all which might take couple of hours. If you have any questions, feel free to knock on our support channel.
        </p>
      </Box>

      <hr className="w-1/2 mx-auto mb-2 mt-4" />

      <Typography variant="body1" className="text-base">
        <strong>Team Tashus</strong>
      </Typography>

      <Box mt={4} mb={4} className="flex flex-col md:flex-row gap-4 justify-center items-center w-full md:w-420">
        {/* <a href="/car-listing" className="w-full md:w-40"> */}
        <Button onClick={handleAddNewListing} variant="contained" color="primary" className="w-full cursor-pointer">
          <span className="whitespace-nowrap mx-3">List Another Car</span>
        </Button>
        {/* </a> */}
        {/* <a href="/" className="w-full md:w-40"> */}
        <Button
          onClick={() => router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userId}/vehicles`)}
          variant="contained"
          color="success"
          className="w-full cursor-pointer px-3"
        >
          Listed Vehicles
        </Button>
        {/* </a> */}
      </Box>
    </Box>
  );
};

export default ThankYou;
