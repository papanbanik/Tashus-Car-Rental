'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';

const getVehicleFuelList = async () => {
  const response = await axiosClient.get(`${process.env.NEXT_PUBLIC_API_URL}/listing/vehicles/fuel-list`);
  return response;
};

export const useGetFuelList = () => {
  const { setVehicleFuelList } = useCarListingContext();
  const {
    userCred: { userId },
  } = useUserCredContext();
  return useQuery({
    queryKey: ['fuel-list'],
    queryFn: async () => {
      try {
        const data = await getVehicleFuelList();
        setVehicleFuelList(data?.data?.data);
        return data;
      } catch (err: any) {
        console.log('useGetReservationsByListingId error', err);
        return err;
      }
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
};
