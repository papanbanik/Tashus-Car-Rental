'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type CarRatesSave = {
  listingId: string;
  rates: any;
  listingSteps: any;
};

const saveCarRates = async ({ listingId, rates, listingSteps }: CarRatesSave) => {
  // console.log(listingId, rates);

  const response = await axiosClient.put(`${apiUrl}/listing/rates/${listingId}`, {
    rates,
    listingSteps,
  });
  return response;
};

export const useSaveCarRates = () => {
  const { handleSaveCurrentStep, carData, setCarData } = useCarListingContext();
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: ({ listingId, rates, listingSteps }: CarRatesSave) => saveCarRates({ listingId, rates, listingSteps }),
    onSuccess: (data, variables) => {
      // console.log(data);
      // console.log(data?.data?.data);
      const { rates } = variables;
      setCarData({ ...carData, rates });
      openSnackBar({
        message: 'Rates Saved Successfully',
        severity: 'success',
      });
      handleSaveCurrentStep(4, data?.data?.data?.listingId);
    },
    onError: (err: any) => {
      console.log('useSaveCarRates mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'Error Saving Rates',
        severity: 'error',
      });
      return err;
    },
  });
};
