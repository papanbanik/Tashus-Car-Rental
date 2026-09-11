'use client';

import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export type TSavePartnerReturnPhotosSave = {
  completedTravels: number | undefined;
  emailVerified: boolean | undefined;
  firstTravel: boolean | undefined;
  userId: string;
};

const getLoginUserVoucher = async ({ completedTravels, emailVerified, firstTravel, userId }: TSavePartnerReturnPhotosSave) => {
  const response = await axiosClient.post(`${apiUrl}/voucher/get-vouchers/${userId}`, {
    completedTravels,
    emailVerified,
    firstTravel,
  });
  return response;
};

export const useGetLoginUserVouchers = () => {
  return useMutation({
    mutationFn: ({ completedTravels, emailVerified, firstTravel, userId }: TSavePartnerReturnPhotosSave) =>
      getLoginUserVoucher({ completedTravels, emailVerified, firstTravel, userId }),
    onSuccess: (data) => {},
    onError: (err: any) => {
      console.log('usePartnerReturnPhotosSave mutation error', err);
      return err;
    },
  });
};
