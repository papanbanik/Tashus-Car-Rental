'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getReservationDetails = async (reservationId: number | undefined) => {
  const response = await axiosClient.get(`${apiUrl}/reservation/find-details/${reservationId}`);
  // console.log('Reservation Response', response);
  return response;
};

export const useReservationDetails = () => {
  // const params = useParams();
  const { reservationId } = useParams<{ reservationId: string }>();
  const reservationID = parseInt(reservationId);
  // console.log(reservationID);
  const { vehicleDetails, setVehicleDetails } = useProfileInfoContext();
  const {
    userCred: { userId },
  } = useUserCredContext();

  return useQuery({
    queryKey: ['reservation-details', { reservationID }],
    queryFn: () => getReservationDetails(reservationID),
    enabled: !!reservationID,
    // enabled: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // console.log(data);
      // console.log(data?.data);
      setVehicleDetails(data?.data);
      // console.log(vehicleDetails);
      // return data;
    },
    onError: (err) => {
      console.log('useReservationDetails error', err);
      return err;
    },
  });
};
