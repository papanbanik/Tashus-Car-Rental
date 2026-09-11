'use client';

import { useSnackBarContext } from '@/context/SnackBarProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type UserDeactivateProps = {
  userId: string;
  reason: string;
};

const deactivatePassword = async ({ userId, reason }: UserDeactivateProps) => {
  const response = await axiosClient.put(`${apiUrl}/setting/account-deactivate/${userId}`, {
    reason,
  });
  return response;
};

export const useDeactivateAccount = () => {
  const { openSnackBar } = useSnackBarContext();
  return useMutation({
    mutationFn: ({ userId, reason }: UserDeactivateProps) => deactivatePassword({ userId, reason }),
    onSuccess: (data) => {
      openSnackBar({
        message: data?.data?.message || 'Account Deactivate Successfully',
        severity: 'success',
      });
      return data;
    },
    onError: (err: any) => {
      console.log('useUpdatePass mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'Error Account Deactivation',
        severity: 'error',
      });
      return err;
    },
  });
};
