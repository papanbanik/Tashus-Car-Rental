import { ReservationPaymentStatusEnum } from '@/types/commonTypes';
import { ReservationCancellationInfoStatus } from '@/types/travels/typeTravels';

export const getUpdatedTravelReturnAmountText = (paymentStatus: ReservationPaymentStatusEnum): string => {
  switch (paymentStatus) {
    case 'refundable':
      return 'Travel update refundable Amount';
    case 'refundedAsCredit':
      return 'Travel update credited Amount';
    case 'refunded':
      return 'Travel update refunded Amount';

    default:
      return '';
  }
};

export const getCancelledTravelReturnAmountText = (isRefundable: boolean, returnStatus: ReservationCancellationInfoStatus): string => {
  if (returnStatus === ReservationCancellationInfoStatus.Credited || !isRefundable) {
    return 'Credited Amount';
  }

  if (returnStatus === ReservationCancellationInfoStatus.Refunded) {
    return 'Refunded Amount';
  }

  if (returnStatus === ReservationCancellationInfoStatus.Pending || isRefundable) {
    return 'Refundable Amount';
  }

  return '';
};
