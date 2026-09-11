'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import environment from '@/utils/configs/environment';
import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { useMutation } from '@tanstack/react-query';
import { useSnackBarContext } from '../../../context/SnackBarProvider';

type ChargeReservationAdditionalFeesParams = {
  reservationId: number;
  paidAmount: number;
};

const payAdditionalFeesAsCredit = async (ChargeReservationAdditionalFeesParams: ChargeReservationAdditionalFeesParams) => {
  const { reservationId, ...rest } = ChargeReservationAdditionalFeesParams;
  const response = await axiosClient.put(`${environment?.API_URL}/v2/reservation/pay-additional-fee-credit/${reservationId}`, {
    ...rest,
  });
  return response;
};

export const useReservationAdditionalFeesCredit = () => {
  const { openSnackBar } = useSnackBarContext();
  const { setTravelDetails } = useProfileInfoContext();
  const { setUpdatedTravelData } = useTravelContext();

  return useMutation({
    mutationFn: (bodyValues: ChargeReservationAdditionalFeesParams) => payAdditionalFeesAsCredit(bodyValues),
    onSuccess: (data, variables) => {
      const { paidAmount = 0 } = variables;
      const { reservationAdditionalFees } = data?.data?.responseObject ?? {};
      if (reservationAdditionalFees?.length > 0) {
        setUpdatedTravelData((prev) => ({
          ...prev,
          reservationAdditionalFees,
        }));
      }
      setTravelDetails((prev) => ({
        ...prev,
        currentCreditBalance: parseFloatWithPrecision((prev?.currentCreditBalance ?? 0) - paidAmount),
      }));
      openSnackBar({
        message: data?.data?.message ?? 'Successfully credit applied in additional fees',
        severity: 'success',
      });
    },
    onError: (err: any) => {
      console.error('useReservationAdditionalFeesCredit mutation error', err?.response?.data?.message);
      openSnackBar({
        message: err?.response?.data?.message ?? 'Error while credit applied in additional fees',
        severity: 'error',
      });
      return err;
    },
  });
};
