'use client';

import AdditionalDriverModal from '@/components/Search/ReservationCheckout/Verification/AdditionalDriver/AdditionalDriverModal';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useGetReservationInvoiceInfo } from '@/hooks/reservation/reservation-invoice/useGetReservationInvoiceInfo';
import { useTravelDetails } from '@/hooks/travel/useTravelDetails';
import { ReservationPaymentStatusEnum } from '@/types/commonTypes';
import { ReservationInvoiceInfoData } from '@/types/reservations/reservationInvoiceTypes';
import { reservationPendingStatus } from '@/utils/Lists/travelInfoList';
import { useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import CancelTravelM from '../../../TravelPriceUpdated/CancelTravelM';
import TravelVehicleCard from './TravelVehicleCard';
import TravelVehicleCardSmallDevice from './TravelVehicleCardSmallDevice';

interface VehicleCardProps {
  timeRemaining?: string;
  scrollToBillingDetails?: () => void;
  isTravelEnded?: boolean;
  isTravelCancelled?: boolean;
  isLatePickupTravel?: boolean;
  isTravelStarted?: boolean;
  handleEndTravel?: () => void;
  isStartInvalid?: boolean;
  isEndDayPassed?: boolean;
}

export default function TravelVehicleCardCommon({
  timeRemaining,
  isTravelEnded,
  isTravelCancelled,
  isLatePickupTravel,
  isTravelStarted,
  handleEndTravel,
  isStartInvalid,
  isEndDayPassed,
}: VehicleCardProps) {
  const router = useRouter();
  const pathName = usePathname();
  const isSmall = useMediaQuery('(max-width: 1024px)');
  useTravelDetails();
  const { updatedTravelData } = useTravelContext();
  const { travelDetails } = useProfileInfoContext();
  const { travelId } = useParams<{ travelId: string }>();
  const { openModal } = useModalContext();
  const [isCopy, setIsCopy] = useState(false);

  const {
    reservationId,
    revisedId,
    revisedVehiclePayableAmount,
    revisedCoveragePayableAmount,
    revisedVehiclePaymentStatus,
    revisedCoveragePaymentStatus,
    paymentStatus,
  } = updatedTravelData ?? {};
  const { data } = useGetReservationInvoiceInfo({ reservationId, revisedId });
  const reservationInvoiceInfo: ReservationInvoiceInfoData = data?.data?.data[0] ?? {};

  const { additionalFeeDue, rentDueAmount, invoiceTotalPaid } = reservationInvoiceInfo;

  const vehicleFee = parseFloat((revisedVehiclePayableAmount ?? 0)?.toFixed(2));
  const coverageFee = parseFloat((revisedCoveragePayableAmount ?? 0)?.toFixed(2));
  const isVehiclePayable = revisedVehiclePaymentStatus === ReservationPaymentStatusEnum.Pending && vehicleFee > 0;
  const isCoveragePayable = revisedCoveragePaymentStatus === ReservationPaymentStatusEnum.Pending && coverageFee > 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(travelId);
    setIsCopy(true);
    setTimeout(() => setIsCopy(false), 2000);
  };
  const handleElementPayButton = () => {
    router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/search/${travelDetails?.carListingId}/payment/${travelId}`);
  };

  const totalDeliveryCost = (updatedTravelData?.vehicleDeliveryFee ?? 0) + (updatedTravelData?.vehicleReturnFee ?? 0);

  const disablePayButton = paymentStatus === ReservationPaymentStatusEnum.Pending && dayjs().diff(dayjs(updatedTravelData?.createdAt), 'minute') > 30;

  const dueHelpingText = isTravelCancelled
    ? 'You are not able to pay for a cancelled travel.'
    : paymentStatus === ReservationPaymentStatusEnum.PendingCharge
    ? 'Your reservation or travel updates will be confirmed once payment is completed. Please make your payment at your earliest convenience.'
    : paymentStatus === ReservationPaymentStatusEnum.Pending
    ? 'Kindly note that your reservation or travel updates will only be confirmed upon payment completion within the next 30 minutes'
    : revisedCoveragePaymentStatus === ReservationPaymentStatusEnum.Pending || revisedVehiclePaymentStatus === ReservationPaymentStatusEnum.Pending
    ? 'Please pay your outstanding balance at your earliest convenience.'
    : '';

  const handleCancelTravel = () => {
    openModal({
      content: <CancelTravelM />,
    });
  };

  const isPending = reservationPendingStatus.includes(paymentStatus);

  const hideAdditionalDriver =
    travelDetails?.additionalDrivers?.length === 0 &&
    (travelDetails?.isTripStarted || (!travelDetails?.isTripStarted && dayjs().isAfter(dayjs(updatedTravelData?.returnDate), 'minute')));

  const handleDisplayDriver = () => {
    openModal({
      title: 'Additional Driver',
      modalWidth: 'md',
      content: <AdditionalDriverModal />,
    });
  };

  const handleStartTravel = () => {
    router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}/start-travel?view=key-received&&from=details`);
  };
  const daysDiffEndToCurrent = dayjs().diff(dayjs(travelDetails?.tripInformation?.endTime), 'day');

  return (
    <>
      {isSmall ? (
        <TravelVehicleCardSmallDevice
          timeRemaining={timeRemaining}
          isTravelEnded={isTravelEnded}
          isTravelCancelled={isTravelCancelled}
          isLatePickupTravel={isLatePickupTravel}
          isTravelStarted={isTravelStarted}
          handleEndTravel={handleEndTravel}
          rentDueAmount={rentDueAmount}
          additionalFeeDue={additionalFeeDue}
          disablePayButton={disablePayButton}
          dueHelpingText={dueHelpingText}
          paymentStatus={paymentStatus}
          handleElementPayButton={handleElementPayButton}
          handleCancelTravel={handleCancelTravel}
          isPending={isPending}
          travelId={travelId}
          handleCopy={handleCopy}
          isCopy={isCopy}
          hideAdditionalDriver={hideAdditionalDriver}
          handleDisplayDriver={handleDisplayDriver}
          isStartInvalid={isStartInvalid}
          isEndDayPassed={isEndDayPassed}
          handleStartTravel={handleStartTravel}
          daysDiffEndToCurrent={daysDiffEndToCurrent}
          isVehiclePayable={isVehiclePayable}
          isCoveragePayable={isCoveragePayable}
          vehicleFee={vehicleFee}
          coverageFee={coverageFee}
        />
      ) : (
        <TravelVehicleCard
          timeRemaining={timeRemaining}
          isTravelEnded={isTravelEnded}
          isTravelCancelled={isTravelCancelled}
          isLatePickupTravel={isLatePickupTravel}
          isTravelStarted={isTravelStarted}
          handleEndTravel={handleEndTravel}
          rentDueAmount={rentDueAmount}
          additionalFeeDue={additionalFeeDue}
          disablePayButton={disablePayButton}
          dueHelpingText={dueHelpingText}
          paymentStatus={paymentStatus}
          handleElementPayButton={handleElementPayButton}
          handleCancelTravel={handleCancelTravel}
          isPending={isPending}
          travelId={travelId}
          handleCopy={handleCopy}
          hideAdditionalDriver={hideAdditionalDriver}
          handleDisplayDriver={handleDisplayDriver}
          invoiceTotalPaid={invoiceTotalPaid}
          isStartInvalid={isStartInvalid}
          isEndDayPassed={isEndDayPassed}
          handleStartTravel={handleStartTravel}
          daysDiffEndToCurrent={daysDiffEndToCurrent}
          isVehiclePayable={isVehiclePayable}
          isCoveragePayable={isCoveragePayable}
          vehicleFee={vehicleFee}
          coverageFee={coverageFee}
        />
      )}
    </>
  );
}
