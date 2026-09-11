'use client';

import { TGuestLicenseInfoByPartner } from '@/types/reservations/typeReservationsActions';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export type TPutTGuestLicenseInfoByPartner = TGuestLicenseInfoByPartner & {
  guestId: string;
};

export type TConfirmGuestLicenseInfo = {
  verificationInfoByPartner: TPutTGuestLicenseInfoByPartner;
  reservationId: number;
};

const confirmGuestLicenseInfo = async ({ reservationId, verificationInfoByPartner }: TConfirmGuestLicenseInfo) => {
  // console.log({ ...verificationInfoByPartner });
  const response = await axiosClient.put(`${apiUrl}/reservation/travel-partner-verify-guest/${reservationId}`, {
    ...verificationInfoByPartner,
  });

  return response;
};

export const useConfirmGuestLicenseInfo = () => {
  return useMutation({
    mutationFn: ({ reservationId, verificationInfoByPartner }: any) => confirmGuestLicenseInfo({ reservationId, verificationInfoByPartner }),
    onSuccess: (data, variables) => {
      // console.log(data);
      // console.log(variables);
      // update state
    },
    onError: (err: any) => {
      console.log('useConfirmGuestLicenseInfo mutation error', err);
      return err;
    },
  });
};
