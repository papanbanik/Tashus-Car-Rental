import { ReservationPaymentStatusEnum } from '@/types/commonTypes';
import { EReservationStatus, EVehicleReplaceReason } from '@/types/travels/travelEnums';
import { PaymentMethod } from '@/types/user-profile/transactionsTypes';

export const reservationPendingStatus = [
  ReservationPaymentStatusEnum.Pending,
  ReservationPaymentStatusEnum.PendingCharge,
  ReservationPaymentStatusEnum.PartiallyPaid,
];

export const reservationPaymentMethod = [PaymentMethod.OnlyCreditWithHold, PaymentMethod.OnlyVoucherWithHold];

export const travelHistoryTableHeader = ['SL', 'Start/End', 'Cost', 'Total Hours', 'Updated Time', 'Vehicle Rates'];

export const vehicleReplacementReasonOptions = [
  { id: 1, value: EVehicleReplaceReason.CarIssue, label: 'Current Car has Issues' },
  { id: 2, value: EVehicleReplaceReason.GuestRequest, label: 'Guest Request Replacement' },
];

export const reservationCancelledStatus = [
  EReservationStatus.Cancelled,
  EReservationStatus.CancelledByGuest,
  EReservationStatus.CancelledByHost,
  EReservationStatus.AdminCancelled,
];
