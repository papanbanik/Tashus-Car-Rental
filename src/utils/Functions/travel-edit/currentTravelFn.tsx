import { TPeakIncreasePrice } from '@/context/SearchProvider';
import { CarDataState } from '@/types/car-listing/carListingTypes';
import { CarDataBookingDiscount } from '@/types/car-listing/carPricingTypes';
import { EPriceAdjustment, TDate } from '@/types/commonTypes';
import { TBillingDetails, TUpdatedTravelData } from '@/types/travels/typeEditTravels';
import { CustomPricing, IndividualPricing, PeakIncreaseType, TParamsGetUpcomingDurationPrice } from '@/types/user-profile/customPriceTypes';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import { Dispatch, SetStateAction } from 'react';
import { getDurationDayHourMin, getDurationHours } from '../dateTimeCommonFn';
import { calculatePeakIncreasePrice, isDayOfWeekInRange } from '../reservationValidationFn';
import { calculateCoverageAmount } from '../transactionCommonFn';
import { utcCurrentTime } from '../utcCommonFn';
import {
  calculateNewDurationPrice,
  calculateNextHighestLongDiscount,
  commonDiscountCalculation,
  convertWeekToDays,
  getDatesInRange,
  getReservationPriceList,
} from '../vehiclePriceUpdateFn';
import { getUpcomingDurationPrice } from './upcomingTravelFn';

dayjs.extend(duration);
dayjs.extend(isBetween);
//handle Date Time in Current Travel
export const handleDateTimeValidation = (pickupTime: Dayjs, returnTime: Dayjs, setAvailabilityErrorText: Dispatch<SetStateAction<string>>) => {
  let isValid = true;
  const updatedPickup = pickupTime?.second(0).millisecond(0);
  const updatedReturn = returnTime?.second(0).millisecond(0);
  const minuteDiff = updatedReturn.diff(updatedPickup, 'minute');
  const isReturnBeforePickup = updatedReturn.isBefore(updatedPickup, 'minute');
  const isPickupReturnSame = updatedReturn.isSame(updatedPickup, 'minute');

  if (isReturnBeforePickup || isPickupReturnSame) {
    setAvailabilityErrorText('Invalid time');
    isValid = false;
    return isValid;
  }

  if (minuteDiff < 60) {
    setAvailabilityErrorText('Duration needs to be minimum 1 hr');
    isValid = false;
    return isValid;
  }

  setAvailabilityErrorText('');
  return isValid;
};
//handle Current Travel Edit
export const handleCurrentTravelEdit = async (
  pickupTime: TDate,
  returnTime: TDate,
  currentPickupTime: TDate,
  currentReturnTime: TDate,
  carData: CarDataState,
  updatedTravelData: TUpdatedTravelData,
  getPreviousReservationData: (travelDetails: any) => Promise<any>,
  travelDetails: any,
  setBillingDetails: Dispatch<SetStateAction<TBillingDetails>>,
  setIndividualPriceList: Dispatch<SetStateAction<IndividualPricing[]>>
) => {
  const { dailyRates, hourlyRates, customPricing, peakIncrease, longBookingDiscounts, longBookingDiscountActive = true } = carData?.rates;
  const generatedDates = await getDatesInRange(pickupTime, returnTime);
  const matchedDates = generatedDates.filter((date) => {
    const currentDate = dayjs(date?.date);
    const isDateBetween = dayjs(currentDate).isBetween(dayjs(currentPickupTime), dayjs(currentReturnTime), 'day', '[]');
    return isDateBetween;
  });
  let paramsGetUpcomingDurationPrice: TParamsGetUpcomingDurationPrice = {
    pickupTime,
    returnTime,
    currentPickupTime,
    currentReturnTime,
    storedDailyPrice: updatedTravelData?.basePrice?.dailyPrice,
    storedHourlyPrice: updatedTravelData?.basePrice?.hourlyPrice,
    storedCustomPricing: updatedTravelData?.basePrice?.customPrices ?? [],
    currentDailyPrice: dailyRates?.amount,
    currentHourlyPrice: hourlyRates?.amount,
    currentCustomPricing: customPricing,
    peakIncrease,
    generatedDates,
    matchedDates,
  };
  // Step 1: generate date list and calculate total duration price and duration price with peak increase
  const tempDurationPrice = await getUpcomingDurationPrice(paramsGetUpcomingDurationPrice, setIndividualPriceList);
  let tempTotalPrice = tempDurationPrice;
  //Step 1: Calculate Price of duration day and time
  const nextDayOfCurrentReturn = dayjs(currentReturnTime).add(1, 'day');
  const isEndExtended = dayjs(returnTime).isAfter(dayjs(nextDayOfCurrentReturn), 'minute');
  // let tempDurationPrice = 0;
  // if (isEndExtended) {
  //   const oldDurationWithOldPrice = await calculateEditDurationPrice(
  //     pickupTime,
  //     nextDayOfCurrentReturn,
  //     updatedTravelData?.basePrice?.dailyPrice,
  //     updatedTravelData?.basePrice?.hourlyPrice,
  //     updatedTravelData?.basePrice?.customPrices ?? [],
  //     peakIncrease,
  //     setIndividualPriceList
  //   );
  //   const newDurationWithNewPrice = await calculateEditDurationPrice(
  //     nextDayOfCurrentReturn,
  //     returnTime,
  //     dailyRates?.amount,
  //     hourlyRates?.amount,
  //     customPricing,
  //     peakIncrease,
  //     setIndividualPriceList
  //   );
  //   tempDurationPrice = parseFloat((oldDurationWithOldPrice + newDurationWithNewPrice)?.toFixed(2));
  // } else {
  //   tempDurationPrice = await calculateEditDurationPrice(
  //     pickupTime,
  //     returnTime,
  //     updatedTravelData?.basePrice?.dailyPrice,
  //     updatedTravelData?.basePrice?.hourlyPrice,
  //     updatedTravelData?.basePrice?.customPrices ?? [],
  //     peakIncrease,
  //     setIndividualPriceList
  //   );
  // }
  // let tempTotalPrice = tempDurationPrice;
  // Step 2: calculate service fee;
  // const serviceFee = tempTotalPrice * (10 / 100);
  const serviceFee = 0; //modify for car rental

  // Step 3: calculate long booking discounts;
  const { longDiscount, tempTotalPrice: totalWithDiscount } = await getEditTravelDiscounts({
    longBookingDiscounts,
    pickupDate: pickupTime,
    returnDate: returnTime,
    totalPrice: tempTotalPrice,
    longBookingDiscountActive: longBookingDiscountActive,
  });

  tempTotalPrice = totalWithDiscount;
  // console.log({ increasedDurationPrice, tempTotalPrice });

  // Step 4: Check advance booking discount and update total price
  if (updatedTravelData?.discounts?.advanceBookingDiscounts?.calculatedAmount) {
    const advDisAmount = updatedTravelData?.discounts?.advanceBookingDiscounts?.calculatedAmount;
    tempTotalPrice = parseFloat(tempTotalPrice?.toFixed(2)) - parseFloat(advDisAmount.toFixed(2));
  }

  // Set billing details
  const newDuration = `${getDurationDayHourMin(dayjs(pickupTime), dayjs(returnTime))} rental`;
  const newDurationHours = getDurationHours(pickupTime, returnTime);
  const oldPriceData = await getPreviousReservationData(updatedTravelData);
  // console.log(newDuration);
  tempTotalPrice = tempTotalPrice + serviceFee;
  let updatedBillingDetails: any = {
    newDuration,
    newDurationPrice: tempDurationPrice,
    newTotalPrice: parseFloat(tempTotalPrice?.toFixed(2)),
    newServiceFee: parseFloat(serviceFee?.toFixed(2)),
    newStartDate: currentPickupTime,
    newEndDate: returnTime,
    newCoverageAmount: 0,
    newTotalWithoutCoverage: parseFloat(tempTotalPrice?.toFixed(2)),
    totalDurationHours: newDurationHours,
    dailyPrice: dailyRates?.amount,
    hourlyPrice: hourlyRates?.amount,
    customPrices: customPricing,
    currency: travelDetails?.reservationInfo?.basePrice?.currency,
    serviceFeePercentage: updatedTravelData?.serviceFeePercentage,
    // Initialize additionalPaymentInfo
    additionalPaymentInfo: {},
  };
  //set calculate peak increased amount
  const peakIncList = await isDayOfWeekInRange(pickupTime, returnTime, peakIncrease);
  let tempPeakIncPrice: TPeakIncreasePrice = {};
  if (peakIncList?.length > 0) {
    const peakDays = peakIncList?.map((day) => day?.dayOfWeek);
    const { incPrice } = await calculatePeakIncreasePrice(dailyRates?.amount, tempTotalPrice, peakIncList);
    tempPeakIncPrice = {
      increaseDays: peakDays,
      increaseType: peakIncList[0]?.increaseType,
      increaseAmount: peakIncList[0]?.percentage || peakIncList[0]?.amount,
      calculatedAmount: incPrice,
    };
  }
  if (peakIncList?.length > 0) {
    updatedBillingDetails.newPeakIncPrice = tempPeakIncPrice;
  }
  if (longDiscount?.text && longBookingDiscountActive) {
    updatedBillingDetails.newLongBookingDis = { ...longDiscount };
  }

  if (travelDetails?.reservationInfo?.additionalDistanceFeePerKm) {
    updatedBillingDetails.additionalDistanceFeePerKm = travelDetails?.reservationInfo?.additionalDistanceFeePerKm;
  }
  // Step 5: Calculate coverage amount
  if (travelDetails?.reservationInfo?.insurance?.guestCoverageType !== 'no-coverage') {
    // console.log(tempTotalPrice);
    // updatedBillingDetails.newTotalWithoutCoverage = tempTotalPrice;
    const coverageAmount = parseFloat((tempTotalPrice * (parseInt(travelDetails?.reservationInfo?.insurance?.coveragePercentage) / 100))?.toFixed(2));
    const newCoverageAmount = calculateCoverageAmount(
      travelDetails?.reservationInfo?.insurance?.guestCoverageType,
      parseFloat(coverageAmount.toFixed(2))
    );
    updatedBillingDetails.newCoverageAmount = parseFloat(newCoverageAmount.toFixed(2));
    // updatedBillingDetails.newCoverageAmount = parseFloat(
    //   (tempTotalPrice * (parseInt(travelDetails?.reservationInfo?.insurance?.coveragePercentage) / 100))?.toFixed(2)
    // );
  }

  // Step 6: Calculate gst amount
  updatedBillingDetails.newTotalWithoutCoverage = tempTotalPrice;
  // const tempGstAmount = (tempTotalPrice + updatedBillingDetails.newCoverageAmount) * (10 / 100); //need later implementation
  const tempGstAmount = 0; //gstAmount amount change if not calculated
  updatedBillingDetails.newGstAmount = tempGstAmount;
  const adjustmentAmount = updatedTravelData?.basePrice?.priceAdjustment?.amount ?? 0;
  const travelPaidAmount = updatedTravelData?.basePrice?.totalPrice - (updatedTravelData?.additionalPaymentInfo?.voucherAmountUsed ?? 0);
  const adjustmentPaidAmount =
    adjustmentAmount > 0
      ? updatedTravelData?.basePrice?.priceAdjustment?.adjustmentType === EPriceAdjustment.Increase
        ? travelPaidAmount + adjustmentAmount
        : travelPaidAmount - adjustmentAmount
      : travelPaidAmount;
  const paidAmount = parseFloat(adjustmentPaidAmount?.toFixed(2));
  const totalDeliveryCost = (updatedTravelData?.vehicleDeliveryFee ?? 0) + (updatedTravelData?.vehicleReturnFee ?? 0);
  const remainingPaidAmount =
    parseFloat((updatedTravelData?.totalPaidAmount ?? 0)?.toFixed(2)) -
    parseFloat((updatedTravelData?.totalReturnedAmount ?? 0)?.toFixed(2)) -
    parseFloat(totalDeliveryCost?.toFixed(2));
  //Calculate Penalty Price
  const penaltyPrice = await calculatePenaltyPrice(
    currentPickupTime,
    returnTime,
    currentReturnTime,
    updatedTravelData?.basePrice?.dailyPrice,
    updatedTravelData?.basePrice?.hourlyPrice,
    updatedTravelData?.basePrice?.customPrices ?? [],
    peakIncrease
  );
  if (dayjs(currentReturnTime).isAfter(dayjs(returnTime))) {
    // Step 7: Add refund or inconvenience fee if travel duration decreases
    updatedBillingDetails = await handleEndDateDecrease(
      updatedBillingDetails?.newTotalPrice,
      updatedTravelData?.basePrice?.dailyPrice,
      paidAmount,
      updatedBillingDetails,
      penaltyPrice,
      0,
      remainingPaidAmount,
      updatedTravelData?.additionalPaymentInfo?.voucherAmountUsed
      // oldPriceData?.oldDepositAmount
    );
  } else {
    updatedBillingDetails.newTotalPrice = parseFloat(
      (updatedBillingDetails.newTotalPrice + updatedBillingDetails.newCoverageAmount + updatedBillingDetails.newGstAmount)
        // +oldPriceData?.oldDepositAmount
        ?.toFixed(2)
    );
    // Step 8: check payable amount
    updatedBillingDetails = await updatePayableAmount(paidAmount, updatedBillingDetails, updatedTravelData); //modify get voucher payment
  }
  // console.log(updatedBillingDetails);

  setBillingDetails({ ...oldPriceData, ...updatedBillingDetails });
};

//handle End date decrease
export const handleEndDateDecrease = async (
  updatedTotalPrice: number,
  dailyPrice: number,
  paidPrice: number,
  updatedBillingDetails: any,
  tempPenaltyPrice?: number,
  depositAmount?: number,
  remainingPaidAmount: number = 0,
  voucherAmountUsed?: number
) => {
  // console.log(tempPenaltyPrice);
  // const penaltyPrice = dayOneAmount + dayTwoAmount;
  const penaltyPrice = tempPenaltyPrice ?? 2 * dailyPrice;
  const totalWithPenalty =
    parseFloat(updatedTotalPrice.toFixed(2)) +
    parseFloat(penaltyPrice.toFixed(2)) +
    updatedBillingDetails?.newCoverageAmount +
    updatedBillingDetails?.newGstAmount +
    depositAmount;
  if (totalWithPenalty < paidPrice) {
    updatedBillingDetails.penaltyPrice = parseFloat(penaltyPrice.toFixed(2));
    updatedBillingDetails.inconvenienceToolTip = `Travel duration reduced than previous`;
    updatedBillingDetails.totalWithoutPenalty = parseFloat(updatedTotalPrice?.toFixed(2));
    updatedBillingDetails.newTotalPrice = parseFloat(totalWithPenalty?.toFixed(2));
    //updatedBillingDetails.refundableAmount = parseFloat((parseFloat(paidPrice?.toFixed(2)) - parseFloat(totalWithPenalty?.toFixed(2))).toFixed(2));
    // Calculate the refundable amount
    const refundableAmount = parseFloat((parseFloat(paidPrice?.toFixed(2)) - parseFloat(totalWithPenalty?.toFixed(2))).toFixed(2));
    // Refund based on remainingPaidAmount
    // updatedBillingDetails.refundableAmount =refundableAmount > (remainingPaidAmount ?? 0) ? remainingPaidAmount : refundableAmount > 0 ? refundableAmount : 0;
    if (remainingPaidAmount > refundableAmount) {
      updatedBillingDetails.refundableAmount = parseFloat(refundableAmount?.toFixed(2));
    } else {
      updatedBillingDetails.refundableAmount = remainingPaidAmount > 0 ? parseFloat(remainingPaidAmount?.toFixed(2)) : 0;
    }
  } else {
    const paidWithVoucher = paidPrice + (voucherAmountUsed ?? 0);
    let waivedPenaltyPrice = 0;
    if (totalWithPenalty > paidWithVoucher) {
      waivedPenaltyPrice = totalWithPenalty - paidWithVoucher; //waived the exceeding price
      updatedBillingDetails.waivedPenaltyPrice = parseFloat(waivedPenaltyPrice?.toFixed(2));
      updatedBillingDetails.penaltyPrice = parseFloat((parseFloat(penaltyPrice?.toFixed(2)) - (waivedPenaltyPrice ?? 0)).toFixed(2));
    } else {
      updatedBillingDetails.penaltyPrice = parseFloat(penaltyPrice?.toFixed(2));
    }
    updatedBillingDetails.inconvenienceToolTip = `${
      process.env.NEXT_PUBLIC_NODE_ENV === 'development' && waivedPenaltyPrice > 0
        ? `Travel duration reduced than previous and $${parseFloat(waivedPenaltyPrice.toFixed(2))} has been waived`
        : 'Travel duration reduced than previous'
    }`;
    updatedBillingDetails.totalWithoutPenalty = parseFloat(updatedTotalPrice?.toFixed(2));
    updatedBillingDetails.newTotalPrice = parseFloat(
      (
        updatedTotalPrice +
        updatedBillingDetails.newCoverageAmount +
        updatedBillingDetails?.newGstAmount +
        depositAmount +
        updatedBillingDetails.penaltyPrice
      )?.toFixed(2)
    );
    if (updatedBillingDetails.newTotalPrice === paidPrice) {
      updatedBillingDetails.paidText = 'There is no change in payment.';
    } else {
      // set voucherAmountUsed for revised travel
      const remainingPrice = updatedBillingDetails.newTotalPrice - paidPrice;
      // Voucher amount to use based on the remaining price
      if (remainingPrice > 0) {
        updatedBillingDetails.additionalPaymentInfo.voucherAmountUsed = Math.min(voucherAmountUsed ?? 0, remainingPrice);
      }
    }
    //previous else statement
    // updatedBillingDetails.newTotalPrice = parseFloat(
    //   (updatedTotalPrice + updatedBillingDetails.newCoverageAmount + updatedBillingDetails?.newGstAmount + depositAmount)?.toFixed(2)
    // );
    // if (penaltyPrice > 0) {
    //   updatedBillingDetails.refundText = `Thank you for updating the end time. Kindly be aware that an inconvenience fee of $${penaltyPrice?.toFixed(
    //     2
    //   )} is applicable for updating return time with duration less than your current travel duration which sums up your total price as $${totalWithPenalty?.toFixed(
    //     2
    //   )}. But be informed that you will not have to pay this exceeding amount`;
    // }
    // else {
    //   if (updatedBillingDetails.newTotalPrice > 0) {
    //     updatedBillingDetails.payableAmount = updatedBillingDetails?.newTotalPrice;
    //   }
    // }
  }
  return updatedBillingDetails;
};

export const getEditTravelDiscounts = async ({
  longBookingDiscounts,
  pickupDate,
  returnDate,
  totalPrice,
  advanceBookingDiscounts,
  longBookingDiscountActive = true,
  advanceBookingDiscountActive = true,
}: {
  longBookingDiscounts: CarDataBookingDiscount[];
  pickupDate: TDate;
  returnDate: TDate;
  totalPrice: number;
  advanceBookingDiscounts?: CarDataBookingDiscount[];
  longBookingDiscountActive?: boolean;
  advanceBookingDiscountActive?: boolean;
}) => {
  const timeDiffDays = dayjs(returnDate).diff(dayjs(pickupDate), 'day');
  const convertedLongDiscounts = await convertWeekToDays(longBookingDiscounts);
  const filteredLongDiscounts = convertedLongDiscounts?.filter((dis: any) => timeDiffDays >= dis?.convertedDays);

  // const advanceDayDiff = dayjs(pickupDate).diff(dayjs(), 'day');
  const advanceDayDiff = dayjs(pickupDate).diff(utcCurrentTime?.formattedTimeDayObj, 'day'); //take current utc time
  const convertedAdvanceDiscounts = await convertWeekToDays(advanceBookingDiscounts);
  const filteredAdvanceDiscounts = convertedAdvanceDiscounts?.filter((dis: any) => advanceDayDiff >= dis?.convertedDays);

  let tempAdvanceDisData = {
    calculatedAmount: 0,
    text: '',
  };
  let tempLongDisData = {
    calculatedAmount: 0,
    text: '',
  };
  let tempNextLongDisData = {
    amount: 0,
    text: '',
  };
  let tempTotalPrice = totalPrice;

  // Four: apply long reservation discount if applicable
  if (filteredLongDiscounts?.length > 0 && longBookingDiscountActive) {
    const { highestData, tempDiscountedPrice, nextHighestData } = await commonDiscountCalculation(
      filteredLongDiscounts,
      convertedLongDiscounts,
      totalPrice,
      'long'
    );
    tempLongDisData = highestData;
    tempNextLongDisData = nextHighestData;
    tempTotalPrice = tempDiscountedPrice;
  }

  // Show minimum long discount price when no long discount is applicable
  if (filteredLongDiscounts?.length === 0 && convertedLongDiscounts?.length > 0 && longBookingDiscountActive) {
    tempNextLongDisData = await calculateNextHighestLongDiscount(convertedLongDiscounts);
    // console.log(tempNextLongDisData);
  }

  // Five: apply advance reservation discount if applicable
  if (filteredAdvanceDiscounts?.length > 0 && advanceBookingDiscountActive) {
    const { highestData, tempDiscountedPrice } = await commonDiscountCalculation(
      filteredAdvanceDiscounts,
      convertedAdvanceDiscounts,
      tempTotalPrice,
      'advance'
    );
    tempAdvanceDisData = highestData;
    tempTotalPrice = tempDiscountedPrice;
    // console.log(tempAdvanceDisData);
    // console.log(tempTotalPrice);
  }

  return { advanceDiscount: tempAdvanceDisData, longDiscount: tempLongDisData, nextLongDiscount: tempNextLongDisData, tempTotalPrice };
};

export const calculateEditDurationPrice = async (
  pickupDateTime: TDate,
  returnDateTime: TDate,
  dailyRate: number,
  hourlyRate: number,
  customPricing: CustomPricing[],
  peakIncrease: PeakIncreaseType[],
  setIndividualPriceList?: Dispatch<SetStateAction<IndividualPricing[]>>
): Promise<number> => {
  const pickupDate = dayjs(pickupDateTime);
  const returnDate = dayjs(returnDateTime);

  // // Calculate the time difference between pickup & return in hours, days
  // const timeDiffMins = returnDate.diff(pickupDate, 'minute');
  // const timeDiffHours = returnDate.diff(pickupDate, 'hour');
  // const timeDiffDays = returnDate.diff(pickupDate, 'day');

  // // Calculate remaining hours
  // const remainingHours = timeDiffHours % 24;
  // const remainingMinutes = timeDiffMins % 60;
  const totalDuration = dayjs.duration(returnDate.second(0).millisecond(0).diff(pickupDate.second(0).millisecond(0)));
  // Convert the duration to milliseconds
  const totalMilliseconds = totalDuration.asMilliseconds();

  // Convert milliseconds to days, hours, and minutes
  const timeDiffDays = Math.floor(totalMilliseconds / (24 * 60 * 60 * 1000)); // Days
  const remainingMillisAfterDays = totalMilliseconds % (24 * 60 * 60 * 1000); // Remaining milliseconds after days
  const remainingHours = Math.floor(remainingMillisAfterDays / (60 * 60 * 1000)); // Hours
  const remainingMillisAfterHours = remainingMillisAfterDays % (60 * 60 * 1000); // Remaining milliseconds after hours
  const remainingMinutes = Math.floor(remainingMillisAfterHours / (60 * 1000)); // Minutes

  // One: calculate base price taking total duration days and hours
  const { reservationPriceList } = await getReservationPriceList(pickupDateTime, returnDateTime, dailyRate, hourlyRate, customPricing, peakIncrease);
  const { tempDurationPrice, individualPrices } = await calculateNewDurationPrice(
    timeDiffDays,
    remainingHours,
    remainingMinutes,
    reservationPriceList
  );
  if (setIndividualPriceList) {
    setIndividualPriceList(individualPrices);
  }
  return tempDurationPrice;
};

export const getAllDuration = (startTime: Dayjs | Date | string, endTime: Dayjs | Date | string) => {
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

export const updatePayableAmount = async (oldTotal: number, updatedBillingDetails: any, updatedTravelData: TUpdatedTravelData) => {
  const newTotal = updatedBillingDetails?.newTotalPrice;
  let payableAmount = 0;

  if (oldTotal === newTotal) {
    updatedBillingDetails.paidText = 'There is no change in payment.';
  }

  // if (oldTotal < newTotal) {
  //   //payableAmount =parseFloat((newTotal - oldTotal)?.toFixed(2))
  //   payableAmount =
  //     parseFloat((newTotal - oldTotal)?.toFixed(2)) - parseFloat((updatedTravelData?.additionalPaymentInfo?.voucherAmountUsed ?? 0)?.toFixed(2));
  //   updatedBillingDetails.payableAmount = payableAmount > 0 ? parseFloat(payableAmount?.toFixed(2)) : 0;
  // }
  //previous code of voucher consider
  // if (oldTotal < newTotal) {
  //   payableAmount =
  //     parseFloat((newTotal - oldTotal)?.toFixed(2)) - parseFloat((updatedTravelData?.additionalPaymentInfo?.voucherAmountUsed ?? 0)?.toFixed(2));
  //   updatedBillingDetails.payableAmount = payableAmount > 0 ? parseFloat(payableAmount?.toFixed(2)) : 0;

  //   //no calculation, just set for now to avoid mobile and web inconsistencies
  //   const rawPayableAmount = parseFloat((newTotal - oldTotal)?.toFixed(2));
  //   let voucherAmountUsed = parseFloat(
  //     (updatedTravelData?.basePrice?.revisedVoucherUsed ?? updatedTravelData?.additionalPaymentInfo?.voucherAmountUsed ?? 0)?.toFixed(2)
  //   ); //1st use or remaining voucher used
  //   if (rawPayableAmount <= voucherAmountUsed) {
  //     //updatedBillingDetails.payableAmount = 0;
  //     updatedBillingDetails.revisedVoucherUsed = rawPayableAmount;
  //   } else {
  //     // updatedBillingDetails.payableAmount = rawPayableAmount - voucherAmountUsed;
  //     updatedBillingDetails.revisedVoucherUsed = voucherAmountUsed > 0 ? voucherAmountUsed : undefined;
  //   }
  // }
  //new code with voucher consider
  if (oldTotal < newTotal) {
    const rawPayableAmount = parseFloat((newTotal - oldTotal)?.toFixed(2));
    let voucherAmountUsed = parseFloat((updatedTravelData?.additionalPaymentInfo?.voucherAmountUsed ?? 0)?.toFixed(2));
    if (voucherAmountUsed > 0) {
      updatedBillingDetails.additionalPaymentInfo = updatedBillingDetails.additionalPaymentInfo || {}; //initialize to resolved type-error
      if (rawPayableAmount <= voucherAmountUsed) {
        updatedBillingDetails.payableAmount = 0;
        updatedBillingDetails.additionalPaymentInfo.voucherAmountUsed = rawPayableAmount;
      } else {
        updatedBillingDetails.payableAmount = parseFloat((rawPayableAmount - voucherAmountUsed).toFixed(2));
        updatedBillingDetails.additionalPaymentInfo.voucherAmountUsed = voucherAmountUsed > 0 ? voucherAmountUsed : 0;
      }
    } else {
      updatedBillingDetails.payableAmount = rawPayableAmount;
    }
  }

  if (oldTotal > newTotal) {
    const totalDeliveryCost = (updatedTravelData?.vehicleDeliveryFee ?? 0) + (updatedTravelData?.vehicleReturnFee ?? 0);
    const remainingPaidAmount =
      parseFloat((updatedTravelData?.totalPaidAmount ?? 0)?.toFixed(2)) -
      parseFloat((updatedTravelData?.totalReturnedAmount ?? 0)?.toFixed(2)) -
      parseFloat(totalDeliveryCost?.toFixed(2));
    const refundableAmountCalculation = parseFloat((oldTotal - newTotal)?.toFixed(2));
    if (remainingPaidAmount >= refundableAmountCalculation) {
      updatedBillingDetails.refundableAmount = parseFloat(refundableAmountCalculation?.toFixed(2));
    } else {
      updatedBillingDetails.refundableAmount = remainingPaidAmount > 0 ? parseFloat(remainingPaidAmount?.toFixed(2)) : 0;
    }
    //updatedBillingDetails.refundableAmount = parseFloat((oldTotal - newTotal)?.toFixed(2));
  }
  return updatedBillingDetails;
};

export const calculatePenaltyPrice = async (
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
  const oldDay1 = oldReservationPriceList2Day[0]?.dailyPrice;
  const oldDay2 = oldReservationPriceList2Day[1]?.dailyPrice;
  // Check if the duration between old and current time is within 24 hours
  if (newReturn.isBefore(oldReturn)) {
    penalty = oldDay1 + oldDay2;
  } else {
    penalty = 0;
  }
  return penalty;
};
