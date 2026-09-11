'use client';
import SignUp from '@/components/SignUp/SignUp';
import { useModalContext } from '@/context/ModalProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useHealthCheck } from '@/hooks/useHealthCheck';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { FaArrowRight } from 'react-icons/fa6';
import GetVerifiedStepsButton from './GetVerifiedStepsButton';
import VerificationStepper from './VerificationStepper';

const UserVerification = () => {
  useHealthCheck();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { userCred } = useUserCredContext();
  const { openModal } = useModalContext();
  const handleSignUp = async () => {
    openModal({
      title: 'Login or Sign Up',
      content: (
        <div className="md:mx-4 md:my-2">
          <SignUp></SignUp>
        </div>
      ),
    });
  };
  return (
    <div>
      <Typography className="pt-4" variant={isSmallScreen ? 'h6' : 'h4'} align="left">
        <div className="columns-1 md:ml-24">
          <span className="bg-primary text-white p-1 rounded-md font-bold font-poppins ">GET APPROVED QUICKLY</span>{' '}
          <span className="font-bold">and </span>
          <p className="py-0 my-1 font-poppins font-semibold">Hit The Road With Confidence!</p>
        </div>
      </Typography>

      <div className="my-4">
        <VerificationStepper />
      </div>
      <div className="ml-24">
        {userCred?.loggedIn ? (
          <GetVerifiedStepsButton />
        ) : (
          <Button variant="contained" color="success" className="normal-case" endIcon={<FaArrowRight />} onClick={handleSignUp}>
            Sign up
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserVerification;
