import { TDate } from '../commonTypes';

export type AdditionalFeeReservationDetails = {
  additionalFeeDueAmount: number;
  startDate: TDate;
  endDate: TDate;
  createdAt: TDate;
  email: string;
  guestId: string;
  reservationId: number;
  reservationStatus: string; //'confirmed' | 'pending' | 'completed'| 'cancelledByHost'| 'cancelledByGuest'| 'cancelled';
};

export type PaymentDataInfo = {
  guestId: string;
  email: string;
  dueAmount: number;
  currency: string;
  reservationId: number;
  description?: string;
  payment_category: string;
  request_origin?: string;
};

export type PaymentIntentResponse = {
  success: boolean;
  message: string;
  responseObject: {
    clientSecret: string;
    paymentIntentId: string;
    status: string;
  };
  statusCode: number;
  decryptedClientSecret: string;
};
