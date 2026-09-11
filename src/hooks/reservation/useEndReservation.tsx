'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export type TSaveEndReservation = {
  reservationId: number;
  isKeyReceivedByPartner: boolean;
};

const saveEndReservation = async ({ reservationId, isKeyReceivedByPartner }: TSaveEndReservation) => {
  const response = await axiosClient.put(`${apiUrl}/reservation/travel-end-by-partner/${reservationId}`, {
    isKeyReceivedByPartner,
  });
  return response;
};

export const useEndReservation = () => {
  const { travelDetails, setTravelDetails } = useProfileInfoContext();
  return useMutation({
    mutationFn: ({ reservationId, isKeyReceivedByPartner }: TSaveEndReservation) => saveEndReservation({ reservationId, isKeyReceivedByPartner }),
    onSuccess: (data) => {
      // console.log('Key Status', data);
      // const updatedTravelDetails = { ...travelDetails, isTripStarted: true };
      // setTravelDetails(updatedTravelDetails);
    },
    onError: (err: any) => {
      console.log('useEndReservation mutation error', err);
      return err;
    },
  });
};
