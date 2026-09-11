'use client';

import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type StartTravelMultiplePhotoSave = {
  guestId: string | undefined;
  imageUrlList?: Blob[];
  reservationId: number | undefined;
};

const saveStartTravelPhotos = async ({ guestId, imageUrlList, reservationId }: StartTravelMultiplePhotoSave) => {
  const response = await axiosClient.put(`${apiUrl}/reservation/travel-guest-start-photo/${reservationId}`, {
    guestId,
    imageUrlList,
  });
  return response;
};

export const useStartTravelPhotos = () => {
  return useMutation({
    mutationFn: ({ guestId, imageUrlList, reservationId }: StartTravelMultiplePhotoSave) =>
      saveStartTravelPhotos({ guestId, imageUrlList, reservationId }),
    onSuccess: (data) => {
      // console.log(data);
    },
    onError: (err: any) => {
      console.log('useSavePhotos mutation error', err);
      return err;
    },
  });
};