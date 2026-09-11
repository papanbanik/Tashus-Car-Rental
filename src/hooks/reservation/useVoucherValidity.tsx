'use client';

import { useSearchContext } from '@/context/SearchProvider';
import { VoucherDetailsType } from '@/types/checkout/checkoutTypes';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface IAdditionalData {
  carType: string;
  reservationDuration: number;
  completedReservations: number;
  monthOfTravel: string;
}
export interface CheckVoucherValidityParams {
  userId: string;
  voucherCode: string;
  totalAmount: number;
  additionalData: IAdditionalData;
}

const checkVoucherValidity = async (voucherData: CheckVoucherValidityParams) => {
  const response = await axiosClient.post(`${apiUrl}/voucher/check-voucher-validity`, {
    ...voucherData,
  });

  return response;
};

export const useVoucherValidity = () => {
  const { setCustomMessage, setVoucherDetails, setValidVoucher } = useSearchContext();
  return useMutation({
    mutationFn: (voucherData: CheckVoucherValidityParams) => checkVoucherValidity(voucherData),
    onSuccess: (data) => {
      if (data.status === 201) {
        if (data?.data?.success) {
          // console.log('Voucher Details', data?.data?.validVoucher?.voucher);
          setValidVoucher(true);
          setVoucherDetails(data?.data?.validVoucher);
          setCustomMessage(data?.data?.message);
        } else {
          setValidVoucher(false);
          setVoucherDetails({} as VoucherDetailsType);
          setCustomMessage(data?.data?.message);
        }
      } else {
        setValidVoucher(false);
        setVoucherDetails({} as VoucherDetailsType);
      }
      return data;
    },
    onError: (err: any) => {
      setValidVoucher(false);
      setVoucherDetails({} as VoucherDetailsType);
      return err;
    },
  });
};
