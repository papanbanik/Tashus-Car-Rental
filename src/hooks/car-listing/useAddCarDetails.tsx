'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { CarAdditionalInfosState, VehicleObligationsState } from '@/types/car-listing/carInfoTypes';
import { TLicenseVerifiedData } from '@/types/car-listing/carListingTypes';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type TAddCarDetails = {
  hostId: string | undefined;
  listingId?: string;
  car: any;
  features: string[];
  additionalFeatures: any;
  additionalInfos: CarAdditionalInfosState;
  vehicleObligations: VehicleObligationsState;
  listingSteps: any;
  carNickName: string;
};

const addCarDetails = async ({
  hostId,
  listingId,
  car,
  features,
  additionalFeatures,
  additionalInfos,
  vehicleObligations,
  listingSteps,
  carNickName,
}: TAddCarDetails) => {
  //console.log(hostId, car, listingId, carNickName);

  const response = await axiosClient.post(`${apiUrl}/listing/car-details`, {
    hostId,
    car,
    listingId,
    features,
    additionalFeatures,
    additionalInfos,
    vehicleObligations,
    listingSteps,
    carNickName,
  });
  return response;
};

export const useAddCarDetails = () => {
  const {
    setListingId,
    handleSaveCurrentStep,
    listingId,
    carData,
    setCarData,
    setLicenseVerifiedData,
    listingErrorMessage,
    setListingErrorMessage,
    setListingSuccessMessage,
  } = useCarListingContext();
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: ({
      hostId,
      listingId,
      car,
      features,
      additionalFeatures,
      additionalInfos,
      vehicleObligations,
      listingSteps,
      carNickName,
    }: TAddCarDetails) =>
      addCarDetails({ hostId, listingId, car, features, additionalFeatures, additionalInfos, vehicleObligations, listingSteps, carNickName }),
    onSuccess: (data, variables) => {
      const { car, features, additionalFeatures, additionalInfos, vehicleObligations, carNickName } = variables;
      // console.log('useAddCarDetails response', data);
      // console.log('data', data?.data?.data);
      // setListingSuccessMessage('Vehicle Information Saved Successfully');
      openSnackBar({
        message: 'Vehicle Information Saved Successfully',
        severity: 'success',
        hideDuration: 5000,
      });
      // First time save
      if (data?.status === 201) {
        // const { listingId } = data?.data?.data;
        setListingId(data?.data?.data?.listingId);

        const tashus = JSON.parse(localStorage.getItem('tashus') || '{}');
        tashus.listingId = data?.data?.data?.listingId;
        localStorage.setItem('tashus', JSON.stringify(tashus));

        setCarData({ ...carData, car, features, additionalFeatures, additionalInfos, vehicleObligations, carNickName });
        setLicenseVerifiedData({} as TLicenseVerifiedData);

        handleSaveCurrentStep(1, data?.data?.data?.listingId);
      } else if (data?.status === 200 && data?.data?.data?.listingId === parseInt(listingId)) {
        // Update car information
        setCarData({ ...carData, car, features, additionalFeatures, additionalInfos, vehicleObligations, carNickName });
        handleSaveCurrentStep(1, data?.data?.data?.listingId);
      }
    },
    onError: (err: any) => {
      console.log('useAddCarDetails mutation error', err);
      // console.log('useAddCarDetails mutation error', err?.response);
      // setListingErrorMessage(err?.response?.data?.message || 'Error Saving Vehicle Information');
      openSnackBar({
        message: err?.response?.data?.message || 'Error Saving Vehicle Information',
        severity: 'error',
      });
      // console.log('useAddCarDetails mutation error', err?.AxiosError?.response);
      return err;
    },
  });
};
