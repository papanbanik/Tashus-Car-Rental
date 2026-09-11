import { TDiscountedPrice, TPeakIncreasePrice } from '@/context/SearchProvider';
import { CarAdditionalInfosState } from '../car-listing/carInfoTypes';
import { CarDataGuidelines, CarDataInsuranceInfo, CarDataRates, CarPickupLocationValues } from '../car-listing/carListingTypes';
import { TAdditionalDriverInfo, TGuestInsurance } from '../checkout/guestVerificationTypes';
import {
  EPriceAdjustment,
  OptimizedPhotoValues,
  ReservationPaymentStatusEnum,
  TDate,
  TPaymentMethods,
  TPhoto,
  TReservationStatus,
} from '../commonTypes';
import { CustomPricing } from '../user-profile/customPriceTypes';
import { TVehicleInsurance } from '../user-profile/transactionsTypes';
import { TVoucherInfo } from '../voucher-promotion/voucherTypes';
import { EPaymentMethod, EPaymentStatus } from './travelEnums';
import { TDiscountInfo } from './typeEditTravels';

export type TPriceAdjustment = {
  reason: string;
  amount: number;
  adjustmentType: EPriceAdjustment;
};

export type TBasePrice = {
  dailyPrice: number;
  hourlyPrice: number;
  totalPrice: number;
  durationPrice: number;
  currency: string;
  serviceFeeAmount: number;
  customPrices?: CustomPricing[];
  penaltyPrice?: number; // only when revised
  penaltyReason?: string; // only when revised
  waivedPenaltyPrice?: number; // only when current travel revised
  previousPayableAmount?: number;
  payableAmount?: number; // only when revised
  refundableAmount?: number; // only when revised
  coverageAmount?: number;
  gstAmount?: number;
  hostIncome?: number;
  customizedCoverageId?: string;
  revisedVoucherUsed?: number;
  //Vehicle Delivery
  totalDeliveryFee?: number;
  totalReturnFee?: number;
  deliveryFeeDiscount?: number;
  returnFeeDiscount?: number;
  priceAdjustment?: TPriceAdjustment; // only when revised admin
  waivedPayableAmount?: number;
};

export type TTravelDiscounts = {
  advanceBookingDiscounts?: TDiscountedPrice;
  longBookingDiscounts?: TDiscountedPrice;
  customAdvanceDiscountAmount?: number;
  customLongDiscountAmount?: number;
  discountsInfo?: TDiscountInfo;
};

export type TTravelLocation = {
  coordinates: [];
  streetAddress?: string;
};
export type TLocation = {
  coordinates: [number, number];
  shortAddress: string;
  streetAddress: string;
  postalCode?: string;
};

export type TRevisedReservation = {
  _id?: string;
  rentalAgreement?: any; // _id agreementId; // Ref. Agreement
  newStartDate: Date;
  newEndDate: Date;
  totalDurationHours: number;
  additionalDistanceFeePerKm?: number; //
  basePrice: TBasePrice;
  serviceFeePercentage: number;
  paymentStatus: 'pending' | 'paid' | 'refundable' | 'refunded' | 'refundedAsCredit';
  discounts?: TTravelDiscounts;
  peakIncrease?: TPeakIncreasePrice;
  isRefundable?: boolean;
  additionalPaymentInfo?: TAdditionalPaymentInfo;
  paymentMethod?: TPaymentMethods;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TRevisedVehicle = {
  previousCarListingId: number;
  previousBasePrice: TBasePrice;
  paymentStatus?: ReservationPaymentStatusEnum;
  paymentMethod?: TPaymentMethods;
  reason: string;
  description: string;
  payableAmount?: number;
  discountAmount?: number;
  creditedAmount?: number;
};

export type TRevisedCoverage = {
  revisedId: string;
  dueAmount: number; //
  paymentStatus?: ReservationPaymentStatusEnum;
  paymentMethod?: TPaymentMethods;
  previousInsurance: ReservationGuestInsurance;
  reason: string;
  previousBasePrice: TBasePrice;
};

export type TReservation = {
  reservationId: number;
  guestId: string;
  hostId: string;
  carListingId: number;
  startDate: Date;
  endDate: Date;
  totalDurationHours: number;
  totalDistanceKm?: number;
  dailyDistanceKm?: number;
  additionalDistanceFeePerKm?: number;
  basePrice: TBasePrice;
  serviceFeePercentage: number; // settings/get-company-info {agreementId, serviceF}
  reservationStatus: TReservationStatus;
  paymentStatus?: ReservationPaymentStatusEnum;
  pickupLocation: TTravelLocation;
  dropOffLocation: TTravelLocation;
  discounts?: TTravelDiscounts;
  peakIncrease?: TPeakIncreasePrice;
  tripInformation?: TTripInformation;
  rentalAgreement?: any; // Ref: Agreement
  revisedReservations?: TRevisedReservation[]; // api update | return latest edited if any
  revisedVehicles?: TRevisedVehicle[]; // will add when update vehicle
  revisedCoverages?: TRevisedCoverage[];
  vehicleInsurance?: TVehicleInsurance;
  insurance?: TGuestInsurance;
  reservedAt?: Date;
  updatedAt?: Date;
};

export type TOppositeUserInfo = {
  firstName: string;
  middleName?: string;
  lastName: string;
  username?: string;
  joinedDate: string | Date;
  profilePhoto: string;
  totalTrips?: number;
  ratings?: number;
  phoneNumber?: number;
  respondIn?: number;
  hostRatingCount?: number;
  hostRatingTotal?: number;
  hostTotalTrips?: number;
  guestRatingCount?: number;
  guestRatingTotal?: number;
  guestTotalTrips?: number;
};

export type TTravelQueryEnableFlags = {
  useConfirmGuestLicenseInfo: boolean;
};

export type TAdditionalPaymentInfo = {
  cardAmountUsed?: number;
  creditAmountUsed?: number;
  voucherCode?: string;
  voucherAmountUsed?: number;
  voucherId?: string;
  voucherUsedId?: string; // [_id] in the voucherUsedBy array at VoucherPromotion collection for future removed when cancellation
  chargeId?: string;
};

export type TTripInformation = {
  carKeyReceived: boolean;
  startTime: Date;
  endTime: Date;
  guestInitialConditionPhotos?: TPhoto[];
  partnerInitialConditionPhotos?: TPhoto[];
  guestTravelEndPhotos?: TPhoto[];
  partnerTravelEndPhotos?: TPhoto[];
  tripEndingInfo: TTripEndingInfo;
  guestLicenseVerificationConfirmation: TGuestLicenseVerificationConfirmation;
  startTravelOdometer?: ITravelOdometerReading;
  endTravelOdometer?: ITravelOdometerReading;
  vehicleInfoBeforeReservation: IReservationVehicleInfo;
  vehicleInfoAfterReservation: IReservationVehicleInfo;
};

export type TTripEndingInfo = {
  isEndedByAdmin?: boolean;
  isEndedByGuest?: boolean;
  isEndedByPartner?: boolean;
  endingInfoByGuest?: TGuestEnding;
  endingInfoByPartner?: TPartnerEnding;
  endingInfoByAdmin?: TPartnerEnding;
};

export type TGuestEnding = {
  isCarParkedByGuest: boolean;
  isAnythingLeftChecked: boolean;
  isCarLockedByGuest: boolean;
  isKeyReturnedByGuest: boolean;
  parkingPhoto?: TPhoto; // Photo of guest's parking (optional).
  updatedAt: Date;
};

export type TPartnerEnding = {
  totalTravelDistanceKilometers?: number; // Total distance traveled for partner's extra payment.
  isKeyReceivedByPartner: boolean;
  updatedAt: Date;
};

export type TGuestLicenseVerificationConfirmation = {
  isLicenseInfoMatched: boolean;
  licenseImagesByPartner?: TPhoto[];
};

export type TAgreementReservationData = {
  pickupDate: Date | string;
  returnDate: Date | string;
  basePrice: TBasePrice;
  totalDurationHours: number;
  dailyDistanceKm?: number;
  totalAllowedKM: number;
  additionalFee: number;
  depositAmount?: number;
  perKmCost?: number;
};

export type PeakIncreaseTypeEnum = 'percentage' | 'amount';

export type ReservationLocationState = {
  coordinates: [number, number];
  shortAddress: string;
  streetAddress: string;
  postalCode?: string;
};

export type ReservationGuestInsurance = {
  guestCoverageType: string;
  coveragePercentage: number;
  excessFee: number;
};

export type ITravelOdometerReading = {
  imageInfo?: OptimizedPhotoValues;
  odometerValue?: number;
};

export type IReservationVehicleInfo = {
  odometerValue?: number;
  odometerPhoto?: OptimizedPhotoValues;
};

type TravelDetailsUserInfo = {
  firstName: string;
  lastName: string;
  username: string;
  joinedDate: string;
  profilePhoto: string;
  totalTrips: number;
  phoneNumber: string;
  respondIn: number;
};

type TravelDetailsGuestInfo = TravelDetailsUserInfo & {
  guestRatingCount: number;
  guestRatingTotal: number;
  guestTotalTrips: number;
};

type TravelDetailsPartnerInfo = TravelDetailsUserInfo & {
  hostRatingCount: number;
  hostRatingTotal: number;
  hostTotalTrips: number;
};

type TravelDetailsCarInfo = {
  carNickName: string;
  car: TravelDetailsCar;
  features: string[];
  rates: CarDataRates;
  additionalFeatures: string[];
  additionalInfos: CarAdditionalInfosState;
  guidelines: CarDataGuidelines;
  totalTrips: number;
  ratingsReceivedFrom: number;
  totalRatings: number;
};

type TravelDetailsCar = {
  licensePlate: string;
  make: string;
  model: string;
};

export type TravelDetailsState = {
  _id: string;
  startDate: Date;
  endDate: Date;
  guestInfo: TravelDetailsGuestInfo;
  partnerInfo: TravelDetailsPartnerInfo;
  carListingId: number;
  reservationId: number;
  guestId: string;
  partnerId: string;
  reservationStatus: TReservationStatus;
  paymentStatus: ReservationPaymentStatusEnum;
  reservedAt: string;
  coverPhoto: {
    secureUrl: string;
    format: string;
  };
  parkingInstructions: string;
  pickupAddress: CarPickupLocationValues;
  carInfo: TravelDetailsCarInfo;
  reservationInfo: TravelDetailsReservationInfo;
  isTripStarted: boolean;
  isEndedByGuest: boolean;
  isEndedByPartner: boolean;
  tripInformation: TTripInformation;
  additionalDrivers: TAdditionalDriverInfo[];
  currentCreditBalance?: number;
};

export type TReservationNote = {
  noteId: string;
  message: string;
  name: string;
  role: 'admin' | 'guest' | 'host';
  createdAt: Date | string;
};

export type TravelDetailsReservationInfo = {
  pickupLocation: ReservationLocationState;
  dropOffLocation: ReservationLocationState;
  isDeliveryEnabled?: boolean;
  isReturnEnabled?: boolean;
  peakIncrease: TPeakIncreasePrice;
  totalDurationHours: number;
  totalDistanceKm: number;
  dailyDistanceKm: number;
  additionalDistanceFeePerKm: number;
  basePrice: TBasePrice;
  depositAmount: number;
  insurance: ReservationGuestInsurance;
  vehicleInsurance: CarDataInsuranceInfo;
  discounts: TTravelDiscounts;
  serviceFeePercentage: number;
  revisedReservations: TRevisedReservation[];
  cancellationInfo: CancellationInfo;
  paymentMethod: TPaymentMethods;
  additionalPaymentInfo: TAdditionalPaymentInfo;
  totalPaidAmount?: number;
  totalReturnedAmount?: number;
  reservationAdditionalFees?: ReservationAdditionalFees[];
  revisedVehicles?: TRevisedVehicle[];
  revisedCoverages?: TRevisedCoverage[];
  isHoldSuccess?: boolean;
  voucherInfo?: TVoucherInfo;
  notes?: TReservationNote[];
};

export type AdditionalFeePaymentStatus = 'pending' | 'paid' | 'partiallyPaid';

export type ReservationAdditionalFees = {
  subtotal: number;
  feeItems: ReservationAdditionalFeeItems[];
  paymentStatus: AdditionalFeePaymentStatus;
  currentDueAmount: number;
  chargeHistory?: ReservationAdditionalFeesChargeHistory[];
  updatedAt?: Date | string;
  createdAt?: Date | string;
  waiveFees?: TWaiveFeesItem[];
};

export type CancellationInfo = {
  isRefundable: boolean;
  returnAmountType?: string;
  guestInconvenienceFee?: number;
  guestInconvenienceFeeReason?: string;
  returnAmount?: number;
  requestedBy?: string;
  supportTicketId?: number;
  hostInconvenienceFee?: number;
  hostInconvenienceFeeReason?: string;
  cancellationReason?: string;
  adminId?: string;
  hostId: string;
  cancellationTime: Date;
  returnStatus: ReservationCancellationInfoStatus;
  requestId?: string;
};

export type ReservationAdditionalFeeItems = {
  itemType?: EPriceAdjustment;
  itemName: string;
  cost?: number; //total calculated amount
  additionalCharges?: AdditionalCharges[];
  // late return daily
  dailyRate?: number;
  numOfDays?: number;
  hideItemName?: boolean;
  fromDate?: string;
  toDate?: string;
  createdAt?: Date | string;
  processingFee?: number;
  notes?: string;
  itemKey?: string;
};

export type AdditionalCharges = {
  chargeName: string;
  cost?: number; //total calculated amount
  // for fuel shortage
  startRange?: number;
  endRange?: number;
  fuelCost?: number;
  // late return hourly
  hourlyRate?: number;
  numOfHours?: number;
  // late return daily
  dailyRate?: number;
  numOfDays?: number;
  fromDate?: string;
  toDate?: string;
  processingFee?: number;
  notes?: string;
};

export type ReservationAdditionalFeesChargeHistory = {
  chargeMethod: AdditionalFeeChargeMethod;
  paidAmount: number;
  adminPaymentNotes: string;
  adminId: string;
  adminUserName: string;
  chargedAt: Date;
};

export type AdditionalFeeChargeMethod =
  | 'chargeWithSavedCard'
  | 'cashPayment'
  | 'manualStripeCharged'
  | 'bankTransferred'
  | 'creditApplied'
  | 'otherPayment';

export enum ReservationCancellationInfoStatus {
  Pending = 'pending',
  Refunded = 'refunded',
  Credited = 'credited',
  NoReturn = 'noReturn',
}
//reservation additional waive fess

export type TWaiveFeesAdminLog = {
  adminUsername: string;
  metadata: {
    browser: string;
    ipAddress: string;
    userAgent: string;
  };
};

export type TWaiveFeesItem = {
  _id: string;
  amount: number;
  createdAt: string;
  description: string;
  updatedAt: string;
  adminLog: TWaiveFeesAdminLog;
  waivedAmount: number;
};

export type TReservationWaiveFees = {
  waiveFees: TWaiveFeesItem[];
};

export type TInvoiceReservationWaiveFeeItem = {
  amount: number;
  description: string;
};

export type TInvoiceReservationWaiveFees = {
  totalWaivedAmount?: number;
  waiveFees?: TInvoiceReservationWaiveFeeItem[];
};

export interface ReservationPriceListType {
  date: TDate;
  dailyPrice: number;
  hourlyPrice: number;
  rateDailyChange: string;
  rateHourlyChange: string;
  dailyDiff: number;
  hourlyDiff: number;
}
export type RevisedCoverageType = {
  startDate: TDate;
  endDate: TDate;
  revisedId: string;
  dueAmount: number;
  paymentStatus?: EPaymentStatus;
  paymentMethod?: EPaymentMethod;
  previousInsurance: ReservationGuestInsurance;
  reason: string;
  previousBasePrice: TBasePrice;
  updatedAt: TDate;
};
