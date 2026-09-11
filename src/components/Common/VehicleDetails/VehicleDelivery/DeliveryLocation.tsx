import { useCarListingContext } from '@/context/CarListingProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { TCommonDateRange } from '@/types/commonTypes';
import { getCarShortLocation } from '@/utils/Functions/carListingCommonFn';
import { getFutureReservations, handleSortReservations } from '@/utils/Functions/reservationValidationFn';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import VehicleLocationPickup from '../CustomReservationLocation/VehicleLocationPickup';
import VehicleDelivery from './VehicleDelivery';

const DeliveryLocation = () => {
  const { carData: { location } = {} } = useCarListingContext();
  const { singleCarReservationList } = useSearchContext();
  const urlSearchParams = useSearchParams();

  const { pickupAddress, pickupHistory } = location ?? {};
  const shortAddress =
    pickupHistory && pickupHistory?.length > 0
      ? pickupHistory?.slice(-1)?.[0]?.shortAddress
      : pickupAddress
      ? getCarShortLocation(pickupAddress)
      : '';

  const [nextReservations, setNextReservations] = useState<TCommonDateRange[]>([]);
  const [sortedReservations, setSortedReservations] = useState<TCommonDateRange[]>([]);

  useEffect(() => {
    sortReservations();
  }, [singleCarReservationList]);

  useEffect(() => {
    handleFutureReservationForLocation();
  }, [sortedReservations, urlSearchParams]);

  const sortReservations = async () => {
    if (singleCarReservationList?.length > 0) {
      const tempSortedReservations = await handleSortReservations(singleCarReservationList);
      setSortedReservations(tempSortedReservations);
    }
  };

  const handleFutureReservationForLocation = async () => {
    const returnDateTime = urlSearchParams?.get('return');
    if (sortedReservations?.length > 0 && returnDateTime) {
      const futureReservations = getFutureReservations(sortedReservations, returnDateTime);
      setNextReservations(futureReservations);
    }
  };
  return (
    <div>
      <span className="font-semibold">{'Pickup and Return Location'}</span>
      <div className="p-4 border border-solid border-accent rounded-md my-2">
        <VehicleLocationPickup shortAddress={shortAddress} bottomMargin={2} padding={2} />
        {process.env.NEXT_PUBLIC_NODE_ENV !== 'production' && <>{pickupAddress && <VehicleDelivery />}</>}
      </div>
    </div>
  );
};

export default DeliveryLocation;
