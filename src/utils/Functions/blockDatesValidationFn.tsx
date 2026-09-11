import { TDate } from '@/types/commonTypes';
import { TReservation, TRevisedReservation } from '@/types/travels/typeTravels';
import dayjs from 'dayjs';
import { getUpdatedReservationDates } from './reservationValidationFn';
import { dayjsUtc, formatDateUtc, formatFullDateTimeUtc, formatTimeUtc } from './utcCommonFn';

export const handleModifiedReservation = (reservation: any) => {
  if (reservation?.revisedReservations && reservation?.revisedReservations.length > 0) {
    const paidRevisedReservations = reservation?.revisedReservations.filter(
      (revisedReservation: any) => revisedReservation?.paymentStatus === 'paid'
    );

    if (paidRevisedReservations.length > 0) {
      const lastRevisedReservation = paidRevisedReservations[paidRevisedReservations.length - 1];
      return {
        startDate: lastRevisedReservation?.newStartDate,
        endDate: lastRevisedReservation?.newEndDate,
      };
    }
  }

  return {
    startDate: reservation?.startDate,
    endDate: reservation?.endDate,
  };
};

export const checkAvailability = async (
  startDate: TDate,
  endDate: TDate,
  reservationList: any[],
  eachCalendarDetails: any[],
  listingId: string
): Promise<{ isReserved: boolean; isBlocked: boolean }> => {
  if (reservationList?.length > 0 || eachCalendarDetails?.length > 0) {
    const matchingReservations = reservationList
      ?.filter((reservation) => reservation.carListingId === parseInt(listingId))
      .filter((reservation) => !['cancelledByGuest', 'cancelledByHost', 'cancelled'].includes(reservation.reservationStatus));

    const updatedReservationList = await getUpdatedReservationDates(matchingReservations);
    const isReserved = updatedReservationList?.some((reservation) => {
      const { startDate: reservationStartDate, endDate: reservationEndDate } = reservation;
      //   return dayjs(startDate).isBefore(dayjs(reservationEndDate)) && dayjs(endDate).isAfter(dayjs(reservationStartDate));
      return (
        dayjsUtc(startDate).isBefore(dayjsUtc(reservationEndDate).add(30, 'minute')) &&
        dayjsUtc(endDate).isAfter(dayjsUtc(reservationStartDate).subtract(30, 'minute'))
      );
    });

    // const isBlocked = eachCalendarDetails?.some((range) => {
    //   return dayjs(startDate).isBefore(dayjs(range.end)) && dayjs(endDate).isAfter(dayjs(range.start));
    // });
    const isBlocked = eachCalendarDetails?.some((range) => {
      const rangeStart = dayjsUtc(range.start);
      const rangeEnd = dayjsUtc(range.end);
      return (
        (dayjsUtc(startDate).isSame(rangeStart) || dayjsUtc(startDate).isAfter(rangeStart)) &&
        (dayjsUtc(endDate).isSame(rangeEnd) || dayjsUtc(endDate).isBefore(rangeEnd))
      );
    });

    return { isReserved: !!isReserved, isBlocked: !!isBlocked };
  }

  return { isReserved: false, isBlocked: false };
};

export const formatEventDetailsUtc = (startDate: string, endDate: string) => {
  const formattedStart = formatFullDateTimeUtc(startDate);
  const formattedEnd = formatTimeUtc(endDate);
  const CheckStart = formatTimeUtc(startDate);
  const AllDayStart = formatDateUtc(startDate);
  // const AllDayStart = dayjs(startDate).format('DD MMM, YYYY');
  const isAllDay = CheckStart === '12:00 AM' && formattedEnd === '11:59 PM';

  return isAllDay ? `${AllDayStart} | All day` : `${formattedStart} to ${formattedEnd}`;
};

export const getHostUpdatedReservation = (reservation: TReservation) => {
  const lastPaidReservation = getLatestNotPendingRevised(reservation?.revisedReservations);

  return {
    startDate: lastPaidReservation?.newStartDate || reservation?.startDate,
    endDate: lastPaidReservation?.newEndDate || reservation?.endDate,
    basePrice: lastPaidReservation?.basePrice || reservation?.basePrice,
  };
};

export const getLatestNotPendingRevised = (revisedReservationList: TRevisedReservation[] | undefined): TRevisedReservation | undefined => {
  let lastRevision = revisedReservationList?.slice(-1)?.[0] ?? undefined;
  let isEditPaymentExpired: boolean = false;

  if (lastRevision?.paymentStatus === 'pending') {
    isEditPaymentExpired = dayjs().diff(dayjs(lastRevision?.createdAt), 'minute') > 30;
  }

  // if last revision payment is expired, take the last not pending revision
  if (isEditPaymentExpired) {
    lastRevision = revisedReservationList?.filter((revised) => revised?.paymentStatus !== 'pending').slice(-1)?.[0];
  }

  return lastRevision;
};
