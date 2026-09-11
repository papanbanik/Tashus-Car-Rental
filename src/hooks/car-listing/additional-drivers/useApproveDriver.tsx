'use client';

import { useSnackBarContext } from '@/context/SnackBarProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type DriverVerificationProps = {
  requestId: string | undefined;
  email: string | undefined;
};

const driverApproval = async ({ requestId, email }: DriverVerificationProps) => {
  //   console.log(email);
  //   console.log(requestId);
  const response = await axiosClient.put(`${apiUrl}/verify/approve-driver-request/${requestId}`, {
    email,
  });
  return response;
};

export const useApproveDriver = () => {
  const { openSnackBar } = useSnackBarContext();
  return useMutation({
    mutationFn: ({ requestId, email }: DriverVerificationProps) => driverApproval({ requestId, email }),
    onSuccess: (data) => {
      // console.log(data);
      openSnackBar({
        message: data?.data?.message || 'Request Accepted',
        severity: 'success',
        hideDuration: 3000,
      });
      return data;
    },
    onError: (err: any) => {
      console.log('useApproveDriver mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'Request Accept Error',
        severity: 'error',
      });
      return err;
    },
  });
};
