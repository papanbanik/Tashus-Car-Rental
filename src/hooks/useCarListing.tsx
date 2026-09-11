'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { CarFeaturesValues, CarPickupLocationValues } from '@/types/car-listing/carListingTypes';
import { getCarListingSteps } from '@/utils/Lists/carListingSteps';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type CarFeaturesSave = Omit<CarFeaturesValues, 'additionalFeatures'> & {
  listingId: string | undefined;
  additionalFeatures: string[];
};

type CarPickupLocationSave = Omit<CarPickupLocationValues, 'pickupLocations'> & {
  listingId: string | undefined;
  listingSteps: any;
};

const addCarFeatures = async ({ listingId, features, additionalFeatures, additionalInfos }: CarFeaturesSave) => {
  // console.log(listingId, features, additionalFeatures, additionalInfos);

  const response = await axiosClient.put(`${apiUrl}/listing/features-description/${listingId}`, {
    features,
    additionalFeatures,
    additionalInfos,
  });
  return response;
};

const addCarPickupLocation = async ({
  listingId,
  street,
  state,
  city,
  country,
  coordinates,
  postalCode,
  parkingInstructions,
  stateShortCode,
  countryShortCode,
  listingSteps,
}: CarPickupLocationSave) => {
  try {
    const response = await axiosClient.put(`${apiUrl}/listing/pickup-location/${listingId}`, {
      pickupAddress: { postalCode, city, state, stateShortCode, country, countryShortCode, street, coordinates },
      parkingInstructions: parkingInstructions,
      listingSteps,
    });
    return response;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

const getCarListSteps = async (listingId: string) => {
  const response = await axiosClient.get(`${apiUrl}/listing/listed-car/${listingId}`);
  return response;
};

// export const useAddCarFeatures = () => {
//   const { setListingSteps, handleSaveCurrentStep, listingId, setCarData, carData } = useCarListingContext();

//   return useMutation({
//     mutationFn: ({ listingId, features, additionalFeatures, additionalInfos }: CarFeaturesSave) =>
//       addCarFeatures({ listingId, features, additionalFeatures, additionalInfos }),
//     onSuccess: (data, variables) => {
//       // console.log('data', data);
//       const { features, additionalFeatures, additionalInfos } = variables;
//       if (data?.data?.data?.listingId === listingId) {
//         setCarData({ ...carData, features, additionalFeatures, additionalInfos });
//       }
//     },
//     onError: (err) => {
//       console.log('useAddCarFeatures mutation error', err);
//       return err;
//     },
//   });
// };

export const useCarListingSteps = (customSuccessFn?: (vehicleData: any) => any) => {
  const { listingId, setCarData, getLastStep, setListingSteps, setCurrentStep, enableListSteps, setEnableListSteps } = useCarListingContext();
  const router = useRouter();
  // console.log(listingId);

  return useQuery({
    queryKey: ['car-list-steps', listingId],
    queryFn: () => getCarListSteps(listingId),
    enabled: enableListSteps && !!listingId,
    onSuccess: (data) => {
      // console.log('data listing steps', data?.data);
      if (customSuccessFn) {
        customSuccessFn(data?.data);
        return;
      }
      setCarData(data?.data);
      const { listingSteps: storedSteps } = data?.data;
      if (storedSteps.length > 0) {
        let lastCompletedStep = getLastStep(storedSteps);
        const tempListingSteps = [...getCarListingSteps()];
        const updatedCarList = tempListingSteps.map((car) => ({
          ...car,
          isCurrent: car.id === lastCompletedStep?.step + 1 ? true : false,
          isCompleted: storedSteps.find((step: any) => step.step === car.id)?.completed,
        }));
        let tempCurrentStep = [...updatedCarList].find((step) => step.isCurrent);
        const lastString = `${listingId}/${tempCurrentStep?.urlString}`;

        setListingSteps(updatedCarList);
        setCurrentStep(tempCurrentStep);
        setEnableListSteps(false);

        // console.log(updatedCarList);
        // console.log(tempCurrentStep);
        // console.log(storedSteps);
        // console.log(listingSteps);
        // console.log(`${process.env.NEXT_PUBLIC_DOMAIN}/car-listing/${tempCurrentStep?.id === 1 ? '' : lastString}`);

        router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/car-listing/${tempCurrentStep?.id === 1 ? '' : lastString}`);
      }
    },
  });
};

export const useAddPickupLocation = () => {
  const { setListingSteps, handleSaveCurrentStep, listingId, setCarData, carData } = useCarListingContext();
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: ({
      listingId,
      street,
      state,
      city,
      country,
      coordinates,
      postalCode,
      parkingInstructions,
      stateShortCode,
      countryShortCode,
      listingSteps,
    }: CarPickupLocationSave) =>
      addCarPickupLocation({
        listingId,
        street,
        state,
        city,
        country,
        coordinates,
        postalCode,
        parkingInstructions,
        stateShortCode,
        countryShortCode,
        listingSteps,
      }),
    onSuccess: (data, variables) => {
      const { listingId, street, state, city, country, coordinates, postalCode, parkingInstructions, stateShortCode, countryShortCode } = variables;
      if (data?.data?.data?.listingId === parseInt(listingId ?? ' ', 10)) {
        setCarData({
          ...carData,
          location: {
            pickupAddress: {
              street,
              state,
              city,
              country,
              coordinates,
              postalCode,
              stateShortCode,
              countryShortCode,
            },
            parkingInstructions: parkingInstructions,
          },
        });
      }

      openSnackBar({
        message: 'Location Saved Successfully',
        severity: 'success',
      });
      handleSaveCurrentStep(2, data?.data?.data?.listingId);
    },
    onError: (err: any) => {
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'Error Saving Location',
        severity: 'error',
      });
      console.log('useAddCarFeatures mutation error', err);
      return err;
    },
  });
};
