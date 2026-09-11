'use client';

import { useTravelContext } from '@/context/TravelProvider';
import { useGetReservationInvoiceInfo } from '@/hooks/reservation/reservation-invoice/useGetReservationInvoiceInfo';
import { ReservationPaymentStatusEnum } from '@/types/commonTypes';
import { ReservationInvoiceInfoData } from '@/types/reservations/reservationInvoiceTypes';
import { reservationPendingStatus } from '@/utils/Lists/travelInfoList';
import { useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import ReservationVehicleCard from './ReservationVehicleCard';
import ReservationVehicleCardSmallDevice from './ReservationVehicleCardSmallDevice';

interface ReservationVehicleCommonProps {
  timeRemaining?: string;
  isTravelEnded?: boolean;
  isTravelCancelled?: boolean;
  isLatePickupTravel?: boolean;
  isTravelStarted?: boolean;
  handleCompleteConfirmation?: () => void;
  handleVerifyGuest?: () => void;
  handleCancelUpcomingReservation?: () => void;
  handleCancelCurrentReservation?: () => void;
  isGuestVerified?: boolean;
  handlePartnerEndTravel?: () => void;
}

export default function ReservationVehicleCommon({
  timeRemaining,
  isTravelEnded,
  isTravelCancelled,
  isLatePickupTravel,
  isTravelStarted,
  handleCompleteConfirmation,
  handleVerifyGuest,
  handleCancelUpcomingReservation,
  handleCancelCurrentReservation,
  isGuestVerified,
  handlePartnerEndTravel,
}: ReservationVehicleCommonProps) {
  const isSmall = useMediaQuery('(max-width: 1024px)');
  const { updatedTravelData } = useTravelContext();
  const { travelId } = useParams<{ travelId: string }>();
  const [isCopy, setIsCopy] = useState(false);
  const { reservationId, revisedId } = updatedTravelData ?? {};
  const { data } = useGetReservationInvoiceInfo({ reservationId, revisedId });
  const reservationInvoiceInfo: ReservationInvoiceInfoData = data?.data?.data[0] ?? {};

  const { additionalFeeDue, rentDueAmount } = reservationInvoiceInfo;

  const handleCopy = () => {
    navigator.clipboard.writeText(travelId);
    setIsCopy(true);
    setTimeout(() => setIsCopy(false), 2000);
  };
  const { paymentStatus } = updatedTravelData;

  const disablePayButton = paymentStatus === ReservationPaymentStatusEnum.Pending && dayjs().diff(dayjs(updatedTravelData?.createdAt), 'minute') > 30;

  const dueHelpingText =
    paymentStatus === ReservationPaymentStatusEnum.PendingCharge
      ? 'Your reservation or travel updates will be confirmed once payment is completed. Please make your payment at your earliest convenience.'
      : ReservationPaymentStatusEnum.Pending
      ? 'Kindly note that your reservation or travel updates will only be confirmed upon payment completion within the next 30 minutes'
      : '';

  const isPending = reservationPendingStatus.includes(paymentStatus);

  return (
    <>
      {isSmall ? (
        <ReservationVehicleCardSmallDevice
          timeRemaining={timeRemaining}
          isTravelEnded={isTravelEnded}
          isTravelCancelled={isTravelCancelled}
          isLatePickupTravel={isLatePickupTravel}
          isTravelStarted={isTravelStarted}
          handleCompleteConfirmation={handleCompleteConfirmation}
          rentDueAmount={rentDueAmount}
          additionalFeeDue={additionalFeeDue}
          disablePayButton={disablePayButton}
          dueHelpingText={dueHelpingText}
          paymentStatus={paymentStatus}
          isPending={isPending}
          reservationId={reservationId}
          handleCopy={handleCopy}
          handleVerifyGuest={handleVerifyGuest}
          isGuestVerified={isGuestVerified}
          handleCancelUpcomingReservation={handleCancelUpcomingReservation}
          handleCancelCurrentReservation={handleCancelCurrentReservation}
          isCopy={isCopy}
          handlePartnerEndTravel={handlePartnerEndTravel}
        />
      ) : (
        <ReservationVehicleCard
          timeRemaining={timeRemaining}
          isTravelEnded={isTravelEnded}
          isTravelCancelled={isTravelCancelled}
          isLatePickupTravel={isLatePickupTravel}
          isTravelStarted={isTravelStarted}
          handleCompleteConfirmation={handleCompleteConfirmation}
          rentDueAmount={rentDueAmount}
          additionalFeeDue={additionalFeeDue}
          disablePayButton={disablePayButton}
          dueHelpingText={dueHelpingText}
          paymentStatus={paymentStatus}
          isPending={isPending}
          handleCopy={handleCopy}
          handleVerifyGuest={handleVerifyGuest}
          isGuestVerified={isGuestVerified}
          handleCancelUpcomingReservation={handleCancelUpcomingReservation}
          handleCancelCurrentReservation={handleCancelCurrentReservation}
          handlePartnerEndTravel={handlePartnerEndTravel}
        />
      )}
    </>
  );
}
