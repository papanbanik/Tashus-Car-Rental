'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { ServiceLogState } from '@/types/car-listing/carDistanceInfoTypes';
import { CarFuelEconomyType } from '@/types/car-listing/carListingTypes';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type CarDistanceSave = {
  listingId: string;
  distance: any;
  fuelGauge?: any;
  serviceLog?: any;
  fuelEconomy?: CarFuelEconomyType;
  listingSteps: any;
  showServiceLog?: boolean;
};

const saveCarDistance = async ({ listingId, distance, serviceLog, fuelGauge, fuelEconomy, listingSteps, showServiceLog }: CarDistanceSave) => {
  // console.log('Saving car distance:', distance, listingId);
  const response = await axiosClient.put(`${apiUrl}/listing/distance/${listingId}`, {
    serviceLog,
    distance,
    fuelGauge,
    fuelEconomy,
    listingSteps,
    showServiceLog,
  });
  // console.log('Save car distance response:', response);
  return response;
};

export const useSaveCarDistance = () => {
  const { handleSaveCurrentStep, carData, setCarData } = useCarListingContext();
  const { openSnackBar } = useSnackBarContext();
  return useMutation({
    mutationFn: ({ listingId, distance, fuelGauge, serviceLog, fuelEconomy, listingSteps, showServiceLog }: CarDistanceSave) =>
      saveCarDistance({ listingId, distance, fuelGauge, serviceLog, fuelEconomy, listingSteps, showServiceLog }),
    onSuccess: (data, variables) => {
      // console.log(variables);
      const { distance, serviceLog, fuelGauge, fuelEconomy } = variables;
      // console.log();
      // console.log(serviceLog);
      // console.log(fuelGauge);
      // For set FuelGauge
      const { vehicleKilometersRange, attachmentOfFuelGauge } = fuelGauge || {};
      const existingFuelGauges = Array.isArray(carData?.distance?.fuelGauges) ? carData?.distance?.fuelGauges : [];
      const newFuelGauge = {
        vehicleKilometersRange: parseInt(vehicleKilometersRange),
        attachmentOfFuelGauge,
      };
      // const updatedFuelGauges = [...existingFuelGauges, newFuelGauge];
      const updatedFuelGauges = fuelGauge ? [...existingFuelGauges, newFuelGauge] : [...existingFuelGauges];
      // For set service log
      const { serviceDate, odometer, documentInfo, nextServiceDate, nextServiceDueOdometer } = serviceLog || {};
      // console.log(carData);
      // console.log(serviceDate, odometer, documentInfo, nextServiceDate);
      const existingServiceLogs: ServiceLogState[] = Array.isArray(carData?.carServiceLog?.serviceLogs)
        ? carData?.carServiceLog?.serviceLogs ?? []
        : [];
      // const serviceLogs = [
      //   ...existingServiceLogs,
      //   {
      //     serviceDate,
      //     odometer: parseInt(odometer),
      //     documentInfo,
      //     nextServiceDate,
      //     nextServiceDueOdometer: parseInt(nextServiceDueOdometer),
      //     status: 'pending',
      //   },
      // ];
      const serviceLogs: ServiceLogState[] = serviceLog
        ? [
            ...existingServiceLogs,
            {
              serviceDate,
              odometer: parseInt(odometer) || 0,
              documentInfo,
              nextServiceDate,
              nextServiceDueOdometer: parseInt(nextServiceDueOdometer) || 0,
              status: 'pending',
            },
          ]
        : [...existingServiceLogs];
      // setCarData({ ...carData, distance, serviceLogs });
      // setCarData({ ...carData, distance, carServiceLog: { serviceLogs } });
      setCarData({ ...carData, distance: { ...distance, fuelGauges: updatedFuelGauges, fuelEconomy: fuelEconomy }, carServiceLog: { serviceLogs } });
      // console.log(data);
      // console.log('Saving car distance:', distance);
      // console.log('Car Service Log:', carData?.carServiceLog);
      // console.log('Car Service Log:', carData?.carServiceLog?.serviceLogs);
      openSnackBar({
        message: data?.data?.message || 'Distance and Service Logs Saved Successfully',
        severity: 'success',
      });
      // console.log(data?.data?.data[0]?.listingId);
      // console.log(data?.data?.data?.listingId);
      handleSaveCurrentStep(7, data?.data?.data[0]?.listingId);
    },
    onError: (err: any) => {
      console.log('useSaveCarDistance mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'Error Saving Distance',
        severity: 'error',
      });
      return err;
    },
  });
};
