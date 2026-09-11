import CombinedPayment from '@/features/profile/combined-payment/components/CombinedPayment';
import CombinedPaymentElement from '@/features/profile/combined-payment/components/CombinedPaymentPage';

export const metadata = {
  title: 'Combined Payment | Tashus: Drive Smarter, Share Together',
  description: 'Pay your outstanding dues combinedly.',
};

const CombinedPaymentPage = ({ params }: { params: { reservationId: string } }) => {
  return <CombinedPaymentElement reservationId={parseInt(params.reservationId)} />;
};

export default CombinedPaymentPage;
