import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useGetGuestLicenseInfoForPartner } from '@/hooks/reservation/useGetGuestLicenseInfoForPartner';
import { useTravelDetails } from '@/hooks/travel/useTravelDetails';
import { calculateLiveDuration } from '@/utils/Functions/dateTimeCommonFn';
import { isLatePickup } from '@/utils/Functions/travelCommonFn';
import { dayjsUtc, getPickerTimeStringInUtc } from '@/utils/Functions/utcCommonFn';
import dayjs from 'dayjs';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReservationVehicleCommon from '../../Travels/TravelDetailsM/VehicleInfo/ReservationVehicleInfoCard/ReservationVehicleCommon';
import CurrentCancel from '../CancelReservation/CurrentCancel';
import UpcomingCancel from '../CancelReservation/UpcomingCancel';
import KeyModal from '../EndReservation/KeyModal';
import PartnerEndTravel from '../EndReservation/PartnerEndTravel';
import ReservationCommonActionCardM from './ReservationCommonActionCardM';

const ReservationBasicsM = () => {
  const { refetch } = useTravelDetails();
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

  const isTravelCancelled =
    travelDetails?.reservationStatus === 'cancelledByGuest' ||
    travelDetails?.reservationStatus === 'cancelledByHost' ||
    travelDetails?.reservationStatus === 'cancelled';

  const { tripInformation } = travelDetails ?? {};
  const { tripEndingInfo } = tripInformation ?? {};
  const { isEndedByPartner = false, isEndedByGuest = false, isEndedByAdmin = false } = tripEndingInfo ?? {};
  const isTravelEnded = isEndedByAdmin || isEndedByGuest || isEndedByPartner;

  const handlePartnerEndTravel = () => {
    openModal({
      content: <PartnerEndTravel refetch={refetch} />,
    });
  };
  return (
    <div>
      <>
        {travelDetails?.tripInformation?.tripEndingInfo?.isEndedByGuest ? (
          <>
            {travelDetails?.reservationStatus === 'completed' ? (
              <ReservationCommonActionCardM title="Travel has been completed" currentStatus="completed" />
            ) : (
              <ReservationCommonActionCardM title="Pending Travel Completion" currentStatus="pendingCompletion" />
            )}
          </>
        ) : isTravelCancelled ? (
          <ReservationCommonActionCardM title="Travel has been cancelled by" currentStatus="cancelled" />
        ) : (
          <>
            {!travelDetails?.isTripStarted && !isLatePickup(currentTime, updatedTravelData?.pickupDate) && (
              <ReservationCommonActionCardM
                title="Travel start in"
                timeRemaining={timeRemaining}
                currentStatus="upcoming"
                // isStartInvalid={isStartInvalid}
                // isEndDayPassed={isEndDayPassed}
              />
            )}

            {travelDetails?.isTripStarted && (
              <ReservationCommonActionCardM timeRemaining={timeRemaining} title="Current Duration " currentStatus="started" />
            )}

            {!travelDetails?.isTripStarted && isLatePickup(currentTime, updatedTravelData?.pickupDate) && (
              <ReservationCommonActionCardM title="Late Pickup" currentStatus="latePickup" isLatePickup={true} />
            )}
          </>
        )}

        <ReservationVehicleCommon
          timeRemaining={timeRemaining}
          isTravelEnded={isTravelEnded}
          isTravelCancelled={isTravelCancelled}
          //   isLatePickupTravel={isLatePickupTravel}
          //   isTravelStarted={travelDetails?.isTripStarted}
          handleCompleteConfirmation={handleCompleteConfirmation}
          handleCancelCurrentReservation={handleCancelCurrentReservation}
          handleCancelUpcomingReservation={handleCancelUpcomingReservation}
          handleVerifyGuest={handleVerifyGuest}
          isGuestVerified={isGuestVerified}
          handlePartnerEndTravel={handlePartnerEndTravel}
        />
      </>
    </div>
  );
};

export default ReservationBasicsM;
