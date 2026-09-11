'use client';

import { useState } from 'react';
import Image from 'next/image';
import { convertToThousandSeparator } from '@/utils/Functions/randomCommonFn';
import UpdatedCommonImgZoomInOutModal from '@/components/Common/ZoomInOutModal/UpdatedCommonImgZoomInOutModal';

interface ViewReservedVehicleInfoProps {
  odometerPhotoSecureUrl?: string;
  odometerValue?: number;
}

const ViewReservedVehicleInfo = ({ odometerPhotoSecureUrl, odometerValue }: ViewReservedVehicleInfoProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>('');
  const handleOpen = (photoUrl: string) => {
    setModalImageSrc(photoUrl);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      <div>
        <p className="mb-0 flex md:flex-row flex-col justify-between w-full">
          <span className="text-lg font-semibold">Odometer Reading:</span>
          <span className="text-md">{odometerValue ? `${convertToThousandSeparator(odometerValue)} KM` : 'Not Added'}</span>
        </p>

        <p className="text-lg font-semibold mb-2">Odometer Photo:</p>

        <div className="w-full relative h-60">
          {odometerPhotoSecureUrl ? (
            <Image
              src={odometerPhotoSecureUrl}
              alt="CarImage"
              objectFit="contain"
              className="object-contain rounded-lg cursor-pointer"
              fill={true}
              onClick={(event) => {
                handleOpen(odometerPhotoSecureUrl);
              }}
            />
          ) : (
            <div className="car_details_no_photo w-full" style={{ border: '1px solid gray' }}>
              No Photo
            </div>
          )}
        </div>
      </div>
      <UpdatedCommonImgZoomInOutModal handleClose={handleClose} open={open} modalImageSrc={modalImageSrc} />
    </>
  );
};

export default ViewReservedVehicleInfo;
