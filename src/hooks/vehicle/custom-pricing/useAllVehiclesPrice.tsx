'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getAllVehiclePrice = async (hostId: string | undefined) => {
  const response = await axiosClient.get(`${apiUrl}/listing/custom-pricing/${hostId}`);
  return response;
};

export const useAllVehiclesPrice = () => {
  const {
    userCred: { userId },
  } = useUserCredContext();
  const { setUserVehiclePrice } = useCarListingContext();
  return useQuery({
    queryKey: ['vehicle-price', { userId }],
    queryFn: () => getAllVehiclePrice(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // console.log(data?.data?.data);
      setUserVehiclePrice(data?.data?.data);
    },
    onError: (err) => {
      console.log('useAllVehiclesPrice error', err);
      return err;
    },
  });
};
