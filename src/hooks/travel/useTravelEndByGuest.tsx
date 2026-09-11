'use client';

import { TEndQueries } from '@/components/UserProfileUpdated/Travels/EndTravel/EndTravel';
import { ITravelOdometerReading } from '@/types/travels/typeTravels';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export type TEndingInfoByGuest = TEndQueries & {
  imageUrlList?: any[];
  endTravelOdometer?: ITravelOdometerReading;
};

type TTravelEndByGuest = {
  reservationId: number;
  endingInfoByGuest: TEndingInfoByGuest;
};

const saveTravelEndByGuest = async ({ reservationId, endingInfoByGuest }: TTravelEndByGuest) => {
  // console.log(reservationId, endingInfoByGuest);

  const response = await axiosClient.put(`${apiUrl}/reservation/travel-end-by-guest/${reservationId}`, {
    ...endingInfoByGuest,
  });
  return response;
};

export const useTravelEndByGuest = () => {
  return useMutation({
    mutationFn: ({ reservationId, endingInfoByGuest }: TTravelEndByGuest) => saveTravelEndByGuest({ reservationId, endingInfoByGuest }),
    onSuccess: (data, variables) => {
      // console.log(data);
      const { endingInfoByGuest } = variables;
      // console.log(endingInfoByGuest);
    },
    onError: (err: any) => {
      console.log('useTravelEndByGuest mutation error', err);
      return err;
    },
  });
};
