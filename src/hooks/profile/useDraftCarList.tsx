'use client';

import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getDraftCarList = async (hostId: string | undefined) => {
  const response = await axiosClient.get(`${apiUrl}/listing/drafted-car-list/${hostId}`);
  return response;
};

export const useDraftCarList = () => {
  const {
    userCred: { userId },
  } = useUserCredContext();

  return useQuery({
    queryKey: ['draft-lists', { userId }],
    queryFn: () => getDraftCarList(userId),
    enabled: !!userId,
    // enabled: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // console.log(data);
      // console.log(data?.data?.data?.draftList);
      return data;
    },
    onError: (err) => {
      console.log('useDraftCarList error', err);
      return err;
    },
  });
};
