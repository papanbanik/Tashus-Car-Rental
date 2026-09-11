import { usePaymentDetailsContext } from '@/context/PaymentDetailsProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getPaymentConfirmation = async (reservationId?: number, revisedReservationId?: string) => {
  let url = `${apiUrl}/payment/validate-payment/${reservationId}`;
  if (revisedReservationId) {
    url += `?revisedReservationId=${revisedReservationId}`;
  }
  const response = await axiosClient.get(url);
  return response;
};

export const usePaymentConfirmation = () => {
  const { reservationPaymentDetails } = usePaymentDetailsContext();
  const {
    userCred: { userId },
  } = useUserCredContext();
  const { reservationId: reservationIdParam } = useParams<{ reservationId: string }>();

  const reservationId = parseInt(reservationIdParam) || parseInt(reservationPaymentDetails?.reservationId?.toString());
  const revisedReservationId = reservationPaymentDetails?.revisedReservationId;

  const haveReservationORRevisedId = !!reservationId || !!revisedReservationId;

  return useQuery({
    queryKey: ['payment-check', { reservationId, revisedReservationId }],
    queryFn: () => getPaymentConfirmation(reservationId, revisedReservationId),
    enabled: !!userId && haveReservationORRevisedId,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      return data;
    },
    onError: (err) => {
      console.log('usePaymentConfirmation error', err);
      return err;
    },
  });
};
