'use client';

import { IReservationVehicleInfo } from '@/types/travels/typeTravels';
import axiosClient from '@/utils/configs/axiosInstance';
import environment from '@/utils/configs/environment';
import { useMutation } from '@tanstack/react-query';

type TTravelEndByGuest = {
  reservationId: number;
  carKeyReceived: boolean;
  endTravelOdometer: IReservationVehicleInfo;
};

const partnerTravelEnd = async ({ reservationId, carKeyReceived, endTravelOdometer }: TTravelEndByGuest) => {
  const response = await axiosClient.put(`${environment?.API_URL}/v2/reservation/partner-end-reservation/${reservationId}`, {
    carKeyReceived,
    endTravelOdometer,
  });
  return response;
};

export const usePartnerEndReservation = () => {
  return useMutation({
    mutationFn: ({ reservationId, carKeyReceived, endTravelOdometer }: TTravelEndByGuest) =>
      partnerTravelEnd({ reservationId, carKeyReceived, endTravelOdometer }),
    onSuccess: () => {},
    onError: (err: any) => {
      console.log('usePartnerEndReservation mutation error', err);
      return err;
    },
  });
};
