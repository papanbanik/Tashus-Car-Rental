'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getPhoneVerification = async (userId: string | undefined) => {
  const response = await axiosClient.get(`${apiUrl}/verify/phone-verification-details/${userId}`);
  return response;
};

export const useGetPhoneVerification = () => {
  const { userCred } = useUserCredContext();
  const { setOTPVerifyAttempt, setPhoneVerificationDetails, setTimeInterval } = useProfileInfoContext();

  return useQuery({
    queryKey: ['get-phone-verification-details', { userId: userCred?.userId }],
    queryFn: () => getPhoneVerification(userCred?.userId),
    enabled: !!userCred?.userId,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // console.log(data);
      // console.log('Phone Verification', data?.data?.data);
      setPhoneVerificationDetails(data?.data?.data);
      setOTPVerifyAttempt(data?.data?.data?.otpRequests ?? 0);
    },
    onError: (err) => {
      console.log('useGetPhoneVerification error', err);
      return err;
    },
  });
};
