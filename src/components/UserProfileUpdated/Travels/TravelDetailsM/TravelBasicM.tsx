'use client';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { EReservationStatus } from '@/types/travels/travelEnums';
import { formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { isLatePickup } from '@/utils/Functions/travelCommonFn';
import { dayjsUtc, formatFullDateTimeUtc, utcCurrentTime } from '@/utils/Functions/utcCommonFn';
import { reservationCancelledStatus } from '@/utils/Lists/travelInfoList';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import EndModal from '../EndTravel/EndModal';
import { calculateTimeRemaining } from './ActionFn';
import CommonActionCard from './TravelCommonActionCard';
import TravelVehicleCardCommon from './VehicleInfo/TravelVehicleInfoCard/TravelVehicleCardCommon';

interface TravelBasicMProps {
  scrollToBillingDetails?: () => void;
}

const TravelBasicM = ({ scrollToBillingDetails }: TravelBasicMProps) => {
  const currentTime = dayjs();
  const { updatedTravelData } = useTravelContext();
  const { travelDetails, guestAccess } = useProfileInfoContext();
  const { openModal } = useModalContext();
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  const travelStartTime = useMemo(() => travelDetails?.tripInformation?.startTime, [travelDetails]);

  const isTravelStarted = travelDetails?.tripInformation?.carKeyReceived;

  const isTravelEnded =
    travelDetails?.tripInformation?.tripEndingInfo?.isEndedByGuest ??
    travelDetails?.tripInformation?.tripEndingInfo?.isEndedByPartner ??
    travelDetails?.tripInformation?.tripEndingInfo?.isEndedByAdmin;
  //Start and End
  const startTime = travelDetails?.tripInformation?.tripEndingInfo?.isEndedByAdmin
    ? formatFullDateTimeUtc(updatedTravelData?.pickupDate)
    : formatFullDateTime(travelDetails?.tripInformation?.startTime) ?? formatFullDateTimeUtc(updatedTravelData?.pickupDate);
  const endTime = travelDetails?.tripInformation?.tripEndingInfo?.isEndedByAdmin
    ? formatFullDateTimeUtc(updatedTravelData?.returnDate)
    : formatFullDateTime(travelDetails?.tripInformation?.endTime) ?? formatFullDateTimeUtc(updatedTravelData?.returnDate);

  const travelPickupDate = useMemo(() => updatedTravelData?.pickupDate, [updatedTravelData]);

  // Stable memoized function
  const calculateRemainingTime = useCallback(() => {
    return calculateTimeRemaining(travelDetails, travelPickupDate);
  }, [travelDetails, travelPickupDate]);

  useEffect(() => {
    const updateRemainingTime = () => {
      const newTimeRemaining = calculateRemainingTime();
      setTimeRemaining((prev: any) => (prev !== newTimeRemaining ? newTimeRemaining : prev));
    };

    updateRemainingTime();
    const intervalId = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [calculateRemainingTime]);

  const parseTimeToSeconds = (time: string) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const shouldShowStartTravelCard = timeRemaining && parseTimeToSeconds(timeRemaining) < 30 * 60;

  const isEndDayPassed = isTravelStarted ? false : utcCurrentTime?.formattedTimeDayObj.isAfter(dayjsUtc(updatedTravelData?.returnDate), 'minute');
  const isStartInvalid =
    utcCurrentTime?.formattedTimeDayObj.isBefore(dayjsUtc(updatedTravelData?.pickupDate)) &&
    dayjsUtc(updatedTravelData?.pickupDate).diff(utcCurrentTime?.formattedTimeDayObj, 'minute') > 15;

  const handleEndTravel = () => {
    const hourDiff = dayjsUtc(updatedTravelData?.returnDate).diff(utcCurrentTime?.formattedTimeDayObj, 'hour');
    openModal({
      content: <EndModal isEndAllowed={hourDiff <= 6 ? true : false}></EndModal>,
    });
  };

  const isTravelCancelled = reservationCancelledStatus?.includes(travelDetails?.reservationStatus as EReservationStatus);

  const isLatePickupTravel = !travelDetails?.isTripStarted && isLatePickup(currentTime, updatedTravelData?.pickupDate);
  return (
    <>
      {isTravelEnded ? (
        <CommonActionCard title="Travel Completed" currentStatus="completed" />
      ) : isTravelCancelled ? (
        <CommonActionCard title="Travel has been cancelled by" currentStatus="cancelled" />
      ) : (
        <>
          {!travelDetails?.isTripStarted && !isLatePickup(currentTime, updatedTravelData?.pickupDate) && (
            <CommonActionCard
              title="Travel start in"
              timeRemaining={timeRemaining}
              currentStatus="upcoming"
              isStartInvalid={isStartInvalid}
              isEndDayPassed={isEndDayPassed}
            />
          )}

          {travelDetails?.isTripStarted && <CommonActionCard timeRemaining={timeRemaining} title="Current Duration " currentStatus="started" />}

          {!travelDetails?.isTripStarted && isLatePickup(currentTime, updatedTravelData?.pickupDate) && (
            <CommonActionCard title="Late Pickup" currentStatus="latePickup" isLatePickup={true} />
          )}
        </>
      )}

      <TravelVehicleCardCommon
        timeRemaining={timeRemaining}
        scrollToBillingDetails={scrollToBillingDetails}
        isTravelEnded={isTravelEnded}
        isTravelCancelled={isTravelCancelled}
        isLatePickupTravel={isLatePickupTravel}
        isTravelStarted={travelDetails?.isTripStarted}
        handleEndTravel={handleEndTravel}
        isStartInvalid={isStartInvalid}
        isEndDayPassed={isEndDayPassed}
      />
    </>
  );
};

export default TravelBasicM;
