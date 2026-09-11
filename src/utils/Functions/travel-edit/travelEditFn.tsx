import { TPeakIncreasePrice } from '@/context/SearchProvider';
import { CarDataState } from '@/types/car-listing/carListingTypes';
import { CarDataPeakIncrease } from '@/types/car-listing/carPricingTypes';
import { EPriceAdjustment, TDate } from '@/types/commonTypes';
import { TUpdatedTravelData } from '@/types/travels/typeEditTravels';
import { ReservationGuestInsurance, TAdditionalPaymentInfo, TBasePrice, TPriceAdjustment, TravelDetailsState } from '@/types/travels/typeTravels';
import {
  CustomPricing,
  ICustomPricing,
  IndividualPricing,
  PeakIncreaseType,
  ReservationPriceListType,
  TParamsGetRefundOrPenalty,
  TParamsGetUpcomingDurationPrice,
  TPeakIncreasedDates,
} from '@/types/user-profile/customPriceTypes';
import { TVoucherValidateRequest } from '@/types/voucher-promotion/voucherTypes';
import { differenceInDays } from 'date-fns';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Dispatch, SetStateAction } from 'react';
import { generateRateChange } from '../advancedCalenderFn';
import { getDurationDayHourMin, getDurationHours } from '../dateTimeCommonFn';
import { calculateWithPrecision, compareValuesWithDetails, parseFloatWithPrecision } from '../lodashHelperFn';
import { calculatePeakIncreasePrice, getDatesInRange, isDayOfWeekInRange } from '../reservationValidationFn';
import { calculateCoverageAmount } from '../transactionCommonFn';
import { convertDateToUtc, dayjsUtc, getPickerTimeStringInUtc } from '../utcCommonFn';
import { calculateNewDurationPrice } from '../vehiclePriceUpdateFn';
import { checkVoucherValidity } from '../voucher/voucherRulesFn';
import { getEditTravelDiscountNew } from './travelDiscountFn';
import { getRefundOrPenaltyUpdated, handleCurrentTravelBillingUpdate } from './travelPenaltyFn';
dayjs.extend(isBetween);

const getTravelEditPriceList = async (
  pickupDateTime: TDate,
  returnDateTime: TDate,
  defaultDailyPrice: number,
  defaultHourlyPrice: number,
  customPricing: CustomPricing[],
  peakIncreaseList: PeakIncreaseType[],
  storedPickupDate: TDate,
  storedReturnDate: TDate,
  storedDailyPrice: number,
  storedHourlyPrice: number,
  storedCustomPricing: CustomPricing[],
  setReservationCustomPriceList?: Dispatch<SetStateAction<ICustomPricing[]>>,
  peakIncreasedDates?: TPeakIncreasedDates[]
): Promise<ReservationPriceListType[]> => {
  const reservationPriceList: ReservationPriceListType[] = [];
  const tempReservationCustomPriceList: ICustomPricing[] = [];
  // Determine the range for stored prices
  // const dayBeforePickup = dayjsUtc(storedPickupDate).subtract(1, 'day');
  const dayBeforePickup = dayjsUtc(storedPickupDate);
  // console.log('dayBeforePickup', dayBeforePickup);
  const dayAfterReturn = dayjsUtc(storedReturnDate).subtract(1, 'day');
  // Convert pickup and return dates to dayjs objects
  const pickupDate = dayjsUtc(pickupDateTime);
  const returnDate = dayjsUtc(returnDateTime);
  let currentDate = pickupDate;
  while (currentDate.isBefore(returnDate, 'day') || currentDate.isSame(returnDate, 'day')) {
    let dailyPrice = defaultDailyPrice;
    let hourlyPrice = defaultHourlyPrice;
    let rateDailyChange = 'ND';
    let rateHourlyChange = 'NH';
    let dailyDiff = 0;
    let hourlyDiff = 0;
    // Check if the current date is within the stored pickup and return dates
    if (currentDate.isBetween(dayBeforePickup, dayAfterReturn, 'day', '[]')) {
      dailyPrice = storedDailyPrice;
      hourlyPrice = storedHourlyPrice;
      customPricing = storedCustomPricing;
    }
    // Check if the current date matches any date in custom pricing
    const matchedCustomPrice = (customPricing || []).find((customPrice) => {
      const customPriceDate = dayjs(customPrice.date);
      return currentDate.isSame(customPriceDate, 'day');
    });

    if (matchedCustomPrice) {
      const rateChangeResult = generateRateChange(
        defaultDailyPrice,
        matchedCustomPrice?.updatedDailyRates,
        defaultHourlyPrice,
        matchedCustomPrice?.updatedHourlyRates
      );
      dailyPrice = matchedCustomPrice?.updatedDailyRates || defaultDailyPrice;
      hourlyPrice = matchedCustomPrice?.updatedHourlyRates || defaultHourlyPrice;
      rateDailyChange = rateChangeResult?.rateDailyChange || 'ND';
      rateHourlyChange = rateChangeResult?.rateHourlyChange || 'NH';
      dailyDiff = rateChangeResult?.dailyDiff || 0;
      hourlyDiff = rateChangeResult?.hourlyDiff || 0;

      // Create custom price list to save to DB
      const utcDate = convertDateToUtc(currentDate);
      tempReservationCustomPriceList.push({
        date: utcDate?.formattedDateString,
        dailyRates: defaultDailyPrice,
        hourlyRates: defaultHourlyPrice,
        updatedDailyRates: matchedCustomPrice?.updatedDailyRates,
        updatedHourlyRates: matchedCustomPrice?.updatedHourlyRates,
      });
    } else {
      // const matchedPeakIncreaseDate = (peakIncreasedDates || []).find((peakDate) => dayjs(peakDate.reservationDate).isSame(currentDate, 'day'));
      const matchedPeakIncreaseDate = (peakIncreasedDates || []).find(
        (peakDate) =>
          dayjsUtc(peakDate.reservationDate).isSame(currentDate, 'day') && dayjsUtc(currentDate).isBefore(dayjsUtc(storedReturnDate), 'day')
      );
      if (matchedPeakIncreaseDate) {
        dailyPrice = matchedPeakIncreaseDate?.dailyPrice;
        hourlyPrice = matchedPeakIncreaseDate?.hourlyPrice;
      } else {
        // Apply peak increase if applicable
        const currentDayOfWeek = currentDate.format('ddd').toLowerCase();
        const peakIncrease = (peakIncreaseList || []).find((peak) => peak.dayOfWeek === currentDayOfWeek);
        if (peakIncrease) {
          if (peakIncrease.increaseType === 'percentage') {
            dailyPrice += dailyPrice * (peakIncrease?.percentage! / 100);
            hourlyPrice += hourlyPrice * (peakIncrease?.percentage! / 100);
          } else if (peakIncrease.increaseType === 'amount') {
            dailyPrice += peakIncrease?.amount!;
            hourlyPrice += peakIncrease?.amount!;
          }
        }

        const rateChangeResult = generateRateChange(defaultDailyPrice, dailyPrice, defaultHourlyPrice, hourlyPrice);
        rateDailyChange = rateChangeResult?.rateDailyChange || 'ND';
        rateHourlyChange = rateChangeResult?.rateHourlyChange || 'NH';
        dailyDiff = rateChangeResult?.dailyDiff || 0;
        hourlyDiff = rateChangeResult?.hourlyDiff || 0;
      }
    }

    reservationPriceList.push({
      date: currentDate.toDate(),
      dailyPrice: parseFloat(dailyPrice.toFixed(2)),
      hourlyPrice: parseFloat(hourlyPrice.toFixed(2)),
      rateDailyChange,
      rateHourlyChange,
      dailyDiff: parseFloat(dailyDiff.toFixed(2)),
      hourlyDiff: parseFloat(hourlyDiff.toFixed(2)),
    });

    currentDate = currentDate.add(1, 'day');
  }

  if (setReservationCustomPriceList) {
    setReservationCustomPriceList(tempReservationCustomPriceList);
  }

  return reservationPriceList;
};

const calculateTravelDurationPrice = async (
  pickupDateTime: TDate,
  returnDateTime: TDate,
  reservationPriceList: ReservationPriceListType[]
): Promise<{ tempDurationPrice: number; individualPrices: IndividualPricing[] }> => {
  const pickupDate = dayjsUtc(pickupDateTime);
  const returnDate = dayjsUtc(returnDateTime);
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
  const { tempDurationPrice, individualPrices } = await calculateNewDurationPrice(
    timeDiffDays,
    remainingHours,
    remainingMinutes,
    reservationPriceList
  );
  return { tempDurationPrice, individualPrices };
};

const getDurationPrice = async (
  paramsGetUpcomingDurationPrice: TParamsGetUpcomingDurationPrice,
  setIndividualPriceList: Dispatch<SetStateAction<IndividualPricing[]>>
): Promise<number> => {
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
    peakIncreasedDates,
  } = paramsGetUpcomingDurationPrice;
  const reservationPriceList = await getTravelEditPriceList(
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
    storedCustomPricing,
    undefined,
    peakIncreasedDates
  );
  // console.log('reservation Price List', reservationPriceList);
  const { tempDurationPrice: totalDurationPrice, individualPrices } = await calculateTravelDurationPrice(
    pickupTime,
    returnTime,
    reservationPriceList
  );
  setIndividualPriceList(individualPrices);
  return parseFloatWithPrecision(totalDurationPrice);
};

//# Step 1: Function to generate Date wise Duration Price
const generateDurationPrice = async ({
  pickupTime,
  returnTime,
  currentPickupTime,
  currentReturnTime,
  paramsGetUpcomingDurationPrice,
  setIndividualPriceList,
}: {
  pickupTime: TDate;
  returnTime: TDate;
  currentPickupTime: TDate;
  currentReturnTime: TDate;
  paramsGetUpcomingDurationPrice: TParamsGetUpcomingDurationPrice;
  setIndividualPriceList: Dispatch<SetStateAction<IndividualPricing[]>>;
}) => {
  // Generate dates in the range
  const generatedDates = await getDatesInRange(pickupTime, returnTime);

  // Filter matched dates
  const matchedDates = generatedDates?.filter((date) => {
    const currentDate = dayjs(date?.date);
    const isDateBetween = dayjs(currentDate).isBetween(dayjs(currentPickupTime), dayjs(currentReturnTime), 'day', '[]');
    return isDateBetween;
  });
  const updatedParams = {
    ...paramsGetUpcomingDurationPrice,
    generatedDates,
    matchedDates,
  };
  // Calculate total duration price and duration price with peak increase
  const tempDurationPrice = await getDurationPrice(updatedParams, setIndividualPriceList);

  return { tempDurationPrice, generatedDates, matchedDates };
};

//# Step 2: Function to calculate service fee
const calculateServiceFee = (tempTotalPrice: number, serviceFeePercentage: number = 10): number => {
  const serviceFee = tempTotalPrice * (serviceFeePercentage / 100);
  return parseFloatWithPrecision(serviceFee);
};

//~i~ Function to calculate set peak increase
const calculateAndSetPeakIncreasePrice = async (
  pickupTime: TDate,
  returnTime: TDate,
  peakIncrease: CarDataPeakIncrease[],
  dailyRate: number,
  tempTotalPrice: number
): Promise<TPeakIncreasePrice | null> => {
  const peakIncList = await isDayOfWeekInRange(pickupTime, returnTime, peakIncrease);

  if (peakIncList?.length > 0) {
    const peakDays = peakIncList.map((day) => day?.dayOfWeek);
    const { incPrice } = await calculatePeakIncreasePrice(dailyRate, tempTotalPrice, peakIncList);

    return {
      increaseDays: peakDays,
      increaseType: peakIncList[0]?.increaseType,
      increaseAmount: peakIncList[0]?.percentage || peakIncList[0]?.amount,
      calculatedAmount: incPrice,
    };
  }
  return null;
};
//# Step 4: Function to calculate coverage amount
export const calculateAndSetCoverageAmount = (tempTotalPrice: number, insurance: ReservationGuestInsurance): number | null => {
  if (insurance?.guestCoverageType !== 'no-coverage') {
    const coverageAmount = (tempTotalPrice * Number(insurance?.coveragePercentage ?? 0)) / 100;
    const newCoverageAmount = calculateCoverageAmount(insurance?.guestCoverageType, parseFloatWithPrecision(coverageAmount));
    return parseFloatWithPrecision(newCoverageAmount);
  }

  return null; // Return null if no coverage is applicable
};
//# Step 6: Function to calculate gst amount
const calculateGstAmount = (totalPrice: number, coverageAmount: number, gstRate: number = 10): number => {
  const gstAmount = (totalPrice + coverageAmount) * (gstRate / 100);
  return parseFloat(gstAmount.toFixed(2));
};
//# Step 7: Function to calculate payable or refundable
export const updatePayableAmount = async (
  oldTotal: number,
  updatedBillingDetails: any,
  updatedTravelData: TUpdatedTravelData,
  isDurationReduced?: boolean,
  isVoucherValid?: boolean
) => {
  const newTotal = updatedBillingDetails?.newTotalPrice;
  if (oldTotal === newTotal) {
    updatedBillingDetails.paidText = 'There is no change in payment.';
  }
  if (oldTotal < newTotal) {
    const rawPayableAmount = parseFloat((newTotal - oldTotal)?.toFixed(2));
    let voucherAmountUsed = isVoucherValid ? parseFloatWithPrecision(updatedTravelData?.additionalPaymentInfo?.voucherAmountUsed ?? 0) : 0;
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
  }
  const oldVoucher = updatedTravelData?.additionalPaymentInfo?.voucherAmountUsed ?? 0;
  const newVoucher = updatedBillingDetails?.additionalPaymentInfo?.voucherAmountUsed ?? 0;
  // New condition: If new duration is less than old and still has a payable amount
  if (oldVoucher > 0 && newVoucher <= 0 && (updatedBillingDetails?.penaltyPrice ?? 0) <= 0) {
    return updatedBillingDetails;
  } else {
    if (isDurationReduced && updatedBillingDetails.payableAmount > 0) {
      updatedBillingDetails.paidText = `Thank you for updating the time. Please note that no refund will be issued, as the total price exceeds your paid amount. However, you will not be required to pay the excess amount, as $${parseFloatWithPrecision(
        updatedBillingDetails.payableAmount
      )} has been waived.`;
      updatedBillingDetails.waivedPayableAmount = updatedBillingDetails.payableAmount;
      updatedBillingDetails.payableAmount = 0;
    }
  }
  return updatedBillingDetails;
};

//~i~ Generate Paid Amount
export const calculatePaidAmount = (basePrice: TBasePrice, additionalPaymentInfo?: TAdditionalPaymentInfo): number => {
  const { priceAdjustment, totalPrice } = basePrice;
  const adjustmentAmount = priceAdjustment?.amount ?? 0;
  const travelPaidAmount = totalPrice - (additionalPaymentInfo?.voucherAmountUsed ?? 0);
  const adjustmentPaidAmount =
    adjustmentAmount > 0
      ? priceAdjustment?.adjustmentType === EPriceAdjustment.Increase
        ? travelPaidAmount + adjustmentAmount
        : travelPaidAmount - adjustmentAmount
      : travelPaidAmount;

  return parseFloatWithPrecision(adjustmentPaidAmount);
};

export const handleTravelEdit = async (
  pickupTime: TDate,
  returnTime: TDate,
  currentPickupTime: TDate,
  currentReturnTime: TDate,
  carData: CarDataState,
  travelDetails: TravelDetailsState,
  updatedTravelData: TUpdatedTravelData,
  setIndividualPriceList: Dispatch<SetStateAction<IndividualPricing[]>>,
  peakIncreasedDates: TPeakIncreasedDates[] = []
) => {
  //Destruct Car Data rate
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
  const { additionalDistanceFeePerKm, insurance, basePrice: travelBasePrice, voucherInfo } = reservationInfo;
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
  const { dailyPrice, hourlyPrice, customPrices, currency } = travelBasePrice ?? {}; //!modified last updated price to initial price
  const { durationPrice, priceAdjustment, penaltyPrice = 0 } = basePrice;
  const { longBookingDiscounts: previousLongDiscount, customLongDiscountAmount } = discounts ?? {};

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
    peakIncreasedDates,
  };
  //~i~ Step 1: generate date list and calculate total duration price and duration price with peak increase

  const { tempDurationPrice, generatedDates, matchedDates } = await generateDurationPrice({
    pickupTime,
    returnTime,
    currentPickupTime,
    currentReturnTime,
    paramsGetUpcomingDurationPrice,
    setIndividualPriceList,
  });
  let tempTotalPrice = tempDurationPrice;

  //~i~ Step 2: calculate service fee;
  //const serviceFee = calculateServiceFee(tempTotalPrice, serviceFeePercentage);
  const serviceFee = 0; //modify for car rental

  //~i~ Step 3: calculate long booking discounts; (travelDiscountFn.tsx)
  const hasVoucher = (additionalPaymentInfo?.voucherAmountUsed ?? 0) > 0;
  //console.log('previousLongDiscount', previousLongDiscount);
  const {
    longDiscount,
    tempTotalPrice: totalWithDiscount,
    longDiscountToolTip,
    discountsInfo,
    nextLongDiscount,
    previousDiscountAmount,
  } = await getEditTravelDiscountNew({
    totalPrice: tempTotalPrice,
    previousDurationPrice: durationPrice,
    pickupDate: pickupTime,
    returnDate: returnTime,
    oldPickupDate: currentPickupTime,
    oldReturnDate: currentReturnTime,
    longBookingDiscounts,
    longBookingDiscountActive,
    hasVoucher,
    previousLongDiscount,
    customLongDiscountAmount,
  });

  tempTotalPrice = totalWithDiscount;

  //~i~ Set billing details
  const newReservationDuration = getDurationDayHourMin(dayjs(pickupTime), dayjs(returnTime));
  const newDuration = `${newReservationDuration} rental`;
  const newDurationHours = getDurationHours(pickupTime, returnTime);

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
    currency: currency,
    serviceFeePercentage: serviceFeePercentage,
  };

  //~i~ set calculate peak increased amount
  const tempPeakIncPrice = await calculateAndSetPeakIncreasePrice(pickupTime, returnTime, peakIncrease, dailyRates?.amount, tempTotalPrice);
  if (tempPeakIncPrice) {
    updatedBillingDetails.newPeakIncPrice = tempPeakIncPrice;
  }

  //~i~ set previous long booking
  if ((previousDiscountAmount ?? 0) > 0) {
    updatedBillingDetails.previousLongBookingDiscount = previousDiscountAmount;
  }
  //~i~ set long discount
  if (longDiscount?.text && longBookingDiscountActive) {
    updatedBillingDetails.newLongBookingDis = { ...longDiscount };
    updatedBillingDetails.longDiscountToolTip = longDiscountToolTip;
  }
  //~i~ set nextLong discount
  if (!!nextLongDiscount?.text) {
    updatedBillingDetails.nextLongBookingDis = { ...nextLongDiscount };
  }

  //~i~ set advance discount
  // if (advanceDiscount?.text && advanceBookingDiscountActive) {
  //   updatedBillingDetails.newAdvBookingDis = { ...advanceDiscount };
  //   updatedBillingDetails.advanceDiscountToolTip = advDiscountToolTip;
  // }
  //~i~ set discount info
  if (longDiscount?.text && discountsInfo) {
    updatedBillingDetails.discountsInfo = discountsInfo;
  }

  //~i~ set additional distance fee
  if (additionalDistanceFeePerKm) {
    updatedBillingDetails.additionalDistanceFeePerKm = additionalDistanceFeePerKm;
  }

  //~i~ Step 4: Calculate coverage amount
  const coverageAmount = calculateAndSetCoverageAmount(tempTotalPrice, insurance);
  if (coverageAmount !== null) {
    updatedBillingDetails.newCoverageAmount = coverageAmount;
  }

  //~i~ Step 5: Check refund or inconvenience fee (travelPenaltyFn.tsx)
  const { formattedTimeDayObj: currentDateTime } = getPickerTimeStringInUtc(dayjs());
  const isCurrentTimePassPickupDate =
    dayjs(currentDateTime).isAfter(dayjs(currentPickupTime)) || dayjs(currentDateTime).isSame(dayjs(currentPickupTime));
  const currentStartCurrentTimeHoursDiff = isCurrentTimePassPickupDate
    ? getDurationHours(currentDateTime, dayjs(returnTime))
    : getDurationHours(currentDateTime, dayjs(currentPickupTime));
  const paramsGetRefundOrPenalty: TParamsGetRefundOrPenalty = {
    ...paramsGetUpcomingDurationPrice,
    generatedDates,
    matchedDates,
    updatedBillingDetails,
    oldDurationHours: currentStartCurrentTimeHoursDiff,
    newDurationHours,
    paidPrice: updatedTravelData?.basePrice?.totalPrice,
    newDurationPrice: tempDurationPrice ?? 0,
  };

  updatedBillingDetails.newTotalWithoutCoverage = tempTotalPrice;

  //~i~ Step 6: Calculate gst amount
  // const tempGstAmount = calculateGstAmount(tempTotalPrice, coverageAmount);
  const tempGstAmount = 0; //gstAmount amount change if not calculated
  updatedBillingDetails.newGstAmount = tempGstAmount;
  let isVoucherValid = (additionalPaymentInfo?.voucherAmountUsed ?? 0) > 0;
  //  console.log('Total Amount', updatedBillingDetails?.newTotalPrice);
  const checkVoucherValidityParams: TVoucherValidateRequest = {
    totalAmount: updatedBillingDetails?.newTotalPrice ?? 0,
    additionalData: {
      carListingId: carData?.listingId ?? '',
      reservationDuration: Math.ceil(differenceInDays(dayjsUtc(returnTime).toDate(), dayjsUtc(pickupTime).toDate())),
      travelStartDate: pickupTime,
      travelEndDate: returnTime,
      carRates: carData?.rates,
      carType: carData?.car?.carType,
    },
    voucherInfo: voucherInfo,
  };

  if (isVoucherValid) {
    isVoucherValid = await checkVoucherValidity(checkVoucherValidityParams);
  }

  //~i~ Get Paid Amount
  const paidAmount = calculatePaidAmount(basePrice, additionalPaymentInfo);
  const diffMin = dayjsUtc(currentPickupTime).diff(currentDateTime, 'minute');
  const isCurrentTravel = dayjs(currentPickupTime).isSame(dayjs(pickupTime)) && diffMin <= 120 && currentStartCurrentTimeHoursDiff <= 48;
  const durationResult = getDurationsComparison(pickupTime, returnTime, currentPickupTime, currentReturnTime);
  const isDurationReduced = durationResult === 'L';
  if (isCurrentTravel) {
    updatedBillingDetails = await handleCurrentTravelBillingUpdate({
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
      additionalPaymentInfo,
      tempGstAmount,
      paidAmount,
      peakIncrease,
      updatedTravelData,
      isDurationReduced,
      previousPenaltyPrice: penaltyPrice,
      isVoucherValid,
    });
    return updatedBillingDetails;
  }
  if (currentStartCurrentTimeHoursDiff <= 48) {
    updatedBillingDetails = await getRefundOrPenaltyUpdated(paramsGetRefundOrPenalty);
  }
  // updatedBillingDetails.newTotalPrice = parseFloat(
  //   (updatedBillingDetails.newTotalPrice + updatedBillingDetails.newCoverageAmount + tempGstAmount)?.toFixed(2)
  // );
  if (penaltyPrice > 0) {
    updatedBillingDetails.previousPenaltyPrice = penaltyPrice;
  }
  const totalPriceWithoutAdjustment = parseFloatWithPrecision(
    updatedBillingDetails.newTotalPrice + updatedBillingDetails.newCoverageAmount + tempGstAmount + penaltyPrice
  );
  //~i Step 7: check payable amount
  //updatedBillingDetails = await updatePayableAmount(paidAmount, updatedBillingDetails, updatedTravelData, isDurationReduced); //modify voucher added
  //~i~ Step 7: Check Adjustment Price
  if (priceAdjustment) {
    const { updatedPriceAdjustment } = applyPriceAdjustment(priceAdjustment, totalPriceWithoutAdjustment);
    updatedBillingDetails.priceAdjustment = updatedPriceAdjustment;
    //tempTotalPrice = adjustedTotalPrice;
  }
  updatedBillingDetails.newTotalPrice = calculateWithPrecision(
    updatedBillingDetails?.priceAdjustment?.adjustmentType === EPriceAdjustment.Decrease ? 'subtract' : 'add',
    [totalPriceWithoutAdjustment, updatedBillingDetails?.priceAdjustment?.amount]
  );
  //~i~ Step 8: check payable amount
  updatedBillingDetails = await updatePayableAmount(paidAmount, updatedBillingDetails, updatedTravelData, isDurationReduced, isVoucherValid); //modify voucher added

  return updatedBillingDetails;
};

export const getDurationsComparison = (newPickupTime: TDate, newReturnTime: TDate, oldPickupTime: TDate, oldReturnTime: TDate): string => {
  const newDurationMs = dayjs(newReturnTime).valueOf() - dayjs(newPickupTime).valueOf();
  const oldDurationMs = dayjs(oldReturnTime).valueOf() - dayjs(oldPickupTime).valueOf();
  const { result } = compareValuesWithDetails(newDurationMs, oldDurationMs);
  return result;
};

export const applyPriceAdjustment = (
  priceAdjustment: TPriceAdjustment,
  tempTotalPrice: number
): {
  adjustedTotalPrice: number;
  updatedPriceAdjustment?: TPriceAdjustment;
} => {
  let adjustmentAmount = priceAdjustment.amount;
  const adjustmentType = priceAdjustment.adjustmentType;
  // For 'decrease', ensure the adjustment amount is capped to not exceed the current total price
  if (adjustmentType === EPriceAdjustment.Decrease) {
    // const amountConsider = Math.min(adjustmentAmount, tempTotalPrice);
    // adjustmentAmount = parseFloatWithPrecision(amountConsider);
    adjustmentAmount = adjustmentAmount >= tempTotalPrice ? 0 : parseFloatWithPrecision(adjustmentAmount);
  }
  // Calculate the new total price based on the adjustment type (increase or decrease)
  const newTotalPrice = calculateWithPrecision(adjustmentType === EPriceAdjustment.Decrease ? 'subtract' : 'add', [tempTotalPrice, adjustmentAmount]);
  const updatedPriceAdjustment = adjustmentType === EPriceAdjustment.Decrease && adjustmentAmount === 0 ? undefined : priceAdjustment;
  // Return the updated total price and the modified price adjustment (if it's a decrease)
  return {
    adjustedTotalPrice: newTotalPrice,
    // updatedPriceAdjustment: adjustmentType === EPriceAdjustment.Decrease ? { ...priceAdjustment, amount: adjustmentAmount } : priceAdjustment,
    updatedPriceAdjustment: updatedPriceAdjustment,
  };
};
