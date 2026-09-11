import { EReservationStatus } from '@/types/travels/travelEnums';
export const BREAKDOWN_FILTERS = [
  { value: '', label: 'All' },
  { value: 'rent', label: 'Rent' },
  { value: 'additionalFee', label: 'Additional' },
  { value: 'coverageFee', label: 'Coverage' },
  { value: 'vehicleFee', label: 'Vehicle' },
  { value: 'holdDue', label: 'Hold' },
];

export const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: EReservationStatus.Confirmed, label: 'Confirmed' },
  { value: EReservationStatus.Pending, label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const reservationCancelledStatuses: string[] = [
  EReservationStatus.Cancelled,
  EReservationStatus.CancelledByGuest,
  EReservationStatus.CancelledByHost,
  EReservationStatus.AdminCancelled,
];

export const completedStatuses: string[] = [
  EReservationStatus.Completed,
  EReservationStatus.AutoCompleted,
  EReservationStatus.AdminCompleted,
  EReservationStatus.ForcedCompletion,
];
