import { useCarListingContext } from '@/context/CarListingProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { TCommonDateRange } from '@/types/commonTypes';
import { getCarShortLocation } from '@/utils/Functions/carListingCommonFn';
import { getFutureReservations, handleSortReservations } from '@/utils/Functions/reservationValidationFn';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import CarDetailsSectionTitle from '../CarDetailsSectionTitle';
import VehicleDeliverToGuest from './VehicleDeliverToGuest';
import VehicleDropOffLocation from './VehicleDropOffLocation';
import VehicleLocationPickup from './VehicleLocationPickup';

const CustomReservationLocation = () => {
  const { carData: { location } = {} } = useCarListingContext();
  const { pickupAddress, pickupHistory } = location ?? {};

  const shortAddress =
    pickupHistory && pickupHistory?.length > 0
      ? pickupHistory?.slice(-1)?.[0]?.shortAddress
      : pickupAddress
      ? getCarShortLocation(pickupAddress)
      : '';

  const { singleCarReservationList } = useSearchContext();
  const [nextReservations, setNextReservations] = useState<TCommonDateRange[]>([]);
  const [sortedReservations, setSortedReservations] = useState<TCommonDateRange[]>([]);

  const [isDeliverToInitialLocation, setIsDeliverToInitialLocation] = useState<boolean>(false);

  const urlSearchParams = useSearchParams();

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
      <CarDetailsSectionTitle sectionTitle="Pickup and Return Location"></CarDetailsSectionTitle>

      <Accordion className="rounded-lg">
        <AccordionSummary
          expandIcon={<IoIosArrowDown />}
          aria-controls="panel2-content"
          id="panel2-header"
          className="rounded-lg"
          style={{ border: '1px solid gray' }}
        >
          <Typography>{shortAddress}</Typography>
        </AccordionSummary>

        <AccordionDetails className="shadow-none drop-shadow-none py-6">
          <VehicleLocationPickup shortAddress={shortAddress}></VehicleLocationPickup>

          {process.env.NEXT_PUBLIC_NODE_ENV !== 'production' && (
            <>
              {pickupAddress && (
                <VehicleDeliverToGuest
                  vehiclePickupAddress={pickupAddress}
                  isDeliverToInitialLocation={isDeliverToInitialLocation}
                  setIsDeliverToInitialLocation={setIsDeliverToInitialLocation}
                ></VehicleDeliverToGuest>
              )}
            </>
          )}

          {process.env.NEXT_PUBLIC_NODE_ENV !== 'production' && !isDeliverToInitialLocation && nextReservations?.length === 0 && (
            <VehicleDropOffLocation></VehicleDropOffLocation>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default CustomReservationLocation;
