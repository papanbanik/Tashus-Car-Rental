import { TDiscountedPrice, TNextLongDiscount, TPeakIncreasePrice } from '@/context/SearchProvider';
import { ReservationPaymentStatusEnum, TDate, TGeneratedDateList, TReservationStatus } from '../commonTypes';
import { CustomPricing } from '../user-profile/customPriceTypes';
import { TReservationHoldTransaction } from '../user-profile/holdPaymentTransactionTypes';
import { PaymentMethod } from '../user-profile/transactionsTypes';
import {
  CancellationInfo,
  ReservationAdditionalFees,
  TAdditionalPaymentInfo,
  TBasePrice,
  TOppositeUserInfo,
  TPriceAdjustment,
  TTravelDiscounts,
} from './typeTravels';

export type TDiscountInfo = {
  longAppliedPrice?: number;
  advAppliedPrice?: number;
  dayDiff?: number;
  advancedDays?: number;
};

export type TBillingDetails = {
  newDuration: string;
  newDurationPrice: number;
  newTotalPrice: number;
  newServiceFee: number;
  newPeakIncPrice?: TPeakIncreasePrice;
  newLongBookingDis?: TDiscountedPrice;
  newAdvBookingDis?: TDiscountedPrice;
  newCoverageAmount?: number;
  newGstAmount?: number;
  newDepositAmount?: number;
  newTotalWithoutCoverage?: number;
  oldDuration: string;
  oldDurationPrice: number;
  oldTotalPrice: number;
  oldServiceFee: number;
  oldPeakIncPrice?: TPeakIncreasePrice;
  oldLongBookingDis?: TDiscountedPrice;
  oldAdvBookingDis?: TDiscountedPrice;
  oldCoverageAmount?: number;
  oldGstAmount?: number;
  oldDepositAmount?: number;
  oldPenaltyPrice?: number;
  oldPenaltyReason?: string;
  payableAmount?: number;
  refundableAmount?: number;
  penaltyPrice?: number;
  totalWithoutPenalty?: number;
  refundText?: string;
  paidText?: string;
  newStartDate: Date;
  newEndDate: Date;
  totalDurationHours: number;
  dailyPrice: number;
  hourlyPrice: number;
  currency: string;
  serviceFeePercentage: number;
  additionalDistanceFeePerKm?: number;
  peakIncToolTip?: string;
  inconvenienceToolTip?: string;
  customPrices: CustomPricing[];
  // revisedVoucherUsed?: number;
  additionalPaymentInfo?: TAdditionalPaymentInfo;
  waivedPenaltyPrice?: number;
  longDiscountToolTip?: string;
  advanceDiscountToolTip?: string;
  discountsInfo?: TDiscountInfo;
  nextLongBookingDis?: TNextLongDiscount;
  waivedPayableAmount?: number;
  priceAdjustment?: TPriceAdjustment;
  previousLongBookingDiscount?: number;
  previousPenaltyPrice?: number;
};

export type TUpdatedTravelData = {
  pickupDate: Date | string;
  returnDate: Date | string;
  createdAt: Date | string;
  reservedAt: Date | string;
  basePrice: TBasePrice;
  hostRentalFees: number;
  discounts?: TTravelDiscounts;
  peakIncrease?: TPeakIncreasePrice;
  serviceFeePercentage: number;
  additionalDistanceFeePerKm?: number;
  totalDurationText: string;
  reservationId: string;
  paymentStatus: ReservationPaymentStatusEnum;
  paymentMethod?: PaymentMethod;
  travelType: 'current' | 'upcoming' | 'past';
  isUserGuest: boolean;
  oppositeUserInfo: TOppositeUserInfo;
  totalDurationHours: number;
  depositAmount?: number;
  additionalPaymentInfo?: TAdditionalPaymentInfo;
  reservationStatus: TReservationStatus;
  totalPaidAmount?: number;
  totalReturnedAmount?: number;
  reservationAdditionalFees?: ReservationAdditionalFees[];
  cancellationInfo?: CancellationInfo;
  revisedId?: string;
  vehicleDeliveryFee?: number;
  vehicleReturnFee?: number;
  revisedVehicleCreditedAmount?: number;
  revisedVehiclePayableAmount?: number;
  revisedVehicleDiscountAmount?: number;
  revisedCoveragePayableAmount?: number;
  revisedCoverageCreditedAmount?: number;
  revisedVehiclePaymentStatus?: ReservationPaymentStatusEnum;
  revisedCoveragePaymentStatus?: ReservationPaymentStatusEnum;
  holdPaymentTransaction?: TReservationHoldTransaction;
};

export type TSingleTravel = {
  pickupDate: Date | string;
  returnDate: Date | string;
  reservationId: number;
  totalPrice: number;
  hostRentalFees: number;
  paymentStatus: ReservationPaymentStatusEnum;
  reservationStatus: string;
  coverPhoto: string;
  vehicleModel: string;
  pickupLocation: string;
  maximumDailyDistance?: number;
  hourlyPrice: number;
  dailyPrice: number;
  isPaymentExpired: boolean;
  carNickName: string;
  guestId?: string;
  // isEndedByGuest?: boolean;
  // isEndedByPartner?: boolean;
};

export type TDateInfo = {
  date: any;
  dayName: string;
  isMatched: boolean;
  dailyRate: number;
  hourlyRate: number;
  hasPeakIncrease: any;
  increasedAmount: number;
  dayPrice?: number;
};

export type TParamsGetUpcomingDurationPrice = {
  pickupTime: TDate;
  returnTime: TDate;
  currentPickupTime: TDate;
  currentReturnTime: TDate;
  storedDailyPrice: number;
  storedHourlyPrice: number;
  currentDailyPrice: number;
  currentHourlyPrice: number;
  peakIncrease: any;
  generatedDates?: TGeneratedDateList[];
  matchedDates?: TGeneratedDateList[];
};

export type TParamsGetRefundOrPenalty = TParamsGetUpcomingDurationPrice & {
  dateList?: TDateInfo[];
  updatedBillingDetails: any;
  oldDurationHours: number;
  newDurationHours: number;
  paidPrice: number;
};

export type TCancelReservationInfo = {
  hostName: string;
  carName: string;
};

export type TCancelUpcomingTravelByGuest = {
  userId: string;
  totalAmount: number;
  cancellationFee: number;
  creditAmount: number;
  reservationInfo: TCancelReservationInfo;
  isRefundable: boolean;
  guestInconvenienceFeeReason?: string;
};

export type TCancelUpcomingReservationByHost = {
  userId: string;
  reservationInfo: TCancelReservationInfo;
};
