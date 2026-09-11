import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useCancelUpcomingReservation } from '@/hooks/reservation/useCancelUpcomingReservation';
import { TCancelUpcomingReservationByHost } from '@/types/travels/typeEditTravels';
import { utcCurrentTime } from '@/utils/Functions/utcCommonFn';
import Alert from '@mui/material/Alert/Alert';
import Button from '@mui/material/Button/Button';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const UpcomingCancel = () => {
  const [isChargedFees, setIsChargedFees] = useState<boolean>();

  const { travelDetails } = useProfileInfoContext();
  const { updatedTravelData } = useTravelContext();

  const currentTime = dayjs();

  const { mutateAsync, isLoading } = useCancelUpcomingReservation();

  useEffect(() => {
    if (updatedTravelData?.pickupDate && travelDetails?.reservedAt) {
      calculateUpcomingCancellation();
    }
  }, [travelDetails, updatedTravelData]);

  const calculateUpcomingCancellation = () => {
    const reservedMinDiff = currentTime.diff(dayjs(travelDetails?.reservedAt), 'minute');
    const pickupTimeMinDiff = dayjs(updatedTravelData?.pickupDate).diff(utcCurrentTime?.formattedTimeDayObj, 'minute');
    // const pickupTimeMinDiff = dayjs(updatedTravelData?.pickupDate).diff(dayjs(), 'minute');
    // const pickupTimeHourDiff = dayjs(updatedTravelData?.pickupDate).diff(utcCurrentTime?.formattedTimeDayObj, 'hour');

    if (reservedMinDiff > 120 || (reservedMinDiff <= 120 && pickupTimeMinDiff < 30)) {
      setIsChargedFees(true);
    }
  };

  const handleCancelUpcomingReservation = async () => {
    try {
      const cancelReservation: TCancelUpcomingReservationByHost = {
        userId: travelDetails?.partnerId,
        reservationInfo: {
          hostName: `${travelDetails?.partnerInfo?.firstName} ${travelDetails?.partnerInfo?.lastName}`,
          carName: travelDetails?.carInfo?.car?.model,
        },
      };
      await mutateAsync({ reservationId: travelDetails?.reservationId, cancelReservation });
    } catch (error: any) {
      console.error('handleCancelUpcomingReservation error', error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <p className="m-0 text-xl font-bold">Are you sure to cancel the travel?</p>
      {isChargedFees ? (
        <Alert severity="warning" className="font-bold bg-orange-100 text center">
          Reservation is outside of cancellation window. You will be charged a cancellation fee of $50. Please refer to
          <Link target="_blank" href={'https://www.tashus.com/help/article/95'} className="text-primary no-underline">
            {' Tashus Partner Cancellation Policy '}
          </Link>
          for more details.
        </Alert>
      ) : (
        <p className="helping_text m-0">No cancellation fee will be charged</p>
      )}

      <Button
        disabled={!updatedTravelData?.pickupDate || !travelDetails?.reservationId || isLoading}
        onClick={handleCancelUpcomingReservation}
        variant="contained"
        color="error"
        className="font-bold text-white mt-6"
      >
        Cancel Travel
      </Button>
    </div>
  );
};

export default UpcomingCancel;
