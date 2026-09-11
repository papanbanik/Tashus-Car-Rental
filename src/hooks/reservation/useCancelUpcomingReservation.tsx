'use client';

import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { TCancelUpcomingReservationByHost } from '@/types/travels/typeEditTravels';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type TSaveCancelUpcomingReservation = {
  reservationId: number;
  cancelReservation: TCancelUpcomingReservationByHost;
};

const saveCancelUpcomingReservation = async ({ reservationId, cancelReservation }: TSaveCancelUpcomingReservation) => {
  const response = await axiosClient.put(`${apiUrl}/reservation/travel-cancel-by-host/${reservationId}`, {
    ...cancelReservation,
  });
  return response;
};

export const useCancelUpcomingReservation = () => {
  const { setTravelDetails, travelDetails } = useProfileInfoContext();
  const { closeModal } = useModalContext();
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: ({ reservationId, cancelReservation }: TSaveCancelUpcomingReservation) =>
      saveCancelUpcomingReservation({ reservationId, cancelReservation }),
    onSuccess: (data) => {
      // console.log(data);
      setTravelDetails({ ...travelDetails, reservationStatus: 'cancelledByHost' });
      openSnackBar({
        message: 'Travel Cancelled Successfully',
        severity: 'success',
      });
      closeModal();
    },
    onError: (err: any) => {
      console.log('useCancelUpcomingReservation mutation error', err);
      openSnackBar({ message: err?.response?.data?.message || 'Error cancelling reservation', severity: 'error' });
      return err;
    },
  });
};
