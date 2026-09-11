'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getPublicProfile = async (userName: string | undefined) => {
  const response = await axios.get(`${apiUrl}/other/public/profile/${userName}`);
  return response;
};

export const usePublicProfile = () => {
  const { userName } = useParams<{ userName: string }>();
  return useQuery({
    queryKey: ['draft-lists', { userName }],
    queryFn: () => getPublicProfile(userName),
    enabled: !!userName,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      return data;
    },
    onError: (err) => {
      console.log('useProfileInfo error', err);
      return err;
    },
  });
};
