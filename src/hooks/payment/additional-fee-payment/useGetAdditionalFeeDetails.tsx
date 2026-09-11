'use client';

import { useTravelContext } from '@/context/TravelProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL_V2;

const getReservationsById = async (reservationId: number | string) => {
  const response = await axiosClient.get(`${apiUrl}/reservation/additional-fee/${reservationId}`);
  return response;
};

export const useGetAdditionalFeeDetails = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const { setAdditionalFeeReservationDetails } = useTravelContext();
  return useQuery({
    queryKey: ['additional-fee-reservations', { reservationId }],
    queryFn: () => getReservationsById(reservationId),
    enabled: !!reservationId,
    refetchOnWindowFocus: true,
    onSuccess: (data) => {
      //   console.log(data?.data?.responseObject);
      setAdditionalFeeReservationDetails(data?.data?.responseObject);
      return data;
    },
    onError: (err) => {
      console.log('useGetAdditionalFeesByReservationId error', err);
      return err;
    },
  });
};
