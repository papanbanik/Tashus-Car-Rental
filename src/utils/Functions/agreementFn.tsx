import dayjs from 'dayjs';
import { isReservationActive, isWithinTimeRange, shouldShowAddress } from './travelCommonFn';

export const getPickupStartDate = (reservationDetails: any) => {
  if (reservationDetails?.revisedReservationResponses?.length > 0) {
    const latestReservation = reservationDetails?.revisedReservationResponses[reservationDetails?.revisedReservationResponses?.length - 1];
    return latestReservation.newStartDate;
  } else {
    return reservationDetails?.startTime;
  }
};
export const isBeforePickupTime = (reservationDetails: any) => {
  const pickupTime = getPickupStartDate(reservationDetails);
  return (
    (isWithinTimeRange(pickupTime) && isReservationActive(reservationDetails?.reservationStatus)) ||
    (reservationDetails?.isTripStarted && !reservationDetails?.isEndedByGuest)
  );
};

export const isBeforePickupTimeUtc = (reservationDetails: any) => {
  const pickupTime = getPickupStartDate(reservationDetails);
  const showAddress = shouldShowAddress(pickupTime);
  return showAddress;
};

export const isAfterPickupTime = (reservationDetails: any) => {
  const pickupTime = getPickupStartDate(reservationDetails);
  return dayjs().isAfter(pickupTime);
};
