'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getAllNotifications = async (userId: string | undefined) => {
  const response = await axiosClient.get(`${apiUrl}/profile/notification/${userId}`);
  return response;
};

export const useAllNotifications = () => {
  const {
    userCred: { userId },
  } = useUserCredContext();
  const { setNotificationList } = useProfileInfoContext();
  return useQuery({
    queryKey: ['notification-lists', { userId }],
    queryFn: () => getAllNotifications(userId),
    enabled: !!userId,
    // enabled: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // console.log(data?.data?.data);
      // console.log(data?.data?.data[0]);
      setNotificationList(data?.data?.data[0]);
      return data;
    },
    onError: (err) => {
      console.log('useAllNotifications error', err);
      return err;
    },
  });
};
