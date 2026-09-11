'use client';

import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getAvailableLocations = async () => {
  const response = await axiosClient.get(`${apiUrl}/v2/available-locations`);
  return response;
};

export const useGetAvailableLocations = () => {
  return useQuery({
    queryKey: ['available-location', {}],
    queryFn: () => getAvailableLocations(),
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      return data;
    },
    onError: (err) => {
      console.log('useAvailableLocations error', err);
      return err;
    },
  });
};
