'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type CarAvailabilitySave = {
  listingId: string;
  availability: any;
  listingSteps: any;
};

const saveCarAvailability = async ({ listingId, availability, listingSteps }: CarAvailabilitySave) => {
  // console.log(listingId, availability);

  const response = await axiosClient.put(`${apiUrl}/listing/availability/${listingId}`, {
    availability,
    listingSteps,
  });
  return response;
};

export const useSaveCarAvailability = () => {
  const { handleSaveCurrentStep, carData, setCarData } = useCarListingContext();
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: ({ listingId, availability, listingSteps }: CarAvailabilitySave) => saveCarAvailability({ listingId, availability, listingSteps }),
    onSuccess: (data, variables) => {
      const { availability } = variables;
      setCarData({ ...carData, availability });
      openSnackBar({
        message: 'Vehicle Availability Saved Successfully',
        severity: 'success',
      });
      handleSaveCurrentStep(3, data?.data?.data?.listingId);
    },
    onError: (err: any) => {
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'Error Saving Vehicle Availability',
        severity: 'error',
      });
      console.log('useSaveCarAvailability mutation error', err);
      return err;
    },
  });
};
