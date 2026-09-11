'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_DRIVER_API_URL;

const getDeliveryDetails = async (reservationId: number) => {
  const response = await axiosClient.get(`${apiUrl}/v1/delivery-request/${reservationId}`);
  return response;
};

export const useGetDeliveryDetails = () => {
  const { travelId, reservationId: reservationIdParam } = useParams<{ travelId: string; reservationId: string }>();
  const reservationID = parseInt(travelId) || parseInt(reservationIdParam);
  const { travelDetails } = useProfileInfoContext();
  const { setReservationDeliveryDetails } = useTravelContext();
  const { userCred } = useUserCredContext();
  const enabledKey = !!reservationID && !!userCred?.userId && travelDetails?.reservationInfo?.isDeliveryEnabled;
  return useQuery({
    queryKey: ['delivery-details', { reservationID }],
    queryFn: () => getDeliveryDetails(reservationID),
    enabled: enabledKey,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setReservationDeliveryDetails(data?.data?.responseObject);
    },
    onError: (err) => {
      console.log('useDeliveryDetails error', err);
      return err;
    },
  });
};
