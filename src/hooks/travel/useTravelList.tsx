'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getTravelList = async (userId: string | undefined) => {
  const response = await axiosClient.get(`${apiUrl}/reservation/find-guest-travels/${userId}`);
  // console.log('Travels Response', response);
  return response;
};

export const useTravelList = () => {
  const { setTravelList } = useProfileInfoContext();
  const { setIsTravelListLoading } = useTravelContext();
  const {
    userCred: { userId, loggedIn },
  } = useUserCredContext();

  const travelListQuery = useQuery({
    queryKey: ['travels-lists', { userId }],
    queryFn: () => getTravelList(userId),
    enabled: !!userId && loggedIn,
    // enabled: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // console.log(data);
      setTravelList(data?.data);
      return data;
    },
    onError: (err) => {
      console.log('useTravelsList error', err);
      return err;
    },
  });

  useEffect(() => {
    setIsTravelListLoading(travelListQuery.isLoading);
  }, [travelListQuery.isLoading, setIsTravelListLoading]);

  return travelListQuery;
};
