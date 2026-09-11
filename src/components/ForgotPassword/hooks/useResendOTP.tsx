'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type UserForgotPassword = {
  email: string | undefined;
};

const resendOTP = async ({ email }: UserForgotPassword) => {
  const response = await axios.put(`${apiUrl}/auth/resend-otp/${email}`, {
    email,
  });
  return response;
};

export const useResendOTP = () => {
  return useMutation({
    mutationFn: ({ email }: UserForgotPassword) => resendOTP({ email }),
    onSuccess: (data) => {
      //   console.log('Email OTP Resent', data);
      return data;
    },
    onError: (err: any) => {
      console.log('useResent mutation error', err);
      return err;
    },
  });
};
