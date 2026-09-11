'use client';

import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type TSaveGuestReturnPhotos = {
  guestId: string | undefined;
  imageUrlList?: Blob[];
  reservationId: number;
};

const saveGuestReturnPhotos = async ({ guestId, imageUrlList, reservationId }: TSaveGuestReturnPhotos) => {
  const response = await axiosClient.put(`${apiUrl}/reservation/travel-guest-end-photo/${reservationId}`, {
    guestId,
    imageUrlList,
  });
  return response;
};

export const useGuestReturnPhotosSave = () => {
  return useMutation({
    mutationFn: ({ guestId, imageUrlList, reservationId }: TSaveGuestReturnPhotos) => saveGuestReturnPhotos({ guestId, imageUrlList, reservationId }),
    onSuccess: (data) => {
      // console.log(data);
    },
    onError: (err: any) => {
      console.log('useGuestReturnPhotosSave mutation error', err);
      return err;
    },
  });
};
