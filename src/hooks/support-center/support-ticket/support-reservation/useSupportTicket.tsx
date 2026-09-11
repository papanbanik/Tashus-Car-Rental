'use client';

import { useSnackBarContext } from '@/context/SnackBarProvider';
import { AddSupportTicketType } from '@/types/support-center/support-ticket';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const addSupportTicket = async ({ reservationId, ticket }: AddSupportTicketType) => {
  // console.log(reservationId);
  const endpoint = Number.isNaN(reservationId) ? 'general' : 'reservation';
  // console.log(endpoint);
  const response = await axiosClient.post(`${apiUrl}/support-ticket/${endpoint}`, ticket);
  return response;
};

export const useSupportTicket = () => {
  const { openSnackBar } = useSnackBarContext();
  return useMutation({
    mutationFn: ({ reservationId, ticket }: AddSupportTicketType) => addSupportTicket({ reservationId, ticket }),
    onSuccess: (data, variables) => {
      // console.log(variables);
      // console.log(data);
      openSnackBar({
        message: data?.data?.message || 'Support Ticket Create Successfully',
        severity: 'success',
        hideDuration: 3000,
      });
    },
    onError: (err: any) => {
      console.log('useAddSupportTicket page mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'Error Saving Support Ticket',
        severity: 'error',
      });
      return err;
    },
  });
};
