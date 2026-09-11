'use client';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useGetReservationsByListingId } from '@/hooks/reservation/useGetReservationsByListingId';
import { getUpdatedReservationDates } from '@/utils/Functions/reservationValidationFn';
import { formatDateTimeUtc } from '@/utils/Functions/utcCommonFn';
import { Divider } from '@mui/material';
import { useEffect, useState } from 'react';

const TemporaryReservationData = () => {
  const [updatedReservationList, setUpdatedReservationList] = useState<any[]>([]);
  const { data: reservationData } = useGetReservationsByListingId();
  const { carData } = useCarListingContext();
  const { updatedTravelData } = useTravelContext();
  const { travelDetails } = useProfileInfoContext();
  const { reservationInfo } = travelDetails ?? {};
  const { basePrice } = reservationInfo ?? {};
  const { dailyPrice, hourlyPrice, customPrices } = basePrice ?? {};
  useEffect(() => {
    setUpdatedReservationList([]);
  }, []);

  useEffect(() => {
    if (reservationData?.data?.length > 0) {
      handleUpdate();
    }
  }, [reservationData]);

  const handleUpdate = async () => {
    const filteredCancelReservations = reservationData?.data?.filter(
      (reservation: any) =>
        reservation?.reservationStatus !== 'cancelledByGuest' &&
        reservation?.reservationStatus !== 'cancelledByHost' &&
        reservation?.reservationStatus !== 'cancelled'
    );
    const tempList = await getUpdatedReservationDates(filteredCancelReservations);
    setUpdatedReservationList(tempList);
  };

  return (
    <div>
      {updatedReservationList?.length > 0 ? (
        <div>
          {updatedReservationList
            ?.sort((a: any, b: any) => +new Date(a.startDate) - +new Date(b.startDate))
            .map((reservation: any, index: number) => (
              <div key={index} className="lg:flex justify-between items-center">
                <p className="m-0">{reservation?.reservationId}</p>
                <p className="m-0">Pickup on {formatDateTimeUtc(new Date(reservation?.startDate))}</p>
                <p className="m-0">Return on {formatDateTimeUtc(new Date(reservation?.endDate))}</p>
              </div>
            ))}
        </div>
      ) : (
        <p>No reservations yet</p>
      )}
      <div className="grid grid-cols-3 w-full pt-2">
        <p className="m-0 col-span-1">Price During Reservation:</p>
        <div className="col-span-2 flex gap-4">
          <p className="m-0">Daily: ${dailyPrice}</p>
          <Divider orientation="vertical" className="bg-black"></Divider>
          <p className="m-0">Hourly: ${hourlyPrice}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 w-full mb-4">
        <p className="m-0 col-span-1">Current price:</p>
        <div className="col-span-2 flex gap-4">
          <p className="m-0">Daily: ${carData?.rates?.dailyRates?.amount}</p>
          <Divider orientation="vertical" className="bg-black"></Divider>
          <p className="m-0">Hourly: ${carData?.rates?.hourlyRates?.amount}</p>
        </div>
      </div>
    </div>
  );
};

export default TemporaryReservationData;
