'use client';

import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export type TSaveEditedTravel = {
  reservationId: number;
  guestId: string;
  revisedReservationData: any;
};

const saveEditedTravel = async ({ reservationId, guestId, revisedReservationData }: TSaveEditedTravel) => {
  const response = await axiosClient.put(`${apiUrl}/reservation/revised/${guestId}/${reservationId}`, {
    ...revisedReservationData,
    origin: 'web',
  });
  return response;
};

export const useTravelEdit = () => {
  const { travelDetails, setTravelDetails } = useProfileInfoContext();
  const { closeModal } = useModalContext();

  return useMutation({
    mutationFn: ({ reservationId, guestId, revisedReservationData }: TSaveEditedTravel) =>
      saveEditedTravel({ reservationId, guestId, revisedReservationData }),
    onSuccess: (data) => {
      // console.log('Updated Travel', data);
      // closeModal();
      // const updatedTravelDetails = { ...travelDetails, isTripStarted: true };
      // setTravelDetails(updatedTravelDetails);
    },
    onError: (err: any) => {
      console.log('useTravelEdit mutation error', err);
      return err;
    },
  });
};
