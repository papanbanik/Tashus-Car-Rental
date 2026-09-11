'use client';

import { useHelpTopicArticleInfoContext } from '@/context/HelpTopicsArticlesProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getAgreementDetails = async (reservationId: any, userId: string | undefined) => {
  const response = await axiosClient.get(`${apiUrl}/reservation/rental-agreement/${reservationId}/${userId}`);
  // console.log(response);
  return response;
};

export const useAgreementDetails = () => {
  const {
    userCred: { userId },
  } = useUserCredContext();
  const { setCustomMessage, customMessage } = useSearchContext();
  const { setAgreementDetails } = useHelpTopicArticleInfoContext();
  const searchParams = useSearchParams();
  const reservationId = searchParams?.get('reservation-id');
  return useQuery({
    queryKey: ['agreement-details', { reservationId, userId }],
    queryFn: () => getAgreementDetails(reservationId, userId),
    enabled: !!reservationId && !!userId,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // console.log(data);
      // console.log(data?.data?.data);
      setAgreementDetails(data?.data?.data);
      return data;
    },
    onError: (err: any) => {
      console.log('useAgreementDetails error', err);
      // console.log(err?.request?.status);
      const errorMessage = err?.request?.status === 404 ? 'No Reservation or Rental Agreement Found!' : err?.message;
      // console.log(err?.request?.response);
      setCustomMessage(errorMessage);
      // console.log(customMessage);
      return err;
    },
  });
};
