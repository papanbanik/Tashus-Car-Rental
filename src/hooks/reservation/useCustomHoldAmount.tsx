'use client';

import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getCustomHoldAmount = async (userId: string | undefined) => {
  const response = await axiosClient.get(`${apiUrl}/profile/me/customized-coverage/${userId}`);
  return response;
};

export const useCustomHoldAmount = () => {
  const {
    userCred: { userId },
    setCustomizedHoldAmount,
  } = useUserCredContext();

  return useQuery({
    queryKey: ['reservation-lists', { userId }],
    queryFn: () => getCustomHoldAmount(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setCustomizedHoldAmount(data?.data?.data);
      return data;
    },
    onError: (err) => {
      console.log('useReservationList error', err);
      return err;
    },
  });
};
