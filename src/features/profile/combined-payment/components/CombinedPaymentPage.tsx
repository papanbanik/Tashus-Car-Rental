'use client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CombinedPayment from './CombinedPayment';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK as string);

// ─── Props ────────────────────────────────────────────────────────────────────

interface CombinedPaymentPageProps {
  reservationId: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

const CombinedPaymentElement = ({ reservationId }: CombinedPaymentPageProps) => {
  return (
    <Elements stripe={stripePromise}>
      <CombinedPayment reservationId={reservationId} />
    </Elements>
  );
};

export default CombinedPaymentElement;
