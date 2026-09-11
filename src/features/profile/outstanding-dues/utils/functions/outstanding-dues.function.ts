import { EReservationStatus } from '@/types/travels/travelEnums';
import { completedStatuses, reservationCancelledStatuses } from '../lists/outstanding-dues.list';
import { SortField, SortOrder } from '../../types/outstanding-dues.type';

export const getStatusBadgeClass = (status: string): string => {
  if (status === EReservationStatus.Confirmed) return 'bg-green-100 text-green-700';
  if (status === EReservationStatus.Pending) return 'bg-yellow-100 text-yellow-700';
  if (status === EReservationStatus.Disputed) return 'bg-orange-100 text-orange-700';
  if (completedStatuses.includes(status as EReservationStatus)) return 'bg-blue-100 text-blue-700';
  if (reservationCancelledStatuses.includes(status as EReservationStatus)) return 'bg-red-100 text-red-500';
  return 'bg-gray-100 text-gray-600';
};

export const getStatusLabel = (status: string): string => {
  if (reservationCancelledStatuses.includes(status as EReservationStatus)) return 'Cancelled';
  if (completedStatuses.includes(status as EReservationStatus)) return 'Completed';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const getSortLabel = ({ sortField, sortOrder }: { sortField: SortField; sortOrder: SortOrder }) => {
  let fieldName = 'Reservation ID';
  if (sortField === 'totalOutstandingDues') fieldName = 'Outstanding Dues';
  if (sortField === 'totalPaidAmount') fieldName = 'Paid Amount';
  return `${fieldName} (${sortOrder.toUpperCase()})`;
};
