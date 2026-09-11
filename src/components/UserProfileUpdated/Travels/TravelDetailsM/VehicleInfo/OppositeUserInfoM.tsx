'use client';
import CommonRating from '@/components/Common/CommonRating';
import UpdatedCommonImgZoomInOutModal from '@/components/Common/ZoomInOutModal/UpdatedCommonImgZoomInOutModal';
import { useTravelContext } from '@/context/TravelProvider';
import { TOppositeUserInfo } from '@/types/travels/typeTravels';
import { formatToMonthYear } from '@/utils/Functions/dateTimeCommonFn';
import { getUserFullName } from '@/utils/Functions/randomCommonFn';
import Image from 'next/image';
import React, { useState } from 'react';
import { BsDot } from 'react-icons/bs';
import { IoIosCall } from 'react-icons/io';
import { TiStar } from 'react-icons/ti';

export interface IOppositeUserInfo {
  userInfo: TOppositeUserInfo;
}
const OppositeUserInfoM = ({ userInfo }: IOppositeUserInfo) => {
  const { updatedTravelData } = useTravelContext();
  const [open, setOpen] = useState<boolean>(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>('');

  const handleClose = () => setOpen(false);

  return (
    <>
      <div className=" w-full bg-white shadow-md shadow-secondary rounded-lg  ml-0 sm:ml-4  mt-5 relative">
        <div className=" flex flex-col sm:flex-row justify-between items-center max-h-full mx-3 relative my-3 px-5 py-4">
          <div className="flex w-full">
            {userInfo?.profilePhoto && (
              <div className=" relative w-16 h-16">
                <Image
                  onClick={() => {
                    setModalImageSrc(userInfo?.profilePhoto);
                    setOpen(true);
                  }}
                  src={`${userInfo?.profilePhoto}`}
                  alt="CarImage"
                  className="object-cover rounded-full cursor-pointer"
                  fill={true}
                />
              </div>
            )}

            <div className=" ms-4">
              <div className="font-semibold">{getUserFullName(userInfo?.firstName, userInfo?.middleName, userInfo?.lastName)}</div>
              <div>
                {updatedTravelData?.isUserGuest ? (
                  <>
                    {userInfo?.hostTotalTrips} {`Travel${userInfo?.hostTotalTrips || 0 > 1 ? 's' : ''} `}
                  </>
                ) : (
                  <>
                    {userInfo?.guestTotalTrips} {`Travel${userInfo?.guestTotalTrips || 0 > 1 ? 's' : ''} `}
                  </>
                )}
                <span>
                  <BsDot /> {formatToMonthYear(userInfo?.joinedDate)}
                </span>
              </div>

              <div className=" py-0.5 px-1 flex items-center">
                {updatedTravelData?.isUserGuest ? (
                  <CommonRating
                    initialRating={
                      !userInfo?.hostRatingCount || userInfo?.hostRatingTotal == null
                        ? 0
                        : parseFloat(((userInfo?.hostRatingTotal ?? 0) / userInfo?.hostRatingCount).toFixed(2))
                    }
                    emptyIcon={<TiStar />}
                    readOnly
                    size="small"
                    showRatingNumber={true}
                    noMaxRating={true}
                    typographyProps={{ className: 'text-sm md:text-md' }}
                  />
                ) : (
                  <CommonRating
                    initialRating={
                      !userInfo?.guestRatingCount || userInfo?.guestRatingTotal == null
                        ? 0
                        : parseFloat(((userInfo?.guestRatingTotal ?? 0) / userInfo?.guestRatingCount).toFixed(2))
                    }
                    emptyIcon={<TiStar />}
                    readOnly
                    size="small"
                    showRatingNumber={true}
                    noMaxRating={true}
                    typographyProps={{ className: 'text-sm md:text-md' }}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            className="border mt-2 sm:mt-0 w-full sm:w-3/12 border-primary rounded-full flex items-center py-1 px-2  space-x-2 me-3"
            style={{ border: '1px solid purple' }}
          >
            <IoIosCall size={20} className="text-primary" />
            <span className="text-primary font-medium">{userInfo?.phoneNumber ?? ''}</span>
          </div>
        </div>
      </div>

      <UpdatedCommonImgZoomInOutModal handleClose={handleClose} open={open} modalImageSrc={modalImageSrc} />
    </>
  );
};

export default OppositeUserInfoM;
