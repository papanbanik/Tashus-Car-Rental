'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getReservationsByListingId = async (carListingId: number | string) => {
  // console.log(carListingId);
  const response = await axios.get(`${apiUrl}/reservation/reservations-by-car/${carListingId}`);
  return response;
};

export const useGetReservationsByListingId = () => {
  // const params = useParams();
  // const carListingId = params['vehicle-id'];
  const { vehicleId: carListingId } = useParams<{ vehicleId: string }>();
  const { queryEnableFlags, setQueryEnableFlags, setSingleCarReservationList } = useSearchContext();
  const { listingId } = useCarListingContext();
  // // Ensure carListingId and listingId are valid numbers
  // const validCarListingId = !isNaN(carListingId) ? carListingId : null;
  // const validListingId = !isNaN(parseInt(listingId)) ? parseInt(listingId) : null;
  const vehicleListingId = carListingId ?? listingId;
  return useQuery({
    queryKey: ['single-car-all-reservations', { carListingId }],
    queryFn: () => getReservationsByListingId(vehicleListingId),
    // enabled: queryEnableFlags?.enableSingleCarReservations,
    enabled: !!vehicleListingId,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // console.log(data);
      // console.log(data?.data);
      setSingleCarReservationList(data?.data);
      setQueryEnableFlags({ ...queryEnableFlags, enableSingleCarReservations: false });
      // return data;
    },
    onError: (err) => {
      console.log('useGetReservationsByListingId error', err);
      setQueryEnableFlags({ ...queryEnableFlags, enableSingleCarReservations: false });
      return err;
    },
  });
};
