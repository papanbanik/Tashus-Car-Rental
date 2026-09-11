'use client';

import { AgreementInfoProps } from '@/types/legals/agreementTypes';
import { getDurationHours } from '@/utils/Functions/dateTimeCommonFn';
import { formatFullDateTimeUtc } from '@/utils/Functions/utcCommonFn';

export function formatRentalPeriod(totalHours: number): string {
  const days = Math.floor(totalHours / 24);
  const remainingHours = Math.floor(totalHours % 24);
  const minutes = Math.round((totalHours % 1) * 60);

  let result = [];

  if (days > 0) {
    result.push(`${days} day${days !== 1 ? 's' : ''}`);
  }

  if (remainingHours > 0) {
    result.push(`${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`);
  }

  if (minutes > 0) {
    result.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  }

  return result.join(', ') || '0 minutes';
}

const RevisedReservation = ({ reservationDetails, count, isReserveRevised, isRental }: AgreementInfoProps) => {
  // console.log(reservationDetails);
  // console.log(reservationDetails?.reservation?.revisedReservationResponses);
  const historyReservationList = reservationDetails?.reservation?.revisedReservationResponses || [];
  // console.log('List of Reservation', historyReservationList);
  const generatedReservationList: any[] = [];
  if (historyReservationList?.length > 0) {
    const transformedData = {
      additionalPaymentInfo: reservationDetails?.additionalPaymentInfo,
      rentalAgreement: reservationDetails?.rentalAgreement,
      newStartDate: reservationDetails?.reservation?.startTime,
      newEndDate: reservationDetails?.reservation?.endTime,
      totalDurationHours: reservationDetails?.reservation?.rentalPeriod,
      additionalDistanceFeePerKm: reservationDetails?.reservation?.additionalFee,
      basePrice: reservationDetails?.basePrice,
    };
    generatedReservationList.push(transformedData, ...historyReservationList);
  }
  return (
    <div className="mb-6">
      <div className="font-bold text-xl">
        <div className="font-bold mr-1 inline-block text-center ">{count}.</div> Revised Reservations :{' '}
      </div>
      <div className="pl-4">
        <div>
          <p className="text-justify">{`A revised reservation occurs when a guest updates the time schedule of an existing reservation. This adjustment reflects changes in timing, ensuring accuracy and alignment with the new schedule.`}</p>
        </div>
        <div>
          <p className="font-semibold">
            {reservationDetails?.reservation?.revisedReservationResponses?.length > 0
              ? `${reservationDetails?.reservation?.revisedReservationResponses?.length}`
              : `No`}{' '}
            revised {reservationDetails?.reservation?.revisedReservationResponses?.length > 1 ? 'reservations' : 'reservation'} found
          </p>
        </div>
        <div>
          {isReserveRevised && (
            <>
              {generatedReservationList?.map((reservation: any, index: number) => {
                const reservationHtml = (
                  <div key={index} className="mb-2">
                    <p className="mb-2 mt-0 mx-0 text-base font-semibold">Reservation {index + 1} Details:</p>
                    <p className="m-0 text-sm">
                      <span className="font-semibold">Start Date & Time:</span> {formatFullDateTimeUtc(reservation?.newStartDate)}
                    </p>
                    <p className="m-0 text-sm">
                      <span className="font-semibold">End Date & Time:</span> {formatFullDateTimeUtc(reservation?.newEndDate)}
                    </p>
                    <p className="m-0 text-sm">
                      <span className="font-semibold">Total Rental Period:</span>{' '}
                      <span className="capitalize">
                        {/* {reservation?.totalDurationHours} {reservation?.totalDurationHours > 1 ? 'hours' : 'hour'} */}
                        {formatRentalPeriod(reservation?.totalDurationHours ?? getDurationHours(reservation?.newStartDate, reservation?.newEndDate))}
                      </span>
                    </p>
                    {reservation?.updatedAt && (
                      <p className="m-0 text-sm">
                        <span className="font-semibold">Revised At:</span>{' '}
                        <span className="capitalize">{formatFullDateTimeUtc(reservation?.updatedAt)}</span>
                      </p>
                    )}
                    <p className="m-0 text-sm">
                      <span className="font-semibold">Total Payment:</span>{' '}
                      <span className="capitalize">
                        {isRental ? `$${reservation?.basePrice?.totalPrice}` : `$${reservation?.basePrice?.hostIncome}`}
                      </span>
                    </p>
                    {isRental && index !== 0 && (
                      <p className="m-0 text-sm">
                        <span className="font-semibold">Additional Payment:</span>{' '}
                        <span className="capitalize">
                          ${reservation?.additionalPaymentInfo ? reservation?.additionalPaymentInfo?.cardAmountUsed : 0}
                        </span>
                      </p>
                    )}
                  </div>
                );
                return reservationHtml;
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevisedReservation;
