'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type UnlistedVehicleProps = {
  userId: string;
  vehicleId: number;
};

const unlistedVehicle = async ({ userId, vehicleId }: UnlistedVehicleProps) => {
  const response = await axiosClient.put(`${apiUrl}/profile/vehicle-unlisted/${userId}/${vehicleId}`);
  return response;
};

export const useUnlistedVehicle = () => {
  const { setCarData } = useCarListingContext();
  const { openSnackBar } = useSnackBarContext();
  return useMutation({
    mutationFn: ({ userId, vehicleId }: UnlistedVehicleProps) => unlistedVehicle({ userId, vehicleId }),
    onSuccess: (data) => {
      setCarData((prevCarData: any) => ({
        ...prevCarData,
        listingStatus: 'unlisted',
      }));
      openSnackBar({
        message: data?.data?.message,
        severity: 'success',
        hideDuration: 5000,
      });
    },
    onError: (err: any) => {
      console.log('useUnlistedVehicle mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || 'Failed to unlisted the car.',
        severity: 'error',
      });
      return err;
    },
  });
};
