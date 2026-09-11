import { ImageInfoType } from '@/context/SearchProvider';
import { Dayjs } from 'dayjs';
import { IconType } from 'react-icons';

export type TDate = string | Date | Dayjs;

export type TCommonDateRange = {
  startDate: Date;
  endDate: Date;
  reservationId?: number;
};

export type TReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'cancelledByGuest' | 'cancelledByHost' | 'adminCompleted';
export type TPaymentStatus = 'pending' | 'paid' | 'refundable' | 'refunded' | 'refundedAsCredit';

export type TSnackBarContent = {
  message: string;
  severity: 'error' | 'info' | 'success' | 'warning';
  variant?: 'filled' | 'outlined' | 'standard';
  horizontal?: 'center' | 'left' | 'right';
  vertical?: 'bottom' | 'top';
  hideDuration?: number;
};

export type TGeneratedDateList = {
  date: Date | string;
  dayName: string;
};

export type TPaymentMethods =
  | 'onlyCard'
  | 'onlyVoucher'
  | 'onlyCredit'
  | 'onlyVoucherWithHold'
  | 'onlyCreditWithHold'
  | 'cardWithCredit'
  | 'cardWithVoucher'
  | 'noPayment';

export type TButtonVariant = 'contained' | 'outlined' | 'text';

export type TPhoto = {
  imageInfo: ImageInfoType;
  storageProvider?: string;
};

export interface OptionType {
  id: number;
  label: string;
  value?: string;
  icon?: IconType;
}
export const genderList: OptionType[] = [
  { id: 1, label: 'Male', value: 'male' },
  { id: 2, label: 'Female', value: 'female' },
  { id: 3, label: 'Others', value: 'others' },
];

export type OptimizedPhotoValues = {
  publicId: string;
  secureUrl: string;
  format: string;
  storageProvider: string;
};

export type TableHeader = {
  align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
  style?: React.CSSProperties;
  label: string;
};

export enum ReservationPaymentStatusEnum {
  Pending = 'pending',
  PendingCharge = 'pendingCharge', //when admin updates, guest can pay even after 30 mins or admin may charge later
  Paid = 'paid',
  Refundable = 'refundable',
  Refunded = 'refunded',
  RefundedAsCredit = 'refundedAsCredit',
  NotRequired = 'not_required',
  PartiallyPaid = 'partiallyPaid',
}

export enum EPriceAdjustment {
  Increase = 'INCREASE',
  Decrease = 'DECREASE',
}
