'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { usePublicVehicleDetails } from '@/hooks/car-search/usePublicVehicleDetails';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import VehicleDetails from '../Common/VehicleDetails/VehicleDetails';

const SearchedVehicleDetails = () => {
  // const params = useParams();
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const { setCarData, setListingId, setEnableListSteps, carData } = useCarListingContext();
  const { setQueryEnableFlags, queryEnableFlags, searchParams } = useSearchContext();
  const { data } = usePublicVehicleDetails();

  useEffect(() => {
    // console.log(params['vehicle-id']);
    const tashus = JSON.parse(localStorage.getItem('tashus') || '{}');
    if (tashus?.reservationList?.length > 0) {
      const reservationList: any = [];
      localStorage.setItem('tashus', JSON.stringify({ ...tashus, reservationList }));
    }

    setListingId(vehicleId);
    setQueryEnableFlags({ ...queryEnableFlags, enableVehicleDetails: true });
  }, []);

  // const isCarExpired = carData?.car?.expiry ? dayjs(carData?.car?.expiry).isBefore(dayjs(searchParams?.return), 'day') : false;

  return (
    <div className="lg:px-24 md:px-24 px-2 mb-24 flex justify-center items-center w-full">
      {/* {isCarExpired ? (
        <div className="min-h-[300px] mt-10 flex items-center justify-center w-full">
          <Alert severity="error" className="bg-red-200 w-full">
            Vehicle Currently Unavailable
          </Alert>
        </div>
      ) : (
        <VehicleDetails></VehicleDetails>
      )} */}
      <VehicleDetails></VehicleDetails>
    </div>
  );
};

export default SearchedVehicleDetails;
