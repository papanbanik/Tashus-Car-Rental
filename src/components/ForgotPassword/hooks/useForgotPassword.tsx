'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type UserForgotPassword = {
  email: string | undefined;
  oldPassword?: string | undefined;
};

const sendOTP = async ({ email, oldPassword }: UserForgotPassword) => {
  // console.log(email);
  const response = await axios.put(`${apiUrl}/auth/send-otp/${email}`, {
    oldPassword,
  });
  return response;
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: ({ email, oldPassword }: UserForgotPassword) => sendOTP({ email, oldPassword }),
    onSuccess: (data) => {
      // console.log('Email OTP sent', data);
      return data;
    },
    onError: (err: any) => {
      console.log('useForgotPass mutation error', err);
      return err;
    },
  });
};
