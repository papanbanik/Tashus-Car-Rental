'use client';

import CommonRating from '@/components/Common/CommonRating';
import UpdatedCommonImgZoomInOutModal from '@/components/Common/ZoomInOutModal/UpdatedCommonImgZoomInOutModal';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { ReservationPaymentStatusEnum, TReservationStatus } from '@/types/commonTypes';
import { isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { toFormattedNumber } from '@/utils/Functions/randomCommonFn';
import { formatFullDateTimeUtc } from '@/utils/Functions/utcCommonFn';
import { Button } from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { FaCalendarCheck } from 'react-icons/fa';
import { FaArrowRightLong } from 'react-icons/fa6';
import { MdCancel, MdVerified } from 'react-icons/md';
import { RiVerifiedBadgeLine } from 'react-icons/ri';
import { TiStar } from 'react-icons/ti';
import JourneyDark from '../../../../../../../public/icons/VehicleIcons/JourneyDark.svg';
import { handleRedirectToVehicleDetails } from '../../ActionFn';
import { getReservationStatusClassName } from '../../VehicleDetailsFn';
import OppositeUserInfoM from '../OppositeUserInfoM';
interface ReservationVehicleCardProps {
  timeRemaining?: string;
  isTravelEnded?: boolean;
  isTravelCancelled?: boolean;
  isLatePickupTravel?: boolean;
  isTravelStarted?: boolean;
  handleVerifyGuest?: () => void;
  isGuestVerified?: boolean;
  rentDueAmount: number;
  additionalFeeDue: number;
  disablePayButton?: boolean;
  dueHelpingText?: string;
  paymentStatus: ReservationPaymentStatusEnum;
  handleCompleteConfirmation?: () => void;
  handleCancelUpcomingReservation?: () => void;
  handleCancelCurrentReservation?: () => void;
  handleCopy?: () => void;
  handlePartnerEndTravel?: () => void;
  isPending?: boolean;
}

export default function ReservationVehicleCard({
  isTravelEnded,
  isTravelCancelled,
  isLatePickupTravel,
  handleVerifyGuest,
  isGuestVerified,
  handleCompleteConfirmation,
  handleCancelCurrentReservation,
  handleCancelUpcomingReservation,
  isPending,
  handlePartnerEndTravel,
}: ReservationVehicleCardProps) {
  const { travelDetails, guestAccess, partnerAccess } = useProfileInfoContext();
  const { updatedTravelData } = useTravelContext();

  const [open, setOpen] = useState<boolean>(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>('');

  const handleClose = () => setOpen(false);

  useEffect(() => {}, [updatedTravelData]);

  return (
    <>
      <div className=" w-full bg-white shadow-md shadow-secondary rounded-lg ml-4  mt-5 relative">
        <div className="flex  justify-between max-h-full px-5 mt-3 pb-4 pt-3">
          <div className="w-full flex  justify-start px-5 ">
            <div>
              {travelDetails?.coverPhoto?.secureUrl && (
                <div className="relative w-16 h-16">
                  <Image
                    onClick={() => {
                      setModalImageSrc(travelDetails?.coverPhoto?.secureUrl);
                      setOpen(true);
                    }}
                    src={`${travelDetails?.coverPhoto?.secureUrl}`}
                    alt="CarImage"
                    className="object-cover rounded-full cursor-pointer"
                    fill={true}
                  />
                </div>
              )}
            </div>

            <div className=" flex flex-col  justify-start max-h-full ml-3 ">
              <div className="text-left">
                <span
                  className="md:whitespace-nowrap text-start text-2xl font-bold no-underline hover:underline cursor-pointer"
                  onClick={() => {
                    if (handleRedirectToVehicleDetails) {
                      handleRedirectToVehicleDetails(travelDetails?.carListingId ?? 0);
                    }
                  }}
                >
                  {travelDetails?.carInfo?.car?.model ?? ''}
                </span>
                <span className="md:whitespace-nowrap text-start text-xs flex text-primary">
                  {travelDetails?.carInfo?.carNickName ? <span>{travelDetails?.carInfo?.carNickName}</span> : ''}
                </span>
              </div>

              <div className="flex items-center my-1">
                <div className=" flex justify-center ">
                  <div className="">
                    <CommonRating
                      initialRating={
                        travelDetails?.carInfo?.ratingsReceivedFrom === 0
                          ? 0
                          : parseFloat((travelDetails?.carInfo?.totalRatings / travelDetails?.carInfo?.ratingsReceivedFrom)?.toFixed(2))
                      }
                      emptyIcon={<TiStar />}
                      readOnly
                      size="small"
                      showRatingNumber={true}
                      noMaxRating={true}
                      typographyProps={{ className: 'text-sm md:text-md' }}
                    />
                  </div>
                </div>
                <div className="h-6 w-px bg-gray-300 mx-2"></div>

                <div className="flex items-center mr-2 p-0 m-0">
                  <span className="flex gap-1 items-center justify-end">
                    <JourneyDark className="text-xl" />
                    {travelDetails?.carInfo?.totalTrips} {`Travel${travelDetails?.carInfo?.totalTrips > 1 ? 's' : ''} `}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5">
            <div className="absolute right-0 top-8 pe-2 transform -translate-y-1/2 text-sm">
              Rental Fees:
              <span className="text-primary text-base font-bold">${toFormattedNumber(updatedTravelData?.hostRentalFees?.toFixed(2))}</span>
            </div>

            <div className="absolute right-0 top-16 transform -translate-y-1/2">
              <span
                className={`font-semibold text-sm pl-4 pe-16 py-2 rounded-l-full capitalize ${getReservationStatusClassName(
                  travelDetails?.reservationStatus || ''
                )}`}
              >
                {travelDetails?.reservationStatus === 'cancelledByGuest' ||
                travelDetails?.reservationStatus === 'cancelledByHost' ||
                travelDetails?.reservationStatus === 'cancelled'
                  ? 'Cancelled'
                  : travelDetails?.reservationStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="w-[90%]  ml-10 mr-10 h-px bg-gray-300 "></div>

        <div className="flex justify-between items-center px-5 ">
          <div className="flex justify-start items-center md:gap-2 p-5">
            <div className="flex justify-center">
              <Image
                src="/icons/FromTo/EnabledFromTo.svg"
                alt="FromTo"
                width={90}
                height={70}
                className="object-cover rounded-lg w-auto md:h-8 h-8 m-1 mr-2 lg:mr-0"
              />
            </div>

            <div className="flex  lg:gap-4 md:gap-2 gap-1">
              <div className={`md:block`}>
                <p className={'m-0 lg:text-sm text-sm'}> {isTravelEnded ? 'Started At' : 'Starts From'} </p>
                <p className={'m-0 lg:text-sm text-sm'}> {isTravelEnded ? 'Ended At' : 'End At'}</p>
              </div>
              <div className="font-bold">
                <p className={'m-0 lg:text-sm text-sm'}>{formatFullDateTimeUtc(updatedTravelData?.pickupDate)}</p>
                <p className={'m-0 lg:text-sm text-sm'}>{formatFullDateTimeUtc(updatedTravelData?.returnDate)}</p>
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          <div className="flex justify-end items-center md:gap-2 p-4">
            <div className="flex  lg:gap-4 md:gap-2 gap-1">
              <div className={`md:block`}>
                <p className={'m-0 lg:text-sm text-sm'}> Reserved: </p>
                {updatedTravelData?.reservedAt !== updatedTravelData?.createdAt && <p className={'m-0 lg:text-sm text-sm'}> Updated:</p>}
              </div>
              <div className="font-bold">
                <p className={'m-0 lg:text-sm text-sm'}> {formatFullDateTime(updatedTravelData?.reservedAt)}</p>

                {updatedTravelData?.reservedAt !== updatedTravelData?.createdAt && (
                  <p className={'m-0 lg:text-sm text-sm'}> {formatFullDateTime(updatedTravelData?.createdAt)}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-[90%]  ml-10 mr-10 h-px bg-gray-300 "></div>

        <div className="flex justify-between items-center px-5 pb-2">
          <div className="flex justify-start items-center md:gap-2 p-2 ">
            <Button
              variant="text"
              color="primary"
              className="text-sm normal-case font-bold hover:text-success underline  pe-0"
              onClick={() => {
                if (handleRedirectToVehicleDetails) {
                  handleRedirectToVehicleDetails(travelDetails?.carListingId ?? 0);
                }
              }}
            >
              View Vehicle Details
            </Button>
            <span className="  mt-1.5 text-primary">
              <FaArrowRightLong />
            </span>
          </div>
          {(travelDetails?.reservationStatus as TReservationStatus) === 'adminCompleted' ? (
            <div className="p-4 text-error">Travel has been ended by Admin</div>
          ) : (
            <div className="flex justify-between items-center  p-4">
              <div className="font-semibold text-sm ">
                <Button
                  className="normal-case rounded-full py-2 px-12 text-sm font-semibold"
                  disabled={isTravelCancelled || updatedTravelData?.travelType === 'past'}
                  variant="outlined"
                  size="small"
                  color="error"
                  fullWidth
                  onClick={updatedTravelData?.travelType === 'current' ? handleCancelCurrentReservation : handleCancelUpcomingReservation}
                  startIcon={<MdCancel />}
                >
                  Cancel
                </Button>
              </div>
              {!isTravelEnded && !isTravelCancelled && (
                <div className="flex font-semibold text-sm ms-3 w-full sm:w-1/2">
                  <Button
                    className="normal-case rounded-full py-2  px-6 text-sm font-semibold"
                    variant="outlined"
                    size="small"
                    color="primary"
                    fullWidth
                    onClick={handlePartnerEndTravel}
                    startIcon={<FaCalendarCheck />}
                  >
                    End Travel
                  </Button>
                </div>
              )}
              {travelDetails?.tripInformation?.tripEndingInfo?.isEndedByGuest ? (
                <div className="flex font-semibold text-sm ms-3">
                  <Button
                    className=" normal-case rounded-full py-2 px-12 text-sm font-semibold"
                    variant="contained"
                    size="small"
                    color="primary"
                    fullWidth
                    onClick={handleCompleteConfirmation}
                    disabled={travelDetails?.reservationStatus === 'completed'}
                    startIcon={<CiEdit />}
                  >
                    Confirm Completion
                  </Button>
                </div>
              ) : updatedTravelData?.travelType !== 'past' ? (
                <div className="flex font-semibold text-sm ms-3">
                  <Button
                    className=" normal-case rounded-full py-2 px-12 text-sm font-semibold"
                    variant="contained"
                    size="small"
                    color="primary"
                    fullWidth
                    onClick={handleVerifyGuest}
                    disabled={isPartnerRestrict(partnerAccess) || isTravelCancelled}
                    startIcon={isGuestVerified ? <MdVerified /> : <RiVerifiedBadgeLine />}
                  >
                    {isGuestVerified ? 'Verified' : 'Verify Guest'}
                  </Button>
                </div>
              ) : (
                ''
              )}
            </div>
          )}
        </div>
      </div>

      <OppositeUserInfoM userInfo={updatedTravelData?.oppositeUserInfo} />
      <UpdatedCommonImgZoomInOutModal handleClose={handleClose} open={open} modalImageSrc={modalImageSrc} />
    </>
  );
}
