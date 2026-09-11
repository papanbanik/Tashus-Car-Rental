'use client';

import { useTravelContext } from '@/context/TravelProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getReservationList = async (userId: string | undefined) => {
  const response = await axiosClient.get(`${apiUrl}/reservation/find-partner-reservations/${userId}`);
  // console.log('Reservation Response', response);
  return response;
};

export const useReservationLandingPage = () => {
  //******remove redirection this part of code and codes associated with it after mobile redirection is not needed anymore ***/
  const [userCred, setUserCred] = useState<any>();
  const userId = userCred?.userId;
  useEffect(() => {
    const cred = JSON.parse(localStorage.getItem('tashus') as string);
    setUserCred(cred);
  }, []);
  //************* part ended *************************************/

  // const { setReservationList } = useTravelContext();
  // const {
  //   userCred: { userId },
  // } = useUserCredContext();

  return useQuery({
    queryKey: ['reservation-lists', { userId }],
    queryFn: () => getReservationList(userId || userCred?.userId),
    enabled: !!userId || !!userCred?.userId,
    // enabled: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // console.log(data);
      // console.log(data?.data);
      // setReservationList(data?.data);
      return data;
    },
    onError: (err) => {
      console.log('useReservationList error', err);
      return err;
    },
  });
};
