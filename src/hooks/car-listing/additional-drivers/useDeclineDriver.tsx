'use client';

import { useSnackBarContext } from '@/context/SnackBarProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type DriverVerificationProps = {
  requestId: string | undefined;
  email: string | undefined;
};

const driverDeclined = async ({ requestId, email }: DriverVerificationProps) => {
  const response = await axiosClient.put(`${apiUrl}/verify/decline-driver-request/${requestId}`, {
    email,
  });
  return response;
};

export const useDeclineDriver = () => {
  const { openSnackBar } = useSnackBarContext();
  return useMutation({
    mutationFn: ({ requestId, email }: DriverVerificationProps) => driverDeclined({ requestId, email }),
    onSuccess: (data) => {
      // console.log(data);
      openSnackBar({
        message: data?.data?.message || 'Request Declined',
        severity: 'success',
        hideDuration: 3000,
      });
      return data;
    },
    onError: (err: any) => {
      console.log('useDeclineDriver mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'Request Decline Error',
        severity: 'error',
      });
      return err;
    },
  });
};
