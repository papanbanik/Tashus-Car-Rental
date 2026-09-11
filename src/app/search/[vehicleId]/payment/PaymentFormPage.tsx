'use client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK as string) as any;

const PaymentFormPage = () => {
  return (
    <div>
      <Elements stripe={stripePromise}>
        <PaymentForm
        // product={product}
        ></PaymentForm>
      </Elements>
    </div>
  );
};

export default PaymentFormPage;
