'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type PublicVehicleDetailsType = {
  listingId: string;
};

const getPublicVehicleDetails = async ({ listingId }: PublicVehicleDetailsType) => {
  const response = await axios.get(`${apiUrl}/search/find-cars/${listingId}`);
  return response;
};

export const usePublicVehicleDetails = () => {
  const { queryEnableFlags, setQueryEnableFlags, setHostInfo } = useSearchContext();
  const { listingId, setCarData } = useCarListingContext();
  const router = useRouter();

  return useQuery({
    queryKey: ['public-vehicle-details'],
    queryFn: () => getPublicVehicleDetails({ listingId }),
    enabled: queryEnableFlags?.enableVehicleDetails && !!listingId,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // console.log(data);
      // console.log(data?.data);
      if (data?.status === 204) {
        router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/not-found`);
      } else {
        setCarData(data?.data);
        setHostInfo({ ...data?.data?.hostInfo, joiningDate: new Date(data?.data?.hostInfo?.createdAt) });
        setQueryEnableFlags({ ...queryEnableFlags, enableVehicleDetails: false });
      }

      return data;
    },
    onError: (err) => {
      console.log('usePublicVehicleDetails error', err);
      setQueryEnableFlags({ ...queryEnableFlags, enableVehicleDetails: false });
      return err;
    },
  });
};
