'use client';

import { useSnackBarContext } from '@/context/SnackBarProvider';
import { TSaveAdditionalDriverInfo } from '@/types/checkout/guestVerificationTypes';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type TSaveAddNewDrivers = {
  listingId: string;
  hostId: string | undefined;
  newDrivers: TSaveAdditionalDriverInfo[];
};

const saveAddNewDrivers = async ({ listingId, hostId, newDrivers }: TSaveAddNewDrivers) => {
  const response = await axiosClient.put(`${apiUrl}/listing/additional-drivers/${listingId}/${hostId}`, {
    newDrivers,
  });
  return response;
};

export const useSaveAddNewDrivers = () => {
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: ({ hostId, listingId, newDrivers }: TSaveAddNewDrivers) => saveAddNewDrivers({ hostId, listingId, newDrivers }),
    onSuccess: (data, variables) => {
      // console.log(data);
    },
    onError: (err: any) => {
      console.log('useSaveAddNewDrivers mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || 'Error saving additional drivers information',
        severity: 'error',
      });
      return err;
    },
  });
};
