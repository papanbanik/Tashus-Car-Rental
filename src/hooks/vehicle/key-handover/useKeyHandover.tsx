'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
type VehicleKeyHandoverType = {
  listingId: number;
  label: string;
  value: string;
};
const addKeyHandover = async ({ listingId, label, value }: VehicleKeyHandoverType) => {
  const response = await axiosClient.put(`${apiUrl}/listing/key-handover/${listingId}`, {
    label,
    value,
  });
  return response;
};

export const useKeyHandover = () => {
  const { openSnackBar } = useSnackBarContext();
  const { carData, setCarData } = useCarListingContext();
  return useMutation({
    mutationFn: ({ listingId, label, value }: VehicleKeyHandoverType) => addKeyHandover({ listingId, label, value }),
    onSuccess: (data, variables) => {
      setCarData({
        ...carData,
        keyHandovers: [...(carData?.keyHandovers || []), { label: variables?.label, value: variables?.value }],
      });
      openSnackBar({
        message: data?.data?.message || 'Key Handover Updated Successfully',
        severity: 'success',
      });
      return data;
    },
    onError: (err: any) => {
      console.log('useBlockDates mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'Error Updating Key Handover',
        severity: 'error',
      });
      return err;
    },
  });
};
