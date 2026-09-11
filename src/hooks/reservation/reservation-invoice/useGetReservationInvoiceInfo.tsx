import { useTravelContext } from '@/context/TravelProvider';
import { ReservationInvoiceInfoData } from '@/types/reservations/reservationInvoiceTypes';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';

interface GetReservationInvoiceInfoParams {
  reservationId: string;
  revisedId?: string;
}

const getReservationInvoiceInfo = async ({ reservationId, revisedId }: GetReservationInvoiceInfoParams) => {
  const response = await axiosClient.get(`${process.env.NEXT_PUBLIC_API_URL}/reservation/reservation-invoice-info/${reservationId}/${revisedId}`);

  return response;
};

export const useGetReservationInvoiceInfo = (params: GetReservationInvoiceInfoParams) => {
  const { setReservationInvoiceInfo } = useTravelContext();
  return useQuery({
    queryKey: ['reservation-invoice-info', params],
    queryFn: async () => {
      try {
        const data = await getReservationInvoiceInfo(params);
        const _reservationInvoiceInfo = data?.data?.data[0] ?? {};
        setReservationInvoiceInfo(_reservationInvoiceInfo);
        return data;
      } catch (err: any) {
        console.log('useGetReservationInvoiceInfo', err);
        setReservationInvoiceInfo({} as ReservationInvoiceInfoData);
        throw err;
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!params?.reservationId,
  });
};
