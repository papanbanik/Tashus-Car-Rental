'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getCommonVouchers = async () => {
  const response = await axios.get(`${apiUrl}/voucher/get-common-vouchers`);
  return response;
};

export const useGetCommonVouchers = () => {
  return useQuery({
    queryKey: ['common-voucher'],
    queryFn: () => getCommonVouchers(),
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      return data;
    },
    onError: (err) => {
      console.log('useCommonVoucher error', err);
      return err;
    },
  });
};
