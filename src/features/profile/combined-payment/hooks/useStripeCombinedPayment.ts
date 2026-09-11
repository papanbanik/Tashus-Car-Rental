'use client';

import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import type { CombinedPaymentClientSecrets } from '../types/combined-payment.types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaymentItem {
  category: keyof CombinedPaymentClientSecrets;
  amount: number;
  label: string;
  description: string;
  paymentCategory: string;
}

interface UseStripeCombinedPaymentProps {
  clientSecrets: CombinedPaymentClientSecrets | null;
  paymentItems: PaymentItem[];
  reservationId: number;
  guestId: string;
  email: string;
  requestOrigin?: 'web' | 'mobile';
  sendToFlutter?: (action: string, data: Record<string, any>) => void;
}

interface PaymentResult {
  success: boolean;
  transactionIds: string[];
  error?: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useStripeCombinedPayment = ({
  clientSecrets,
  paymentItems,
  reservationId,
  guestId,
  email,
  requestOrigin = 'web',
  sendToFlutter,
}: UseStripeCombinedPaymentProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [cardHolderName, setCardHolderName] = useState<string>('');
  const [cardHolderAddress, setCardHolderAddress] = useState<string>('');
  const [cardError, setCardError] = useState<string>('');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState<boolean>(false);
  const [paymentComplete, setPaymentComplete] = useState<boolean>(false);
  const [transactionIds, setTransactionIds] = useState<string[]>([]);

  // ─── Process Payment ──────────────────────────────────────────────────────────

  const handleStripePayment = async (event: React.FormEvent): Promise<PaymentResult> => {
    event.preventDefault();
    setIsPaymentProcessing(true);
    setCardError('');

    // Validation
    if (!cardHolderName || !cardHolderAddress) {
      const error = 'Please fill out all information';
      setCardError(error);
      setIsPaymentProcessing(false);
      return { success: false, transactionIds: [], error };
    }

    if (!stripe || !elements) {
      const error = 'Payment system not ready. Please try again.';
      setCardError(error);
      setIsPaymentProcessing(false);
      return { success: false, transactionIds: [], error };
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      const error = 'Card element not found. Please refresh and try again.';
      setCardError(error);
      setIsPaymentProcessing(false);
      return { success: false, transactionIds: [], error };
    }

    // Create payment method
    const { error: paymentMethodError } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (paymentMethodError) {
      const error = paymentMethodError.message ?? 'Failed to create payment method';
      setCardError(error);
      setIsPaymentProcessing(false);
      return { success: false, transactionIds: [], error };
    }

    // Process all payments sequentially
    const completedTransactions: string[] = [];

    for (const item of paymentItems) {
      const clientSecret = clientSecrets?.[item.category];
      if (clientSecret) {
        try {
          // Build metadata for this payment
          const metadata = {
            guestId,
            email,
            dueAmount: item.amount,
            currency: 'AUD',
            reservationId: reservationId.toString(),
            description: item.description,
            payment_category: item.paymentCategory,
            request_origin: requestOrigin,
          };

          const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            setup_future_usage: 'off_session',
            payment_method: {
              card,
              billing_details: {
                name: cardHolderName,
                email: email,
                address: {
                  line1: cardHolderAddress,
                },
              },
              metadata: metadata as any,
            },
          });

          if (error) {
            const errorMessage = `Payment failed for ${item.label}: ${error.message}`;
            setCardError(errorMessage);
            setIsPaymentProcessing(false);
            return { success: false, transactionIds: completedTransactions, error: errorMessage };
          }

          if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_capture')) {
            completedTransactions.push(paymentIntent.id);
          }
        } catch (err) {
          const errorMessage = `Payment error for ${item.label}: ${err instanceof Error ? err.message : 'Unknown error'}`;
          setCardError(errorMessage);
          setIsPaymentProcessing(false);
          return { success: false, transactionIds: completedTransactions, error: errorMessage };
        }
      }
    }

    // Check if all payments succeeded
    if (completedTransactions.length === paymentItems.length) {
      setPaymentComplete(true);
      setTransactionIds(completedTransactions);
      setIsPaymentProcessing(false);

      // Notify Flutter WebView after successful payment
      if (sendToFlutter) {
        sendToFlutter('paymentSuccess', {
          reservationId,
          amount: paymentItems.reduce((sum, item) => sum + item.amount, 0),
          transactionIds: completedTransactions,
          success: true,
        });
      }

      return { success: true, transactionIds: completedTransactions };
    }

    setIsPaymentProcessing(false);
    return { success: false, transactionIds: completedTransactions, error: 'Not all payments completed' };
  };

  const isPaymentDisabled = isPaymentProcessing || !cardHolderName || !cardHolderAddress || !stripe || !clientSecrets || paymentComplete;

  return {
    // State
    cardHolderName,
    cardHolderAddress,
    cardError,
    isPaymentProcessing,
    paymentComplete,
    transactionIds,
    isPaymentDisabled,
    stripe,
    elements,

    // Actions
    setCardHolderName,
    setCardHolderAddress,
    setCardError,
    handleStripePayment,
  };
};
