'use client';
import ReservationOwnerAgreement from '@/components/Legals/Agreement/OwnerAgreement';
import OwnerAgreement from '@/components/Legals/OwnerAgreement/OwnerAgreement';
import { useSearchParams } from 'next/navigation';

const OwnerAgreementTermsAndOtherPages = () => {
  const searchParams = useSearchParams();
  const reservationId = searchParams?.get('reservation-id');

  return <>{reservationId ? <ReservationOwnerAgreement /> : <OwnerAgreement />}</>;
};

export default OwnerAgreementTermsAndOtherPages;
