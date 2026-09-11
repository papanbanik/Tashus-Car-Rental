'use client';

import { useUserCredContext } from '@/context/UserCredProvider';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL_V2?.replace('/v2', ''); // Exclude '/v2'

const getHealthCheck = async () => {
  const response = await axios.get(`${apiUrl}/health-check`);
  return response;
};

export const useHealthCheck = () => {
  const { userCred } = useUserCredContext();
  return useQuery({
    queryKey: ['health-check', {}],
    queryFn: () => getHealthCheck(),
    enabled: !!userCred?.userId,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      return data;
    },
    onError: (err) => {
      console.log('useHealthCheck error', err);
      return err;
    },
  });
};
