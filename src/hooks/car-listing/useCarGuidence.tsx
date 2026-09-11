'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type CarGuidelinesSave = {
  listingId: string;
  guidelines: any;
  listingSteps: any;
};

const saveCarGuidelines = async ({ listingId, guidelines, listingSteps }: CarGuidelinesSave) => {
  // console.log('Saving car guidelines:', guidelines, listingId);
  const response = await axiosClient.put(`${apiUrl}/listing/guidelines/${listingId}`, {
    guidelines,
    listingSteps,
  });
  // console.log('Save car guidelines response:', response);
  return response;
};

export const useSaveCarGuidelines = () => {
  const { handleSaveCurrentStep, carData, setCarData } = useCarListingContext();
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: ({ listingId, guidelines, listingSteps }: CarGuidelinesSave) => saveCarGuidelines({ listingId, guidelines, listingSteps }),
    onSuccess: (data, variables) => {
      const { guidelines } = variables;
      setCarData({ ...carData, guidelines });
      // console.log('Saving car guidelines:', guidelines);
      openSnackBar({
        message: 'Guidelines Saved Successfully',
        severity: 'success',
      });
      handleSaveCurrentStep(5, data?.data?.data?.listingId);
    },
    onError: (err: any) => {
      console.log('useSaveCarGuidelines mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'Error Saving Guidelines',
        severity: 'error',
      });
      return err;
    },
  });
};
