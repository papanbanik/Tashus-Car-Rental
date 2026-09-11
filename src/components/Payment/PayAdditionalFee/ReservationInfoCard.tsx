import { useTravelContext } from '@/context/TravelProvider';
import { useParams } from 'next/navigation';
import ShowPickupReturnTime from '../../Common/DateTimePickers/ShowPickupReturnTime';

const ReservationInfoCard = ({ isModification, dueAmount }: { isModification?: boolean; dueAmount?: number }) => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const { additionalFeeReservationDetails, updatedTravelData } = useTravelContext();

  return (
    <div className={`w-full md:w-[841px] grid grid-cols-1 bg-white shadow-md shadow-secondary rounded-lg`}>
      <div className={`bg-primary rounded-t-lg text-white w-full flex justify-center items-center`}>
        <span className="p-4 font-bold">Reservation ID : {reservationId ?? additionalFeeReservationDetails?.reservationId}</span>
      </div>
      <div className="w-full flex justify-between items-center p-4 ">
        <div>
          <ShowPickupReturnTime
            startDate={isModification ? updatedTravelData?.pickupDate : additionalFeeReservationDetails?.startDate}
            endDate={isModification ? updatedTravelData?.returnDate : additionalFeeReservationDetails?.endDate}
          />
        </div>
        <div>
          <span className="text-xl lg:text-2xl font-bold">
            Due:{' '}
            <span className="text-success">
              {isModification
                ? `$${parseFloat((dueAmount ?? 0)?.toFixed(2))}`
                : `$${parseFloat(additionalFeeReservationDetails?.additionalFeeDueAmount?.toFixed(2))}`}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReservationInfoCard;
