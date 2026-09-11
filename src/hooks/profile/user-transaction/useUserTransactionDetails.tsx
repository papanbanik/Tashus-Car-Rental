'use client';

import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { TUserRole, TUserTransaction } from '@/types/user-profile/transactionsTypes';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export type TGetUserTransactionDetails = {
  userId: string | undefined;
  role: TUserRole;
  from?: string;
  to?: string;
};

const getUserTransactionDetails = async ({ userId, role, from, to }: TGetUserTransactionDetails) => {
  // console.log({ userId, role, from, to });
  const response = await axiosClient.put(`${apiUrl}/profile/${role === 'guest' ? 'guest' : 'host'}-transactions/${userId}`, {
    from,
    to,
  });
  return response;
};

export const useUserTransactionDetails = () => {
  const { role, setTransactionDetails, setTransactions } = useProfileInfoContext();

  // The + sign is a unary operator in JavaScript, and when placed before a date object, it converts the date object to its corresponding timestamp in milliseconds. This is often referred to as the "unary plus" or "unary positive" operator.

  return useMutation({
    mutationFn: ({ userId, role, from, to }: TGetUserTransactionDetails) => getUserTransactionDetails({ userId, role, from, to }),
    onSuccess: (data, variables) => {
      if (role === 'guest') {
        setTransactions(
          (data?.data?.data?.transactionHistory).sort(
            (a: any, b: any) => +new Date(b?.updatedAt ?? b?.createdAt) - +new Date(a?.updatedAt ?? a?.createdAt)
          )
        );
        setTransactionDetails(data?.data?.data);
      } else {
        // console.log(data?.data?.data?.partnerTransactionHistory);
        setTransactions(
          (data?.data?.data?.partnerTransactionHistory).sort(
            (a: any, b: any) => +new Date(b?.updatedAt ?? b?.createdAt) - +new Date(a?.updatedAt ?? a?.createdAt)
          )
        );
        setTransactionDetails(data?.data?.data);
      }
    },
    onError: (err: any) => {
      console.log('useUserTransactionDetails mutation error', err);
      setTransactionDetails({} as TUserTransaction);
      setTransactions([]);
      return err;
    },
  });
};
