'use client';

import { useHelpTopicArticleInfoContext } from '@/context/HelpTopicsArticlesProvider';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getAllLegals = async () => {
  const response = await axios.get(`${apiUrl}/setting/legals`);
  return response;
};

export const useAllLegals = () => {
  const { setAllLegals } = useHelpTopicArticleInfoContext();

  return useQuery({
    queryKey: ['all-legals'],
    queryFn: () => getAllLegals(),

    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setAllLegals(data?.data);
      return data;
    },
    onError: (err) => {
      console.log(' useAllLegals error', err);
      return err;
    },
  });
};
