'use client';
import RentalAgreement from '@/components/Legals/RentalAgreement/RentalAgreement';
import { useSearchParams } from 'next/navigation';

import ReservationRentalAgreement from '@/components/Legals/Agreement/RentalAgreement';

const RentalAgreementTermsAndOtherPages = () => {
  const searchParams = useSearchParams();
  const reservationId = searchParams?.get('reservation-id');
  return <>{reservationId ? <ReservationRentalAgreement /> : <RentalAgreement />}</>;
};

export default RentalAgreementTermsAndOtherPages;
