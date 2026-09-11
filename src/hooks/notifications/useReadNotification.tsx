'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
type ReadNotificationProps = {
  notificationId: string;
};
const readNotification = async ({ notificationId }: ReadNotificationProps) => {
  const response = await axiosClient.put(`${apiUrl}/profile/notification-read/${notificationId}`, {});
  return response;
};

export const useReadNotification = () => {
  const { notificationList, setNotificationList } = useProfileInfoContext();
  return useMutation({
    mutationFn: ({ notificationId }: ReadNotificationProps) => readNotification({ notificationId }),
    onSuccess: (data, variables) => {
      // console.log(variables);
      // console.log(notificationList);
      // console.log(data);
      // console.log(data?.data?.data[0]?.id);
      const updatedNotificationList = notificationList?.map((notification: any) => {
        // console.log(notification._id);
        if (notification._id === data?.data?.data[0]?.id) {
          return { ...notification, isRead: true };
        }
        return notification;
      });
      setNotificationList(updatedNotificationList);

      // console.log(updatedNotificationList);
    },
    onError: (err: any) => {
      return err;
    },
  });
};
