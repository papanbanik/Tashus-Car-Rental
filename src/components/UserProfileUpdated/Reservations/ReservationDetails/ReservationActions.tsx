import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useGetGuestLicenseInfoForPartner } from '@/hooks/reservation/useGetGuestLicenseInfoForPartner';
import { isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { calculateLiveDuration, formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { isLatePickup } from '@/utils/Functions/travelCommonFn';
import Button from '@mui/material/Button/Button';
import dayjs from 'dayjs';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CurrentCancel from '../CancelReservation/CurrentCancel';
import UpcomingCancel from '../CancelReservation/UpcomingCancel';
import KeyModal from '../EndReservation/KeyModal';
import { dayjsUtc, getPickerTimeStringInUtc } from '@/utils/Functions/utcCommonFn';

const ReservationActions = () => {
  useGetGuestLicenseInfoForPartner();
  const router = useRouter();
  const pathName = usePathname();

  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isGuestVerified, setIsGuestVerified] = useState<boolean>(false);

  const { travelDetails, partnerAccess } = useProfileInfoContext();
  // console.log(travelDetails?.reservedAt);
  const { updatedTravelData, verifyGuestInfoByPartner } = useTravelContext();
  const { openModal } = useModalContext();
  const currentTime = dayjs();
  useEffect(() => {
    if (verifyGuestInfoByPartner?.guestLicenseVerificationConfirmation?.isLicenseInfoMatched) {
      setIsGuestVerified(verifyGuestInfoByPartner?.guestLicenseVerificationConfirmation?.isLicenseInfoMatched);
    }
  }, [verifyGuestInfoByPartner?.guestLicenseVerificationConfirmation?.isLicenseInfoMatched]);
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const isTravelStarted = travelDetails?.tripInformation?.carKeyReceived;
      const isTravelEnded = travelDetails?.tripInformation?.tripEndingInfo?.isEndedByGuest;
      const travelStartTime = dayjs(travelDetails?.tripInformation?.startTime);
      const currentTime = dayjs();
      const utcCountStartTime = getPickerTimeStringInUtc(currentTime, true);
      if (isTravelStarted && !isTravelEnded) {
        const utcStartTime = getPickerTimeStringInUtc(travelStartTime, true);
        const timeCount = calculateLiveDuration(utcStartTime?.formattedTimeDayObj, utcCountStartTime?.formattedTimeDayObj);
        setTimeRemaining(timeCount);
      } else if (!isTravelStarted) {
        const timeCount = calculateLiveDuration(utcCountStartTime?.formattedTimeDayObj, dayjsUtc(updatedTravelData?.pickupDate));
        setTimeRemaining(timeCount);
      } else {
        setTimeRemaining('');
      }
    };

    calculateTimeRemaining();

    const intervalId = setInterval(calculateTimeRemaining, 1000); // Update every second

    return () => {
      clearInterval(intervalId);
    };
  }, [travelDetails, updatedTravelData]);

  const handleCompleteConfirmation = () => {
    openModal({
      title: '',
      content: <KeyModal></KeyModal>,
    });
  };

  const handleCancelCurrentReservation = () => {
    openModal({
      title: 'Cancel Reservation',
      content: <CurrentCancel></CurrentCancel>,
    });
  };

  const handleCancelUpcomingReservation = () => {
    openModal({
      title: '',
      content: <UpcomingCancel></UpcomingCancel>,
    });
  };

  const handleVerifyGuest = () => {
    router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}?view=verify-guest`);
  };

  return (
    <div
      style={{ borderTop: '4px solid red', borderBottom: '4px solid red' }}
      className="flex flex-row justify-between items-center mt-4 pt-4 pb-2 border border-gray-400 flex-wrap w-full"
    >
      {/* Can be checked if travel type is past */}
      {travelDetails?.tripInformation?.tripEndingInfo?.isEndedByGuest ? (
        <div className="w-full flex md:flex-row flex-col md:justify-between justify-center items-center">
          <div className="md:mb-0 mb-2">
            <p className="text-gray-400 m-0">Started at {formatFullDateTime(travelDetails?.tripInformation?.startTime)}</p>
            <p className="text-gray-400 m-0">Ended at {formatFullDateTime(travelDetails?.tripInformation?.endTime)}</p>
          </div>
          {travelDetails?.reservationStatus === 'completed' ? (
            <p className="text-success lg:text-xl font-bold uppercase m-0">Travel has been completed</p>
          ) : (
            <div className="flex flex-col justify-end items-end order-3 md:w-1/3 w-full">
              <Button
                onClick={handleCompleteConfirmation}
                // disabled={!travelDetails?.isTripStarted && updatedTravelData?.travelType !== 'current'}
                variant="contained"
                color="success"
                className="font-bold hover:text-white normal-case md:w-auto w-full"
              >
                Confirm Completion
              </Button>
            </div>
          )}
        </div>
      ) : travelDetails?.reservationStatus === 'cancelledByGuest' ||
        travelDetails?.reservationStatus === 'cancelledByHost' ||
        travelDetails?.reservationStatus === 'cancelled' ? (
        <p className="text-success lg:text-xl font-bold uppercase m-0 text-center w-full">
          Travel has been cancelled by{' '}
          {travelDetails?.reservationStatus?.includes('Host') ? 'you' : travelDetails?.reservationStatus?.includes('Guest') ? 'guest' : 'Tashus'}
        </p>
      ) : (
        <>
          <div className="order-2 md:order-1 md:w-1/3">
            {updatedTravelData?.travelType !== 'past' && (
              <Button
                onClick={handleVerifyGuest}
                disabled={isPartnerRestrict(partnerAccess)}
                // disabled={!travelDetails?.isTripStarted && updatedTravelData?.travelType !== 'current'}
                sx={{ border: 2 }}
                className="font-bold hover:bg-primary hover:text-white normal-case w-32"
              >
                {/* Verify Guest */}
                {isGuestVerified ? 'Verified' : 'Verify Guest'}
              </Button>
            )}
            {travelDetails?.isTripStarted && (
              <p className="text-gray-400 mt-2 text-sm m-0">{`Started at ${formatFullDateTime(travelDetails?.tripInformation?.startTime)}`}</p>
            )}
          </div>

          {travelDetails?.isTripStarted && (
            <div className="md:order-2 order-1 md:w-1/3 w-full flex flex-col justify-center items-center">
              <p className="m-0 font-bold">Current Duration</p>
              <p className="text-success text-xl font-bold uppercase text-center m-0">{timeRemaining}</p>
            </div>
          )}

          {!travelDetails?.isTripStarted && !isLatePickup(currentTime, updatedTravelData?.pickupDate) && (
            <div className="md:order-2 order-1 md:w-1/3 w-full flex flex-col justify-center items-center">
              <p className="m-0 font-bold">Travel Starts In</p>
              <p className="text-success text-xl font-bold uppercase text-center m-0">{timeRemaining}</p>
            </div>
          )}

          {!travelDetails?.isTripStarted && isLatePickup(currentTime, updatedTravelData?.pickupDate) && (
            <div className="md:order-2 order-1 md:w-1/3 w-full flex flex-col justify-center items-center">
              <p className="text-orange-400 text-xl font-bold uppercase text-center m-0">Late Pickup</p>
            </div>
          )}

          <div className="flex flex-col justify-end items-end order-3 md:w-1/3">
            {updatedTravelData?.travelType !== 'past' && (
              <Button
                onClick={updatedTravelData?.travelType === 'current' ? handleCancelCurrentReservation : handleCancelUpcomingReservation}
                // disabled={!travelDetails?.isTripStarted && updatedTravelData?.travelType !== 'current'}
                sx={{ border: 2 }}
                variant="outlined"
                color="error"
                className="font-bold hover:bg-error hover:text-white normal-case w-32"
              >
                Cancel
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReservationActions;
