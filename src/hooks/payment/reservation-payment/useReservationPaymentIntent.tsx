'use server';

import { IPaymentBody } from '@/types/payment/reservationPayment';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function createReservationPaymentIntent(withHoldPayment: boolean, paymentBody: IPaymentBody, accessToken: string) {
  const endpoint = `${apiUrl}/payment/${withHoldPayment ? 'stripe-hold-with-payment' : 'stripe-element'}`;
  try {
    const response = await axios.post(endpoint, paymentBody, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    return { ...response?.data };
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const message = error?.response?.data?.message || 'An unexpected error occurred';
    console.log('paymentIntentError useReservationPaymentIntent.tsx', error);
    return {
      status,
      message,
      data: null,
    };
  }
}
