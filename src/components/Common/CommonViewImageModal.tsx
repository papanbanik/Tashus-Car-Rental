'use client';
import { Fade, Modal } from '@mui/material';
import Image from 'next/image';

interface CommonViewImageModalProps {
  isOpen: boolean;
  handleClose: () => void;
  imageUrl: string;
  showFill?: boolean;
}

const CommonViewImageModal = ({ isOpen, handleClose, imageUrl, showFill }: CommonViewImageModalProps) => {
  return (
    <Modal className="flex items-center justify-center" open={isOpen} onClose={handleClose} closeAfterTransition>
      <Fade in={isOpen}>
        <div className="bg-neutral border-2 border-black shadow-md p-4 md:p-8 flex items-center">
          <Image
            src={imageUrl}
            alt="View"
            width={500}
            height={500}
            // className="object-scale-down"
            className={showFill ? 'object-fill' : 'object-scale-down'}
          />
        </div>
      </Fade>
    </Modal>
  );
};

export default CommonViewImageModal;
