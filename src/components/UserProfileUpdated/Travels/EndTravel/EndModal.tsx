'use client';

import { useModalContext } from '@/context/ModalProvider';
import { Button, Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

export interface IEndModal {
  isEndAllowed: boolean;
}

const EndModal = ({ isEndAllowed }: IEndModal) => {
  const router = useRouter();
  const pathName = usePathname();
  const { closeModal } = useModalContext();

  const handleContinueEnding = () => {
    // Ending travel is not allowed till 6 hours of its return time
    if (isEndAllowed) {
      // router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}/end-travel?view=parking`);
      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}/end-travel?view=photos`);
      closeModal();
    } else {
      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}/edit-travel`);
      closeModal();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Typography className="font-bold md:text-2xl text-lg mb-2">Continue ending travel?</Typography>
      {/* <Typography className="font-bold md:text-2xl text-lg mb-2">Do you want to End Your Travel?</Typography> */}
      {!isEndAllowed && (
        <p className="helping_text text-center">
          Travel ending is not allowed until a minimum of 6 hours prior to your designated return time. To proceed with the completion of your travel,
          it is necessary to update your end time accordingly.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 my-10">
        <Button
          onClick={closeModal}
          sx={{ border: 2 }}
          color="error"
          variant="outlined"
          className="font-bold hover:bg-error hover:text-white normal-case text-md"
        >
          Close
        </Button>
        <Button variant="contained" color="primary" fullWidth className="normal-case font-bold text-md" onClick={handleContinueEnding}>
          {!isEndAllowed ? 'Update Travel' : 'Continue'}
          {/* {!isEndAllowed ? 'Update Travel' : 'Continue to End Travel'} */}
        </Button>
      </div>
    </div>
  );
};

export default EndModal;
