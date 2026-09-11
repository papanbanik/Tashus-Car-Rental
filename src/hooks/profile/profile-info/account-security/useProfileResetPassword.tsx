'use client';

import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type UserPasswordUpdate = {
  userId: string | undefined;
  email: string | undefined;
  oldPassword: string | undefined;
  newPassword: string | undefined;
  otp: number | undefined;
};

const resetPassword = async ({ userId, email, oldPassword, newPassword, otp }: UserPasswordUpdate) => {
  otp = Number(otp);
  const response = await axiosClient.put(`${apiUrl}/profile/reset-password/${userId}`, {
    email,
    oldPassword,
    newPassword,
    otp,
  });
  return response;
};

export const useUpdatePassword = () => {
  const { userCred } = useUserCredContext();
  return useMutation({
    mutationFn: ({ userId, email, oldPassword, newPassword, otp }: UserPasswordUpdate) =>
      resetPassword({ userId, email, oldPassword, newPassword, otp }),
    onSuccess: (data) => {
      console.log('Password Updated', data);
      return data;
    },
    onError: (err: any) => {
      console.log('useUpdatePass mutation error', err);
      return err;
    },
  });
};
