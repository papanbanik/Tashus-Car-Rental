'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getPromotionPageSection = async () => {
  const response = await axios.get(`${apiUrl}/promotion/get-promotion-section/voucherCard`);
  return response;
};

export const useGetPromotionPageSection = () => {
  return useQuery({
    queryKey: ['promotion-page-section'],
    queryFn: () => getPromotionPageSection(),
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      return data;
    },
    onError: (err) => {
      console.log('usePromotionPageSection error', err);
      return err;
    },
  });
};
