'use client';

import { useHelpTopicArticleInfoContext } from '@/context/HelpTopicsArticlesProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getOwnerAgreement = async (reservationId: any, userId: string | undefined) => {
  const response = await axiosClient.get(`${apiUrl}/reservation/host-rental-agreement/${reservationId}/${userId}`);
  //   console.log(response);
  return response;
};

export const useOwnerAgreement = () => {
  const {
    userCred: { userId },
  } = useUserCredContext();
  const { setCustomMessage, customMessage } = useSearchContext();
  const { setOwnerAgreement } = useHelpTopicArticleInfoContext();
  const searchParams = useSearchParams();
  const reservationId = searchParams?.get('reservation-id');
  return useQuery({
    queryKey: ['owner-agreement', { reservationId, userId }],
    queryFn: () => getOwnerAgreement(reservationId, userId),
    enabled: !!reservationId && !!userId,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      //   console.log(data);
      // console.log(data?.data?.data);
      setOwnerAgreement(data?.data?.data);
      return data;
    },
    onError: (err: any) => {
      console.log('useOwnerAgreement error', err);
      // console.log(err?.request?.status);
      const errorMessage = err?.request?.status === 404 ? 'No Reservation or Owner Agreement Found!' : err?.message;
      // console.log(err?.request?.response);
      setCustomMessage(errorMessage);
      // console.log(customMessage);
      return err;
    },
  });
};
