'use client';

import { useSearchContext } from '@/context/SearchProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type DriverDeletionProps = {
  listingId: string | undefined;
  driverId: string | undefined;
  requestId: string | undefined;
  reservationId?: string | undefined;
};

const driverRemoved = async ({ listingId, driverId, requestId, reservationId }: DriverDeletionProps) => {
  const response = await axiosClient.put(`${apiUrl}/verify/remove-additional-driver/${driverId}`, {
    listingId,
    reservationId,
    requestId,
  });
  return response;
};

export const useRemoveDriver = () => {
  const { setAdditionalDrivers, additionalDrivers } = useSearchContext();
  const { openSnackBar } = useSnackBarContext();
  const pathName = usePathname();
  // console.log(additionalDrivers);
  return useMutation({
    mutationFn: ({ listingId, driverId, requestId, reservationId }: DriverDeletionProps) =>
      driverRemoved({ listingId, driverId, requestId, reservationId }),
    onSuccess: (data, variables) => {
      const { driverId } = variables;
      // console.log(driverId);
      // console.log(data);
      if (pathName.includes('travels')) {
        const updatedDrivers = additionalDrivers?.filter((driver) => driver?._id !== driverId);
        setAdditionalDrivers(updatedDrivers);
      }
      // const removedDriver = (drivers: any) => {
      //   return drivers.map((driver: any) => (driver._id === driverId ? { ...driver, isActive: false } : { ...driver }));
      // };
      // const updatedDrivers = removedDriver(additionalDrivers);
      openSnackBar({
        message: 'Additional Driver Removed Successfully',
        severity: 'success',
        hideDuration: 3000,
      });
      // console.log(updatedDrivers);
      return data;
    },
    onError: (err: any) => {
      console.log('useRemoveDriver mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'Failed to Remove Additional Driver',
        severity: 'error',
      });
      return err;
    },
  });
};
