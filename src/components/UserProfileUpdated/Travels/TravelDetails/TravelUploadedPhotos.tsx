'use client';

import UpdatedCommonImgZoomInOutModal from '@/components/Common/ZoomInOutModal/UpdatedCommonImgZoomInOutModal';
import { TPhoto } from '@/types/commonTypes';
import { formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { Button } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { FaUpload } from 'react-icons/fa';

export interface ITravelUploadedPhotos {
  handleFunc: () => void;
  buttonText: string;
  partnerPhotos: TPhoto[];
  guestPhotos: TPhoto[];
  disableButton?: boolean;
  helpingText: string;
}

// Interface for TPhoto, assuming it has updatedAt
interface TPhotoWithTimestamp extends TPhoto {
  updatedAt: string | Date;
}

const TravelUploadedPhotos = ({ handleFunc, buttonText, partnerPhotos, guestPhotos, disableButton, helpingText }: ITravelUploadedPhotos) => {
  const [open, setOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('partnerPhotos');

  const handleClose = () => setOpen(false);
  const handleOpen = (index: number, activeSection: string) => {
    setCurrentIndex(index);
    setActiveSection(activeSection);
    setOpen(true);
  };

  const getCurrentImages = () => {
    if (activeSection === 'partnerPhotos') {
      return partnerPhotos?.map((item: TPhoto) => item?.imageInfo?.secure_url) || [];
    } else if (activeSection === 'guestPhotos') {
      return guestPhotos?.map((item: TPhoto) => item?.imageInfo?.secure_url) || [];
    }
    return [];
  };

  // Group photos by formatted updatedAt date
  const groupPhotosByDate = (photos: TPhotoWithTimestamp[]) => {
    const grouped: { [key: string]: TPhotoWithTimestamp[] } = {};
    photos.forEach((photo) => {
      const formattedDate = formatFullDateTime(photo.updatedAt);
      if (!grouped[formattedDate]) {
        grouped[formattedDate] = [];
      }
      grouped[formattedDate].push(photo);
    });
    return grouped;
  };

  const partnerPhotosGrouped = groupPhotosByDate(partnerPhotos as TPhotoWithTimestamp[]);
  const guestPhotosGrouped = groupPhotosByDate(guestPhotos as TPhotoWithTimestamp[]);

  const images = getCurrentImages();

  return (
    <div>
      <div className="flex items-center justify-center">
        <Button sx={{ border: 2, borderColor: 'grey.500' }} disabled={disableButton} className="flex flex-col normal-case p-4" onClick={handleFunc}>
          <FaUpload size={40} />
          <span>{buttonText}</span>
        </Button>
      </div>

      <div>
        <p className="font-bold m-0">Updated by Partner</p>
        <p className="helping_text">{helpingText}</p>
        {Object.keys(partnerPhotosGrouped).length > 0 ? (
          Object.entries(partnerPhotosGrouped).map(([date, photos], groupIndex) => (
            <div key={groupIndex} className="my-4">
              <p className="font-semibold m-0">{date}</p>
              <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4 my-4">
                {photos.map((photo: TPhoto, index: number) => (
                  <div key={index} className="col-span-1 relative w-full lg:h-[132px] h-[73px]">
                    <Image
                      src={photo?.imageInfo?.secure_url}
                      fill={true}
                      alt="photos"
                      style={{ objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => handleOpen(index, 'partnerPhotos')}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="m-0 w-full lg:col-span-6 md:col-span-4 col-span-2">No Photos Uploaded</p>
        )}
      </div>

      <div className="my-4">
        <p className="font-bold m-0">Updated by Guest</p>
        <p className="helping_text">{helpingText}</p>
        {Object.keys(guestPhotosGrouped).length > 0 ? (
          Object.entries(guestPhotosGrouped).map(([date, photos], groupIndex) => (
            <div key={groupIndex} className="my-4">
              <p className="font-semibold m-0">{date}</p>
              <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4 my-4">
                {photos.map((photo: TPhoto, index: number) => (
                  <div key={index} className="col-span-1 relative w-full lg:h-[132px] h-[73px]">
                    <Image
                      src={photo?.imageInfo?.secure_url}
                      fill={true}
                      alt="photos"
                      style={{ objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => handleOpen(index, 'guestPhotos')}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="m-0 w-full lg:col-span-6 md:col-span-4 col-span-2">No Photos Uploaded</p>
        )}
      </div>

      <UpdatedCommonImgZoomInOutModal
        open={open}
        handleClose={handleClose}
        modalImageSrc={images[currentIndex]}
        imageList={images}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
};

export default TravelUploadedPhotos;
