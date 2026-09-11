'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getActivePopups = async () => {
  const response = await axios.get(`${apiUrl}/application-settings/active-landing-popup`);
  return response;
};

export const useGetLandingPageActivePopup = () => {
  return useQuery({
    queryKey: ['active-landing-page-popup'],
    queryFn: () => getActivePopups(),
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      return data;
    },
    onError: (err) => {
      console.log('useLandingPagePopup error', err);
      return err;
    },
  });
};
