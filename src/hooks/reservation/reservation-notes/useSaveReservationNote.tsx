'use client';

import { useSnackBarContext } from '@/context/SnackBarProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface SaveNoteParams {
  reservationId: string | number;
  message: string;
  role: 'guest' | 'host';
  noteId?: string | null;
  currentDateTime: string;
}

const saveReservationNote = async ({ reservationId, message, role, noteId, currentDateTime }: SaveNoteParams) => {
  const url = `${apiUrl}/v2/reservation/save-notes/${reservationId}${noteId ? `/${noteId}` : ''}`;
  const response = await axiosClient.put(url, {
    message,
    role,
    currentDateTime,
  });
  return response.data;
};

export const useSaveReservationNote = () => {
  const queryClient = useQueryClient();
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: saveReservationNote,
    onSuccess: () => {
      openSnackBar({
        message: 'Note saved successfully',
        severity: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['travel-details'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to save note';
      openSnackBar({
        message,
        severity: 'error',
      });
    },
  });
};
