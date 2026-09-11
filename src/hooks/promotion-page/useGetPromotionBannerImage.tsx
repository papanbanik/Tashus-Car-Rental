'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getPromotionBannerImage = async () => {
  const response = await axios.get(`${apiUrl}/promotion/get-promotion-banner-image`);
  return response;
};

export const useGetPromotionBannerImage = () => {
  return useQuery({
    queryKey: ['promotion-banner-image'],
    queryFn: () => getPromotionBannerImage(),
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      return data;
    },
    onError: (err) => {
      console.log('usePromotion banner image error', err);
      return err;
    },
  });
};
