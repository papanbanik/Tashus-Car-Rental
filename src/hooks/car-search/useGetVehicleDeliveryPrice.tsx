'use client';

import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface GetVehicleDeliveryPriceParams {
  drivingDistanceInKm: number;
}

const getVehicleDeliveryPrice = async ({ drivingDistanceInKm }: GetVehicleDeliveryPriceParams) => {
  const response = await axios.put(`${apiUrl}/search/vehicle-delivery-price/${drivingDistanceInKm}`, {});
  return response;
};

export const useGetVehicleDeliveryPrice = () => {
  const { openSnackBar } = useSnackBarContext();
  return useMutation({
    mutationFn: (bodyValues: GetVehicleDeliveryPriceParams) => getVehicleDeliveryPrice(bodyValues),
    onSuccess: (data) => {},
    onError: (err: any) => {
      console.error('useGetVehicleDeliveryPrice mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'An error occurred while calculating price.',
        severity: 'error',
      });
      return err;
    },
  });
};
