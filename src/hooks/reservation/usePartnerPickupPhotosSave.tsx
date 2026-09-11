'use client';

import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export type TSavePartnerPickupPhotosSave = {
  guestId: string | undefined;
  imageUrlList?: Blob[];
  reservationId: number | undefined;
};

const savePartnerPickupPhotosSave = async ({ guestId, imageUrlList, reservationId }: TSavePartnerPickupPhotosSave) => {
  const response = await axiosClient.put(`${apiUrl}/reservation/travel-partner-start-photo/${reservationId}`, {
    guestId,
    imageUrlList,
  });
  return response;
};

export const usePartnerPickupPhotosSave = () => {
  return useMutation({
    mutationFn: ({ guestId, imageUrlList, reservationId }: TSavePartnerPickupPhotosSave) =>
      savePartnerPickupPhotosSave({ guestId, imageUrlList, reservationId }),
    onSuccess: (data) => {
      // console.log(data);
    },
    onError: (err: any) => {
      console.log('usePartnerPickupPhotosSave mutation error', err);
      return err;
    },
  });
};
