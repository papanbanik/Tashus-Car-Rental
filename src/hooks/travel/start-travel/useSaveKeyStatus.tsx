'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { ITravelOdometerReading } from '@/types/travels/typeTravels';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface SaveKeyStatusParams {
  reservationId: number;
  startTravelOdometer?: ITravelOdometerReading;
}

const saveKeyStatus = async ({ reservationId, startTravelOdometer }: SaveKeyStatusParams) => {
  const response = await axiosClient.put(`${apiUrl}/reservation/travel-start/${reservationId}`, {
    ...(startTravelOdometer && startTravelOdometer),
  });

  return response;
};

export const useSaveKeyStatus = () => {
  const { travelDetails, setTravelDetails } = useProfileInfoContext();
  return useMutation({
    mutationFn: (bodyValues: SaveKeyStatusParams) => saveKeyStatus(bodyValues),
    onSuccess: (data) => {
      const updatedTravelDetails = { ...travelDetails, isTripStarted: true };
      setTravelDetails(updatedTravelDetails);
    },
    onError: (err: any) => {
      console.log('useSaveKeyStatus mutation error', err);
      return err;
    },
  });
};
