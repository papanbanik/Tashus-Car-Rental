'use client';

import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export type TSavePartnerReturnPhotosSave = {
  hostId: string | undefined;
  imageUrlList?: Blob[];
  reservationId: number | undefined;
};

const savePartnerReturnPhotosSave = async ({ hostId, imageUrlList, reservationId }: TSavePartnerReturnPhotosSave) => {
  const response = await axiosClient.put(`${apiUrl}/reservation/travel-partner-end-photo/${reservationId}`, {
    hostId,
    imageUrlList,
  });
  return response;
};

export const usePartnerReturnPhotosSave = () => {
  return useMutation({
    mutationFn: ({ hostId, imageUrlList, reservationId }: TSavePartnerReturnPhotosSave) =>
      savePartnerReturnPhotosSave({ hostId, imageUrlList, reservationId }),
    onSuccess: (data) => {
      // console.log(data);
    },
    onError: (err: any) => {
      console.log('usePartnerReturnPhotosSave mutation error', err);
      return err;
    },
  });
};
