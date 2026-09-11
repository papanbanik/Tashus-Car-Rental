'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getAllSections = async () => {
  const response = await axios.get(`${apiUrl}/promotion/get-all-promotion-section`);

  return response.data;
};

export const useGetAllPromotionPageSection = () => {
  return useQuery({
    queryKey: ['all-section'],
    queryFn: () => getAllSections(),

    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      return data;
    },
    onError: (err) => {
      console.log('useGetAllPromotionPageSection error', err);
      return err;
    },
  });
};
