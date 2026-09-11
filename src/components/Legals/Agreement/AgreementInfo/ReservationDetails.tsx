'use client';
import { AgreementInfoProps } from '@/types/legals/agreementTypes';
import { TAgreementReservationData } from '@/types/travels/typeTravels';
import { getDurationHours } from '@/utils/Functions/dateTimeCommonFn';
import { getSingularPluralNoun } from '@/utils/Functions/randomCommonFn';
import { getAgreementReservationData } from '@/utils/Functions/travelCommonFn';
import { formatFullDateTimeUtc } from '@/utils/Functions/utcCommonFn';
import { useSearchParams } from 'next/navigation';
import { formatRentalPeriod } from './RevisedReservation';

const ReservationDetails = ({ reservationDetails, count, isRental }: AgreementInfoProps) => {
  const searchParams = useSearchParams();
  const reservationId = searchParams?.get('reservation-id');
  // console.log('Reservation Details', reservationDetails);
  const updatedReservationDetails: TAgreementReservationData = getAgreementReservationData(reservationDetails);
  return (
    <div className="mb-6">
      <div className="font-bold text-xl">
        <div className="font-bold mr-1 inline-block text-center ">{count}.</div> Reservation Details :{' '}
      </div>
      <div className="pl-4">
        <div>
          <p className="text-justify">{`“Reservation” is defined as the period of day and time from following start and end time when the guest has booked the vehicle.`}</p>
        </div>
        {!!reservationId && (
          <div className="font-semibold mb-1">
            Reservation ID : <span className="font-normal">{reservationId}</span>
          </div>
        )}
        <div className="font-semibold mb-1">
          Reservation Start Date and Time : <span className="font-normal">{formatFullDateTimeUtc(updatedReservationDetails?.pickupDate)}</span>
        </div>
        <div className="font-semibold mb-1">
          Reservation End Date and Time : <span className="font-normal">{formatFullDateTimeUtc(updatedReservationDetails?.returnDate)}</span>
        </div>
        <div className="font-semibold mb-1">
          Rental Period :{' '}
          <span className="font-normal">
            {formatRentalPeriod(
              updatedReservationDetails?.totalDurationHours ??
                getDurationHours(updatedReservationDetails?.pickupDate, updatedReservationDetails?.returnDate)
            )}
            {/* {} {updatedReservationDetails?.totalDurationHours > 1 ? 'hours' : 'hour'} */}
          </span>
        </div>
        <div className="font-semibold mb-1">
          Rental Charges :{' '}
          <span className="font-normal">
            ${isRental ? updatedReservationDetails?.basePrice?.totalPrice : updatedReservationDetails?.basePrice?.hostIncome}
          </span>
        </div>
        <div className="font-semibold mb-1">
          Kilometers allowed per day :{' '}
          <span className="font-normal">
            {(updatedReservationDetails?.dailyDistanceKm ?? 0) > 0
              ? `${updatedReservationDetails?.dailyDistanceKm} ${getSingularPluralNoun('Kilometer', updatedReservationDetails?.dailyDistanceKm ?? 0)}`
              : 'Unlimited'}
          </span>
        </div>
        <div className="font-semibold mb-1">
          Total Allowed Kilometers without additional charges :{' '}
          <span className="font-normal">
            {updatedReservationDetails?.totalAllowedKM > 0
              ? `${updatedReservationDetails?.totalAllowedKM} ${getSingularPluralNoun('Kilometer', updatedReservationDetails?.totalAllowedKM)}`
              : 'Unlimited'}
          </span>
        </div>
        <div className="font-semibold mb-1">
          Additional kilometers Fees:{' '}
          <span className="font-normal">
            {updatedReservationDetails?.additionalFee <= 0 ? 'N/A' : `${updatedReservationDetails?.additionalFee} ₵/KM`}{' '}
          </span>
        </div>
        {isRental && (
          <div className="font-semibold mb-1">
            {/* Security Deposit (if applicable):{' '} */}
            Security Deposit :{' '}
            <span className="font-normal"> {updatedReservationDetails?.depositAmount ? `$${updatedReservationDetails?.depositAmount}` : 'N/A'}</span>
          </div>
        )}
        {(updatedReservationDetails?.perKmCost ?? 0) > 0 ? (
          <div className="font-semibold mb-1">
            Fuel Shortage Upon Return:{' '}
            <span className="font-normal">
              {`$10 + ${updatedReservationDetails?.perKmCost ? parseFloat((updatedReservationDetails.perKmCost * 100).toFixed(2)) : 0} ₵/KM`}
              {'(calculated on fuel range difference)'}
            </span>
          </div>
        ) : (
          ''
        )}
        <div>
          <p className="text-justify">During this period of reservation, the guest has the right to use the vehicle.</p>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
