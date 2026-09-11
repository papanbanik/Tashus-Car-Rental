'use client';

import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useCarListingContext } from '@/context/CarListingProvider';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getVehicleList = async (userId: string | undefined) => {
  const response = await axiosClient.get(`${apiUrl}/profile/user-listed-cars/${userId}`);
  return response;
};

export const useVehicleList = () => {
  const {
    userCred: { userId },
  } = useUserCredContext();
  const { setUserVehicleList } = useCarListingContext();

  return useQuery({
    queryKey: ['vehicle-lists', { userId }],
    queryFn: () => getVehicleList(userId),
    enabled: !!userId,
    // enabled: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setUserVehicleList(data?.data?.data?.listedCars);
      return data;
    },
    onError: (err) => {
      console.log('useVehicleList error', err);
      return err;
    },
  });
};
