'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { TCancelUpcomingTravelByGuest } from '@/types/travels/typeEditTravels';
import { CancellationInfo, TravelDetailsReservationInfo } from '@/types/travels/typeTravels';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type TSaveCancelUpcomingTravel = {
  reservationId: number;
  cancelTravel: TCancelUpcomingTravelByGuest;
};

const saveCancelUpcomingTravel = async ({ reservationId, cancelTravel }: TSaveCancelUpcomingTravel) => {
  const response = await axiosClient.put(`${apiUrl}/reservation/travel-cancel/${reservationId}`, {
    ...cancelTravel,
  });
  return response;
};

export const useCancelUpcomingTravel = () => {
  const { setTravelDetails, travelDetails } = useProfileInfoContext();
  const { setUpdatedTravelData } = useTravelContext();

  return useMutation({
    mutationFn: ({ reservationId, cancelTravel }: TSaveCancelUpcomingTravel) => saveCancelUpcomingTravel({ reservationId, cancelTravel }),
    onSuccess: (data) => {
      const cancellationInfo: CancellationInfo = data?.data?.data[0];
      setTravelDetails({ ...travelDetails, reservationStatus: 'cancelledByGuest' });
      setUpdatedTravelData((prev) => ({ ...prev, cancellationInfo }));
    },
    onError: (err: any) => {
      console.log('useCancelUpcomingTravel mutation error', err);
      return err;
    },
  });
};
