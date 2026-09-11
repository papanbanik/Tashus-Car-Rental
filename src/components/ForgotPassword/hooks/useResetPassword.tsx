'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type UserOTPVerify = {
  email: string | undefined;
  newPassword: string | undefined;
  otp: number | undefined;
};

const resetPassword = async ({ email, otp, newPassword }: UserOTPVerify) => {
  const response = await axios.put(`${apiUrl}/auth/reset-password/`, {
    email,
    newPassword,
    otp,
  });
  return response;
};

export const useResetPass = () => {
  return useMutation({
    mutationFn: ({ email, newPassword, otp }: UserOTPVerify) => resetPassword({ email, newPassword, otp }),
    onSuccess: (data) => {
      // console.log('Set new Password', data);
      return data;
    },
    onError: (err: any) => {
      // console.log('usePassReset mutation error', err);
      return err;
    },
  });
};
