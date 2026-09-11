'use client';
import { AgreementInfoProps } from '@/types/legals/agreementTypes';
import { isAfterPickupTime, isBeforePickupTimeUtc } from '@/utils/Functions/agreementFn';
import { showTime } from '@/utils/Functions/travelCommonFn';
import { dayjsUtc, utcCurrentTime } from '@/utils/Functions/utcCommonFn';

const VehicleLocations = ({ reservationDetails, count, isRental, isReserveRevised }: AgreementInfoProps) => {
  const travelEndTime = isReserveRevised
    ? reservationDetails?.reservation?.revisedReservationResponses[reservationDetails?.reservation?.revisedReservationResponses?.length - 1]
        .newEndDate
    : reservationDetails?.reservation?.endTime;
  const isEndDayPassed = utcCurrentTime?.formattedTimeDayObj.isAfter(dayjsUtc(travelEndTime), 'minute');
  return (
    <div className="mb-6">
      <div className="font-bold text-xl mb-4">
        <div className="font-bold mr-1 inline-block text-center ">{count}.</div> Vehicle Pickup and Return : <br />
        <span className="helping_text mr-1 inline-block text-center">
          {!isBeforePickupTimeUtc(reservationDetails?.reservation) &&
          !reservationDetails?.reservation?.tripInformation?.isTripStarted &&
          !isAfterPickupTime(reservationDetails?.reservation && isRental)
            ? `A detailed address will be shared ${showTime} minutes prior to the start of travel`
            : ''}
        </span>
      </div>
      <div className="pl-4">
        <div className="font-semibold mb-1">
          Location for Vehicle Pickup :{' '}
          <span className="font-normal">
            {!isRental
              ? reservationDetails?.reservation?.pickupAddress?.streetAddress
              : !reservationDetails?.reservation?.tripInformation?.isEndedByPartner &&
                isBeforePickupTimeUtc(reservationDetails?.reservation) &&
                !isEndDayPassed
              ? // : !reservationDetails?.reservation?.isEndedByPartner && isBeforePickupTime(reservationDetails?.reservation)
                `${reservationDetails?.reservation?.pickupAddress?.streetAddress}`
              : `${reservationDetails?.reservation?.pickupAddress?.shortAddress}`}
          </span>
        </div>
        <div className="font-semibold mb-1">
          Location for Vehicle Return :{' '}
          <span className="font-normal">
            {' '}
            {!isRental
              ? reservationDetails?.reservation?.returnAddress?.streetAddress
              : !reservationDetails?.reservation?.tripInformation?.isEndedByPartner &&
                isBeforePickupTimeUtc(reservationDetails?.reservation) &&
                !isEndDayPassed
              ? // : !reservationDetails?.reservation?.isEndedByPartner && isBeforePickupTime(reservationDetails?.reservation)
                `${reservationDetails?.reservation?.returnAddress?.streetAddress}`
              : `${reservationDetails?.reservation?.returnAddress?.shortAddress}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VehicleLocations;
