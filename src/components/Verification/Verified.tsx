import { useCarListingContext } from '@/context/CarListingProvider';
import { useModalContext } from '@/context/ModalProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import CarListModal from '../GuestVerification/PartnerVerification/CarListModal';

const Verified = () => {
  const isIPadPro = useIPadProQuery();
  const { openModal } = useModalContext();
  const { handleAddNewListing } = useCarListingContext();
  const { verificationStatusFlags } = useSearchContext();
  const { userCred } = useUserCredContext();
  const handleVehicleList = () => {
    if (Object.values(verificationStatusFlags).some((value) => value === false)) {
      openModal({
        content: <CarListModal handleAddNewListing={handleAddNewListing} />,
      });
    } else {
      handleAddNewListing();
    }
  };
  const baseUrl = userCred?.loggedIn ? `/au/verify-account/${userCred?.userId}/?step=profile` : `/get-verified`;
  return (
    <Box className="w-full flex flex-col items-center justify-center">
      <Image src="/Verification/Verified.svg" alt="Picture" width={200} height={200} className="rounded-full" />
      <Typography variant="h1" className="text-lg md:text-xl lg:text-3xl font-bold py-4">
        The Account is already Verified.
      </Typography>
      <Typography variant="body1" className="text-gray-600 py-4 text-justify">
        {`Get started the journey with us. You'll be able to book instantly if you`}{' '}
        <Link target="_blank" href={baseUrl} className="text-primary inline-block no-underline font-bold">
          verify
        </Link>{' '}
        {`your details now.`}
      </Typography>
      {/* <div className={`flex flex-row items-center justify-center gap-2 ${isIPadPro ? 'mb-28' : 'mb-2 md:mb-10'}`}> */}
      {/* <Link target="_blank" className="no-underline" href="/car-listing"> */}
      {/* <Button
          onClick={handleVehicleList}
          variant="contained"
          size="large"
          className="normal-case rounded-3xl border-primary bg-white text-primary hover:bg-primary hover:text-white"
        >
          List your Car
        </Button> */}
      {/* </Link> */}
      {/* <Link target="_blank" className="no-underline" href={baseUrl}>
          <Button
            // onClick={handleListCarClick}
            variant="contained"
            size="large"
            className="normal-case rounded-3xl border-primary bg-white text-primary hover:bg-primary hover:text-white"
          >
            Verify your ID
          </Button>
        </Link> */}
      {/* </div> */}
    </Box>
  );
};

export default Verified;
