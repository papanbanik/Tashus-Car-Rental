'use client';

import { useModalContext } from '@/context/ModalProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { CommonModalProps } from '@/types/componentTypes';
import { Dialog, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { IoCloseSharp } from 'react-icons/io5';
import { MdArrowBack } from 'react-icons/md';

const CommonModal = ({ title, children, maxWidth }: CommonModalProps) => {
  const { isModalOpen, closeModal, scroll } = useModalContext();
  const { signUpStep, setSignUpStep } = useUserCredContext();
  const { current, previous } = signUpStep;

  return (
    <Dialog
      fullWidth
      maxWidth={maxWidth || 'sm'}
      open={isModalOpen}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title" className="text-center font-bold relative">
        {title === 'Login or Sign Up' && previous && current !== 'email-resend' && (
          <Tooltip enterTouchDelay={0} title="Back">
            <IconButton className="absolute top-3 left-2" onClick={() => setSignUpStep({ current: previous, previous: '' })}>
              <MdArrowBack />
            </IconButton>
          </Tooltip>
        )}

        {title}
        <IconButton className="text-error absolute top-3 right-2" onClick={closeModal}>
          <IoCloseSharp />
        </IconButton>
      </DialogTitle>
      <DialogContent className="pt-2">{children}</DialogContent>
    </Dialog>
  );
};

export default CommonModal;
