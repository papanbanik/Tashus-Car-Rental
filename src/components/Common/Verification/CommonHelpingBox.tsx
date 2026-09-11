'use client';
import { CommonHelpingBoxProps } from '@/types/user-verification/verificationListingSteps';
import Image from 'next/image';
import { useState } from 'react';
import { IoCheckmark } from 'react-icons/io5';
import CommonTextIcon from '../CommonTextIcon';
import CommonViewImageModal from '../CommonViewImageModal';

const CommonHelpingBox = ({ title, pictures = [], descriptions, showBorder }: CommonHelpingBoxProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

  const handleImageClick = (url: string) => {
    setCurrentImageUrl(url);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentImageUrl('');
  };
  const showBorderClass = showBorder ? 'border border-solid border-accent rounded-lg p-4 pt-8 h-full' : '';
  return (
    <div className={showBorderClass}>
      <span className="text-md font-bold">{title}</span>
      {pictures.length > 0 && (
        <div className="grid grid-cols-3 gap-2 my-4">
          {pictures?.map((pic, index) => (
            <div key={index} className="relative w-full pb-[calc(100%/1.2)] overflow-hidden rounded-md cursor-pointer">
              <Image
                src={pic}
                alt={`picture-${index}`}
                fill={true}
                // width={106} height={88}
                className="absolute inset-0 w-full h-full"
                onClick={() => handleImageClick(pic)}
              />
            </div>
          ))}
        </div>
      )}
      <div className="mt-4">
        {/* {descriptions.map((desc, index) => (
          <CommonTextIcon key={index} className="text-sm my-1" text={desc} startIcon={<IoCheckmark className="text-black mr-2" />} />
        ))} */}
        {Array.isArray(descriptions) ? (
          descriptions.map((desc: string, index: number) => (
            <div key={index} className="flex items-center my-1">
              <CommonTextIcon text={desc} wrapAround={true} textClassName="text-xs inline-block" startIcon={<IoCheckmark className="text-black" />} />
            </div>
          ))
        ) : (
          <span className="text-xs text-justify">{descriptions}</span>
        )}
      </div>
      <CommonViewImageModal isOpen={isModalOpen} handleClose={handleCloseModal} imageUrl={currentImageUrl} showFill={true} />
    </div>
  );
};

export default CommonHelpingBox;
