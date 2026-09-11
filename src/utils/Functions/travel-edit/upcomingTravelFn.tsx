import { TPeakIncreasePrice } from '@/context/SearchProvider';
import { EPriceAdjustment, TDate } from '@/types/commonTypes';
import { TBillingDetails, TUpdatedTravelData } from '@/types/travels/typeEditTravels';
import {
  CustomPricing,
  ICustomPricing,
  IndividualPricing,
  PeakIncreaseType,
  ReservationPriceListType,
  TParamsGetRefundOrPenalty,
  TParamsGetUpcomingDurationPrice,
} from '@/types/user-profile/customPriceTypes';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Dispatch, SetStateAction } from 'react';
import { generateRateChange } from '../advancedCalenderFn';
import { getDurationDayHourMin, getDurationHours, getRoundUpStartTime } from '../dateTimeCommonFn';
import { calculatePeakIncreasePrice, isDayOfWeekInRange } from '../reservationValidationFn';
import { calculateCoverageAmount } from '../transactionCommonFn';
import { convertDateToUtc, dayjsUtc, utcCurrentTime } from '../utcCommonFn';
import { calculateNewDurationPrice, getDatesInRange, getReservationPriceList } from '../vehiclePriceUpdateFn';
import { calculateEditDurationPrice, getAllDuration, getEditTravelDiscounts, updatePayableAmount } from './currentTravelFn';
dayjs.extend(isBetween);
export const handleDateTimeValidation = (pickupTime: Dayjs, returnTime: Dayjs, setAvailabilityErrorText: Dispatch<SetStateAction<string>>) => {
  let isValid = true;
  const updatedPickup = pickupTime?.second(0).millisecond(0);
  const updatedReturn = returnTime?.second(0).millisecond(0);
  const minuteDiff = updatedReturn.diff(updatedPickup, 'minute');
  const isReturnBeforePickup = updatedReturn.isBefore(updatedPickup, 'minute');
  const isPickupReturnSame = updatedReturn.isSame(updatedPickup, 'minute');
  const minimumPickupTime = dayjs(getRoundUpStartTime(15)).second(0).millisecond(0); //set minimum pickup time
  const isPickupPast = updatedPickup.isBefore(minimumPickupTime, 'minute');

  if (isPickupPast) {
    setAvailabilityErrorText('Pickup time must has to be 15 minutes after current time');
    isValid = false;
    return isValid;
  }

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

export const handleUpcomingTravelEdit = async (
  pickupTime: TDate,
  returnTime: TDate,
  currentPickupTime: TDate,
  currentReturnTime: TDate,
  carData: any,
  travelDetails: any,
  updatedTravelData: TUpdatedTravelData,
  getPreviousReservationData: (travelDetails: any) => Promise<any>,
  setBillingDetails: Dispatch<SetStateAction<TBillingDetails>>,
  setIndividualPriceList: Dispatch<SetStateAction<IndividualPricing[]>>
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

  // Step 2: calculate service fee;
  //const serviceFee = parseFloat((tempTotalPrice * (10 / 100))?.toFixed(2));
  const serviceFee = 0; //modify for car rental
  // Step 3: calculate long booking discounts;
  const {
    advanceDiscount,
    longDiscount,
    nextLongDiscount,
    tempTotalPrice: totalWithDiscount,
  } = await getEditTravelDiscounts({
    longBookingDiscounts,
    pickupDate: pickupTime,
    returnDate: returnTime,
    totalPrice: tempTotalPrice,
    advanceBookingDiscounts,
    longBookingDiscountActive,
    advanceBookingDiscountActive,
  });
  tempTotalPrice = totalWithDiscount;

  // Set billing details
  const newDuration = `${getDurationDayHourMin(dayjs(pickupTime), dayjs(returnTime))} rental`;
  const newDurationHours = getDurationHours(pickupTime, returnTime);
  const oldPriceData = await getPreviousReservationData(updatedTravelData);
  //exclude oldAdvBookingDis
  const { oldAdvBookingDis, ...oldPriceDataWithoutAdvBookingDis } = oldPriceData;
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
    currency: travelDetails?.reservationInfo?.basePrice?.currency,
    serviceFeePercentage: updatedTravelData?.serviceFeePercentage,
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
    // console.log('Advance Booking Text', advanceDiscount);
  }

  if (travelDetails?.reservationInfo?.additionalDistanceFeePerKm) {
    updatedBillingDetails.additionalDistanceFeePerKm = travelDetails?.reservationInfo?.additionalDistanceFeePerKm;
  }

  // Step 6: Calculate coverage amount
  if (travelDetails?.reservationInfo?.insurance?.guestCoverageType !== 'no-coverage') {
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
    newDurationPrice: tempDurationPrice,
  };
  // console.log('CurrentTimeHours', currentStartCurrentTimeHoursDiff);
  // Step 7: Calculate gst amount
  updatedBillingDetails.newTotalWithoutCoverage = tempTotalPrice;
  //const tempGstAmount = parseFloat(((tempTotalPrice + updatedBillingDetails.newCoverageAmount) * (10 / 100))?.toFixed(2));//need later implementation
  const tempGstAmount = 0; //gstAmount amount change if not calculated
  updatedBillingDetails.newGstAmount = tempGstAmount;

  if (currentStartCurrentTimeHoursDiff <= 48) {
    updatedBillingDetails = await getRefundOrPenaltyUpdated(paramsGetRefundOrPenalty);
  }

  // updatedBillingDetails = await getRefundOrPenalty(paramsGetRefundOrPenalty);

  updatedBillingDetails.newTotalPrice = parseFloat(
    // (updatedBillingDetails.newTotalPrice + updatedBillingDetails.newCoverageAmount + tempGstAmount + oldPriceData?.oldDepositAmount)?.toFixed(2)
    (updatedBillingDetails.newTotalPrice + updatedBillingDetails.newCoverageAmount + tempGstAmount)?.toFixed(2)
    // (
    //   updatedBillingDetails.newTotalPrice +
    //   updatedBillingDetails.newCoverageAmount +
    //   tempGstAmount -
    //   (updatedTravelData?.additionalPaymentInfo?.voucherAmountUsed ?? 0)
    // )?.toFixed(2) //modify to add voucher amount
  );

  // const paidAmount = parseFloat(
  //   (updatedTravelData?.basePrice?.totalPrice - (updatedTravelData?.additionalPaymentInfo?.voucherAmountUsed ?? 0))?.toFixed(2)
  // );
  const adjustmentAmount = updatedTravelData?.basePrice?.priceAdjustment?.amount ?? 0;
  const travelPaidAmount = updatedTravelData?.basePrice?.totalPrice - (updatedTravelData?.additionalPaymentInfo?.voucherAmountUsed ?? 0);
  const adjustmentPaidAmount =
    adjustmentAmount > 0
      ? updatedTravelData?.basePrice?.priceAdjustment?.adjustmentType === EPriceAdjustment.Increase
        ? travelPaidAmount + adjustmentAmount
        : travelPaidAmount - adjustmentAmount
      : travelPaidAmount;
  const paidAmount = parseFloat(adjustmentPaidAmount?.toFixed(2));
  // Step 7: check payable amount
  updatedBillingDetails = await updatePayableAmount(paidAmount, updatedBillingDetails, updatedTravelData); //modify voucher added
  // console.log(updatedBillingDetails);

  setBillingDetails({ ...oldPriceDataWithoutAdvBookingDis, ...updatedBillingDetails }); //exclude oldAdvBookingDis for upcoming
};

// export const getRefundOrPenaltyUpdated = async (paramsGetRefundOrPenalty: TParamsGetRefundOrPenalty) => {
//   const {
//     pickupTime,
//     storedDailyPrice,
//     storedHourlyPrice,
//     storedCustomPricing,
//     peakIncrease,
//     currentPickupTime,
//     oldDurationHours,
//     newDurationHours,
//     updatedBillingDetails,
//   } = paramsGetRefundOrPenalty;

//   // let dayOneAmount = 0;
//   // let dayTwoAmount = 0;
//   // if (oldDurationHours >= 48) {
//   //   const after48Hours = dayjs(currentPickupTime).add(48, 'hour');
//   //   const reservationPriceList = await getReservationPriceList(
//   //     currentPickupTime,
//   //     after48Hours,
//   //     storedDailyPrice,
//   //     storedHourlyPrice,
//   //     customPricing,
//   //     peakIncrease
//   //   );
//   //   dayOneAmount = reservationPriceList[0]?.dailyPrice || 0;
//   //   dayTwoAmount = reservationPriceList[1]?.dailyPrice || 0;
//   // } else if (oldDurationHours >= 24) {
//   //   const after24Hours = dayjs(currentPickupTime).add(24, 'hour');
//   //   const reservationPriceList = await getReservationPriceList(
//   //     currentPickupTime,
//   //     after24Hours,
//   //     storedDailyPrice,
//   //     storedHourlyPrice,
//   //     customPricing,
//   //     peakIncrease
//   //   );
//   //   dayOneAmount = reservationPriceList[0]?.dailyPrice || 0;
//   // } else {
//   //   const afterOldDurationHours = dayjs(currentPickupTime).add(oldDurationHours, 'hour');
//   //   const reservationPriceList = await getReservationPriceList(
//   //     currentPickupTime,
//   //     afterOldDurationHours,
//   //     storedDailyPrice,
//   //     storedHourlyPrice,
//   //     customPricing,
//   //     peakIncrease
//   //   );
//   //   dayOneAmount = reservationPriceList[0]?.dailyPrice || 0;
//   // }
//   let dayOneAmount = 0;
//   let dayTwoAmount = 0;
//   // Convert pickup times to Dayjs objects
//   const oldPickup = dayjs(pickupTime);
//   const currentPickup = dayjs(currentPickupTime);
//   // Helper function to get the reservation price list for a given time period
//   const getPriceList = async (start: TDate, end: TDate) => {
//     return await getReservationPriceList(start, end, storedDailyPrice, storedHourlyPrice, storedCustomPricing, peakIncrease);
//   };
//   // Check if the duration between old and current pickup times is within 24 hours
//   if (oldDurationHours <= 24) {
//     if (oldPickup.isSame(currentPickup)) {
//       // If the old and current pickup times are the same
//       const after48Hours = currentPickup.add(48, 'hour');
//       const old48Hours = oldPickup.add(48, 'hour');
//       const newReservationPriceList48 = await getPriceList(currentPickupTime, after48Hours);
//       const oldReservationPriceList48 = await getPriceList(pickupTime, old48Hours);
//       // Calculate the duration details for the 48-hour period
//       const durationDetails48 = getAllDuration(currentPickupTime, after48Hours);
//       const newDurationPrice48 = await calculateNewDurationPrice(
//         durationDetails48?.timeDiffDays,
//         durationDetails48?.remainingHours,
//         durationDetails48?.remainingMinutes,
//         newReservationPriceList48
//       );
//       // Calculate the old price for the 48-hour period
//       const checkingPrice48 = oldReservationPriceList48[0]?.dailyPrice + oldReservationPriceList48[1]?.dailyPrice;
//       if (newDurationPrice48?.tempDurationPrice >= checkingPrice48) {
//         // If the new duration price is greater than or equal to the price for the 48-hour period
//         dayOneAmount = 0;
//         dayTwoAmount = 0;
//       } else {
//         const after24Hours = currentPickup.add(24, 'hour');
//         const old24Hours = oldPickup.add(24, 'hour');
//         const newReservationPriceList24 = await getPriceList(currentPickupTime, after24Hours);
//         const oldReservationPriceList24 = await getPriceList(pickupTime, old24Hours);
//         // Calculate the duration details for the 24-hour period
//         const durationDetails24 = getAllDuration(currentPickupTime, after24Hours);
//         const newDurationPrice24 = await calculateNewDurationPrice(
//           durationDetails24?.timeDiffDays,
//           durationDetails24?.remainingHours,
//           durationDetails24?.remainingMinutes,
//           newReservationPriceList24
//         );
//         // Calculate the old price for the 24-hour period
//         const checkingPrice24 = oldReservationPriceList24[0]?.dailyPrice || 0;
//         if (newDurationPrice24?.tempDurationPrice >= checkingPrice24) {
//           // If the new duration price is greater than or equal to the price for the 24-hour period
//           dayOneAmount = oldReservationPriceList24[0]?.dailyPrice || 0;
//         }
//       }
//     } else if (oldPickup.isBefore(currentPickup)) {
//       // If the old pickup time is before the current pickup time
//       const after48Hours = currentPickup.add(48, 'hour');
//       const newReservationPriceList48 = await getPriceList(currentPickupTime, after48Hours);
//       if (newDurationHours < 24) {
//         // If the new duration is less than 1 day
//         dayOneAmount = newReservationPriceList48[0]?.dailyPrice || 0;
//         dayTwoAmount = newReservationPriceList48[1]?.dailyPrice || 0;
//       } else if (newDurationHours < 48) {
//         // If the new duration is less than 2 days
//         dayOneAmount = newReservationPriceList48[0]?.dailyPrice || 0;
//       } else {
//         dayOneAmount = newReservationPriceList48[0]?.dailyPrice || 0;
//         dayTwoAmount = newReservationPriceList48[1]?.dailyPrice || 0;
//       }
//     } else {
//       const after48Hours = currentPickup.add(48, 'hour');
//       const newReservationPriceList48 = await getPriceList(currentPickupTime, after48Hours);
//       // For other cases, calculate penalty as the sum of the prices for two days
//       dayOneAmount = newReservationPriceList48[0]?.dailyPrice || 0;
//       dayTwoAmount = newReservationPriceList48[1]?.dailyPrice || 0;
//     }
//   } else if (oldDurationHours <= 48) {
//     // If the duration between old and current pickup times is within 48 hours
//     const after48Hours = currentPickup.add(48, 'hour');
//     const reservationPriceList48 = await getPriceList(currentPickupTime, after48Hours);
//     dayOneAmount = reservationPriceList48[0]?.dailyPrice || 0;
//   } else {
//     const afterOldDurationHours = dayjs(currentPickupTime).add(oldDurationHours, 'hour');
//     const reservationPriceList = await getPriceList(currentPickupTime, afterOldDurationHours);
//     // For other cases, calculate penalty as the sum of the prices for two days
//     dayOneAmount = reservationPriceList[0]?.dailyPrice || 0;
//     dayTwoAmount = reservationPriceList[1]?.dailyPrice || 0;
//   }

//   const currentTime = dayjs();
//   const currentStartCurrentTimeHoursDiff = getDurationHours(currentTime, dayjs(currentPickupTime));

//   const newTotal = parseFloat(updatedBillingDetails?.newTotalPrice?.toFixed(2));

//   if (currentStartCurrentTimeHoursDiff > 24) {
//     let penaltyPrice = parseFloat(dayOneAmount?.toFixed(2));
//     let totalWithPenalty = parseFloat((newTotal + penaltyPrice)?.toFixed(2));
//     const { isMinValid, minimumPay } = await isMinimumValid(
//       totalWithPenalty,
//       oldDurationHours,
//       newDurationHours,
//       dayOneAmount,
//       dayOneAmount + dayTwoAmount
//     );
//     // console.log(isMinValid, minimumPay, totalWithPenalty);
//     const tempUpdatedBillingDetails = await handlePenaltyInBillingDetails(
//       isMinValid,
//       minimumPay,
//       penaltyPrice,
//       newTotal,
//       totalWithPenalty,
//       updatedBillingDetails,
//       '48'
//     );
//     return tempUpdatedBillingDetails;
//   }

//   if (currentStartCurrentTimeHoursDiff <= 24) {
//     const penaltyPrice = parseFloat((dayOneAmount + dayTwoAmount).toFixed(2));
//     const totalWithPenalty = newTotal + penaltyPrice;

//     const { isMinValid, minimumPay } = await isMinimumValid(
//       totalWithPenalty,
//       oldDurationHours,
//       newDurationHours,
//       dayOneAmount,
//       dayOneAmount + dayTwoAmount
//     );
//     // console.log(isMinValid, minimumPay, totalWithPenalty);
//     const tempUpdatedBillingDetails = await handlePenaltyInBillingDetails(
//       isMinValid,
//       minimumPay,
//       penaltyPrice,
//       newTotal,
//       totalWithPenalty,
//       updatedBillingDetails,
//       '24'
//     );
//     return tempUpdatedBillingDetails;
//   }

//   return updatedBillingDetails;
// };

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
  const oldDay1 = oldReservationPriceList2Day[0]?.dailyPrice;
  const oldDay2 = oldReservationPriceList2Day[1]?.dailyPrice;
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

export const getUpcomingDurationPriceOld = async (paramsGetUpcomingDurationPrice: TParamsGetUpcomingDurationPrice): Promise<number> => {
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

  const isNewPickupIsAfterOldReturn = dayjs(pickupTime).isAfter(currentReturnTime, 'day');

  const dayBeforePickup = dayjs(currentPickupTime).subtract(1, 'day');
  const dayAfterReturn = dayjs(currentReturnTime).add(1, 'day');

  const isNewStartBetween = dayjs(pickupTime).isBetween(dayjs(dayBeforePickup), dayjs(dayAfterReturn), 'minute', '[]'); //'[]' means start and end days are included
  const isNewEndBetween = dayjs(returnTime).isBetween(dayjs(dayBeforePickup), dayjs(dayAfterReturn), 'minute', '[]');

  const isCurrentStartBetween = dayjs(dayBeforePickup).isBetween(dayjs(pickupTime), dayjs(returnTime), 'minute', '[]'); //'[]' means start and end days are included
  const isCurrentEndBetween = dayjs(dayAfterReturn).isBetween(dayjs(pickupTime), dayjs(returnTime), 'minute', '[]');

  // console.log({ currentPickupTime, currentReturnTime, pickupTime, isNewStartBetween });
  // console.log({ currentPickupTime, currentReturnTime, returnTime, isNewEndBetween });
  // console.log({ isNewStartBetween, isNewEndBetween, isCurrentStartBetween, isCurrentEndBetween });

  let tempNewDurationPrice: number = 0;

  // New pick & return don't match, use current car price
  if (isNewPickupIsAfterOldReturn || (!isNewStartBetween && !isNewEndBetween && !isCurrentStartBetween && !isCurrentEndBetween)) {
    // console.log('0');
    tempNewDurationPrice = await calculateEditDurationPrice(
      pickupTime,
      returnTime,
      currentDailyPrice,
      currentHourlyPrice,
      currentCustomPricing,
      peakIncrease
    );
    // console.log(tempNewDurationPrice);
    return tempNewDurationPrice;
  }

  // New pick < currStart & currEnd  < return, use current price for [pick - currStart], stored price for [currStart - currEnd], current price for [currEnd - return]
  if (isCurrentStartBetween && isCurrentEndBetween) {
    // console.log('1');
    // change logic
    const minDiffOne = dayjs(dayBeforePickup).diff(dayjs(pickupTime), 'minute');
    const minDiffTwo = dayjs(returnTime).diff(dayjs(dayAfterReturn), 'minute');
    const timeDiffMins = minDiffOne + minDiffTwo;
    const timeDiffHours = Math.floor(timeDiffMins / 60); // Get total hours
    const timeDiffDays = Math.floor(timeDiffHours / 24); // Get total days

    const { reservationPriceList } = await getReservationPriceList(
      pickupTime,
      returnTime,
      currentDailyPrice,
      currentHourlyPrice,
      currentCustomPricing,
      peakIncrease
    );

    const tempNewDurationWithNewPrice = await calculateEditDurationPriceWithoutDates(timeDiffDays, timeDiffHours, timeDiffMins, reservationPriceList);
    const tempNewDurationPriceWithStored = await calculateEditDurationPrice(
      dayBeforePickup,
      dayAfterReturn,
      storedDailyPrice,
      storedHourlyPrice,
      storedCustomPricing,
      peakIncrease
    );
    tempNewDurationPrice = tempNewDurationWithNewPrice + tempNewDurationPriceWithStored;

    // console.log({ timeDiffDays, timeDiffHours, timeDiffMins, tempNewDurationWithNewPrice });
    // console.log({ tempNewDurationPrice });
    return tempNewDurationPrice;
  }

  // New pick & return match, use stored car price
  if (isNewStartBetween && isNewEndBetween) {
    tempNewDurationPrice = await calculateEditDurationPrice(
      pickupTime,
      returnTime,
      storedDailyPrice,
      storedHourlyPrice,
      storedCustomPricing,
      peakIncrease
    );
    return tempNewDurationPrice;
  }

  // New pick matched & return doesn't, use stored price for [pick - currEnd] and current price for [currEnd - return]
  if (isNewStartBetween && !isNewEndBetween) {
    const tempNewDurationPriceWithStored = await calculateEditDurationPrice(
      pickupTime,
      dayAfterReturn,
      storedDailyPrice,
      storedHourlyPrice,
      storedCustomPricing,
      peakIncrease
    );
    const tempNewDurationPriceWithCurrent = await calculateEditDurationPrice(
      dayAfterReturn,
      returnTime,
      currentDailyPrice,
      currentHourlyPrice,
      currentCustomPricing,
      peakIncrease
    );
    tempNewDurationPrice = tempNewDurationPriceWithStored + tempNewDurationPriceWithCurrent;
    return tempNewDurationPrice;
  }

  // New pick doesn't match & return does, use current price for [pick - currStart] stored price for [currStart - return]
  if (!isNewStartBetween && isNewEndBetween) {
    const tempNewDurationPriceWithCurrent = await calculateEditDurationPrice(
      pickupTime,
      dayBeforePickup,
      currentDailyPrice,
      currentHourlyPrice,
      currentCustomPricing,
      peakIncrease
    );
    const tempNewDurationPriceWithStored = await calculateEditDurationPrice(
      dayBeforePickup,
      returnTime,
      storedDailyPrice,
      storedHourlyPrice,
      storedCustomPricing,
      peakIncrease
    );
    tempNewDurationPrice = tempNewDurationPriceWithStored + tempNewDurationPriceWithCurrent;
    return tempNewDurationPrice;
  }

  return parseFloat(tempNewDurationPrice?.toFixed(2));
};

export const calculateEditDurationPriceWithoutDates = async (
  timeDiffDays: number,
  timeDiffHours: number,
  timeDiffMins: number,
  reservationPriceList: ReservationPriceListType[]
): Promise<number> => {
  // Calculate remaining hours
  const remainingHours = timeDiffHours % 24;
  const remainingMinutes = timeDiffMins % 60;
  const { tempDurationPrice } = await calculateNewDurationPrice(timeDiffDays, remainingHours, remainingMinutes, reservationPriceList);
  return tempDurationPrice;
};

export const isMinimumValid = async (
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

export const handlePenaltyInBillingDetails = async (
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

export const calculateUpcomingDurationPrice = async (
  pickupDateTime: TDate,
  returnDateTime: TDate,
  reservationPriceList: ReservationPriceListType[]
): Promise<{ tempDurationPrice: number; individualPrices: IndividualPricing[] }> => {
  const pickupDate = dayjsUtc(pickupDateTime);
  const returnDate = dayjsUtc(returnDateTime);
  // Calculate the time difference between pickup & return in hours, days
  const timeDiffMins = returnDate.diff(pickupDate, 'minute');
  const timeDiffHours = returnDate.diff(pickupDate, 'hour');
  const timeDiffDays = returnDate.diff(pickupDate, 'day');
  // Calculate remaining hours
  const remainingHours = timeDiffHours % 24;
  const remainingMinutes = timeDiffMins % 60;
  // One: calculate base price taking total duration days and hours
  const { tempDurationPrice, individualPrices } = await calculateNewDurationPrice(
    timeDiffDays,
    remainingHours,
    remainingMinutes,
    reservationPriceList
  );
  return { tempDurationPrice, individualPrices };
};

export const getUpcomingReservationPriceList = async (
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
  setReservationCustomPriceList?: Dispatch<SetStateAction<ICustomPricing[]>>
): Promise<ReservationPriceListType[]> => {
  const reservationPriceList: ReservationPriceListType[] = [];
  const tempReservationCustomPriceList: ICustomPricing[] = [];

  // Determine the range for stored prices
  const dayBeforePickup = dayjsUtc(storedPickupDate).subtract(1, 'day');
  const dayAfterReturn = dayjsUtc(storedReturnDate).add(1, 'day');

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

export const getUpcomingDurationPrice = async (
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
  setIndividualPriceList(individualPrices);
  return parseFloat(totalDurationPrice?.toFixed(2));
};
