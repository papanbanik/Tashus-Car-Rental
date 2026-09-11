'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { OptimizedPhotoValues } from '@/types/commonTypes';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export type UpdateReservedVehicleParams = {
  reservationId: string;
  odometerValue?: number;
  odometerPhoto?: OptimizedPhotoValues;
  isBeforeReservation?: boolean;
};

const updateReservedVehicle = async ({ reservationId, odometerPhoto, odometerValue, isBeforeReservation }: UpdateReservedVehicleParams) => {
  const response = await axiosClient.put(`${apiUrl}/reservation/reservation-vehicle-info/${reservationId}`, {
    odometerPhoto,
    odometerValue,
    isBeforeReservation,
  });
  return response;
};

export const useUpdateReservedVehicle = () => {
  const { travelDetails, setTravelDetails } = useProfileInfoContext();
  const { openSnackBar } = useSnackBarContext();
  return useMutation({
    mutationFn: (bodyValues: UpdateReservedVehicleParams) => updateReservedVehicle(bodyValues),
    onSuccess: (data, variables) => {
      const { isBeforeReservation, odometerPhoto, odometerValue } = variables;
      setTravelDetails((prevDetails) => {
        return {
          ...prevDetails,
          tripInformation: {
            ...prevDetails?.tripInformation,
            vehicleInfoBeforeReservation: isBeforeReservation
              ? {
                  ...prevDetails?.tripInformation?.vehicleInfoBeforeReservation,
                  odometerValue,
                  odometerPhoto,
                }
              : prevDetails?.tripInformation?.vehicleInfoBeforeReservation,
            vehicleInfoAfterReservation: !isBeforeReservation
              ? {
                  ...prevDetails?.tripInformation?.vehicleInfoAfterReservation,
                  odometerValue,
                  odometerPhoto,
                }
              : prevDetails?.tripInformation?.vehicleInfoAfterReservation,
          },
        };
      });

      openSnackBar({
        message: data?.data?.data?.message ?? 'Updated reserved vehicle information successfully',
        severity: 'success',
      });
    },
    onError: (error: any) => {
      console.error('useUpdateReservedVehicle mutation error', error);
      openSnackBar({
        message: error?.response?.data?.message || error?.message || 'Error saving reserved  vehicle information',
        severity: 'error',
      });
      return error;
    },
  });
};
