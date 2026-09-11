'use client';

import { usePaymentDetailsContext } from '@/context/PaymentDetailsProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { generatePaymentDetails } from '@/utils/Functions/payment/reservationPayment';
import { useQuery } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getReservationFind = async (reservationId: number | undefined) => {
  const response = await axiosClient.get(`${apiUrl}/reservation/find/${reservationId}`);
  return response;
};

export const useReservationFind = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const reservationID = parseInt(reservationId);
  const { setSupportVehicleID } = useProfileInfoContext();
  const { setReservationPaymentDetails } = usePaymentDetailsContext();

  const pathName = usePathname();
  const isPaymentPage = pathName.includes('/payment') ? true : false;

  return useQuery({
    queryKey: ['reservation-find', { reservationID }],
    queryFn: () => getReservationFind(reservationID),
    enabled: !!reservationID,
    refetchOnWindowFocus: isPaymentPage,
    onSuccess: (data) => {
      setSupportVehicleID(data?.data?.carListingId);
      const paymentDetails = generatePaymentDetails(data?.data);
      setReservationPaymentDetails(paymentDetails);
      return data;
    },
    onError: (err) => {
      console.log('useReservationFind error', err);
      return err;
    },
  });
};
