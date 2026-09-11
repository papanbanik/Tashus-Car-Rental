'use client';

import { useGetAllCommentsOfATicketContext } from '@/context/AllCommentsOfATicketProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation, useQuery } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getAllTickets = async (ticketStatus: string) => {
  const { userId } = JSON.parse(localStorage.getItem('tashus') || '{}');
  const response = await axiosClient.get(`${apiUrl}/support-ticket/get/${userId}/${ticketStatus}`);
  return response.data;
};

export const useGetAllTickets = (ticketStatus: string) => {
  const { allTickets, setAllTickets } = useGetAllCommentsOfATicketContext();

  return useQuery({
    queryKey: ['all-ticket-list'],
    queryFn: () => getAllTickets(ticketStatus),
    enabled: false,
    onSuccess: (data) => {
      setAllTickets(data);
      return data;
    },
    onError: (err: any) => {
      console.log('useGetAllTickets error', err);
      return err;
    },
  });
};
// export const useGetAllTickets = () => {
//   const { allTickets, setAllTickets } = useGetAllCommentsOfATicketContext();
//   return useMutation({
//     mutationFn: (ticketStatus: string) => getAllTickets(ticketStatus),
//     onSuccess: (data, variables) => {
//       //console.log('useGetAllTickets success data', data);
//       setAllTickets(data);
//       return data;
//     },
//     onError: (err: any) => {
//       console.log('useGetAllTickets mutation error', err);
//       return err;
//     },
//   });
// };
