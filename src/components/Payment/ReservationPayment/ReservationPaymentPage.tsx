'use client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentFormM from './PaymentFormM';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK as string) as any;

const ReservationPaymentPage = () => {
  return (
    <div>
      <Elements stripe={stripePromise}>
        <PaymentFormM />
      </Elements>
    </div>
  );
};

export default ReservationPaymentPage;
