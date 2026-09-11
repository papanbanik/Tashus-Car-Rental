'use client';

import { IPaymentDetails } from '@/types/payment/reservationPayment';
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';
type PaymentDetailsProviderProps = {
  children: ReactNode;
};

type PaymentDetailsContextType = {
  reservationPaymentDetails: IPaymentDetails;
  setReservationPaymentDetails: Dispatch<SetStateAction<IPaymentDetails>>;
};

export const PaymentDetails = createContext<PaymentDetailsContextType | undefined>(undefined);

export const usePaymentDetailsContext = (): PaymentDetailsContextType => {
  const context = useContext(PaymentDetails);
  if (!context) {
    throw new Error('useContext must be used within a PaymentDetailsProvider');
  }
  return context;
};

export const PaymentDetailsProvider = ({ children }: PaymentDetailsProviderProps) => {
  const [reservationPaymentDetails, setReservationPaymentDetails] = useState<IPaymentDetails>({} as IPaymentDetails);

  const contextValue: PaymentDetailsContextType = {
    reservationPaymentDetails,
    setReservationPaymentDetails,
  };
  return <PaymentDetails.Provider value={contextValue}>{children}</PaymentDetails.Provider>;
};
