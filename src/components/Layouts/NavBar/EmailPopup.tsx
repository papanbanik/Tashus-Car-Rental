'use client';
import EmailVerModal from '@/components/Search/ReservationCheckout/Verification/EmailVerModal';
import { useModalContext } from '@/context/ModalProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { Button, IconButton, Snackbar } from '@mui/material';
import { usePathname } from 'next/navigation';

import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';

const EmailPopup = () => {
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const { userCred, userProfileInfo } = useUserCredContext();
  const { openModal } = useModalContext();
  const pathName = usePathname();

  useEffect(() => {
    if (userCred?.loggedIn && !!userProfileInfo?.verificationInfo?.email && !userProfileInfo?.verificationInfo?.email?.isVerified) {
      setSnackbarOpen(true);
    } else if (pathName.includes('activate')) {
      setSnackbarOpen(false);
    } else {
      setSnackbarOpen(false);
    }
  }, [userCred?.loggedIn, userProfileInfo?.verificationInfo?.email, pathName]);

  const handleVerifyEmail = () => {
    openModal({
      title: 'Email Verification',
      content: <EmailVerModal />,
    });
  };
  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      className="fixed bottom-20 md:bottom-0 md:left-0 z-50 w-full md:w-1/3"
    >
      <div className="flex items-center p-4 bg-gray-700 rounded-lg text-white w-full m-2">
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <span className="text-sm">{'Verify your email by clicking the link'}</span>
            <Button variant="outlined" className="normal-case" color="inherit" size="small" onClick={handleVerifyEmail}>
              Confirm Email
            </Button>
          </div>
        </div>
        <IconButton aria-label="close" onClick={() => setSnackbarOpen(false)} className="text-white">
          <IoClose />
        </IconButton>
      </div>
    </Snackbar>
  );
};

export default EmailPopup;
