'use client';
import { Alert, Button, CircularProgress, TextField } from '@mui/material';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { FaMapLocationDot } from 'react-icons/fa6';
import { IoPerson } from 'react-icons/io5';
import Image from 'next/image';
import Link from 'next/link';
import { useUserCredContext } from '@/context/UserCredProvider';
import { ECommonText } from '@/utils/Functions/randomCommonFn';
import type { CombinedPaymentClientSecrets, PaymentDistribution } from '../types/combined-payment.types';
import StripeLogo from '/public/stripe-logo.png';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CombinedPaymentProcessProps {
  clientSecrets: CombinedPaymentClientSecrets;
  distribution: PaymentDistribution;
  reservationId: number;
  totalAmount: number;
  onSuccess?: () => void;
}

// ─── Payment Status Type ──────────────────────────────────────────────────────

interface PaymentResult {
  category: keyof CombinedPaymentClientSecrets;
  amount: number;
  status: 'succeeded' | 'requires_capture' | 'failed';
  transactionId?: string;
  error?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const CombinedPaymentProcess = ({ 
  clientSecrets, 
  distribution, 
  reservationId, 
  totalAmount,
  onSuccess 
}: CombinedPaymentProcessProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { userCred } = useUserCredContext();

  // Form state
  const [cardHolderName, setCardHolderName] = useState<string>('');
  const [cardHolderAddress, setCardHolderAddress] = useState<string>('');
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cardError, setCardError] = useState<string>('');
  
  // Payment results
  const [paymentResults, setPaymentResults] = useState<PaymentResult[]>([]);
  const [isPaymentComplete, setIsPaymentComplete] = useState<boolean>(false);

  // Map client secrets to payment amounts
  const paymentItems = [
    { category: 'additionalFee' as const, amount: distribution.additionalFeePaid, label: 'Additional Fee' },
    { category: 'rent' as const, amount: distribution.rentPaid, label: 'Rent' },
    { category: 'holdDue' as const, amount: distribution.holdDuePaid, label: 'Hold Due' },
    { category: 'revised' as const, amount: distribution.revisedPaid, label: 'Revised' },
    { category: 'vehicleFee' as const, amount: distribution.vehiclePaid, label: 'Vehicle Fee' },
    { category: 'coverageFee' as const, amount: distribution.coveragePaid, label: 'Coverage Fee' },
  ].filter(item => item.amount > 0 && clientSecrets[item.category]);

  // ─── Confirm Individual Payment ──────────────────────────────────────────────

  const confirmPayment = async (
    clientSecret: string,
    category: keyof CombinedPaymentClientSecrets,
    amount: number,
    card: any
  ): Promise<PaymentResult> => {
    try {
      const { paymentIntent, error } = await stripe!.confirmCardPayment(clientSecret, {
        setup_future_usage: 'off_session',
        payment_method: {
          card,
          billing_details: {
            name: cardHolderName,
            email: userCred?.email,
            address: {
              line1: cardHolderAddress,
            },
          },
        },
      });

      if (error) {
        return {
          category,
          amount,
          status: 'failed',
          error: error.message,
        };
      }

      return {
        category,
        amount,
        status: paymentIntent!.status as 'succeeded' | 'requires_capture',
        transactionId: paymentIntent!.id,
      };
    } catch (error) {
      return {
        category,
        amount,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  };

  // ─── Handle Submit ────────────────────────────────────────────────────────────

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    setCardError('');

    // Validation
    if (!cardHolderName || !cardHolderAddress) {
      setCardError('Please fill out all information');
      setIsProcessing(false);
      return;
    }

    if (!stripe || !elements) {
      setCardError('Payment system not ready. Please try again.');
      setIsProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setCardError('Card element not found. Please refresh and try again.');
      setIsProcessing(false);
      return;
    }

    // Create payment method
    const { error: paymentMethodError } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (paymentMethodError) {
      setCardError(paymentMethodError.message ?? 'Failed to create payment method');
      setIsProcessing(false);
      return;
    }

    // Process all payments sequentially
    const results: PaymentResult[] = [];
    
    for (const item of paymentItems) {
      const clientSecret = clientSecrets[item.category];
      if (clientSecret) {
        const result = await confirmPayment(clientSecret, item.category, item.amount, card);
        results.push(result);
        
        // Stop processing if a payment fails
        if (result.status === 'failed') {
          setCardError(`Payment failed for ${item.label}: ${result.error}`);
          break;
        }
      }
    }

    setPaymentResults(results);

    // Check if all payments succeeded
    const allSucceeded = results.every(r => r.status === 'succeeded' || r.status === 'requires_capture');
    
    if (allSucceeded) {
      setIsPaymentComplete(true);
      if (onSuccess) {
        onSuccess();
      }
    }

    setIsProcessing(false);
  };

  // ─── Calculate Success Rate ───────────────────────────────────────────────────

  const successfulPayments = paymentResults.filter(r => r.status === 'succeeded' || r.status === 'requires_capture');
  const totalPaid = successfulPayments.reduce((sum, r) => sum + r.amount, 0);

  // ─── Render ───────────────────────────────────────────────────────────────────

  const isPaymentDisabled = 
    isProcessing || 
    !cardHolderName || 
    !cardHolderAddress || 
    !stripe || 
    Object.keys(clientSecrets).length === 0 ||
    isPaymentComplete;

  return (
    <div className="w-full space-y-4">
      {/* Payment Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Payment Summary</h3>
        <div className="space-y-1 text-sm">
          {paymentItems.map(item => (
            <div key={item.category} className="flex justify-between">
              <span className="text-gray-600">{item.label}:</span>
              <span className="font-semibold">${item.amount.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 border-t border-blue-300">
            <span className="font-bold text-gray-800">Total:</span>
            <span className="font-bold text-primary">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      {!isPaymentComplete && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            name="name"
            id="name"
            label={
              <div className="flex items-center gap-2">
                <IoPerson />
                Card holder name {ECommonText.RequiredSign}
              </div>
            }
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            disabled={isProcessing}
            size="small"
            fullWidth
            className="capitalize font-semibold"
          />

          <TextField
            name="address"
            id="address"
            label={
              <div className="flex items-center gap-2">
                <FaMapLocationDot />
                Billing address {ECommonText.RequiredSign}
              </div>
            }
            value={cardHolderAddress}
            onChange={(e) => setCardHolderAddress(e.target.value)}
            disabled={isProcessing}
            size="small"
            fullWidth
            className="capitalize"
          />

          <CardElement
            className="p-3 rounded-md bg-white border-solid border border-gray-300"
            onChange={() => setCardError('')}
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: '16px',
                  backgroundColor: 'white',
                  color: 'black',
                  '::placeholder': {
                    color: 'grey',
                  },
                },
                invalid: {
                  color: '#ff737a',
                },
              },
            }}
          />

          {/* Error Message */}
          {cardError && (
            <Alert severity="error" className="bg-red-50">
              {cardError}
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPaymentDisabled}
            fullWidth
            className="normal-case text-md md:text-lg"
            color="success"
            variant="contained"
          >
            {isProcessing ? (
              <CircularProgress color="inherit" size={22} />
            ) : (
              `Pay $${totalAmount.toFixed(2)}`
            )}
          </Button>
        </form>
      )}

      {/* Payment Results */}
      {paymentResults.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">Payment Results:</h4>
          {paymentResults.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                result.status === 'succeeded' || result.status === 'requires_capture'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm">
                    {paymentItems.find(item => item.category === result.category)?.label}
                  </p>
                  <p className="text-xs text-gray-600">${result.amount.toFixed(2)}</p>
                </div>
                <span
                  className={`text-xs font-semibold ${
                    result.status === 'succeeded' || result.status === 'requires_capture'
                      ? 'text-green-700'
                      : 'text-red-700'
                  }`}
                >
                  {result.status === 'succeeded' ? '✓ Succeeded' : 
                   result.status === 'requires_capture' ? '✓ Authorized' : '✗ Failed'}
                </span>
              </div>
              {result.transactionId && (
                <p className="text-xs text-gray-500 mt-1">
                  Transaction ID: {result.transactionId}
                </p>
              )}
              {result.error && (
                <p className="text-xs text-red-600 mt-1">{result.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Success Message */}
      {isPaymentComplete && (
        <div className="text-center space-y-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <Alert severity="success" className="bg-green-100">
            Payment Successful!
          </Alert>
          <div className="text-sm text-gray-700">
            <p className="font-semibold">Total Paid: ${totalPaid.toFixed(2)}</p>
            <p className="text-xs mt-1">
              {successfulPayments.length} of {paymentResults.length} payment(s) completed successfully
            </p>
          </div>
          <Link href={`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userCred?.userId}/travels/details/${reservationId}`}>
            <Button className="normal-case" variant="contained">
              View Travel Details
            </Button>
          </Link>
        </div>
      )}

      {/* Stripe Logo */}
      <div className="flex justify-center items-center mt-4">
        <Image className="w-2/3 h-auto max-w-[200px]" src={StripeLogo} alt="Stripe logo" />
      </div>
    </div>
  );
};

export default CombinedPaymentProcess;
