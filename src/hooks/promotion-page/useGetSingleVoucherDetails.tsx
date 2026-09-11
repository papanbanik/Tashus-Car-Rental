'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface VoucherSlugProps {
  voucherSlug: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getSingleVoucherDetails = async ({ voucherSlug }: VoucherSlugProps) => {
  const response = await axios.get(`${apiUrl}/v2/voucher/slug/${voucherSlug}`);
  return response;
};

export const useGetSingleVoucherDetails = ({ voucherSlug }: VoucherSlugProps) => {
  return useQuery({
    queryKey: ['voucher-details'],
    queryFn: () => getSingleVoucherDetails({ voucherSlug }),
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      return data;
    },
    onError: (err) => {
      console.log('useVoucherDetails error', err);
      return err;
    },
  });
};
