'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { CustomPricingValues } from '@/types/user-profile/customPriceTypes';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const removeCustomPrice = async (customPricing: CustomPricingValues) => {
  const response = await axiosClient.delete(`${apiUrl}/listing/custom-pricing`, {
    data: customPricing,
  });
  return response;
};

export const useRemoveCustomPrice = () => {
  const { openSnackBar } = useSnackBarContext();
  const { userVehiclePrice, setUserVehiclePrice } = useCarListingContext();

  return useMutation({
    mutationFn: (customPricing: CustomPricingValues) => removeCustomPrice(customPricing),
    onSuccess: async (data) => {
      const updatedListings = data?.data?.data || [];
      const updatedVehiclePrice = [...userVehiclePrice];

      updatedListings.forEach((updatedListing: any) => {
        const updatedListingId = updatedListing.listingId;
        const updatedListingIndex = updatedVehiclePrice.findIndex((listing) => listing.listingId === updatedListingId);
        if (updatedListingIndex !== -1) {
          updatedVehiclePrice[updatedListingIndex] = updatedListing;
        }
      });

      setUserVehiclePrice(updatedVehiclePrice);
      openSnackBar({
        message: data?.data?.message || 'Price Removed Successfully',
        severity: 'success',
      });
      return data;
    },
    onError: (err: any) => {
      console.log('useRemoveCustomPrice mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'Error Removing Price',
        severity: 'error',
      });
      return err;
    },
  });
};
