'use client';

import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type UserPayoutOptions = {
  userId: string | undefined;
  bsb: string | undefined;
  accountNumber: string | undefined;
  accountName: string | undefined;
};

const getPayoutDetails = async (userId: string | undefined) => {
  const response = await axiosClient.get(`${apiUrl}/profile/bank-info/${userId}`);
  return response;
};

const updatePayoutOptions = async ({ userId, accountName, bsb, accountNumber }: UserPayoutOptions) => {
  const updatedData = {
    bankInfo: {
      bsb,
      accountNumber,
      accountName,
    },
  };
  const response = await axiosClient.put(`${apiUrl}/profile/bank-info/${userId}`, updatedData);

  return response;
};

export const useUpdatePayoutOptions = () => {
  const { setPayoutDetails } = useProfileInfoContext();
  return useMutation({
    mutationFn: ({ userId, bsb, accountNumber, accountName }: UserPayoutOptions) => updatePayoutOptions({ userId, bsb, accountNumber, accountName }),

    onSuccess: (data, variable) => {
      const { accountName, accountNumber, bsb } = variable;
      if (variable) {
        setPayoutDetails({ accountName: accountName, accountNumber: accountNumber, bsb: bsb });
      }

      return data;
    },
    onError: (err: any) => {
      console.log('useUpdatePass mutation error', err);
      return err;
    },
  });
};

export const usePayoutDetails = () => {
  const {
    userCred: { userId },
  } = useUserCredContext();
  const { setPayoutDetails } = useProfileInfoContext();

  return useQuery({
    queryKey: ['payout-info', { userId }],
    queryFn: () => getPayoutDetails(userId),
    enabled: !!userId,

    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      if (data?.data?.data) {
        setPayoutDetails(data?.data?.data);
      } else {
        setPayoutDetails({ accountName: '', accountNumber: '', bsb: '' });
      }

      return data;
    },
    onError: (err) => {
      console.log('usePayoutDetails error', err);
      // setPayoutDetails({ accountName: '', accountNumber: '', bsb: '' });
      return err;
    },
  });
};
