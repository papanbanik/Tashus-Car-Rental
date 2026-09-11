'use client';

import axiosClient from '@/utils/configs/axiosInstance';
import environment from '@/utils/configs/environment';
import { useMutation } from '@tanstack/react-query';
import type {
  CombinedPaymentIntentRequest,
  CombinedPaymentIntentResponse,
} from '../types/combined-payment.types';

interface TCreateCombinedPaymentIntentArgs {
  reservationId: number;
  body: CombinedPaymentIntentRequest;
}

const createCombinedPaymentIntent = async ({
  reservationId,
  body,
}: TCreateCombinedPaymentIntentArgs): Promise<CombinedPaymentIntentResponse> => {
  const userCred = JSON.parse(localStorage.getItem('tashus') || '{}');
  const response = await axiosClient.post(
    `${environment?.API_URL}/v3/profile/combined-payments-intent/${reservationId}`,
    body,
    { headers: { authorization: `Bearer ${userCred?.accessToken}` } }
  );
  // Handle both response formats: response.data.data or response.data.responseObject
  return response.data?.responseObject || response.data?.data;
};

export const useCreateCombinedPaymentIntent = () => {
  return useMutation({
    mutationFn: createCombinedPaymentIntent,
    onError: (err: unknown) => {
      console.error('useCreateCombinedPaymentIntent error:', err);
    },
  });
};
