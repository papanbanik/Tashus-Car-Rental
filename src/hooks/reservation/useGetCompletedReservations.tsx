'use client';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getCompletedReservationList = async (userId: string | undefined) => {
    const response = await axiosClient.get(`${apiUrl}/reservation/find-guest-completed-travels/${userId}`);
    return response;
};

export const useGetCompletedReservations = () => {

    //******remove redirection this part of code and codes associated with it after mobile redirection is not needed anymore ***/
    const [userCred, setUserCred] = useState<any>();
    useEffect(() => {
        const cred = JSON.parse(localStorage.getItem('tashus') as string);
        setUserCred(cred);
    }, []);
    //************* part ended *************************************/
    const {
        userCred: { userId },
    } = useUserCredContext();

    return useQuery({
        queryKey: ['completedReservation'],
        queryFn: () => getCompletedReservationList(userId || userCred?.userId),
        enabled: (!!userId || !!userCred?.userId),
        // enabled: false,
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            return data;
        },
        onError: (err) => {
            console.log('useGetCompletedReservations error', err);
            return err;
        },
    });
};
