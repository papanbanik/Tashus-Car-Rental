import { TReservationInfo } from '@/context/SearchProvider';
import { UserProfileInfo } from '@/context/UserCredProvider';
import { SaveNewReservationParams } from '@/hooks/reservation/useCreateReservation';
import { CarDataState } from '@/types/car-listing/carListingTypes';
import { TAppliedCreditInfo, TAppliedVoucherInfo } from '@/types/checkout/checkoutTypes';
import { TAdditionalDriverInfo, TGuestInsurance } from '@/types/checkout/guestVerificationTypes';
import { TPaymentMethods } from '@/types/commonTypes';
import { IPaymentDetails, ReservationDetails } from '@/types/payment/reservationPayment';
import { EPaymentStatus } from '@/types/travels/travelEnums';
import { TAdditionalPaymentInfo } from '@/types/travels/typeTravels';
import { CustomizeCoverage } from '@/types/user-profile/customHoldTypes';
import { CustomPricing } from '@/types/user-profile/customPriceTypes';
import { TDeliveryDetails } from '@/types/vehicle-delivery/vehicleDeliveryTypes';
import dayjs from 'dayjs';
import { getCarPickupLocation } from '../carListingCommonFn';
import { calculateWithPrecision } from '../lodashHelperFn';
import { getDeliveryFee } from '../vehicle-delivery/deliveryFn';

export const generatePaymentDetails = (reservationDetails: ReservationDetails): IPaymentDetails => {
  const {
    additionalPaymentInfo,
    depositAmount,
    revisedReservations,
    startDate,
    endDate,
    createdAt,
    paymentStatus,
    guestId,
    reservationId,
    carListingId,
    paymentMethod,
    reservationStatus,
    isHoldSuccess,
    holdDueAmount = 0,
  } = reservationDetails;

  const revisedReservation = revisedReservations || [];
  const lastRevision = revisedReservation?.slice(-1)[0];

  const reservationPaymentStatus = lastRevision?.paymentStatus ?? paymentStatus;
  const reservedAt = lastRevision?.createdAt ?? createdAt;

  let isPaymentTimeExpired: boolean = false;

  if (reservationPaymentStatus === 'pending') {
    isPaymentTimeExpired = dayjs().diff(dayjs(reservedAt), 'minute') >= 30;
  }

  const payableWithPreviousAmount = (lastRevision?.basePrice?.payableAmount ?? 0) + (lastRevision?.basePrice?.previousPayableAmount ?? 0);
  const cardAmount = additionalPaymentInfo?.cardAmountUsed ?? 0;

  const dueAmount =
    lastRevision?.paymentStatus === EPaymentStatus.PartiallyPaid
      ? (lastRevision?.additionalPaymentInfo?.manualPaymentList ?? [])?.slice(-1)[0]?.dueAmount
      : paymentStatus === EPaymentStatus.PartiallyPaid
      ? (additionalPaymentInfo?.manualPaymentList ?? [])?.slice(-1)[0]?.dueAmount
      : 0;

  const actualPayableAmount = payableWithPreviousAmount > 0 ? payableWithPreviousAmount : cardAmount;
  const payableAmount = dueAmount > 0 ? dueAmount : parseFloat(actualPayableAmount.toFixed(2));

  return {
    carListingId,
    reservationId,
    paymentAmount: payableAmount,
    pickupDate: lastRevision?.newStartDate ?? startDate,
    returnDate: lastRevision?.newEndDate ?? endDate,
    reservedAt: reservedAt,
    depositAmount: paymentStatus === EPaymentStatus.PartiallyPaid ? 0 : depositAmount ?? 0,
    isRevised: revisedReservation?.length > 0,
    revisedReservationId: lastRevision?._id ?? undefined,
    paymentStatus: reservationPaymentStatus,
    guestId,
    isPaymentTimeExpired,
    paymentMethod: !!lastRevision?.newStartDate ? lastRevision?.paymentMethod ?? '' : paymentMethod,
    reservationStatus: reservationStatus,
    isHoldSuccess: isHoldSuccess,
    holdDueAmount,
  };
};

export const getReservationRentFee = (isVoucherValid: boolean, durationPrice: number, totalPrice: number) => {
  return (isVoucherValid ? durationPrice : totalPrice) ?? 0;
};

export const getRentWithCoverage = (
  appliedVoucherInfo: TAppliedVoucherInfo | null,
  reservationInfo: TReservationInfo | null,
  guestCoveragePackage: TGuestInsurance | undefined
) => {
  if (!reservationInfo) return 0;
  const { isVoucherValid = false, totalAfterDiscount = 0 } = appliedVoucherInfo ?? {};
  const { totalPrice } = reservationInfo;
  const { coverageAmount = 0 } = guestCoveragePackage ?? {};
  return isVoucherValid ? totalAfterDiscount : calculateWithPrecision('add', [totalPrice, coverageAmount]);
};

export const getGSTAmount = (
  appliedVoucherInfo: TAppliedVoucherInfo | null,
  reservationInfo: TReservationInfo | null,
  guestCoveragePackage: TGuestInsurance | undefined
) => {
  // Update logic when GST will be added
  const rentWithCoverage = getRentWithCoverage(appliedVoucherInfo, reservationInfo, guestCoveragePackage);
  const calculatedGST = 0; //for now no GST
  // const calculatedGST = calculateWithPrecision('multiply', [rentWithCoverage, 0.1])
  return calculatedGST;
};

export const getCreateReservationPayableAmount = (
  appliedVoucherInfo: TAppliedVoucherInfo | null,
  appliedCreditInfo: TAppliedCreditInfo | null,
  reservationInfo: TReservationInfo | null,
  guestCoveragePackage: TGuestInsurance | undefined,
  gstAmount: number
): number => {
  if (!reservationInfo) return 0;
  const { durationPrice, totalPrice, deliveryDetails = {} as TDeliveryDetails } = reservationInfo;
  const { isCreditValid = false, deductedCreditAmount = 0 } = appliedCreditInfo ?? {};
  // const rentFee = getReservationRentFee(isVoucherValid, durationPrice, totalPrice);
  const rentWithCoverage = getRentWithCoverage(appliedVoucherInfo, reservationInfo, guestCoveragePackage);
  const deliveryFee = getDeliveryFee(deliveryDetails);
  const subTotal = calculateWithPrecision('add', [rentWithCoverage, gstAmount, deliveryFee]);
  const finalPayable = isCreditValid ? calculateWithPrecision('subtract', [subTotal, deductedCreditAmount]) : subTotal;

  return finalPayable;
};

export const getCreateReservationPaymentMethod = (
  payable: number,
  appliedVoucherInfo: TAppliedVoucherInfo | null,
  appliedCreditInfo: TAppliedCreditInfo | null,
  isDepositApplicable: boolean
): TPaymentMethods => {
  let finalPaymentMethod: TPaymentMethods = 'onlyCard';
  const { isVoucherValid = false, discountAmount = 0, voucherCode, voucherId } = appliedVoucherInfo ?? {};
  const { isCreditValid = false, deductedCreditAmount = 0 } = appliedCreditInfo ?? {};

  if (isVoucherValid && discountAmount > 0 && payable === 0) {
    finalPaymentMethod = isDepositApplicable ? 'onlyVoucherWithHold' : 'onlyVoucher';
  } else if (isCreditValid && deductedCreditAmount > 0 && payable === 0) {
    finalPaymentMethod = isDepositApplicable ? 'onlyCreditWithHold' : 'onlyCredit';
  } else if (isVoucherValid && discountAmount > 0 && payable > 0) {
    finalPaymentMethod = 'cardWithVoucher';
  } else if (isCreditValid && deductedCreditAmount > 0 && payable > 0) {
    finalPaymentMethod = 'cardWithCredit';
  } else {
    finalPaymentMethod = 'onlyCard';
  }
  return finalPaymentMethod;
};

export const getCreateReservationTotalPriceTotalPrice = (payable: number, voucherDiscountAmount: number, deductedCreditAmount: number) => {
  return calculateWithPrecision('add', [payable, voucherDiscountAmount || deductedCreditAmount || 0]);
};

export const getCreateReservationAdditionalPaymentInfo = (
  payable: number,
  appliedVoucherInfo: TAppliedVoucherInfo | null,
  appliedCreditInfo: TAppliedCreditInfo | null,
  paymentMethod: TPaymentMethods
): TAdditionalPaymentInfo => {
  const additionalPaymentInfo: TAdditionalPaymentInfo = {};
  const { discountAmount = 0, voucherCode, voucherId } = appliedVoucherInfo ?? {};
  const { deductedCreditAmount = 0 } = appliedCreditInfo ?? {};

  switch (paymentMethod) {
    case 'onlyVoucher':
    case 'onlyVoucherWithHold': {
      additionalPaymentInfo.voucherAmountUsed = discountAmount;
      additionalPaymentInfo.voucherCode = voucherCode;
      additionalPaymentInfo.voucherId = voucherId;
      break;
    }

    case 'onlyCredit':
    case 'onlyCreditWithHold': {
      additionalPaymentInfo.creditAmountUsed = deductedCreditAmount;
      break;
    }

    case 'cardWithCredit': {
      additionalPaymentInfo.creditAmountUsed = deductedCreditAmount;
      additionalPaymentInfo.cardAmountUsed = payable;
      break;
    }

    case 'cardWithVoucher': {
      additionalPaymentInfo.voucherAmountUsed = discountAmount;
      additionalPaymentInfo.voucherCode = voucherCode;
      additionalPaymentInfo.voucherId = voucherId;
      additionalPaymentInfo.cardAmountUsed = payable;
      break;
    }

    case 'noPayment': {
      // No additional payment information needed
      break;
    }

    default: {
      additionalPaymentInfo.cardAmountUsed = payable;
      break;
    }
  }

  return additionalPaymentInfo;
};

type TBuildCreateReservationPayloadParams = {
  reservationInfo: TReservationInfo;
  userProfileInfo: UserProfileInfo;
  reservationDepositAmount: number;
  guestCoveragePackage: TGuestInsurance;
  customizedHoldAmount: CustomizeCoverage;
  carData: CarDataState;
  userId: string;
  gstAmount: number;
  deliveryDetails: TDeliveryDetails;
  payable: number;
  paymentMethod: TPaymentMethods;
  additionalDrivers: TAdditionalDriverInfo[];
  appliedVoucherInfo: TAppliedVoucherInfo | null;
  appliedCreditInfo: TAppliedCreditInfo | null;
  totalPrice: number;
  isDepositCoveredByCredit?: boolean;
  holdCreditAmount?: number;
};

export const buildCreateReservationPayload = async ({
  reservationInfo,
  userProfileInfo,
  reservationDepositAmount,
  guestCoveragePackage,
  customizedHoldAmount,
  carData,
  userId,
  gstAmount,
  deliveryDetails,
  payable,
  paymentMethod,
  additionalDrivers,
  appliedVoucherInfo,
  appliedCreditInfo,
  totalPrice,
  isDepositCoveredByCredit,
  holdCreditAmount = 0,
}: TBuildCreateReservationPayloadParams): Promise<SaveNewReservationParams> => {
  const { listingId, hostId, rates, distance, location } = carData ?? {};
  const { isVoucherValid = false, discountAmount = 0 } = appliedVoucherInfo ?? {};
  const pickupDate = dayjs(reservationInfo?.pickupTime);
  const returnDate = dayjs(reservationInfo?.returnTime);

  // Calculate the time difference between pickup & return in hours, days

  // const timeDiffMins = returnDate.diff(pickupDate, 'minute');
  // const remainingMinutes = timeDiffMins % 60;
  // const timeDiffHours = returnDate.diff(pickupDate, 'hour');
  // const totalDurationHours = timeDiffHours + (remainingMinutes > 0 ? 1 : 0);
  // const totalDays = Math.ceil(totalDurationHours / 24);

  const totalDuration = dayjs.duration(returnDate.second(0).millisecond(0).diff(pickupDate.second(0).millisecond(0)));
  // Convert the duration to milliseconds
  const totalMilliseconds = totalDuration.asMilliseconds();
  // Convert milliseconds to days, hours, and minutes
  const timeDiffDays = Math.floor(totalMilliseconds / (24 * 60 * 60 * 1000)); // Days
  const remainingMillisAfterDays = totalMilliseconds % (24 * 60 * 60 * 1000); // Remaining milliseconds after days
  const remainingHours = Math.floor(remainingMillisAfterDays / (60 * 60 * 1000)); // Hours
  const remainingMillisAfterHours = remainingMillisAfterDays % (60 * 60 * 1000); // Remaining milliseconds after hours
  const remainingMinutes = Math.floor(remainingMillisAfterHours / (60 * 1000)); // Minutes
  // Total hours including rounding if there are leftover minutes
  const totalDurationHours = timeDiffDays * 24 + remainingHours + (remainingMinutes > 0 ? 1 : 0);
  // Total full days (rounded up if any remaining hours or minutes)
  const totalDays = Math.ceil(totalDurationHours / 24);

  // const shortAddress = `${carData?.location?.pickupAddress?.city}, ${carData?.location?.pickupAddress?.state}, ${carData?.location?.pickupAddress?.country}`;
  const customCoverageId =
    userProfileInfo?.isDepositApplicable &&
    !userProfileInfo?.isDepositWaived &&
    reservationDepositAmount !== guestCoveragePackage?.excessFee &&
    !!customizedHoldAmount?.customizedCoverageId
      ? customizedHoldAmount?.customizedCoverageId
      : undefined;

  const carInitialLocation = getCarPickupLocation(location?.pickupAddress, location?.pickupHistory);
  // const carInitialLocation = {
  //   coordinates: carData?.location?.pickupAddress?.coordinates,
  //   shortAddress: shortAddress,
  //   streetAddress: carData?.location?.pickupAddress?.street,
  // };
  const totalDeliveryFee = getDeliveryFee(deliveryDetails);
  const additionalPaymentInfo = getCreateReservationAdditionalPaymentInfo(payable, appliedVoucherInfo, appliedCreditInfo, paymentMethod);
  const reservationData: SaveNewReservationParams = {
    guestId: userId,
    hostId: hostId,
    carListingId: listingId,
    startDate: reservationInfo?.pickupTime as string,
    endDate: reservationInfo?.returnTime as string,
    totalDurationHours,
    basePrice: {
      dailyPrice: rates?.dailyRates?.amount,
      hourlyPrice: rates?.hourlyRates?.amount,
      durationPrice: reservationInfo?.durationPrice as number,
      totalPrice: calculateWithPrecision('subtract', [totalPrice, totalDeliveryFee]), // total amount without voucher discount & vehicle delivery
      // totalPrice: parseFloat((totalPrice + gstData?.gstAmount)?.toFixed(2)), // total amount without voucher discount
      // totalPrice: reservationInfo?.totalPrice,
      customPrices: (reservationInfo?.reservationCustomPrice as CustomPricing[]) ?? [],
      // customPrices: carData?.rates?.customPricing,
      currency: rates?.dailyRates?.currency,
      // serviceFeeAmount: reservationInfo?.serviceFeeAmount,
      serviceFeeAmount: 0,
      coverageAmount: parseFloat(guestCoveragePackage?.coverageAmount?.toFixed(2)), // 0 when no-coverage,
      gstAmount,
      customizedCoverageId: customCoverageId, //hold amount add
      //Vehicle delivery
      ...(deliveryDetails?.isDeliveryEnabled && { totalDeliveryFee: Number(deliveryDetails?.totalDeliveryFee ?? 0) }),
      ...(deliveryDetails?.isReturnEnabled && { totalReturnFee: Number(deliveryDetails?.totalReturnFee ?? 0) }),
      // deliveryFeeDiscount: 0
      // returnFeeDiscount: 0
    },
    depositAmount: reservationDepositAmount,
    // serviceFeePercentage: 10, //comment out for car rental
    serviceFeePercentage: 0,
    insurance: {
      guestCoverageType: guestCoveragePackage?.guestCoverageType, //'economy' | 'standard' | 'premium' | 'ultimate' | 'no-coverage';
      coveragePercentage: Number(guestCoveragePackage?.coveragePercentage), // 0 when no-coverage,
      excessFee: Number(guestCoveragePackage?.excessFee), // 0 when no-coverage
    },
    pickupLocation: carInitialLocation,
    dropOffLocation: reservationInfo?.dropOffLocation ?? carInitialLocation,
    paymentMethod: paymentMethod,
    additionalPaymentInfo,
    isDeliveryEnabled: deliveryDetails?.isDeliveryEnabled ?? false,
    isReturnEnabled: deliveryDetails?.isReturnEnabled ?? false,
    ...(deliveryDetails?.isDeliveryEnabled && { deliveryVehicle: deliveryDetails?.deliveryVehicle }),
    ...(isDepositCoveredByCredit && holdCreditAmount > 0 && { holdDepositCredit: holdCreditAmount }),
  };

  // reservationDataEnd

  // Check if unlimitedTravel is false before adding fields
  if (!distance?.unlimitedTravel) {
    reservationData.totalDistanceKm = totalDays * distance?.maximumDailyDistance;
    reservationData.dailyDistanceKm = distance?.maximumDailyDistance;
  }

  if (distance?.additionalFeePerKilometer) {
    reservationData.additionalDistanceFeePerKm = distance?.additionalFeePerKilometer;
  }

  const isOtherDiscountsApplicable =
    !isVoucherValid && (reservationInfo?.discounts?.longBookingDiscounts || reservationInfo?.discounts?.advanceBookingDiscounts);

  // Add other discounts only if voucher is not applied
  if (isOtherDiscountsApplicable) {
    reservationData.discounts = reservationInfo?.discounts;
  }

  if (reservationInfo?.incPrice) {
    reservationData.peakIncrease = reservationInfo?.incPrice;
  }

  if (additionalDrivers?.length > 0) {
    reservationData.additionalDrivers = additionalDrivers;
  }

  return reservationData;
};
