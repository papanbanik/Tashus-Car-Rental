import { CarDataRates, CarRatesValues } from '../car-listing/carListingTypes';
import { TDate } from '../commonTypes';
import { TVoucherRule } from './promotionTypes';

export type TVoucherEvaluationData = {
  carListingId?: number;
  carType?: string;
  carRates?: CarRatesValues;
  reservationDuration?: number;
  guestTotalTrips?: number;
  monthOfTravel?: string;
  isEmailVerified?: boolean;
  pickupTime?: TDate;
  returnTime?: TDate;
};

export type TVoucherInfo = {
  discountType: string;
  discountAmount: number;
  maxDiscountAmount: number;
  voucherRules: TVoucherRule[];
};
// --- Additional Data Type ---
type TVoucherValidateAdditionalData = {
  carListingId: number;
  reservationDuration: number;
  travelStartDate: TDate;
  travelEndDate: TDate;
  carRates?: CarDataRates;
  carType?: string;
};

// --- Main Request Type ---
export type TVoucherValidateRequest = {
  totalAmount: number;
  additionalData: TVoucherValidateAdditionalData;
  voucherInfo?: TVoucherInfo;
};

export type TApplyVoucherAmountParams = {
  voucherInfo: TVoucherInfo;
  totalPrice: number;
  carRates: CarDataRates;
  pickupTime: string;
  returnTime: string;
};
