'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type UserOTPVerify = {
  email: string | undefined;
  otp: number | undefined;
};

const verifyOTP = async ({ email, otp }: UserOTPVerify) => {
  const response = await axios.put(`${apiUrl}/auth/verify-otp/`, {
    email,
    otp,
  });
  return response;
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: ({ email, otp }: UserOTPVerify) => verifyOTP({ email, otp }),
    onSuccess: (data) => {
      // console.log('Email OTP verify', data);
      return data;
    },
    onError: (err: any) => {
      console.log('usePassVerify mutation error', err);
      return err;
    },
  });
};
