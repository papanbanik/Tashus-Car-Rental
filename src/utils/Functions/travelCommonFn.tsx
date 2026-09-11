import { TPeakIncreasePrice } from '@/context/SearchProvider';
import { TDate, TReservationStatus } from '@/types/commonTypes';
import { EPaymentMethod } from '@/types/travels/travelEnums';
import { TSingleTravel, TUpdatedTravelData } from '@/types/travels/typeEditTravels';
import { TAgreementReservationData, TBasePrice, TOppositeUserInfo, TRevisedReservation } from '@/types/travels/typeTravels';
import { TPeakIncreasedDates } from '@/types/user-profile/customPriceTypes';
import { ERefundPaymentMethod } from '@/types/user-profile/transactionsTypes';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import { getDurationDayHourMin } from './dateTimeCommonFn';
import { parseFloatWithPrecision } from './lodashHelperFn';
import { dayjsUtc, getPickerTimeStringInUtc } from './utcCommonFn';
dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
export const paymentAllowedMinutes = 30;

// Returns list of past travel
export const getPastTravels = (travelList: any[]) => {
  return travelList.filter(
    (travelData: any) =>
      travelData?.isEndedByPartner ||
      travelData?.isEndedByGuest ||
      travelData?.tripInformation?.tripEndingInfo?.isEndedByAdmin ||
      travelData?.reservationStatus === 'cancelledByGuest' ||
      travelData?.reservationStatus === 'cancelledByHost' ||
      travelData?.reservationStatus === 'cancelled'
  );
};

// Returns list of current travel
export const getCurrentTravels = (travelList: any[], isUserGuest?: boolean) => {
  return travelList.filter((travelData: any) => {
    const lastRevision = getValidRevisedTravel(isUserGuest ?? false, travelData?.revisedReservations);
    const pickupDate = lastRevision?.newStartDate ?? travelData?.startDate;
    // const pickupDate = travelData?.revisedReservations?.slice(-1)?.[0]?.newStartDate || travelData?.startDate;
    const utcCurrentTime = getPickerTimeStringInUtc(dayjs());
    const diffMin = dayjsUtc(pickupDate).diff(utcCurrentTime?.formattedTimeDayObj, 'minute');
    const endedTravel = travelData?.isEndedByPartner || travelData?.isEndedByGuest || travelData?.tripInformation?.tripEndingInfo?.isEndedByAdmin;
    return (
      !endedTravel &&
      travelData?.reservationStatus !== 'cancelledByGuest' &&
      travelData?.reservationStatus !== 'cancelledByHost' &&
      travelData?.reservationStatus !== 'cancelled' &&
      diffMin <= 120
    );
    // const subtractTwoHoursFromStartDate = dayjs(travelData.startDate).subtract(2, 'hour');
    // return !travelData.isEndedByGuest && (subtractTwoHoursFromStartDate.isBefore(dayjs()) || subtractTwoHoursFromStartDate.isSame(dayjs()));
  });
};

// Returns list of upcoming travel
export const getUpcomingTravels = (travelList: any[]) => {
  return travelList.filter((travelData: any) => !getPastTravels([travelData]).length && !getCurrentTravels([travelData]).length);
  // return travelList.filter((travelData: any) => !travelData.isEndedByGuest && !getCurrentTravels([travelData]).length);
};

export const isTravelCurrent = (pickupDate: string | Date | Dayjs, isEndedByGuest: boolean, reservationStatus: string) => {
  const utcCurrentTime = getPickerTimeStringInUtc(dayjs());
  const diffMin = dayjsUtc(pickupDate).diff(utcCurrentTime?.formattedTimeDayObj, 'minute');

  return (
    !isEndedByGuest &&
    diffMin <= 120 &&
    reservationStatus !== 'cancelledByGuest' &&
    reservationStatus !== 'cancelledByHost' &&
    reservationStatus !== 'cancelled'
  );
};

// Returns updated travel schedule, price if travel is revised, else returns 1st created reservation data
export const getUpdatedTravelData = (travelDetails: any, userId: string): TUpdatedTravelData => {
  const coveragePercentage = travelDetails?.reservationInfo?.vehicleInsurance?.coveragePercentage || 75;
  const {
    reservationInfo,
    reservedAt,
    paymentStatus,
    startDate,
    endDate,
    reservationId,
    isEndedByGuest,
    guestId,
    guestInfo,
    partnerInfo,
    reservationStatus,
    holdPaymentTransaction,
  } = travelDetails;
  const isUserGuest: boolean = userId === guestId ? true : false;

  let lastRevision = getValidRevisedTravel(isUserGuest, reservationInfo?.revisedReservations);

  const addDistance = lastRevision?.newStartDate ? lastRevision?.additionalDistanceFeePerKm : reservationInfo?.additionalDistanceFeePerKm;
  const addDiscounts = lastRevision?.newStartDate ? lastRevision?.discounts : reservationInfo?.discounts;
  const addPeakIncrease = lastRevision?.newStartDate ? lastRevision?.peakIncrease : reservationInfo?.peakIncrease;
  const additionalPaymentInfo = lastRevision?.newStartDate ? lastRevision?.additionalPaymentInfo : reservationInfo?.additionalPaymentInfo; //last additional fee
  const lastBasePrice = lastRevision?.newStartDate ? lastRevision?.basePrice : reservationInfo?.basePrice;
  const revisedId = lastRevision?.newStartDate ? lastRevision?._id : undefined;
  const updatedPaymentMethod = lastRevision?.paymentMethod ? lastRevision?.paymentMethod : reservationInfo?.paymentMethod;

  const checkIsTravelCurrent = isTravelCurrent(lastRevision?.newStartDate || startDate, isEndedByGuest, reservationStatus);
  // const checkIsTravelCurrent = isTravelCurrent(lastRevision?.newStartDate || startDate, isEndedByGuest);
  let travelType = checkIsTravelCurrent ? 'current' : isEndedByGuest ? 'past' : 'upcoming';

  const oppositeUserInfo: TOppositeUserInfo = isUserGuest ? partnerInfo : guestInfo;
  const finalDeliveryCost = (reservationInfo?.basePrice?.totalDeliveryFee ?? 0) - (reservationInfo?.basePrice?.deliveryFeeDiscount ?? 0);
  const finalReturnCost = (reservationInfo?.basePrice?.totalReturnFee ?? 0) - (reservationInfo?.basePrice?.returnFeeDiscount ?? 0);

  //For Updated Vehicle
  const lastRevisedVehicle = reservationInfo?.revisedVehicles?.length > 0 ? reservationInfo?.revisedVehicles?.slice(-1)?.[0] : null;
  const vehicleCreditedAmount = lastRevisedVehicle?.creditedAmount ?? 0;
  const vehiclePayableAmount = lastRevisedVehicle?.payableAmount ?? 0;
  const vehicleDiscountAmount = lastRevisedVehicle?.discountAmount ?? 0;
  const lastVehicleStatus = lastRevisedVehicle?.paymentStatus;
  //For Updated Coverage
  const lastRevisedCoverage = reservationInfo?.revisedCoverages?.length > 0 ? reservationInfo?.revisedCoverages?.slice(-1)?.[0] : null;
  const coverageDueAmount = lastRevisedCoverage?.dueAmount ?? 0;
  const coverageCreditedAmount = lastRevisedCoverage?.creditedAmount ?? 0;
  const lastCoverageStatus = lastRevisedCoverage?.paymentStatus;

  const updatedTravelData: TUpdatedTravelData = {
    pickupDate: lastRevision?.newStartDate || startDate,
    returnDate: lastRevision?.newEndDate || endDate,
    basePrice: lastBasePrice,
    hostRentalFees: lastBasePrice?.hostIncome ?? getHostRentalFees(lastBasePrice, coveragePercentage, reservationInfo?.depositAmount ?? 0),
    serviceFeePercentage: lastRevision?.serviceFeePercentage || reservationInfo?.serviceFeePercentage,
    paymentStatus: lastRevision?.paymentStatus || paymentStatus,
    totalDurationHours: lastRevision?.totalDurationHours || reservationInfo?.totalDurationHours,
    travelType,
    isUserGuest,
    oppositeUserInfo,
    totalDurationText: lastRevision?.newStartDate
      ? getDurationDayHourMin(lastRevision?.newStartDate, lastRevision?.newEndDate)
      : getDurationDayHourMin(startDate, endDate),
    reservationId: reservationId,
    createdAt: lastRevision?.createdAt || reservedAt,
    reservedAt,
    depositAmount: reservationInfo?.depositAmount ?? 0,
    ...(addDistance && { additionalDistanceFeePerKm: addDistance }),
    ...(addDiscounts && { discounts: addDiscounts }),
    ...(addPeakIncrease && { peakIncrease: addPeakIncrease }),
    ...(additionalPaymentInfo && { additionalPaymentInfo: additionalPaymentInfo }),
    reservationStatus,
    totalPaidAmount: reservationInfo?.totalPaidAmount,
    totalReturnedAmount: reservationInfo?.totalReturnedAmount,
    reservationAdditionalFees: reservationInfo?.reservationAdditionalFees ?? [],
    cancellationInfo: reservationInfo?.cancellationInfo,
    revisedId,
    // ...(addDistance && { additionalDistanceFeePerKm: lastRevision?.additionalDistanceFeePerKm || reservationInfo?.additionalDistanceFeePerKm }),
    // ...(addDiscounts && { discounts: lastRevision?.discounts || reservationInfo?.discounts }),
    // ...(addPeakIncrease && { peakIncrease: lastRevision?.peakIncrease || reservationInfo?.peakIncrease }),
    // ...(additionalPaymentInfo && { additionalPaymentInfo: additionalPaymentInfo }),
    vehicleDeliveryFee: finalDeliveryCost ?? 0,
    vehicleReturnFee: finalReturnCost ?? 0,
    revisedCoveragePayableAmount: coverageDueAmount,
    revisedCoverageCreditedAmount: coverageCreditedAmount,
    revisedVehicleCreditedAmount: vehicleCreditedAmount,
    revisedVehiclePayableAmount: vehiclePayableAmount,
    revisedVehicleDiscountAmount: vehicleDiscountAmount,
    revisedVehiclePaymentStatus: lastVehicleStatus,
    revisedCoveragePaymentStatus: lastCoverageStatus,
    paymentMethod: updatedPaymentMethod,
    ...(holdPaymentTransaction && { holdPaymentTransaction }),
  };

  return updatedTravelData;
};

export const getUpdatedTravelList = async (travelList: any[], isUserGuest: boolean): Promise<TSingleTravel[]> => {
  const updatedTravelList: TSingleTravel[] = travelList?.map((travel) => {
    const coveragePercentage = travel?.vehicleInsurance?.coveragePercentage || 75;
    const {
      startDate,
      endDate,
      reservationId,
      coverPhoto,
      paymentStatus,
      carInfo,
      basePrice,
      pickupAddress,
      distance,
      rates,
      reservationStatus,
      isEndedByGuest,
      isEndedByPartner,
      reservedAt,
      guestId,
      revisedReservations,
    } = travel;

    let lastRevision = getValidRevisedTravel(isUserGuest, revisedReservations);

    // let lastRevision: any = travel?.revisedReservations?.slice(-1)?.[0];
    // let isEditPaymentExpired: boolean = false;

    // if (lastRevision?.paymentStatus === 'pending') {
    //   isEditPaymentExpired = getIsEditPaymentExpired(lastRevision?.createdAt);
    // }

    // // if last revision payment is expired, take the last not pending revision
    // if (isEditPaymentExpired || !isUserGuest) {
    //   lastRevision = travel?.revisedReservations?.filter((revised: any) => revised?.paymentStatus !== 'pending').slice(-1)?.[0];
    // }

    const lastPaymentStatus = lastRevision?.newStartDate ? lastRevision?.paymentStatus : paymentStatus;
    const hasDistance = distance?.maximumDailyDistance;
    const isPaymentExpired: boolean = isOverallPaymentExpired(reservationStatus, lastRevision?.createdAt);

    const lastBasePrice = lastRevision?.newStartDate ? lastRevision?.basePrice : basePrice;

    const updatedTravelData: TSingleTravel = {
      pickupDate: lastRevision?.newStartDate || startDate,
      returnDate: lastRevision?.newEndDate || endDate,
      totalPrice: lastRevision?.basePrice?.totalPrice || basePrice?.totalPrice,
      hostRentalFees: lastBasePrice?.hostIncome ?? getHostRentalFees(lastBasePrice, coveragePercentage, 0),
      coverPhoto: coverPhoto?.secureUrl,
      paymentStatus: lastPaymentStatus,
      reservationStatus,
      reservationId,
      guestId,
      ...(hasDistance && { maximumDailyDistance: distance?.maximumDailyDistance }),
      vehicleModel: carInfo?.model,
      pickupLocation: `${pickupAddress?.city}, ${pickupAddress?.state}`,
      hourlyPrice: lastRevision?.basePrice?.hourlyPrice || rates?.hourlyRates?.amount,
      dailyPrice: lastRevision?.basePrice?.dailyPrice || rates?.dailyRates?.amount,
      isPaymentExpired,
      carNickName: carInfo?.carNickName || '',
      // isEndedByGuest,
      // isEndedByPartner,
    };

    return updatedTravelData;
  });

  return updatedTravelList;
};

// Return if its late pickup or not
export const isLatePickup = (currentTime: string | Date | Dayjs, pickupTime: string | Date | Dayjs): boolean => {
  const utcCurrentTime = getPickerTimeStringInUtc(currentTime);
  const latePickup: boolean = dayjsUtc(pickupTime).isBefore(utcCurrentTime?.formattedTimeDayObj);
  return latePickup;
};

export const getHostRentalFees = async (basePrice: TBasePrice, rentalPercentage: number, depositAmount: number) => {
  const reservationExtraAmounts =
    parseFloat(basePrice?.serviceFeeAmount?.toFixed(2)) +
    parseFloat((basePrice?.gstAmount || 0)?.toFixed(2)) +
    parseFloat((basePrice?.coverageAmount || 0)?.toFixed(2)) +
    parseFloat(depositAmount?.toFixed(2));

  const reservationTotal = parseFloat(basePrice?.totalPrice?.toFixed(2)) - reservationExtraAmounts;
  const coveragePercentage = rentalPercentage || 75;
  const hostPercentage = reservationTotal * (coveragePercentage / 100);

  return parseFloat(hostPercentage?.toFixed(2));
};

// Function to check if revised Travel
export const getPickupStartDate = (travelDetails: any) => {
  if (travelDetails?.revisedReservation?.length > 0) {
    const latestReservation = travelDetails?.revisedReservation[travelDetails?.revisedReservation?.length - 1];
    return latestReservation?.newStartDate;
  } else {
    return travelDetails?.startDate;
  }
};
export const isBeforePickupTime = (travelDetails: any) => {
  const pickupTime = getPickupStartDate(travelDetails);
  return (
    (isWithinTimeRange(pickupTime) && isReservationActive(travelDetails?.reservationStatus)) ||
    (travelDetails?.isTripStarted && !travelDetails?.isEndedByGuest)
  );
};

export const isAfterPickupTime = (travelDetails: any) => {
  const pickupTime = getPickupStartDate(travelDetails);
  return dayjs().isAfter(pickupTime);
};
// Function to check if it's 15 minutes before the given time
// export const isBeforeTime = (time: any) => {
//   const fifteenMinutesBeforeTime = dayjs(time).subtract(15, 'minutes');
//   const currentTime = dayjs();
//   return currentTime.isBefore(fifteenMinutesBeforeTime);
// };
export const showTime = 15;
export const isWithinTimeRange = (time: any) => {
  dayjs.extend(isBetween);
  const providedDateTime = dayjs(time);
  const startRange = providedDateTime.subtract(showTime, 'minutes');
  const endRange = providedDateTime;
  const currentDateTime = dayjs();
  return currentDateTime.isBetween(startRange, endRange, 'minute', '[]');
};

// Function to check if it's active reservation
export const isReservationActive = (status: any) => {
  return status !== 'cancelledByGuest' || status !== 'cancelledByHost' || status !== 'cancelled';
};

export const getGuestCoverageDisplayName = (coverageType: string) => {
  switch (coverageType) {
    case 'ultimate':
      return 'Ultimate Adventure';
    case 'premium':
      return 'Premium Cruiser';
    case 'standard':
      return 'Standard Voyager';
    case 'economy':
      return 'Economy Explorer';
    case 'no-coverage':
      return 'No Coverage';
    default:
      return 'No Coverage';
  }
};

export const getPartnerCoverageDisplayName = (coverageType: string) => {
  switch (coverageType) {
    case 'premium':
      return 'Premium Assurance';
    case 'standard':
      return 'Standard Shield';
    case 'enhanced':
      return 'Standard Coverage';
    case 'basic':
      return 'Basic Guard';
    default:
      return 'Premium Assurance';
  }
};

export const shouldShowAddress = (pickupDate: TDate) => {
  const utcCurrentTime = getPickerTimeStringInUtc(dayjs());
  const minsDiff = dayjsUtc(pickupDate).diff(utcCurrentTime?.formattedTimeDayObj, 'minute');

  return minsDiff <= 15;
};

export const getIsEditPaymentExpired = (createdAt: TDate) => {
  const isExpired = dayjs().diff(dayjs(createdAt), 'minute') > 30;
  return isExpired;
};

export const getLastPaidRevisedReservation = (revisedReservationList: TRevisedReservation[]): TRevisedReservation => {
  const lastPendingRevisedReservation = revisedReservationList?.filter((revised) => revised?.paymentStatus !== 'pending').slice(-1)?.[0] ?? [];
  return lastPendingRevisedReservation;
};

export const getAgreementReservationData = (reservationDetails: any): TAgreementReservationData => {
  const { reservation, basePrice, depositAmount, vehicle } = reservationDetails;
  let lastRevision = reservation?.revisedReservationResponses?.slice(-1)?.[0];
  let isEditPaymentExpired: boolean = false;
  if (lastRevision?.paymentStatus === 'pending') {
    isEditPaymentExpired = getIsEditPaymentExpired(lastRevision?.createdAt);
  }
  if (isEditPaymentExpired) {
    lastRevision = getLastPaidRevisedReservation(reservation?.revisedReservationResponses ?? []);
  }
  const addDistance = reservation?.maxDistance;
  const addFee = lastRevision?.newStartDate ? lastRevision?.additionalDistanceFeePerKm : reservation?.additionalFee;
  const lastBasePrice = lastRevision?.newStartDate ? lastRevision?.basePrice : basePrice;

  const updatedTravelData: TAgreementReservationData = {
    pickupDate: lastRevision?.newStartDate || reservation?.startTime,
    returnDate: lastRevision?.newEndDate || reservation?.endTime,
    totalDurationHours: lastRevision?.totalDurationHours || reservation?.rentalPeriod,
    basePrice: lastBasePrice,
    dailyDistanceKm: reservation?.dailyDistanceKm,
    totalAllowedKM: addDistance,
    additionalFee: addFee,
    depositAmount: depositAmount ?? 0,
    perKmCost: vehicle?.fuelEconomyInfo?.fuelCost ?? 0,
  };

  return updatedTravelData;
};

export const getMaxDistance = (totalDurationHours: number, dailyDistanceKm: number): number => {
  const totalDays = Math.ceil(totalDurationHours / 24);
  return dailyDistanceKm > 0 ? totalDays * dailyDistanceKm : 0;
};

const getValidRevisedTravel = (isUserGuest: boolean, revisedReservations: TRevisedReservation[]) => {
  if (revisedReservations?.length === 0) {
    return undefined;
  }

  let lastRevision: TRevisedReservation = revisedReservations?.slice(-1)?.[0];
  let isEditPaymentExpired: boolean = false;

  if (lastRevision?.paymentStatus === 'pending' && lastRevision?.createdAt) {
    isEditPaymentExpired = getIsEditPaymentExpired(lastRevision?.createdAt);
  }

  // if last revision payment is expired, take the last not pending revision
  if (isEditPaymentExpired || !isUserGuest) {
    lastRevision = revisedReservations?.filter((revised: any) => revised?.paymentStatus !== 'pending').slice(-1)?.[0];
  }

  return lastRevision;
};

const isOverallPaymentExpired = (reservationStatus: TReservationStatus, createdAt?: TDate): boolean => {
  const isEditPaymentExpired = createdAt ? getIsEditPaymentExpired(createdAt) : false;
  const isExpired = isEditPaymentExpired && reservationStatus !== 'confirmed' && reservationStatus !== 'completed';

  return isExpired;
};
export const getRefundPaymentMethod = (paymentMethod: string) => {
  switch (paymentMethod) {
    case ERefundPaymentMethod.Card:
      return 'Card';
    case ERefundPaymentMethod.Bank:
      return 'Bank';
    case ERefundPaymentMethod.Cash:
      return 'Cash';
    case ERefundPaymentMethod.Other:
      return 'Other';
    default:
      return 'Card';
  }
};
export const getPaymentMethod = (paymentMethod: string) => {
  switch (paymentMethod) {
    case EPaymentMethod.OnlyCard:
      return 'Card';
    case EPaymentMethod.OnlyCredit:
      return 'Credit';
    case EPaymentMethod.OnlyVoucher:
      return 'Voucher';
    case EPaymentMethod.OnlyCreditWithHold:
      return 'Credit & Hold';
    case EPaymentMethod.OnlyVoucherWithHold:
      return 'Voucher & Hold';
    case EPaymentMethod.CardWithCredit:
      return 'Card + Credit';
    case EPaymentMethod.CardWithVoucher:
      return 'Card + Voucher';
    case EPaymentMethod.NoPayment:
      return 'No Payment';
    case EPaymentMethod.IssuedCredit:
      return 'Issued Credit';
    case EPaymentMethod.CashPayment:
      return 'Cash Payment';
    case EPaymentMethod.BankTransfer:
      return 'Bank Transferred';
    case EPaymentMethod.CreditApplied:
      return 'Credit Applied';
    case EPaymentMethod.ChargeWithSavedCard:
      return 'Charged Via Card';
    case EPaymentMethod.ManualStripeCharge:
      return 'Charged Via Stripe';
    case EPaymentMethod.OtherPayment:
      return 'Other Payment';
    case EPaymentMethod.HoldDeposit:
      return 'Charged from Hold Deposit';
    default:
      return 'No Transaction';
  }
};

type RequestParams = {
  initialPickupDate: TDate;
  initialReturnDate: TDate;
  initialDailyPrice: number;
  initialHourlyPrice: number;
  initialPeakIncrease?: TPeakIncreasePrice;
  revisedReservations?: TRevisedReservation[];
};

type TMinimalBasePrice = Pick<TBasePrice, 'dailyPrice' | 'hourlyPrice'>;

export const generatePeakIncreasedDates = ({
  initialPickupDate,
  initialReturnDate,
  initialDailyPrice,
  initialHourlyPrice,
  initialPeakIncrease,
  revisedReservations = [],
}: RequestParams): TPeakIncreasedDates[] => {
  const usedDates = new Set<string>();
  const result: TPeakIncreasedDates[] = [];

  const applyPeakIncrease = (base: TMinimalBasePrice, peak?: TPeakIncreasePrice, date?: dayjs.Dayjs): { dailyPrice: number; hourlyPrice: number } => {
    if (!peak || !date) {
      return { dailyPrice: base.dailyPrice, hourlyPrice: base.hourlyPrice };
    }
    const dayOfWeek = date.utc().format('ddd').toLowerCase();
    const shouldApply = !peak.increaseDays || peak.increaseDays.map((d) => d.toLowerCase()).includes(dayOfWeek);
    if (!shouldApply || peak.increaseAmount === undefined || !peak.increaseType) {
      return { dailyPrice: base.dailyPrice, hourlyPrice: base.hourlyPrice };
    }

    if (peak.increaseType === 'percentage') {
      return {
        dailyPrice: parseFloatWithPrecision(base.dailyPrice * (1 + peak.increaseAmount / 100)),
        hourlyPrice: parseFloatWithPrecision(base.hourlyPrice * (1 + peak.increaseAmount / 100)),
      };
    } else {
      return {
        dailyPrice: parseFloatWithPrecision(base.dailyPrice + peak.increaseAmount),
        hourlyPrice: parseFloatWithPrecision(base.hourlyPrice + peak.increaseAmount),
      };
    }
  };

  // 1. Initial reservation range
  let currentDate = dayjs(initialPickupDate);
  const initialEnd = dayjs(initialReturnDate);

  while (currentDate.isSameOrBefore(initialEnd, 'day')) {
    const formatted = currentDate.format('YYYY-MM-DD');
    usedDates.add(formatted);

    const { dailyPrice, hourlyPrice } = applyPeakIncrease(
      {
        dailyPrice: initialDailyPrice,
        hourlyPrice: initialHourlyPrice,
      },
      initialPeakIncrease,
      currentDate
    );

    result.push({
      reservationDate: currentDate.toDate(),
      dailyPrice,
      hourlyPrice,
    });

    currentDate = currentDate.add(1, 'day');
  }

  // 2. Revised reservations (non-pending)
  revisedReservations
    .filter((res) => res.paymentStatus !== 'pending')
    .forEach((res) => {
      let curDate = dayjs(res.newStartDate);
      const end = dayjs(res.newEndDate);

      while (curDate.isSameOrBefore(end, 'day')) {
        const formatted = curDate.format('YYYY-MM-DD');
        if (!usedDates.has(formatted)) {
          usedDates.add(formatted);

          const { dailyPrice, hourlyPrice } = applyPeakIncrease(res.basePrice, res.peakIncrease, curDate);

          result.push({
            reservationDate: curDate.toDate(),
            dailyPrice,
            hourlyPrice,
          });
        }

        curDate = curDate.add(1, 'day');
      }
    });

  return result;
};
