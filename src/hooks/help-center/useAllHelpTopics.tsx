'use client';

import { useQuery } from '@tanstack/react-query';
import { useHelpTopicArticleInfoContext } from '@/context/HelpTopicsArticlesProvider';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getAllTopics = async () => {
  const response = await axios.get(`${apiUrl}/setting/help/topics`);
  return response;
};

const getAllParentTopics = async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/setting/help/topics/-1`, {});
  return response;
};

const getAllArticles = async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/setting/help/articles`);
  return response;
};

export const useAllTopics = () => {
  const { setAllHelpTopics } = useHelpTopicArticleInfoContext();

  const { data, isLoading, error } = useQuery({
    queryKey: ['all-topics'],
    queryFn: () => getAllTopics(),

    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setAllHelpTopics(data?.data);
      return data;
    },
    onError: (err) => {
      console.log(' useAllTopics error', err);
      return err;
    },
  });

  return { data, isLoading, error };
};

export const useAllParentTopics = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['parent-topics'],
    queryFn: () => getAllParentTopics(),

    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      return data;
    },
    onError: (err) => {
      console.log(' useAllParentTopics error', err);
      return err;
    },
  });

  return { data, isLoading, error };
};

export const useAllArticles = () => {
  const { setAllArticleList } = useHelpTopicArticleInfoContext();
  const { data, isLoading, error } = useQuery({
    queryKey: ['all-articles'],
    queryFn: () => getAllArticles(),

    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setAllArticleList(data.data);
      return data;
    },
    onError: (err) => {
      console.log(' useAllArticles error', err);
      return err;
    },
  });

  return { data, isLoading, error };
};
