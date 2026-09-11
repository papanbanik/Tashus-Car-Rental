'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type CarInsuranceSave = {
  listingId: string;
  hostId: string | undefined;
  listingSteps: any;
  insurance: any;
};

const saveCarInsurance = async ({ listingId, hostId, listingSteps, insurance }: CarInsuranceSave) => {
  // console.log(listingId);
  // console.log(insurance);
  // const response = await axiosClient.put(`${apiUrl}/listing/update-step/${listingId}`, {
  // const response = await axiosClient.put(`${apiUrl}/listing/partnership-policy/${listingId}`, {
  const response = await axiosClient.put(`${apiUrl}/listing/insurance-plan/${listingId}/${hostId}`, {
    listingSteps,
    insurance,
  });
  return response;
};

export const useSaveCarInsurance = () => {
  const { handleSaveCurrentStep, carData, setCarData } = useCarListingContext();
  const { openSnackBar } = useSnackBarContext();
  return useMutation({
    mutationFn: ({ hostId, listingId, listingSteps, insurance }: CarInsuranceSave) =>
      saveCarInsurance({ hostId, listingId, listingSteps, insurance }),
    onSuccess: (data, variables) => {
      // console.log(data);
      // console.log(data?.data);
      // console.log(data?.data?.data);
      // const { insurance } = variables?.insurance;
      // console.log(variables);
      // console.log(variables?.insurance);
      // console.log(insurance);
      const { coverageType, coveragePercentage, excessFee, carMarketValue } = variables?.insurance || {};
      // console.log(coverageType, coveragePercentage, excessFee, carMarketValue);
      // setCarData({ ...carData, insurance });
      const existingInsurancePolicies = Array.isArray(carData?.insurancePolicies) ? carData?.insurancePolicies : []; //Type Error resolve
      const insurancePolicies = [
        // ...carData?.insurancePolicies,
        ...existingInsurancePolicies,
        {
          coverageType,
          excessFee: parseInt(excessFee),
          coveragePercentage: parseInt(coveragePercentage),
        },
      ];
      // console.log(insurancePolicies);
      setCarData({ ...carData, insurancePolicies, carMarketValue: parseInt(carMarketValue) });
      // console.log('Saving Insurance:', insurance);
      // console.log(carData);
      handleSaveCurrentStep(8, data?.data?.data?.listingId);
      openSnackBar({
        message: data?.data?.message || 'Partnership Policy Saved Successfully',
        severity: 'success',
      });
    },
    onError: (err: any) => {
      console.log('useSaveCarInsurance mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'Error Saving Partnership Policy',
        severity: 'error',
      });
      return err;
    },
  });
};
