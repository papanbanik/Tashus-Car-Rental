'use client';

import { useGetAllCommentsOfATicketContext } from '@/context/AllCommentsOfATicketProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getAllCommentsOfATicket = async (supportTicketId: string) => {
  const response = await axiosClient.get(`${apiUrl}/support-ticket/get-one/${supportTicketId}`);
  return response.data;
};

export const useGetAllCommentsOfATicket = (currentSupportChatId: any) => {
  const { setAllComments } = useGetAllCommentsOfATicketContext();

  return useQuery({
    queryKey: ['single-ticket-comments', currentSupportChatId],
    queryFn: () => getAllCommentsOfATicket(currentSupportChatId),
    enabled: false,
    onSuccess: (data) => {
      setAllComments(data);
      return data;
    },
    onError: (err: any) => {
      console.log('useGetAllCommentsOfATicket error', err);
      return err;
    },
  });
};
