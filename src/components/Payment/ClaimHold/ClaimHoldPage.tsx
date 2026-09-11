'use client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ClaimHold from './ClaimHold';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK as string) as any;

const ClaimHoldPage = () => {
  return (
    <div>
      <Elements stripe={stripePromise}>
        <ClaimHold />
      </Elements>
    </div>
  );
};

export default ClaimHoldPage;
