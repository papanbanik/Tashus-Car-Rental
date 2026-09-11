import { CarDataPeakIncrease } from '@/types/car-listing/carPricingTypes';
import { EPriceAdjustment, TDate } from '@/types/commonTypes';
import { TBillingDetails, TUpdatedTravelData } from '@/types/travels/typeEditTravels';
import { TAdditionalPaymentInfo, TBasePrice, TPriceAdjustment } from '@/types/travels/typeTravels';
import { CustomPricing, PeakIncreaseType, TParamsGetRefundOrPenalty } from '@/types/user-profile/customPriceTypes';
import dayjs from 'dayjs';
import { getDurationHours } from '../dateTimeCommonFn';
import { calculateWithPrecision, parseFloatWithPrecision } from '../lodashHelperFn';
import { getPickerTimeStringInUtc, utcCurrentTime } from '../utcCommonFn';
import { getReservationPriceList } from '../vehiclePriceUpdateFn';
import { applyPriceAdjustment, updatePayableAmount } from './travelEditFn';

//Current Travel
export interface HandleCurrentTravelUpdateParams {
  currentPickupTime: TDate;
  returnTime: TDate;
  currentReturnTime: TDate;
  basePrice: TBasePrice;
  travelBasePrice: TBasePrice;
  vehicleDeliveryFee?: number;
  vehicleReturnFee?: number;
  totalPaidAmount?: number;
  totalReturnedAmount?: number;
  updatedBillingDetails: TBillingDetails;
  additionalPaymentInfo?: TAdditionalPaymentInfo;
  tempGstAmount: number;
  paidAmount: number;
  peakIncrease: CarDataPeakIncrease[];
  updatedTravelData: TUpdatedTravelData;
  isDurationReduced?: boolean;
  previousPenaltyPrice?: number;
  isVoucherValid?: boolean;
}

const calculateMidPenaltyPrice = async (
  currentPickupTime: TDate,
  returnTime: TDate,
  defaultDailyPrice: number,
  defaultHourlyPrice: number,
  customPricing: CustomPricing[],
  peakIncreaseList: CarDataPeakIncrease[]
): Promise<number> => {
  // Current time in UTC
  const { formattedTimeObj: now } = getPickerTimeStringInUtc(dayjs());
  // Helper function to get reservation price list
  const getPriceList = async (start: TDate, end: TDate) => {
    return await getReservationPriceList(start, end, defaultDailyPrice, defaultHourlyPrice, customPricing, peakIncreaseList);
  };
  // Get daily prices for the first two days from current pickup
  const { reservationPriceList } = await getPriceList(currentPickupTime, dayjs(currentPickupTime).add(2, 'day').toDate());
  let day1Price = reservationPriceList[0]?.dailyPrice ?? 0;
  let day2Price = reservationPriceList[1]?.dailyPrice ?? day1Price;
  // Calculate difference in hours between now and the currentReturnTime
  const diffInHours = dayjs(returnTime).diff(dayjs(now), 'hour');
  let penalty = 0;
  if (diffInHours >= 48) {
    // 48 hours or more before new end time
    penalty = 0;
  } else if (diffInHours >= 24 && diffInHours < 48) {
    // Between 24 and 48 hours
    penalty = day1Price;
  } else {
    // Less than 24 hours
    penalty = day1Price + day2Price;
  }

  return penalty;
};

//!Current Travel Penalty Functions
const calculatePenaltyPrice = async (
  currentPickupTime: TDate,
  returnTime: TDate,
  currentReturnTime: TDate,
  defaultDailyPrice: number,
  defaultHourlyPrice: number,
  customPricing: CustomPricing[],
  peakIncreaseList: PeakIncreaseType[]
): Promise<number> => {
  // console.log(newDurationPrice);
  // Calculate the difference in hours between the old and current pickup times
  const oldPickup = dayjs(currentPickupTime);
  const oldReturn = dayjs(currentReturnTime);
  const newReturn = dayjs(returnTime);
  let penalty = 0;
  // Helper function to get the reservation price list for a given time period
  const getPriceList = async (start: TDate, end: TDate) => {
    return await getReservationPriceList(start, end, defaultDailyPrice, defaultHourlyPrice, customPricing, peakIncreaseList);
  };
  const old48Hours = oldPickup.add(48, 'hour');
  const { reservationPriceList: oldReservationPriceList2Day } = await getPriceList(currentPickupTime, old48Hours);
  let oldDay1 = oldReservationPriceList2Day[0]?.dailyPrice;
  let oldDay2 = oldReservationPriceList2Day[1]?.dailyPrice;
  // Check if the duration between currentPickupTime and returnTime is <= 1 day
  const durationInHours = dayjs(returnTime).diff(dayjs(currentPickupTime), 'hour');
  if (durationInHours <= 24) {
    oldDay2 = oldDay1; // Set oldDay2 same as oldDay1 if duration <= 1 day
  }
  // Check if the duration between old and current time is within 24 hours
  if (newReturn.isBefore(oldReturn)) {
    penalty = oldDay1 + oldDay2;
  } else {
    penalty = 0;
  }
  return penalty;
};

const handleEndDateDecrease = async (
  updatedTotalPrice: number,
  dailyPrice: number,
  paidPrice: number,
  updatedBillingDetails: any,
  tempPenaltyPrice?: number,
  depositAmount?: number,
  remainingPaidAmount: number = 0,
  voucherAmountUsed?: number,
  priceAdjustment?: TPriceAdjustment,
  isDurationReduced?: boolean,
  previousPenaltyPrice?: number,
  isVoucherValid?: boolean
) => {
  const penaltyPrice = tempPenaltyPrice ?? 2 * dailyPrice;
  let totalWithPenalty =
    parseFloatWithPrecision(updatedTotalPrice) +
    parseFloatWithPrecision(penaltyPrice) +
    updatedBillingDetails?.newCoverageAmount +
    updatedBillingDetails?.newGstAmount +
    depositAmount +
    previousPenaltyPrice;

  if (priceAdjustment) {
    const { updatedPriceAdjustment } = applyPriceAdjustment(priceAdjustment, totalWithPenalty);
    updatedBillingDetails.priceAdjustment = updatedPriceAdjustment;
    totalWithPenalty = calculateWithPrecision(
      updatedBillingDetails?.priceAdjustment?.adjustmentType === EPriceAdjustment.Decrease ? 'subtract' : 'add',
      [totalWithPenalty, updatedBillingDetails?.priceAdjustment?.amount ?? 0]
    );
  } else {
    totalWithPenalty = totalWithPenalty;
  }

  if (totalWithPenalty < paidPrice) {
    updatedBillingDetails.penaltyPrice = parseFloatWithPrecision(penaltyPrice);
    updatedBillingDetails.inconvenienceToolTip = `Travel duration reduced than previous`;
    updatedBillingDetails.totalWithoutPenalty = parseFloatWithPrecision(updatedTotalPrice);
    updatedBillingDetails.newTotalPrice = parseFloatWithPrecision(totalWithPenalty);
    // Calculate the refundable amount
    const refundableAmount = parseFloatWithPrecision(parseFloatWithPrecision(paidPrice) - parseFloatWithPrecision(totalWithPenalty));
    // Refund based on remainingPaidAmount
    // updatedBillingDetails.refundableAmount =refundableAmount > (remainingPaidAmount ?? 0) ? remainingPaidAmount : refundableAmount > 0 ? refundableAmount : 0;
    if (remainingPaidAmount > refundableAmount) {
      updatedBillingDetails.refundableAmount = parseFloatWithPrecision(refundableAmount);
    } else {
      updatedBillingDetails.refundableAmount = remainingPaidAmount > 0 ? parseFloatWithPrecision(remainingPaidAmount) : 0;
    }
  } else {
    const paidWithVoucher = paidPrice + (voucherAmountUsed ?? 0);
    let waivedPenaltyPrice = 0;
    if (totalWithPenalty > paidWithVoucher) {
      waivedPenaltyPrice = totalWithPenalty - paidWithVoucher; //waived the exceeding price
      const adjustedWaivedPenaltyPrice = Math.min(waivedPenaltyPrice ?? 0, penaltyPrice ?? 0);
      updatedBillingDetails.waivedPenaltyPrice = parseFloatWithPrecision(adjustedWaivedPenaltyPrice);
      updatedBillingDetails.penaltyPrice = parseFloatWithPrecision(parseFloatWithPrecision(penaltyPrice) - (adjustedWaivedPenaltyPrice ?? 0));
    } else {
      updatedBillingDetails.penaltyPrice = parseFloatWithPrecision(penaltyPrice);
    }
    updatedBillingDetails.inconvenienceToolTip = `${
      process.env.NEXT_PUBLIC_NODE_ENV === 'development' && waivedPenaltyPrice > 0
        ? `Travel duration reduced than previous and $${parseFloatWithPrecision(waivedPenaltyPrice)} has been waived`
        : 'Travel duration reduced than previous'
    }`;
    updatedBillingDetails.totalWithoutPenalty = parseFloatWithPrecision(updatedTotalPrice);
    if (updatedBillingDetails?.priceAdjustment) {
      const { updatedPriceAdjustment, adjustedTotalPrice } = applyPriceAdjustment(updatedBillingDetails?.priceAdjustment, updatedTotalPrice);
      updatedTotalPrice = adjustedTotalPrice;
      updatedBillingDetails.priceAdjustment = updatedPriceAdjustment;
    }
    updatedBillingDetails.newTotalPrice = parseFloatWithPrecision(
      updatedTotalPrice +
        updatedBillingDetails.newCoverageAmount +
        updatedBillingDetails?.newGstAmount +
        depositAmount +
        updatedBillingDetails.penaltyPrice +
        previousPenaltyPrice
    );
    if (updatedBillingDetails.newTotalPrice === paidPrice) {
      updatedBillingDetails.paidText = 'There is no change in payment.';
    } else {
      const remainingPrice = updatedBillingDetails.newTotalPrice - paidPrice;
      if (remainingPrice > 0) {
        updatedBillingDetails.additionalPaymentInfo = updatedBillingDetails.additionalPaymentInfo || {};
        updatedBillingDetails.additionalPaymentInfo.voucherAmountUsed = isVoucherValid ? Math.min(voucherAmountUsed ?? 0, remainingPrice) : 0;
      }
    }
  }
  const newTotalPriceWithVoucherUsed = parseFloatWithPrecision(
    updatedBillingDetails.newTotalPrice - (updatedBillingDetails?.additionalPaymentInfo?.voucherAmountUsed ?? 0)
  );
  if (isDurationReduced && newTotalPriceWithVoucherUsed > paidPrice) {
    const payable = parseFloatWithPrecision(updatedBillingDetails.newTotalPrice - paidPrice);
    updatedBillingDetails.paidText = `Thank you for updating the time. Please note that no refund will be issued, as the total price exceeds your paid amount. However, you will not be required to pay the excess amount, as $${parseFloatWithPrecision(
      payable
    )} has been waived.`;
    updatedBillingDetails.waivedPayableAmount = payable;
    updatedBillingDetails.payableAmount = 0;
  }
  return updatedBillingDetails;
};

export const handleCurrentTravelBillingUpdate = async ({
  currentPickupTime,
  returnTime,
  currentReturnTime,
  basePrice,
  travelBasePrice,
  vehicleDeliveryFee,
  vehicleReturnFee,
  totalPaidAmount,
  totalReturnedAmount,
  updatedBillingDetails,
  additionalPaymentInfo = {} as TAdditionalPaymentInfo,
  tempGstAmount,
  paidAmount,
  peakIncrease,
  updatedTravelData,
  isDurationReduced,
  previousPenaltyPrice = 0,
  isVoucherValid = false,
}: HandleCurrentTravelUpdateParams) => {
  const { dailyPrice, hourlyPrice, customPrices } = travelBasePrice ?? {};
  const { formattedTimeString: currentDateTime } = getPickerTimeStringInUtc(dayjs());
  const isCurrentTimePassPickupDate =
    dayjs(currentDateTime).isAfter(dayjs(currentPickupTime)) || dayjs(currentDateTime).isSame(dayjs(currentPickupTime));
  const penaltyPrice = isCurrentTimePassPickupDate
    ? await calculateMidPenaltyPrice(currentPickupTime, returnTime, dailyPrice, hourlyPrice, customPrices ?? [], peakIncrease)
    : await calculatePenaltyPrice(currentPickupTime, returnTime, currentReturnTime, dailyPrice, hourlyPrice, customPrices ?? [], peakIncrease);

  const totalDeliveryCost = (vehicleDeliveryFee ?? 0) + (vehicleReturnFee ?? 0);
  const remainingPaidAmount =
    parseFloatWithPrecision(totalPaidAmount ?? 0) - parseFloatWithPrecision(totalReturnedAmount ?? 0) - parseFloatWithPrecision(totalDeliveryCost);
  if (previousPenaltyPrice > 0) {
    updatedBillingDetails.previousPenaltyPrice = previousPenaltyPrice;
    // updatedBillingDetails.newTotalPrice = calculateWithPrecision('add', [updatedBillingDetails.newTotalPrice, previousPenaltyPrice]);
  }
  if (dayjs(currentReturnTime).isAfter(dayjs(returnTime))) {
    updatedBillingDetails = await handleEndDateDecrease(
      updatedBillingDetails?.newTotalPrice,
      dailyPrice,
      paidAmount,
      updatedBillingDetails,
      penaltyPrice,
      0,
      remainingPaidAmount,
      additionalPaymentInfo?.voucherAmountUsed,
      basePrice?.priceAdjustment,
      isDurationReduced,
      previousPenaltyPrice,
      isVoucherValid
    );
  } else {
    const totalPriceWithoutAdjustment = parseFloatWithPrecision(
      updatedBillingDetails.newTotalPrice + (updatedBillingDetails?.newCoverageAmount ?? 0) + tempGstAmount + previousPenaltyPrice
    );
    if (basePrice?.priceAdjustment) {
      const { updatedPriceAdjustment } = applyPriceAdjustment(basePrice?.priceAdjustment, totalPriceWithoutAdjustment);
      updatedBillingDetails.priceAdjustment = updatedPriceAdjustment;
    }
    updatedBillingDetails.newTotalPrice = calculateWithPrecision(
      updatedBillingDetails?.priceAdjustment?.adjustmentType === EPriceAdjustment.Decrease ? 'subtract' : 'add',
      [totalPriceWithoutAdjustment, updatedBillingDetails?.priceAdjustment?.amount ?? 0]
    );
    updatedBillingDetails = await updatePayableAmount(paidAmount, updatedBillingDetails, updatedTravelData, isDurationReduced, isVoucherValid);
  }
  return updatedBillingDetails;
};

//!Upcoming Travel Penalty Functions
const getAllDuration = (startTime: TDate, endTime: TDate) => {
  const totalDuration = dayjs.duration(dayjs(endTime).second(0).millisecond(0).diff(dayjs(startTime).second(0).millisecond(0)));
  // Convert the duration to milliseconds
  const totalMilliseconds = totalDuration.asMilliseconds();

  // Convert milliseconds to days, hours, and minutes
  const timeDiffDays = Math.floor(totalMilliseconds / (24 * 60 * 60 * 1000)); // Days
  const remainingMillisAfterDays = totalMilliseconds % (24 * 60 * 60 * 1000); // Remaining milliseconds after days
  const remainingHours = Math.floor(remainingMillisAfterDays / (60 * 60 * 1000)); // Hours
  const remainingMillisAfterHours = remainingMillisAfterDays % (60 * 60 * 1000); // Remaining milliseconds after hours
  const remainingMinutes = Math.floor(remainingMillisAfterHours / (60 * 1000)); // Minutes

  // Format durations
  const dayDuration = timeDiffDays > 0 ? `${timeDiffDays} ${timeDiffDays > 1 ? 'days ' : 'day '}` : '';
  const hourDuration = remainingHours > 0 ? `${remainingHours} ${remainingHours > 1 ? 'hrs ' : 'hr '}` : '';
  const minDuration = remainingMinutes > 0 ? `${remainingMinutes} ${remainingMinutes > 1 ? 'mins ' : 'min '}` : '';

  const formattedDuration = `${dayDuration}${hourDuration}${minDuration}`;
  return {
    formattedDuration,
    timeDiffDays,
    remainingHours,
    remainingMinutes,
  };
};
const isMinimumValid = async (
  newTotal: number,
  oldDurationHours: number,
  newDurationHours: number,
  oneDayMinimum: number,
  twoDaysMinimum: number
) => {
  // console.log({ newTotal, oldDurationHours, newDurationHours });
  let isMinValid = true;
  const minimumPay = 0;
  if (oldDurationHours >= 48 && newDurationHours < 48) {
    // console.log('48 check');
    isMinValid = newTotal > twoDaysMinimum;
    return { isMinValid, minimumPay: twoDaysMinimum };
  }
  if (oldDurationHours >= 24 && newDurationHours < 24) {
    // console.log('24 check');
    isMinValid = newTotal > oneDayMinimum;
    return { isMinValid, minimumPay: oneDayMinimum };
  }

  return { isMinValid, minimumPay };
};
const handlePenaltyInBillingDetails = async (
  isMinValid: boolean,
  minimumPay: number,
  penaltyPrice: number,
  newTotal: number,
  totalWithPenalty: number,
  updatedBillingDetails: any,
  penaltyHours: string
) => {
  if (isMinValid) {
    updatedBillingDetails.penaltyPrice = parseFloat(penaltyPrice.toFixed(2));
    updatedBillingDetails.totalWithoutPenalty = parseFloat(newTotal?.toFixed(2));
    updatedBillingDetails.newTotalPrice = parseFloat(totalWithPenalty?.toFixed(2));
  } else {
    const durationPenalty = parseFloat((minimumPay - totalWithPenalty).toFixed(2));
    penaltyPrice = penaltyPrice + durationPenalty;
    totalWithPenalty = newTotal + penaltyPrice;
    updatedBillingDetails.penaltyPrice = parseFloat(penaltyPrice.toFixed(2));
    updatedBillingDetails.totalWithoutPenalty = newTotal;
    updatedBillingDetails.newTotalPrice = parseFloat(totalWithPenalty?.toFixed(2));
  }
  updatedBillingDetails.inconvenienceToolTip = `For updating within ${penaltyHours} hrs`;

  return updatedBillingDetails;
};
export const getRefundOrPenaltyUpdated = async (paramsGetRefundOrPenalty: TParamsGetRefundOrPenalty) => {
  const {
    pickupTime,
    returnTime,
    newDurationPrice,
    storedDailyPrice,
    storedHourlyPrice,
    storedCustomPricing,
    peakIncrease,
    currentPickupTime,
    oldDurationHours,
    newDurationHours,
    updatedBillingDetails,
  } = paramsGetRefundOrPenalty;
  // Convert pickup times to Dayjs objects
  const oldPickup = dayjs(currentPickupTime);
  const newPickup = dayjs(pickupTime);
  // Helper function to get the reservation price list for a given time period
  const getPriceList = async (start: TDate, end: TDate) => {
    return await getReservationPriceList(start, end, storedDailyPrice, storedHourlyPrice, storedCustomPricing, peakIncrease);
  };
  const newDurationDays = getAllDuration(pickupTime, returnTime);
  const old48Hours = oldPickup.add(48, 'hour');
  const { reservationPriceList: oldReservationPriceList2Day } = await getPriceList(currentPickupTime, old48Hours);
  let oldDay1 = oldReservationPriceList2Day[0]?.dailyPrice;
  let oldDay2 = oldReservationPriceList2Day[1]?.dailyPrice;
  // Check if the duration between currentPickupTime and returnTime is <= 1 day
  const durationInHours = dayjs(returnTime).diff(dayjs(currentPickupTime), 'hour');

  if (durationInHours <= 24) {
    oldDay2 = oldDay1; // Set oldDay2 same as oldDay1 if duration <= 1 day
  }
  // Calculate the duration details for the 2 day period
  const checkingPrice2Day = oldDay1 + oldDay2;
  // Calculate the duration details for the 1 day period
  const checkingPrice1Day = oldDay1;
  let dayOneAmount = 0;
  let dayTwoAmount = 0;
  if (oldDurationHours <= 24) {
    if (newPickup.isSame(oldPickup)) {
      // If the old and current pickup times are the same
      if (newDurationPrice >= checkingPrice2Day) {
        // If the new duration price is greater than or equal to the price for the 48-hour period
        dayOneAmount = 0;
        dayTwoAmount = 0;
      } else if (newDurationPrice >= checkingPrice1Day) {
        // If the new duration price is greater than or equal to the price for the 24-hour period
        dayOneAmount = oldDay1;
        dayTwoAmount = 0;
      } else {
        dayOneAmount = oldDay1 || 0;
        dayTwoAmount = oldDay2 || 0;
      }
    } else if (newPickup.isBefore(oldPickup)) {
      // If the new pickup time is before the old pickup time
      if (newDurationDays?.timeDiffDays < 1) {
        // If the new duration is less than 1 day
        dayOneAmount = oldDay1 || 0;
        dayTwoAmount = oldDay2 || 0;
      } else if (newDurationDays?.timeDiffDays < 2) {
        // If the new duration is less than 2 days
        dayOneAmount = oldDay1;
        dayTwoAmount = 0;
      }
    } else {
      dayOneAmount = oldDay1 || 0;
      dayTwoAmount = oldDay2 || 0;
    }
  } else if (oldDurationHours <= 48) {
    if (newDurationDays?.timeDiffDays < 2) {
      // If the new duration is less than 2 days
      dayOneAmount = oldDay1;
      dayTwoAmount = 0;
    } else {
      dayOneAmount = 0;
      dayTwoAmount = 0;
    }
  }
  const currentStartCurrentTimeHoursDiff = getDurationHours(utcCurrentTime?.formattedTimeDayObj, dayjs(currentPickupTime));

  const newTotal = parseFloat(updatedBillingDetails?.newTotalPrice?.toFixed(2));

  if (currentStartCurrentTimeHoursDiff > 24) {
    let penaltyPrice = parseFloat(dayOneAmount?.toFixed(2));
    let totalWithPenalty = parseFloat((newTotal + penaltyPrice)?.toFixed(2));
    const { isMinValid, minimumPay } = await isMinimumValid(
      totalWithPenalty,
      oldDurationHours,
      newDurationHours,
      dayOneAmount,
      dayOneAmount + dayTwoAmount
    );
    // console.log(isMinValid, minimumPay, totalWithPenalty);
    const tempUpdatedBillingDetails = await handlePenaltyInBillingDetails(
      isMinValid,
      minimumPay,
      penaltyPrice,
      newTotal,
      totalWithPenalty,
      updatedBillingDetails,
      '48'
    );
    return tempUpdatedBillingDetails;
  }

  if (currentStartCurrentTimeHoursDiff <= 24) {
    const penaltyPrice = parseFloat((dayOneAmount + dayTwoAmount).toFixed(2));
    const totalWithPenalty = newTotal + penaltyPrice;

    const { isMinValid, minimumPay } = await isMinimumValid(
      totalWithPenalty,
      oldDurationHours,
      newDurationHours,
      dayOneAmount,
      dayOneAmount + dayTwoAmount
    );
    // console.log(isMinValid, minimumPay, totalWithPenalty);
    const tempUpdatedBillingDetails = await handlePenaltyInBillingDetails(
      isMinValid,
      minimumPay,
      penaltyPrice,
      newTotal,
      totalWithPenalty,
      updatedBillingDetails,
      '24'
    );
    return tempUpdatedBillingDetails;
  }

  return updatedBillingDetails;
};
