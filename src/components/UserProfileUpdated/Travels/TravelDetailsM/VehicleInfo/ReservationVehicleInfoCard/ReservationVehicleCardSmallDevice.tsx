'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { ReservationPaymentStatusEnum, TReservationStatus } from '@/types/commonTypes';
import { isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { toFormattedNumber } from '@/utils/Functions/randomCommonFn';
import { formatFullDateTimeUtc } from '@/utils/Functions/utcCommonFn';
import { Button } from '@mui/material';
import Image from 'next/image';
import { AiOutlineQrcode } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { FaCalendarAlt, FaCalendarCheck, FaCopy, FaStar } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import JourneyDark from '../../../../../../../public/icons/VehicleIcons/JourneyDark.svg';
import { handleRedirectToVehicleDetails } from '../../ActionFn';
import { getReservationStatusClassName } from '../../VehicleDetailsFn';
import OppositeUserInfoM from '../OppositeUserInfoM';

interface ReservationVehicleCardSmallDeviceProps {
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
  reservationId?: string;
  isCopy?: boolean;
}

export default function ReservationVehicleCardSmallDevice({
  isTravelEnded,
  isTravelCancelled,
  isLatePickupTravel,
  handleVerifyGuest,
  isGuestVerified,
  handleCompleteConfirmation,
  handleCancelCurrentReservation,
  handleCancelUpcomingReservation,
  isPending,
  reservationId,
  isCopy,
  handleCopy,
  handlePartnerEndTravel,
}: ReservationVehicleCardSmallDeviceProps) {
  const { updatedTravelData } = useTravelContext();
  const { travelDetails, partnerAccess } = useProfileInfoContext();
  return (
    <>
      <div className=" w-full bg-white shadow-md shadow-secondary rounded-lg ml-0 sm:ml-4  mt-5 relative">
        {/* Price */}

        <span className="absolute right-0 top-12 transform -translate-y-1/2">
          {/* {reservationPendingStatus?.includes(paymentStatus) && updatedTravelData?.isUserGuest && ( */}
          <div className="flex flex-col gap-1 justify-end items-end">
            <div className="flex flex-col">
              <span className="bg-success md:text-sm text-white p-0 font-semibold text-sm px-4 py-2 rounded-l-full capitalize">
                ${toFormattedNumber(updatedTravelData?.hostRentalFees)}
              </span>
            </div>
          </div>
          {/* )} */}
        </span>
        <span className="flex flex-col justify-start absolute left-0 top-12 transform -translate-y-1/2">
          <span
            className={`m-0  md:text-sm p-0 font-semibold text-sm px-4 py-2 rounded-r-full capitalize ${getReservationStatusClassName(
              travelDetails?.reservationStatus || ''
            )}`}
          >
            {travelDetails?.reservationStatus === 'cancelledByGuest' ||
            travelDetails?.reservationStatus === 'cancelledByHost' ||
            travelDetails?.reservationStatus === 'cancelled'
              ? 'Cancelled'
              : travelDetails?.reservationStatus}
          </span>
        </span>

        <div className="flex flex-col justify-center items-center">
          <div
            className="w-1/4 flex items-center justify-center max-h-full ml-3 relative my-3"
            onClick={() => {
              if (handleRedirectToVehicleDetails) {
                handleRedirectToVehicleDetails(travelDetails?.carListingId ?? 0);
              }
            }}
          >
            {travelDetails?.coverPhoto?.secureUrl && (
              <div className="relative w-20 h-20 sm:w-32 sm:h-32">
                <Image src={`${travelDetails?.coverPhoto?.secureUrl}`} alt="CarImage" className="object-cover rounded-full" fill={true} />
              </div>
            )}
          </div>
          <div className=" flex flex-col items-center justify-center max-h-full ml-3 mb-2">
            <div className="grid grid-cols-[auto,1fr] font-bold md:text-xl text-sm lg:mb-1">
              {/* <span className="md:whitespace-nowrap text-start">{vehicleDetails?.car?.model}</span> */}
              <span
                className="md:whitespace-nowrap text-start no-underline hover:underline cursor-pointer"
                onClick={() => {
                  if (handleRedirectToVehicleDetails) {
                    handleRedirectToVehicleDetails(travelDetails?.carListingId ?? 0);
                  }
                }}
              >
                {travelDetails?.carInfo?.car?.model ?? ''}
              </span>
            </div>
            <span className="md:whitespace-nowrap text-start text-xs  text-primary">
              {travelDetails?.carInfo?.carNickName ? <span>{travelDetails?.carInfo?.carNickName}</span> : ''}
            </span>
            <div className="flex items-center my-1">
              <div className="flex items-center mr-2 p-0 m-0">
                <span className="flex gap-1 items-center justify-end">
                  <JourneyDark className="text-xl" />
                  {travelDetails?.carInfo?.totalTrips} {`Trip${travelDetails?.carInfo?.totalTrips > 1 ? 's' : ''} `}
                </span>
              </div>
              <div className="h-6 w-px bg-gray-300 mx-2"></div>

              <div className="flex items-center mr-2 p-0 m-0">
                <FaStar className="text-yellow-500 mr-1 text-lg" />
                <span className="text-gray-800 text-sm font-medium mr-1">
                  {travelDetails?.carInfo?.ratingsReceivedFrom === 0
                    ? 0
                    : parseFloat((travelDetails?.carInfo?.totalRatings / travelDetails?.carInfo?.ratingsReceivedFrom)?.toFixed(2))}{' '}
                  / 5.0
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[94%]  ml-5 mr-10 h-px bg-gray-200 "></div>
        <div className="flex justify-start items-center ">
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

            <div className="flex lg:gap-4 md:gap-2 gap-1">
              <div className={``}>
                <p className={'m-0 lg:text-sm text-sm'}>{isTravelEnded ? 'Started At' : 'Starts From'}</p>
                <p className={'m-0 lg:text-sm text-sm'}> {isTravelEnded ? 'Ended At' : 'End At'}</p>
              </div>
              <div className="font-bold">
                <p className={'m-0 lg:text-sm text-sm'}>{formatFullDateTimeUtc(updatedTravelData?.pickupDate)}</p>
                <p className={'m-0 lg:text-sm text-sm'}>{formatFullDateTimeUtc(updatedTravelData?.returnDate)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[94%]  ml-5 mr-10 h-px bg-gray-200 "></div>
        <div className="flex justify-start items-center md:gap-2 px-5 py-2">
          <div className="">
            <span className="flex gap-1 items-center justify-end">
              <FaCalendarAlt className="text-primary" />
              <p className={'m-0 lg:text-sm text-sm'}>
                Duration: <span className="font-bold">{updatedTravelData?.totalDurationText}</span>
              </p>
            </span>
          </div>
        </div>

        <div className="w-[94%]  ml-5 mr-10 h-px bg-gray-200 "></div>

        <div className="font-semibold text-sm  flex items-center justify-between px-5 py-2">
          <div className="flex items-center">
            <AiOutlineQrcode className="text-primary mr-1" />
            Reservation ID: <span className="text-primary">{reservationId}</span>
          </div>

          <div>
            {isCopy ? (
              <span className="text-primary text-xs ms-1">Copied</span>
            ) : (
              <FaCopy className="ml-2 cursor-pointer text-primary" onClick={handleCopy} title="Copy Reservation ID" />
            )}
          </div>
        </div>

        <div className="w-[94%]  ml-5 mr-10 h-px bg-gray-200 "></div>
        {(travelDetails?.reservationStatus as TReservationStatus) === 'adminCompleted' ? (
          <div className="p-4 text-error">Travel has been ended by Admin</div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-5  px-5 py-2">
            <div className="font-semibold text-sm  py-2 w-full sm:w-1/2">
              <div className="font-semibold text-sm ">
                <Button
                  className="normal-case rounded-full py-2  px-6  text-sm font-semibold"
                  disabled={isTravelCancelled || updatedTravelData?.travelType === 'past'}
                  variant="outlined"
                  size="small"
                  color="error"
                  fullWidth
                  onClick={updatedTravelData?.travelType === 'current' ? handleCancelCurrentReservation : handleCancelUpcomingReservation}
                  startIcon={<MdCancel />}
                >
                  Cancel Travel
                </Button>
              </div>
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
              <div className="flex font-semibold text-sm ms-3 w-full sm:w-1/2">
                <Button
                  className="normal-case rounded-full py-2  px-6 text-sm font-semibold"
                  variant="outlined"
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
              <div className="flex font-semibold text-sm ms-0 sm:ms-3 w-full sm:w-1/2">
                <Button
                  className="normal-case rounded-full py-2  px-6 text-sm font-semibold"
                  variant="contained"
                  size="small"
                  color="primary"
                  fullWidth
                  onClick={handleVerifyGuest}
                  disabled={isPartnerRestrict(partnerAccess) || isTravelCancelled}
                  startIcon={<CiEdit />}
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
      <OppositeUserInfoM userInfo={updatedTravelData?.oppositeUserInfo} />
    </>
  );
}
