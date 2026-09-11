'use client';
import PayModificationFee from '@/components/Payment/ModifyReservation/PayModificationFee';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK as string) as any;

const ReservationModificationPaymentPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <PayModificationFee />
    </Elements>
  );
};

export default ReservationModificationPaymentPage;
