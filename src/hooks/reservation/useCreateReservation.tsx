'use client';

import { TPeakIncreasePrice } from '@/context/SearchProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { TAdditionalDriverInfo } from '@/types/checkout/guestVerificationTypes';
import { TPaymentMethods } from '@/types/commonTypes';
import {
  ReservationGuestInsurance,
  ReservationLocationState,
  TAdditionalPaymentInfo,
  TBasePrice,
  TTravelDiscounts,
} from '@/types/travels/typeTravels';
import { PaymentMethod } from '@/types/user-profile/transactionsTypes';
import { IDeliveryVehicle } from '@/types/vehicle-delivery/vehicleDeliveryTypes';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
let paymentMethod: TPaymentMethods;
let guestId: string | undefined;
let holdDepositCredit: number = 0;

export interface SaveNewReservationParams {
  guestId: string;
  hostId: string;
  carListingId: number;
  startDate: string;
  endDate: string;
  totalDurationHours: number;
  basePrice: TBasePrice;
  depositAmount: number;
  serviceFeePercentage: number;
  insurance: ReservationGuestInsurance;
  pickupLocation: ReservationLocationState;
  dropOffLocation: ReservationLocationState;
  paymentMethod: TPaymentMethods;
  additionalPaymentInfo: TAdditionalPaymentInfo;
  totalDistanceKm?: number;
  dailyDistanceKm?: number;
  additionalDistanceFeePerKm?: number;
  discounts?: TTravelDiscounts;
  peakIncrease?: TPeakIncreasePrice;
  additionalDrivers?: TAdditionalDriverInfo[];
  //Vehicle Delivery
  isDeliveryEnabled?: boolean;
  isReturnEnabled?: boolean;
  deliveryVehicle?: IDeliveryVehicle;
  holdDepositCredit?: number;
}

const saveNewReservation = async (reservationData: SaveNewReservationParams) => {
  paymentMethod = reservationData?.paymentMethod;
  guestId = reservationData?.guestId;
  holdDepositCredit = reservationData?.holdDepositCredit ?? 0;

  const response = await axiosClient.post(`${apiUrl}/reservation/create`, {
    ...reservationData,
    origin: 'web',
  });

  return response;
};

export const useCreateReservation = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const router = useRouter();
  // console.log(params['vehicle-id']);
  const { openSnackBar } = useSnackBarContext();
  return useMutation({
    mutationFn: (reservationData: SaveNewReservationParams) => saveNewReservation(reservationData),
    onSuccess: (data, variables) => {
      // console.log('useCreateReservation data', data);
      // console.log(data?.data?.data?.reservationId);

      // Clear reservation info for this car
      // const tashus = JSON.parse(localStorage.getItem('tashus') || '{}');
      // const { reservationInfo, ...others } = tashus;
      // console.log(others);
      // localStorage.setItem('tashus', JSON.stringify({ ...others }));
      if (paymentMethod === PaymentMethod.OnlyVoucher || paymentMethod === PaymentMethod.OnlyCredit) {
        // !Dynamic Domain
        router.push(`/dashboard/${guestId}/travels/details/${data?.data?.data?.reservationId}`);
      } else if (paymentMethod === PaymentMethod.OnlyCreditWithHold || paymentMethod === PaymentMethod.OnlyVoucherWithHold) {
        // !Dynamic Domain
        if (holdDepositCredit > 0) {
          router.push(`/dashboard/${guestId}/travels/details/${data?.data?.data?.reservationId}`);
        } else {
          router.push(`/payment/holdAmount/${data?.data?.data?.reservationId}?from=checkout`);
        }
      } else {
        // !Dynamic Domain
        router.push(`/search/${vehicleId}/payment/${data?.data?.data?.reservationId}?from=checkout`);
      }
    },
    onError: (err: any) => {
      console.log('useCreateReservation mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || 'Reservation cannot be confirmed!',
        severity: 'error',
      });
      return err;
    },
  });
};
