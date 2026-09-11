'use client';
import { useModalContext } from '@/context/ModalProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FaArrowCircleRight } from 'react-icons/fa';

// function VerifyAccount() {
const VerifyAccount = () => {
  const { openModal } = useModalContext();
  const { userCred } = useUserCredContext();
  const router = useRouter();
  // const handleVerifyAccount = () => {
  //   userCred.loggedIn
  //     ? router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/on-boarding/verification`)
  //     : openModal({
  //         title: 'Login or Sign Up',
  //         content: (
  //           <div className="md:mx-4 md:my-2">
  //             <SignUp></SignUp>
  //           </div>
  //         ),
  //       });
  // };
  return (
    <div
      className="min-h-[450px] lg:min-h-[400px] xl:min-h-[440px] lg:h-full w-full lg:w-screen commonMarginBottom"
      style={{
        backgroundImage: 'url("/Hero/VerifyBG2.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="pt-12 lg:px-32 xl:px-52 md:px-24 px-2 mx-auto max-w-[1600px] items-center">
        <Typography className="text-center text-[16px] lg:text-[24px] font-semibold " style={{ marginBottom: '-6px' }}>
          Unlock Seamless Car Rental
        </Typography>
        <Typography className="text-[24px] lg:text-[40px] text-primary text-center font-bold">Verify Your Account Today</Typography>
        <Typography className="text-[16px] text-center mt-4 mx-6">
          {`Experience hassle-free car rental Sydney by verifying your account today. Enjoy instant access to listing your car or booking a ride with cheap van rental Sydney options anytime. Account verification ensures added security and smooth transactions for all users. Don’t wait – verify your account now and unlock the full benefits of being a trusted, verified member!
`}
        </Typography>

        <div className="flex items-center justify-center mt-8">
          {/* <button
            className="bg-primary text-white font-semibold  py-1 px-4 rounded-full text-[14px] flex items-center justify-center border-none cursor-pointer"
            onClick={() => (window.location.href = '/on-boarding/verification')}
          >
            Verify Account
            <span className="ml-3">
              <ArrowCircleRightIcon style={{ fontSize: 25 }} />
            </span>
          </button> */}
          <Button
            className="normal-case bg-primary text-white font-semibold hover:bg-[#5C8D07] py-1 px-4 rounded-full text-[14px] flex items-center justify-center border-none cursor-pointer"
            onClick={() => router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/get-verified`)}
            endIcon={<FaArrowCircleRight />}
          >
            Verify Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
