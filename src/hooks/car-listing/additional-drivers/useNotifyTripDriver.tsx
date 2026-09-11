'use client';

import { useSearchContext } from '@/context/SearchProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type TSaveAddNewDrivers = {
  reservationId: string;
  userId: string | undefined;
  fullName: string;
  email: string;
};

const saveAddTravelNewDrivers = async ({ reservationId, userId, fullName, email }: TSaveAddNewDrivers) => {
  const response = await axiosClient.put(`${apiUrl}/verify/send-driver-request-email-from-travel/${userId}`, {
    fullName,
    email,
    reservationId,
  });
  return response;
};

export const useNotifyTripDriver = () => {
  const { openSnackBar } = useSnackBarContext();
  const { setAdditionalDrivers, additionalDrivers } = useSearchContext(); //Set the additional Drivers
  return useMutation({
    mutationFn: ({ userId, reservationId, fullName, email }: TSaveAddNewDrivers) =>
      saveAddTravelNewDrivers({ userId, reservationId, fullName, email }),
    onSuccess: (data, variables) => {
      // console.log(data);
      // console.log(data?.data?.data);
      //   setAdditionalDrivers([...additionalDrivers, ...data?.data?.data]);
      //   console.log(additionalDrivers);
      const keepLatestOccurrence = (drivers: any) => {
        const latestOccurrenceMap = new Map();
        drivers.forEach((driver: any) => {
          latestOccurrenceMap.set(driver?.email, driver);
        });
        return Array.from(latestOccurrenceMap.values());
      };
      const updateOrAddDriver = (existingDrivers: any, newDriver: any) => {
        const updatedDrivers = keepLatestOccurrence([...existingDrivers, newDriver]);
        return updatedDrivers;
      };
      const updatedDrivers = updateOrAddDriver(additionalDrivers, data?.data?.data[0]);
      // console.log(updatedDrivers);
      setAdditionalDrivers(updatedDrivers);
    },
    onError: (err: any) => {
      console.log('useNotifyTripDrivers mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || 'Error saving additional drivers information',
        severity: 'error',
      });
      return err;
    },
  });
};
