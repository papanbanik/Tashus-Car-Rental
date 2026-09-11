'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type CarViewPostSave = {
  listingId: string;
  listingSteps: any;
};

const saveCarViewPost = async ({ listingId, listingSteps }: CarViewPostSave) => {
  const response = await axiosClient.put(`${apiUrl}/listing/listing-status/${listingId}`, {
    listingSteps,
  });
  return response;
};

export const useSaveCarViewPost = () => {
  const { handleSaveCurrentStep } = useCarListingContext();
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: ({ listingId, listingSteps }: CarViewPostSave) => saveCarViewPost({ listingId, listingSteps }),
    onSuccess: (data) => {
      handleSaveCurrentStep(9, data?.data?.data?.listingId);
      openSnackBar({
        message: 'All listing steps completed successfully',
        severity: 'success',
        hideDuration: 5000,
      });
    },
    onError: (err: any) => {
      console.log('useSaveCarViewPost mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || 'Error Saving Information',
        severity: 'error',
      });
      return err;
    },
  });
};
