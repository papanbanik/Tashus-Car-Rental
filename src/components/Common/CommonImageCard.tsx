import { colorType } from '@/types/user-verification/userVerificationTypes';
import { getTextColorClass } from '@/utils/Functions/verification/verificationStyleFn';
import { Button, Chip, IconButton } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { MdOutlineFileUpload } from 'react-icons/md';
import CommonStatusBadge from './CommonStatusBadge';
import CommonViewImageModal from './CommonViewImageModal';

interface CommonImageCardProps {
  imageSrc?: string;
  updateButtonOnClick?: () => void;
  showUpdate?: boolean;
  alt?: string;
  width?: number;
  height?: number;
  imageFill?: boolean;
  showBadge?: boolean;
  badgeStatus?: string;
  imageClassNames?: string;
  divClassNames?: string;
  titleClassNames?: string;
  title?: string;
  showChip?: boolean;
  message?: string;
}

const CommonImageCard = ({
  imageSrc,
  imageFill,
  showBadge,
  badgeStatus,
  updateButtonOnClick,
  showUpdate,
  alt,
  width,
  height,
  imageClassNames,
  divClassNames,
  titleClassNames,
  title,
  showChip,
  message,
}: CommonImageCardProps) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      {showBadge ? (
        <div className="flex">
          {title && <span className={`${titleClassNames ?? ''}`}>{title}</span>}
          <CommonStatusBadge status={badgeStatus ?? 'pending'} showTooltip={true} />
        </div>
      ) : showChip ? (
        <>
          <div className="flex items-center gap-1">
            {title && <span className={`${titleClassNames ?? ''}`}>{title}</span>}
            <Chip
              label={`${badgeStatus ?? ''}`}
              size="small"
              className="capitalize"
              variant="outlined"
              color={getTextColorClass(badgeStatus ?? '') as colorType}
            />
          </div>
          {!!message && <span className="helping_text text-error">{message}</span>}
        </>
      ) : (
        <>{title && <span className={`${titleClassNames ?? ''}`}>{title}</span>}</>
      )}
      {imageSrc ? (
        <div className={`${divClassNames ?? 'w-full bg-gray-400 relative rounded-lg flex min-h-[150px] justify-center items-center group'}`}>
          <Image
            src={imageSrc}
            alt={alt || 'Image'}
            className={`${imageClassNames ?? 'object-cover rounded-lg'}`}
            {...(imageFill ? { fill: true } : { width: width || 500, height: height || 500 })}
            onClick={() => setModalOpen(true)}
          />
          {/* Black Overlay */}
          <div className="hover_black_overlay flex justify-center items-center rounded-lg">
            {showUpdate && (
              <Button size="small" className="normal-case text-lg font-semibold p-0 text-white" onClick={updateButtonOnClick}>
                <MdOutlineFileUpload size={20} className="text-white" />
              </Button>
            )}
            <IconButton onClick={() => setModalOpen(true)}>
              <FaEye className="text-white" />
            </IconButton>
            <CommonViewImageModal isOpen={isModalOpen} handleClose={() => setModalOpen(false)} imageUrl={imageSrc} />
          </div>
        </div>
      ) : (
        <div
          className={`border border-solid border-accent rounded-lg w-${width ? `[${width}px]` : 'full'} h-${
            height ? `[${height}px]` : ''
          } relative flex justify-start mt-4`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-md">{'No Image Attached'}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default CommonImageCard;
