'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type DriverVerificationProps = {
  requestId: string | undefined;
  email: string | undefined;
};

const findDriver = async ({ requestId, email }: DriverVerificationProps) => {
  const response = await axiosClient.get(`${apiUrl}/verify/find-driver-request-details/${requestId}`, {
    params: {
      email,
    },
  });
  return response;
};

export const useFindDriver = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { userCred } = useUserCredContext();
  const email = userCred?.email;
  const { setDriverApproved, setDriverDeclined, setDriverError } = useProfileInfoContext();
  return useQuery({
    queryKey: ['find-driver', { requestId, email }],
    queryFn: () => findDriver({ requestId, email }),
    enabled: !!requestId && !!email,
    // enabled: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setDriverApproved(data?.data?.data[0]?.isVerified);
      setDriverDeclined(data?.data?.data[0]?.isDeclined);
      setDriverError(data?.data?.message);
    },
    onError: (err: any) => {
      console.log('useTravelDetails error', err);
      // console.log('Data Status', err?.response?.status);
      const errorMessage = err?.response?.status === 400 ? 'You are unauthorized to view this request' : err?.message;
      setDriverError(errorMessage);
      return err;
    },
  });
};
