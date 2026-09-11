'use client';
import PayAdditionalFee from '@/components/Payment/PayAdditionalFee';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK as string) as any;

const AdditionalFeePaymentPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <PayAdditionalFee />
    </Elements>
  );
};

export default AdditionalFeePaymentPage;
