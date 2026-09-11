//! Deprecated Methods, Only use for compare purpose

import { TPeakIncreasePrice } from '@/context/SearchProvider';
import { CarDataState } from '@/types/car-listing/carListingTypes';
import { CarDataBookingDiscount } from '@/types/car-listing/carPricingTypes';
import { TDate } from '@/types/commonTypes';
import { TUpdatedTravelData } from '@/types/travels/typeEditTravels';
import { TravelDetailsState } from '@/types/travels/typeTravels';
import { TParamsGetRefundOrPenalty, TParamsGetUpcomingDurationPrice } from '@/types/user-profile/customPriceTypes';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { getDurationDayHourMin, getDurationHours } from '../dateTimeCommonFn';
import { calculatePeakIncreasePrice, isDayOfWeekInRange } from '../reservationValidationFn';
import { calculateCoverageAmount } from '../transactionCommonFn';
import { dayjsUtc, utcCurrentTime } from '../utcCommonFn';
import { calculateNextHighestLongDiscount, commonDiscountCalculation, convertWeekToDays, getDatesInRange } from '../vehiclePriceUpdateFn';
import { updatePayableAmount } from './currentTravelFn';
import { getEditTravelDiscountsConsiderPrevious } from './travelDiscountFn';
import { calculatePaidAmount } from './travelEditFn';
import { handleCurrentTravelBillingUpdate } from './travelPenaltyFn';
import { calculateUpcomingDurationPrice, getRefundOrPenaltyUpdated, getUpcomingReservationPriceList } from './upcomingTravelFn';

dayjs.extend(isBetween);

export const getEditTravelDiscounts = async ({
  totalPrice,
  pickupDate,
  returnDate,
  longBookingDiscounts,
  advanceBookingDiscounts,
  longBookingDiscountActive = true,
  advanceBookingDiscountActive = true,
}: {
  totalPrice: number;
  pickupDate: TDate;
  returnDate: TDate;
  longBookingDiscounts: CarDataBookingDiscount[];
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

export const getUpcomingDurationPrice = async (paramsGetUpcomingDurationPrice: TParamsGetUpcomingDurationPrice): Promise<number> => {
  const {
    pickupTime,
    returnTime,
    currentPickupTime,
    currentReturnTime,
    storedDailyPrice,
    storedHourlyPrice,
    storedCustomPricing,
    currentDailyPrice,
    currentHourlyPrice,
    currentCustomPricing,
    peakIncrease,
  } = paramsGetUpcomingDurationPrice;
  const reservationPriceList = await getUpcomingReservationPriceList(
    pickupTime,
    returnTime,
    currentDailyPrice,
    currentHourlyPrice,
    currentCustomPricing,
    peakIncrease,
    currentPickupTime,
    currentReturnTime,
    storedDailyPrice,
    storedHourlyPrice,
    storedCustomPricing
  );
  // console.log('reservation Price List', reservationPriceList);
  const { tempDurationPrice: totalDurationPrice, individualPrices } = await calculateUpcomingDurationPrice(
    pickupTime,
    returnTime,
    reservationPriceList
  );
  return parseFloat(totalDurationPrice?.toFixed(2));
};

export const handleTravelEditOld = async (
  pickupTime: TDate,
  returnTime: TDate,
  currentPickupTime: TDate,
  currentReturnTime: TDate,
  carData: CarDataState,
  travelDetails: TravelDetailsState,
  updatedTravelData: TUpdatedTravelData
) => {
  const {
    dailyRates,
    hourlyRates,
    customPricing,
    peakIncrease,
    longBookingDiscounts,
    advanceBookingDiscounts,
    longBookingDiscountActive = true,
    advanceBookingDiscountActive = true,
  } = carData?.rates;
  //Destruct Travel Details rate
  const { reservationInfo } = travelDetails;
  const { additionalDistanceFeePerKm, insurance } = reservationInfo;
  //Destruct Updated Travel Data
  const {
    basePrice,
    serviceFeePercentage = 0,
    additionalPaymentInfo = {},
    vehicleDeliveryFee,
    vehicleReturnFee,
    totalPaidAmount,
    totalReturnedAmount,
  } = updatedTravelData;
  const { dailyPrice, hourlyPrice, customPrices, durationPrice } = basePrice;

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
    storedDailyPrice: dailyPrice,
    storedHourlyPrice: hourlyPrice,
    storedCustomPricing: customPrices ?? [],
    currentDailyPrice: dailyRates?.amount,
    currentHourlyPrice: hourlyRates?.amount,
    currentCustomPricing: customPricing,
    peakIncrease,
    generatedDates,
    matchedDates,
  };
  // Step 1: generate date list and calculate total duration price and duration price with peak increase
  const tempDurationPrice = await getUpcomingDurationPrice(paramsGetUpcomingDurationPrice);
  let tempTotalPrice = tempDurationPrice;

  // Step 2: calculate service fee;
  //const serviceFee = parseFloat((tempTotalPrice * (10 / 100))?.toFixed(2));
  const serviceFee = 0; //modify for car rental
  // Step 3: calculate long booking discounts;
  const {
    advanceDiscount,
    longDiscount,
    tempTotalPrice: totalWithDiscount,
  } = await getEditTravelDiscounts({
    totalPrice: tempTotalPrice,
    pickupDate: pickupTime,
    returnDate: returnTime,
    longBookingDiscounts,
    advanceBookingDiscounts,
    longBookingDiscountActive,
    advanceBookingDiscountActive,
  });
  tempTotalPrice = totalWithDiscount;

  // Set billing details
  const newDuration = `${getDurationDayHourMin(dayjs(pickupTime), dayjs(returnTime))} rental`;
  const newDurationHours = getDurationHours(pickupTime, returnTime);
  //exclude oldAdvBookingDis
  // console.log('Show Old Price Data', oldPriceData);
  // console.log(newDuration);
  tempTotalPrice = tempTotalPrice + serviceFee;
  let updatedBillingDetails: any = {
    newDuration,
    newDurationPrice: tempDurationPrice,
    newTotalPrice: tempTotalPrice,
    newServiceFee: serviceFee,
    newStartDate: pickupTime,
    newEndDate: returnTime,
    newCoverageAmount: 0,
    newTotalWithoutCoverage: tempTotalPrice,
    customPrices: customPricing,
    totalDurationHours: newDurationHours,
    dailyPrice: dailyRates?.amount,
    hourlyPrice: hourlyRates?.amount,
    currency: reservationInfo?.basePrice?.currency,
    serviceFeePercentage: serviceFeePercentage,
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

  if (advanceDiscount?.text && advanceBookingDiscountActive) {
    updatedBillingDetails.newAdvBookingDis = { ...advanceDiscount };
  }

  if (additionalDistanceFeePerKm) {
    updatedBillingDetails.additionalDistanceFeePerKm = additionalDistanceFeePerKm;
  }

  // Step 6: Calculate coverage amount
  if (insurance?.guestCoverageType !== 'no-coverage') {
    const coverageAmount = parseFloat(((tempTotalPrice * Number(insurance?.coveragePercentage ?? 0)) / 100).toFixed(2));
    const newCoverageAmount = calculateCoverageAmount(insurance?.guestCoverageType, parseFloat(coverageAmount.toFixed(2)));
    updatedBillingDetails.newCoverageAmount = parseFloat(newCoverageAmount.toFixed(2));
  }

  // Step 6: Check refund or inconvenience fee
  const currentStartCurrentTimeHoursDiff = getDurationHours(utcCurrentTime?.formattedTimeDayObj, dayjs(currentPickupTime));
  // const oldPickup = dayjs(currentPickupTime);
  const paramsGetRefundOrPenalty: TParamsGetRefundOrPenalty = {
    ...paramsGetUpcomingDurationPrice,
    generatedDates,
    updatedBillingDetails,
    // oldDurationHours: updatedTravelData?.totalDurationHours,
    // oldDurationHours: currentDateTime.diff(pickupTime, 'hour'),
    oldDurationHours: currentStartCurrentTimeHoursDiff,
    newDurationHours,
    paidPrice: updatedTravelData?.basePrice?.totalPrice,
    newDurationPrice: tempDurationPrice ?? 0,
  };
  // console.log('CurrentTimeHours', currentStartCurrentTimeHoursDiff);
  // Step 7: Calculate gst amount
  updatedBillingDetails.newTotalWithoutCoverage = tempTotalPrice;
  //const tempGstAmount = parseFloat(((tempTotalPrice + updatedBillingDetails.newCoverageAmount) * (10 / 100))?.toFixed(2));//need later implementation
  const tempGstAmount = 0; //gstAmount amount change if not calculated
  updatedBillingDetails.newGstAmount = tempGstAmount;
  const paidAmount = calculatePaidAmount(basePrice, additionalPaymentInfo);
  const diffMin = dayjsUtc(currentPickupTime).diff(utcCurrentTime?.formattedTimeDayObj, 'minute');
  const isCurrentTravel = dayjs(currentPickupTime).isSame(dayjs(pickupTime)) && diffMin <= 120 && currentStartCurrentTimeHoursDiff <= 48;
  if (isCurrentTravel) {
    updatedBillingDetails = await handleCurrentTravelBillingUpdate({
      currentPickupTime,
      returnTime,
      currentReturnTime,
      basePrice,
      travelBasePrice: basePrice,
      vehicleDeliveryFee,
      vehicleReturnFee,
      totalPaidAmount,
      totalReturnedAmount,
      updatedBillingDetails,
      additionalPaymentInfo,
      tempGstAmount,
      paidAmount,
      peakIncrease,
      updatedTravelData,
      isDurationReduced: false,
    });
    return updatedBillingDetails;
  }
  if (currentStartCurrentTimeHoursDiff <= 48) {
    updatedBillingDetails = await getRefundOrPenaltyUpdated(paramsGetRefundOrPenalty);
  }
  // updatedBillingDetails = await getRefundOrPenalty(paramsGetRefundOrPenalty);
  updatedBillingDetails.newTotalPrice = parseFloat(
    (updatedBillingDetails.newTotalPrice + updatedBillingDetails.newCoverageAmount + tempGstAmount)?.toFixed(2)
  );
  // Step 7: check payable amount
  updatedBillingDetails = await updatePayableAmount(paidAmount, updatedBillingDetails, updatedTravelData); //modify voucher added
  // console.log(updatedBillingDetails);

  return updatedBillingDetails; //exclude oldAdvBookingDis for upcoming
};

export const handleTravelEditPreviousConsider = async (
  pickupTime: TDate,
  returnTime: TDate,
  currentPickupTime: TDate,
  currentReturnTime: TDate,
  carData: CarDataState,
  travelDetails: TravelDetailsState,
  updatedTravelData: TUpdatedTravelData
) => {
  const {
    dailyRates,
    hourlyRates,
    customPricing,
    peakIncrease,
    longBookingDiscounts,
    advanceBookingDiscounts,
    longBookingDiscountActive = true,
    advanceBookingDiscountActive = true,
  } = carData?.rates;
  //Destruct Travel Details rate
  const { reservationInfo } = travelDetails;
  const { additionalDistanceFeePerKm, insurance } = reservationInfo;
  //Destruct Updated Travel Data
  const {
    basePrice,
    serviceFeePercentage = 0,
    additionalPaymentInfo = {},
    vehicleDeliveryFee,
    vehicleReturnFee,
    totalPaidAmount,
    totalReturnedAmount,
    discounts,
  } = updatedTravelData;
  const { dailyPrice, hourlyPrice, customPrices, durationPrice } = basePrice;

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
    storedDailyPrice: dailyPrice,
    storedHourlyPrice: hourlyPrice,
    storedCustomPricing: customPrices ?? [],
    currentDailyPrice: dailyRates?.amount,
    currentHourlyPrice: hourlyRates?.amount,
    currentCustomPricing: customPricing,
    peakIncrease,
    generatedDates,
    matchedDates,
  };
  // Step 1: generate date list and calculate total duration price and duration price with peak increase
  const tempDurationPrice = await getUpcomingDurationPrice(paramsGetUpcomingDurationPrice);
  let tempTotalPrice = tempDurationPrice;

  // Step 2: calculate service fee;
  //const serviceFee = parseFloat((tempTotalPrice * (10 / 100))?.toFixed(2));
  const serviceFee = 0; //modify for car rental
  // Step 3: calculate long booking discounts;
  const {
    advanceDiscount,
    longDiscount,
    tempTotalPrice: totalWithDiscount,
  } = await getEditTravelDiscountsConsiderPrevious({
    totalPrice: tempTotalPrice,
    previousDurationPrice: durationPrice,
    pickupDate: pickupTime,
    returnDate: returnTime,
    oldPickupDate: currentPickupTime,
    oldReturnDate: currentReturnTime,
    longBookingDiscounts,
    advanceBookingDiscounts,
    longBookingDiscountActive,
    advanceBookingDiscountActive,
    previousLongDiscount: discounts?.longBookingDiscounts,
  });
  tempTotalPrice = totalWithDiscount;

  // Set billing details
  const newDuration = `${getDurationDayHourMin(dayjs(pickupTime), dayjs(returnTime))} rental`;
  const newDurationHours = getDurationHours(pickupTime, returnTime);
  //exclude oldAdvBookingDis
  // console.log('Show Old Price Data', oldPriceData);
  // console.log(newDuration);
  tempTotalPrice = tempTotalPrice + serviceFee;
  let updatedBillingDetails: any = {
    newDuration,
    newDurationPrice: tempDurationPrice,
    newTotalPrice: tempTotalPrice,
    newServiceFee: serviceFee,
    newStartDate: pickupTime,
    newEndDate: returnTime,
    newCoverageAmount: 0,
    newTotalWithoutCoverage: tempTotalPrice,
    customPrices: customPricing,
    totalDurationHours: newDurationHours,
    dailyPrice: dailyRates?.amount,
    hourlyPrice: hourlyRates?.amount,
    currency: reservationInfo?.basePrice?.currency,
    serviceFeePercentage: serviceFeePercentage,
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

  if (advanceDiscount?.text && advanceBookingDiscountActive) {
    updatedBillingDetails.newAdvBookingDis = { ...advanceDiscount };
  }

  if (additionalDistanceFeePerKm) {
    updatedBillingDetails.additionalDistanceFeePerKm = additionalDistanceFeePerKm;
  }

  // Step 6: Calculate coverage amount
  if (insurance?.guestCoverageType !== 'no-coverage') {
    const coverageAmount = parseFloat(((tempTotalPrice * Number(insurance?.coveragePercentage ?? 0)) / 100).toFixed(2));
    const newCoverageAmount = calculateCoverageAmount(insurance?.guestCoverageType, parseFloat(coverageAmount.toFixed(2)));
    updatedBillingDetails.newCoverageAmount = parseFloat(newCoverageAmount.toFixed(2));
  }

  // Step 6: Check refund or inconvenience fee
  const currentStartCurrentTimeHoursDiff = getDurationHours(utcCurrentTime?.formattedTimeDayObj, dayjs(currentPickupTime));
  // const oldPickup = dayjs(currentPickupTime);
  const paramsGetRefundOrPenalty: TParamsGetRefundOrPenalty = {
    ...paramsGetUpcomingDurationPrice,
    generatedDates,
    updatedBillingDetails,
    // oldDurationHours: updatedTravelData?.totalDurationHours,
    // oldDurationHours: currentDateTime.diff(pickupTime, 'hour'),
    oldDurationHours: currentStartCurrentTimeHoursDiff,
    newDurationHours,
    paidPrice: updatedTravelData?.basePrice?.totalPrice,
    newDurationPrice: tempDurationPrice ?? 0,
  };
  // console.log('CurrentTimeHours', currentStartCurrentTimeHoursDiff);
  // Step 7: Calculate gst amount
  updatedBillingDetails.newTotalWithoutCoverage = tempTotalPrice;
  //const tempGstAmount = parseFloat(((tempTotalPrice + updatedBillingDetails.newCoverageAmount) * (10 / 100))?.toFixed(2));//need later implementation
  const tempGstAmount = 0; //gstAmount amount change if not calculated
  updatedBillingDetails.newGstAmount = tempGstAmount;
  const paidAmount = calculatePaidAmount(basePrice, additionalPaymentInfo);
  const diffMin = dayjsUtc(currentPickupTime).diff(utcCurrentTime?.formattedTimeDayObj, 'minute');
  const isCurrentTravel = dayjs(currentPickupTime).isSame(dayjs(pickupTime)) && diffMin <= 120 && currentStartCurrentTimeHoursDiff <= 48;
  if (isCurrentTravel) {
    updatedBillingDetails = await handleCurrentTravelBillingUpdate({
      currentPickupTime,
      returnTime,
      currentReturnTime,
      basePrice,
      travelBasePrice: basePrice,
      vehicleDeliveryFee,
      vehicleReturnFee,
      totalPaidAmount,
      totalReturnedAmount,
      updatedBillingDetails,
      additionalPaymentInfo,
      tempGstAmount,
      paidAmount,
      peakIncrease,
      updatedTravelData,
      isDurationReduced: false,
    });
    return updatedBillingDetails;
  }
  if (currentStartCurrentTimeHoursDiff <= 48) {
    updatedBillingDetails = await getRefundOrPenaltyUpdated(paramsGetRefundOrPenalty);
  }
  // updatedBillingDetails = await getRefundOrPenalty(paramsGetRefundOrPenalty);
  updatedBillingDetails.newTotalPrice = parseFloat(
    (updatedBillingDetails.newTotalPrice + updatedBillingDetails.newCoverageAmount + tempGstAmount)?.toFixed(2)
  );
  // Step 7: check payable amount
  updatedBillingDetails = await updatePayableAmount(paidAmount, updatedBillingDetails, updatedTravelData); //modify voucher added
  // console.log(updatedBillingDetails);

  return updatedBillingDetails; //exclude oldAdvBookingDis for upcoming
};
