'use client';

import { useSearchContext } from '@/context/SearchProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { TDate } from '@/types/commonTypes';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// interface IAdditionalData {
//   carType: string;
//   reservationDuration: number;
//   completedReservations: number;
//   monthOfTravel: string;
//   travelStartDate: TDate;
//   travelEndDate: TDate;
// }
export type TVoucherValidationAdditionalData = {
  carListingId: number;
  reservationDuration: number;
  travelStartDate: TDate;
  travelEndDate: TDate;
  guestEmail: string;
};

export interface CheckCheckVoucherValidationParams {
  userId: string;
  voucherCode: string;
  totalAmount: number;
  additionalData: TVoucherValidationAdditionalData;
}

const checkVoucherValidation = async (voucherData: CheckCheckVoucherValidationParams) => {
  const response = await axiosClient.put(`${apiUrl}/v2/voucher/validate-voucher`, {
    ...voucherData,
  });
  // Previous working API
  // const response = await axiosClient.put(`${apiUrl}/v2/voucher/check-voucher-validity`, {
  //   ...voucherData,
  // });

  return response;
};

export const useCheckVoucherValidation = () => {
  const { setAppliedVoucherInfo } = useSearchContext();
  const {openSnackBar} = useSnackBarContext();
  return useMutation({
    mutationFn: (voucherData: CheckCheckVoucherValidationParams) => checkVoucherValidation(voucherData),
    onSuccess: (data) => {
      const {success, message, responseObject} = data?.data ?? {};
      setAppliedVoucherInfo({isVoucherValid: success, responseMessage: message, ...responseObject});
      return data;
    },
    onError: (err: any) => {
      console.error(err);
      setAppliedVoucherInfo(null)
      openSnackBar({ message: err?.response?.data?.message || 'Error validating voucher', severity: 'error' });
      return err;
    },
  });
};
// export const useCheckVoucherValidation = () => {
//   const { setCustomMessage, setVoucherDetails, setValidVoucher } = useSearchContext();
//   return useMutation({
//     mutationFn: (voucherData: CheckCheckVoucherValidationParams) => checkVoucherValidation(voucherData),
//     onSuccess: (data) => {
//       if (data.status === 200) {
//         if (data?.data?.success) {
//           setValidVoucher(true);
//           setVoucherDetails(data?.data?.responseObject);
//           setCustomMessage(data?.data?.message);
//         } else {
//           setValidVoucher(false);
//           setVoucherDetails({} as VoucherDetailsType);
//           setCustomMessage(data?.data?.message);
//         }
//       } else {
//         setValidVoucher(false);
//         setVoucherDetails({} as VoucherDetailsType);
//       }
//       return data;
//     },
//     onError: (err: any) => {
//       console.log(err);
//       setValidVoucher(false);
//       setCustomMessage(err?.response?.data?.message);
//       setVoucherDetails({} as VoucherDetailsType);
//       return err;
//     },
//   });
// };
