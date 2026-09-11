import { TDateInfo, TParamsGetRefundOrPenalty, TParamsGetUpcomingDurationPrice } from '@/types/travels/typeEditTravels';
import dayjs from 'dayjs';
import {
  calculateDurationPrice,
  calculateNextHighestLongDiscount,
  calculatePeakIncreasePrice,
  commonDiscountCalculation,
  convertWeekToDays,
  getDatesInRange,
  getDurationPrice,
  isDayOfWeekInRange,
} from './reservationValidationFn';
import { TDate } from '@/types/commonTypes';
import { combineDateTime, getDurationDayHourMin, getDurationHours } from './dateTimeCommonFn';

const calculateEditDurationPrice = async (pickupDateTime: TDate, returnDateTime: TDate, dailyRate: number, hourlyRate: number): Promise<number> => {
  const pickupDate = dayjs(pickupDateTime);
  const returnDate = dayjs(returnDateTime);

  // Calculate the time difference between pickup & return in hours, days
  const timeDiffMins = returnDate.diff(pickupDate, 'minute');
  const timeDiffHours = returnDate.diff(pickupDate, 'hour');
  const timeDiffDays = returnDate.diff(pickupDate, 'day');

  // Calculate remaining hours
  const remainingHours = timeDiffHours % 24;
  const remainingMinutes = timeDiffMins % 60;
  // One: calculate base price taking total duration days and hours
  const { tempDurationPrice } = await calculateDurationPrice(
    timeDiffMins,
    timeDiffHours,
    timeDiffDays,
    remainingHours,
    remainingMinutes,
    dailyRate,
    hourlyRate
  );
  return tempDurationPrice;
};

const calculateEditDurationPriceWithoutDates = async (
  timeDiffDays: number,
  timeDiffHours: number,
  timeDiffMins: number,
  dailyRate: number,
  hourlyRate: number
): Promise<number> => {
  // Calculate remaining hours
  const remainingHours = timeDiffHours % 24;
  const remainingMinutes = timeDiffMins % 60;

  // console.log({ timeDiffDays, remainingHours, remainingMinutes });
  const { tempDurationPrice } = await calculateDurationPrice(
    timeDiffMins,
    timeDiffHours,
    timeDiffDays,
    remainingHours,
    remainingMinutes,
    dailyRate,
    hourlyRate
  );
  return tempDurationPrice;
};

// Calculates price conditionally using current and stored price
// export const getUpcomingDurationPrice = async (paramsGetUpcomingDurationPrice: TParamsGetUpcomingDurationPrice): Promise<number> => {
//   const { pickupTime, returnTime, currentPickupTime, currentReturnTime, currentDailyPrice, currentHourlyPrice, storedDailyPrice, storedHourlyPrice } =
//     paramsGetUpcomingDurationPrice;

//   const generatedDates = await getDatesInRange(pickupTime, returnTime);
//   let tempNewDurationPrice: number = 0;

//   const matchedDates = generatedDates.filter(date => {
//     const currentDate = dayjs(date?.date);
//     const isDateBetween = dayjs(currentDate).isBetween(dayjs(currentPickupTime), dayjs(currentReturnTime), 'day', '[]');
//     return isDateBetween;
//   });

//   console.log({generatedDates})
//   console.log({matchedDates})

//   const generatedLength = generatedDates?.length;
//   const matchedLength = matchedDates?.length;

//     const isNewStartBetween = dayjs(pickupTime).isBetween(dayjs(currentPickupTime), dayjs(currentReturnTime), 'minute', '[]'); //'[]' means start and end days are included
//   const isNewEndBetween = dayjs(returnTime).isBetween(dayjs(currentPickupTime), dayjs(currentReturnTime), 'minute', '[]');

//   // calculate price with current car pricing
//   if(matchedLength === 0) {
//     tempNewDurationPrice = await calculateEditDurationPrice(pickupTime, returnTime, currentDailyPrice, currentHourlyPrice);
//     console.log(tempNewDurationPrice)
//     return tempNewDurationPrice;
//   }

//   // calculate price with stored car pricing
//   if(matchedLength === generatedLength || (isNewStartBetween && isNewEndBetween)) {
//     tempNewDurationPrice = await calculateEditDurationPrice(pickupTime, returnTime, storedDailyPrice, storedHourlyPrice);
//     console.log(tempNewDurationPrice);
//     return tempNewDurationPrice;
//   }

//   const startOfCurrentPickupDate = dayjs(currentPickupTime).startOf('day').toISOString();
//   const endOfCurrentReturnDate = dayjs(currentReturnTime).endOf('day').toISOString();

//   console.log({pickupTime, returnTime})

//   const oldFirstMatched = generatedDates[0]?.date === matchedDates[0]?.date ? pickupTime : dayjs(matchedDates[0]?.date).startOf('day').toISOString();
//   const oldLastMatched = generatedDates[generatedLength - 1]?.date === matchedDates[matchedLength - 1]?.date ? returnTime : dayjs(matchedDates[matchedLength - 1]?.date).endOf('day').toISOString();

// const newDuration = getDurationDayHourMin(dayjs(oldFirstMatched), dayjs(oldLastMatched));

// const oldDays = dayjs(oldLastMatched).diff(dayjs(oldFirstMatched), 'day')
// const newDays = dayjs(returnTime).diff(dayjs(pickupTime), 'day')
// const oldHours = dayjs(oldLastMatched).diff(dayjs(oldFirstMatched), 'hour')
// const newHours = dayjs(returnTime).diff(dayjs(pickupTime), 'hour')
// const oldMins = dayjs(oldLastMatched).diff(dayjs(oldFirstMatched), 'minute')
// const newMins = dayjs(returnTime).diff(dayjs(pickupTime), 'minute')
// const minDiff = newMins - oldMins;

// console.log({newDays, oldDays, oldHours, newHours})

// console.log({oldMins, newMins, minDiff})

// console.log({oldFirstMatched, oldLastMatched, newDuration})

// const timeDiffDays = newDays - oldDays;
// const timeDiffHours = newHours - oldHours;
// const timeDiffMins = newMins - oldMins;
// const remainingHours = timeDiffHours % 24;
// const remainingMinutes = timeDiffMins % 60 > 1 ? timeDiffMins % 60 : 0;

// console.log({timeDiffDays, timeDiffHours, timeDiffMins})
// console.log({remainingHours, remainingMinutes})

// const { tempDurationPrice } = await calculateDurationPrice(
//   timeDiffMins,
//   timeDiffHours,
//   timeDiffDays,
//   remainingHours,
//   remainingMinutes,
//   currentDailyPrice,
//   currentHourlyPrice
// );

// console.log(tempDurationPrice)

//   const tempOldDurationWithOldPrice = await calculateEditDurationPrice(oldFirstMatched, oldLastMatched, storedDailyPrice, storedHourlyPrice);
//   tempNewDurationPrice = parseFloat((tempOldDurationWithOldPrice + tempDurationPrice)?.toFixed(2));
//   // const tempOldDurationWithNewPrice = await calculateEditDurationPrice(oldFirstMatched, oldLastMatched, currentDailyPrice, currentHourlyPrice);
//   // const tempNewDurationWithNewPrice = await calculateEditDurationPrice(pickupTime, returnTime, currentDailyPrice, currentHourlyPrice);

//   // console.log({tempOldDurationWithOldPrice, tempOldDurationWithNewPrice, tempNewDurationWithNewPrice})

//   // const priceToBeAdded = parseFloat((tempNewDurationWithNewPrice - tempOldDurationWithNewPrice)?.toFixed(2));
//   // const addedPrice = priceToBeAdded > 0 ? priceToBeAdded : currentDailyPrice;
//   // tempNewDurationPrice = parseFloat((tempOldDurationWithOldPrice + addedPrice)?.toFixed(2));

//   // console.log({priceToBeAdded, addedPrice, tempNewDurationPrice})
//   console.log({tempOldDurationWithOldPrice, tempDurationPrice, tempNewDurationPrice})

//   return tempNewDurationPrice;
// };

// current
// Calculates price conditionally using current and stored price
// export const getUpcomingDurationPrice = async (paramsGetUpcomingDurationPrice: TParamsGetUpcomingDurationPrice): Promise<number> => {
//   const { pickupTime, returnTime, currentPickupTime, currentReturnTime, currentDailyPrice, currentHourlyPrice, storedDailyPrice, storedHourlyPrice } =
//     paramsGetUpcomingDurationPrice;

//   const isNewStartBetween = dayjs(pickupTime).isBetween(dayjs(currentPickupTime), dayjs(currentReturnTime), 'minute', '[]'); //'[]' means start and end days are included
//   const isNewEndBetween = dayjs(returnTime).isBetween(dayjs(currentPickupTime), dayjs(currentReturnTime), 'minute', '[]');

//   const isCurrentStartBetween = dayjs(currentPickupTime).isBetween(dayjs(pickupTime), dayjs(returnTime), 'minute', '[]'); //'[]' means start and end days are included
//   const isCurrentEndBetween = dayjs(currentReturnTime).isBetween(dayjs(pickupTime), dayjs(returnTime), 'minute', '[]');

//   // console.log({ currentPickupTime, currentReturnTime, pickupTime, isNewStartBetween });

//   let tempNewDurationPrice: number = 0;

//   // New pick & return don't match, use current car price
//   if (!isNewStartBetween && !isNewEndBetween && !isCurrentStartBetween && !isCurrentEndBetween) {
//     // console.log('0');
//     tempNewDurationPrice = await calculateEditDurationPrice(pickupTime, returnTime, currentDailyPrice, currentHourlyPrice);
//     // console.log(tempNewDurationPrice);
//     return tempNewDurationPrice;
//   }

//   tempNewDurationPrice = await calculateEditDurationPrice(pickupTime, returnTime, storedDailyPrice, storedHourlyPrice);
//   return tempNewDurationPrice;
// };

// Updated
export const getUpcomingDurationPrice = async (paramsGetUpcomingDurationPrice: TParamsGetUpcomingDurationPrice): Promise<number> => {
  const { pickupTime, returnTime, currentPickupTime, currentReturnTime, currentDailyPrice, currentHourlyPrice, storedDailyPrice, storedHourlyPrice } =
    paramsGetUpcomingDurationPrice;

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
    tempNewDurationPrice = await calculateEditDurationPrice(pickupTime, returnTime, currentDailyPrice, currentHourlyPrice);
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

    // console.log({ minDiffOne, minDiffTwo, timeDiffMins, timeDiffHours, timeDiffDays });

    const tempNewDurationWithNewPrice = await calculateEditDurationPriceWithoutDates(
      timeDiffDays,
      timeDiffHours,
      timeDiffMins,
      currentDailyPrice,
      currentHourlyPrice
    );
    const tempNewDurationPriceWithStored = await calculateEditDurationPrice(dayBeforePickup, dayAfterReturn, storedDailyPrice, storedHourlyPrice);
    tempNewDurationPrice = tempNewDurationWithNewPrice + tempNewDurationPriceWithStored;

    // console.log({ timeDiffDays, timeDiffHours, timeDiffMins, tempNewDurationWithNewPrice });
    // console.log({ tempNewDurationPrice });
    return tempNewDurationPrice;
  }

  // New pick & return match, use stored car price
  if (isNewStartBetween && isNewEndBetween) {
    // console.log('2');
    tempNewDurationPrice = await calculateEditDurationPrice(pickupTime, returnTime, storedDailyPrice, storedHourlyPrice);
    // console.log(tempNewDurationPrice);
    return tempNewDurationPrice;
  }

  // New pick matched & return doesn't, use stored price for [pick - currEnd] and current price for [currEnd - return]
  if (isNewStartBetween && !isNewEndBetween) {
    // console.log('3');
    const tempNewDurationPriceWithStored = await calculateEditDurationPrice(pickupTime, dayAfterReturn, storedDailyPrice, storedHourlyPrice);
    const tempNewDurationPriceWithCurrent = await calculateEditDurationPrice(dayAfterReturn, returnTime, currentDailyPrice, currentHourlyPrice);
    tempNewDurationPrice = tempNewDurationPriceWithStored + tempNewDurationPriceWithCurrent;
    // console.log({ tempNewDurationPriceWithStored, tempNewDurationPriceWithCurrent, tempNewDurationPrice });
    return tempNewDurationPrice;
  }

  // New pick doesn't match & return does, use current price for [pick - currStart] stored price for [currStart - return]
  if (!isNewStartBetween && isNewEndBetween) {
    // console.log('4');
    const tempNewDurationPriceWithCurrent = await calculateEditDurationPrice(pickupTime, dayBeforePickup, currentDailyPrice, currentHourlyPrice);
    const tempNewDurationPriceWithStored = await calculateEditDurationPrice(dayBeforePickup, returnTime, storedDailyPrice, storedHourlyPrice);
    tempNewDurationPrice = tempNewDurationPriceWithStored + tempNewDurationPriceWithCurrent;
    // console.log({ tempNewDurationPriceWithStored, tempNewDurationPriceWithCurrent, tempNewDurationPrice });
    return tempNewDurationPrice;
  }

  return parseFloat(tempNewDurationPrice?.toFixed(2));
};
// export const getUpcomingDurationPrice = async (paramsGetUpcomingDurationPrice: TParamsGetUpcomingDurationPrice): Promise<number> => {
//   const { pickupTime, returnTime, currentPickupTime, currentReturnTime, currentDailyPrice, currentHourlyPrice, storedDailyPrice, storedHourlyPrice } =
//     paramsGetUpcomingDurationPrice;

//   const isNewStartBetween = dayjs(pickupTime).isBetween(dayjs(currentPickupTime), dayjs(currentReturnTime), 'minute', '[]'); //'[]' means start and end days are included
//   const isNewEndBetween = dayjs(returnTime).isBetween(dayjs(currentPickupTime), dayjs(currentReturnTime), 'minute', '[]');

//   const isCurrentStartBetween = dayjs(currentPickupTime).isBetween(dayjs(pickupTime), dayjs(returnTime), 'minute', '[]'); //'[]' means start and end days are included
//   const isCurrentEndBetween = dayjs(currentReturnTime).isBetween(dayjs(pickupTime), dayjs(returnTime), 'minute', '[]');

//   // console.log({ currentPickupTime, currentReturnTime, pickupTime, isNewStartBetween });
//   // console.log({ currentPickupTime, currentReturnTime, returnTime, isNewEndBetween });

//   let tempNewDurationPrice: number = 0;

//   // New pick & return don't match, use current car price
//   if (!isNewStartBetween && !isNewEndBetween && !isCurrentStartBetween && !isCurrentEndBetween) {
//     // console.log('0');
//     tempNewDurationPrice = await getDurationPrice(pickupTime, returnTime, currentDailyPrice, currentHourlyPrice);
//     // console.log(tempNewDurationPrice);
//     return tempNewDurationPrice;
//   }

//   // New pick < currStart & currEnd  < return, use current price for [pick - currStart], stored price for [currStart - currEnd], current price for [currEnd - return]
//   if (isCurrentStartBetween && isCurrentEndBetween) {
//     // console.log('1');
//     // change logic
//     const tempNewDurationPriceWithCurrentOne = await getDurationPrice(pickupTime, currentPickupTime, currentDailyPrice, currentHourlyPrice);
//     const tempNewDurationPriceWithStored = await getDurationPrice(currentPickupTime, currentReturnTime, storedDailyPrice, storedHourlyPrice);
//     const tempNewDurationPriceWithCurrentTwo = await getDurationPrice(currentReturnTime, returnTime, currentDailyPrice, currentHourlyPrice);
//     tempNewDurationPrice = tempNewDurationPriceWithCurrentOne + tempNewDurationPriceWithStored + tempNewDurationPriceWithCurrentTwo;
//     // console.log({ tempNewDurationPriceWithCurrentOne, tempNewDurationPriceWithStored, tempNewDurationPriceWithCurrentTwo });
//     // console.log({ tempNewDurationPrice });
//     return tempNewDurationPrice;
//   }

//   // New pick & return match, use stored car price
//   if (isNewStartBetween && isNewEndBetween) {
//     // console.log('2');
//     tempNewDurationPrice = await getDurationPrice(pickupTime, returnTime, storedDailyPrice, storedHourlyPrice);
//     // console.log(tempNewDurationPrice);
//     return tempNewDurationPrice;
//   }

//   // New pick matched & return doesn't, use stored price for [pick - currEnd] and current price for [currEnd - return]
//   if (isNewStartBetween && !isNewEndBetween) {
//     // console.log('3');
//     const tempNewDurationPriceWithStored = await getDurationPrice(pickupTime, currentReturnTime, storedDailyPrice, storedHourlyPrice);
//     const tempNewDurationPriceWithCurrent = await getDurationPrice(currentReturnTime, returnTime, currentDailyPrice, currentHourlyPrice);
//     tempNewDurationPrice = tempNewDurationPriceWithStored + tempNewDurationPriceWithCurrent;
//     // console.log({ tempNewDurationPriceWithStored, tempNewDurationPriceWithCurrent, tempNewDurationPrice });
//     return tempNewDurationPrice;
//   }

//   // New pick doesn't match & return does, use current price for [pick - currStart] stored price for [currStart - return]
//   if (!isNewStartBetween && isNewEndBetween) {
//     // console.log('4');
//     const tempNewDurationPriceWithCurrent = await getDurationPrice(pickupTime, currentPickupTime, currentDailyPrice, currentHourlyPrice);
//     const tempNewDurationPriceWithStored = await getDurationPrice(currentPickupTime, returnTime, storedDailyPrice, storedHourlyPrice);
//     tempNewDurationPrice = tempNewDurationPriceWithStored + tempNewDurationPriceWithCurrent;
//     // console.log({ tempNewDurationPriceWithStored, tempNewDurationPriceWithCurrent, tempNewDurationPrice });
//     return tempNewDurationPrice;
//   }

//   return tempNewDurationPrice;
// };

export type TParamsGetPeakIncrease = {
  pickupDateTime: TDate;
  returnDateTime: TDate;
  peakIncrease: any;
  currentDailyRates: number;
  tempTotalPrice: number;
};

export const getPeakIncrease = async (paramsGetPeakIncrease: TParamsGetPeakIncrease) => {
  const { pickupDateTime, returnDateTime, peakIncrease, currentDailyRates, tempTotalPrice } = paramsGetPeakIncrease;
  let tempPeakIncPrice = {};
  // create list with applicable peak increase price days
  const matchedPeakIncList = await isDayOfWeekInRange(pickupDateTime, returnDateTime, peakIncrease);
  // Two: add peak increase price if selected day includes host added peak increased days
  if (matchedPeakIncList?.length > 0) {
    const peakDays = matchedPeakIncList?.map((day) => day?.dayOfWeek);
    const { tempPeakIncreasePrice, incPrice } = await calculatePeakIncreasePrice(currentDailyRates, tempTotalPrice, matchedPeakIncList);
    // const { tempPeakIncreasePrice, incPrice } = await calculatePeakIncreasePrice(dailyRates, tempTotalPrice, matchedPeakIncList);
    // tempTotalPrice = tempPeakIncreasePrice;
    tempPeakIncPrice = {
      increaseDays: peakDays,
      increaseType: matchedPeakIncList[0]?.increaseType,
      increaseAmount: matchedPeakIncList[0]?.percentage || matchedPeakIncList[0]?.amount,
      calculatedAmount: incPrice,
    };
  }
};

export const checkEditPrice = async (paramsGetUpcomingDurationPrice: TParamsGetUpcomingDurationPrice) => {
  const dateList = await getDateList(paramsGetUpcomingDurationPrice);
  // console.log(dateList);

  // const { durationPrice, increasedDurationPrice } = calculateTotalPrice(dateList);

  return calculateTotalPrice(dateList, paramsGetUpcomingDurationPrice?.returnTime);
};

export const getPeakIncreasedPrices = (peakIncrease: any, dailyRate: number, hourlyRate: number) => {
  // console.log(peakIncrease);
  const { amount, percentage, increaseType } = peakIncrease;
  // console.log({ dailyRate, hourlyRate });

  let daily = 0;
  let hourly = 0;

  if (increaseType === 'amount') {
    daily = dailyRate + amount;
    hourly = hourlyRate + amount;
  } else {
    const dailyPercentage = (dailyRate * percentage) / 100;
    const hourlyPercentage = (hourlyRate * percentage) / 100;
    daily = dailyRate + dailyPercentage;
    hourly = hourlyRate + hourlyPercentage;
  }

  // console.log({ daily, hourly });

  return { daily, hourly };
};

export const calculateTotalPrice = (dateList: TDateInfo[], returnDate: TDate) => {
  let durationPrice = 0;
  let updatedDateList: TDateInfo[] = [...dateList];
  const increasedDurationPrice = dateList.reduce((totalPrice, currentDate, index) => {
    const { date, hourlyRate, dailyRate, hasPeakIncrease } = currentDate;
    // console.log(hourlyRate, dailyRate);
    const isPickup = index === 0;
    const isReturn = index === dateList.length - 1;

    const isStartOfDay = dayjs(date).isSame(dayjs(date).startOf('day'), 'minute');
    const isEndOfDay = dayjs(date).isSame(dayjs(date).endOf('day'), 'minute');
    // console.log({ date, returnDate });
    let durationHours = dateList?.length > 1 ? 24 : getDurationHours(date, returnDate);

    // get duration hours for pickup and return date
    if (dateList?.length > 1 && isPickup && !isStartOfDay) {
      const endTime = dayjs(date).endOf('day').toISOString();
      durationHours = getDurationHours(date, endTime);
      // console.log({ date, endTime, durationHours });
    }

    if (dateList?.length > 1 && isReturn && !isEndOfDay) {
      const startTime = dayjs(date).startOf('day').toISOString();
      durationHours = getDurationHours(startTime, date);
      // console.log({ date, startTime, durationHours });
    }

    let dayPrice = parseFloat(Math.min(durationHours * hourlyRate, dailyRate).toFixed(2));
    // console.log(durationHours * hourlyRate, dailyRate);
    // durationHours * hourlyRate > dailyRate ? dailyRate : hourlyRate
    durationPrice = durationPrice + dayPrice;
    // console.log({ durationHours, durationPrice, dayPrice });

    if (hasPeakIncrease) {
      const { daily, hourly } = getPeakIncreasedPrices(hasPeakIncrease, dailyRate, hourlyRate);
      const increasedDayPrice = parseFloat(Math.min(durationHours * hourly, daily).toFixed(2));
      updatedDateList[index].increasedAmount = increasedDayPrice - dayPrice;
      // console.log({ increasedDayPrice, dayPrice });
      // console.log(updatedDateList[index]);

      dayPrice = increasedDayPrice;
      // console.log(dayPrice);
    }

    updatedDateList[index].dayPrice = dayPrice;

    // Add the price to the total
    // console.log({ totalPrice, dayPrice });
    return totalPrice + dayPrice;
  }, 0);

  // console.log({ durationPrice, increasedDurationPrice });
  // console.log(updatedDateList);

  return { durationPrice, increasedDurationPrice, updatedDateList };
};

export const getEditTravelDiscounts = async (
  longBookingDiscounts: any,
  pickupDate: TDate,
  returnDate: TDate,
  totalPrice: number,
  advanceBookingDiscounts?: any[]
) => {
  const timeDiffDays = dayjs(returnDate).diff(dayjs(pickupDate), 'day');
  const convertedLongDiscounts = await convertWeekToDays(longBookingDiscounts);
  const filteredLongDiscounts = convertedLongDiscounts?.filter((dis: any) => timeDiffDays >= dis?.convertedDays);

  const advanceDayDiff = dayjs(pickupDate).diff(dayjs(), 'day');
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
  if (filteredLongDiscounts?.length > 0) {
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
  if (filteredLongDiscounts?.length === 0 && convertedLongDiscounts?.length > 0) {
    tempNextLongDisData = await calculateNextHighestLongDiscount(convertedLongDiscounts);
    // console.log(tempNextLongDisData);
  }

  // Five: apply advance reservation discount if applicable
  if (filteredAdvanceDiscounts?.length > 0) {
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

export const getRefundOrPenalty = async (paramsGetRefundOrPenalty: TParamsGetRefundOrPenalty) => {
  const {
    pickupTime,
    returnTime,
    currentReturnTime,
    currentHourlyPrice,
    storedDailyPrice,
    storedHourlyPrice,
    peakIncrease,
    currentPickupTime,
    currentDailyPrice,
    oldDurationHours,
    newDurationHours,
    updatedBillingDetails,
    paidPrice,
  } = paramsGetRefundOrPenalty;
  // console.log({ pickupTime, currentPickupTime });
  const dateList = await getDateList({
    pickupTime: currentPickupTime,
    returnTime: currentReturnTime,
    currentPickupTime,
    currentReturnTime,
    currentDailyPrice,
    currentHourlyPrice,
    storedDailyPrice,
    storedHourlyPrice,
    peakIncrease,
  });
  // console.log(dateList);

  let dayOneAmount = storedDailyPrice;
  let dayTwoAmount = storedDailyPrice;

  if (dateList[0]?.hasPeakIncrease) {
    const { daily, hourly } = getPeakIncreasedPrices(dateList[0]?.hasPeakIncrease, storedDailyPrice, storedHourlyPrice);
    dayOneAmount = daily;
  }

  if (dateList[1]?.hasPeakIncrease) {
    const { daily, hourly } = getPeakIncreasedPrices(dateList[1]?.hasPeakIncrease, storedDailyPrice, storedHourlyPrice);
    dayTwoAmount = daily;
  }

  // console.log({ dayOneAmount, dayTwoAmount });

  // console.log({ oldDurationHours, newDurationHours });

  const currentTime = dayjs();
  const isNewPickupGreater = dayjs(pickupTime).isAfter(dayjs(currentPickupTime));
  const currentStartCurrentTimeHoursDiff = getDurationHours(currentTime, dayjs(currentPickupTime));
  // console.log(currentStartCurrentTimeHoursDiff);

  let penaltyPrice = 0;

  if (isNewPickupGreater && currentStartCurrentTimeHoursDiff < 24) {
    // console.log('1');
    const calculatedPenalty = dayOneAmount + dayTwoAmount;
    // const calculatedPenalty = 2 * currentDailyPrice + (dateList[0]?.increasedAmount || 0) + (dateList[1]?.increasedAmount || 0);
    penaltyPrice = parseFloat(calculatedPenalty.toFixed(2));
    const tempBillingDetails = await handleUpdateBillingDetails(
      penaltyPrice,
      updatedBillingDetails,
      updatedBillingDetails?.newTotalPrice,
      paidPrice,
      oldDurationHours
    );
    return tempBillingDetails;
  }

  if (isNewPickupGreater && currentStartCurrentTimeHoursDiff < 48) {
    // console.log('2');
    // const calculatedPenalty = currentDailyPrice + (dateList[0]?.increasedAmount || 0);
    const calculatedPenalty = dayOneAmount;
    penaltyPrice = parseFloat(calculatedPenalty.toFixed(2));
    const tempBillingDetails = await handleUpdateBillingDetails(
      penaltyPrice,
      updatedBillingDetails,
      updatedBillingDetails?.newTotalPrice,
      paidPrice,
      oldDurationHours
    );
    return tempBillingDetails;
  }

  // If total duration of current reservation is greater than 48 hours & total duration of new reservation is less than 48 hours, add 2 days payment
  if (!isNewPickupGreater && oldDurationHours > 48 && newDurationHours < 48) {
    // console.log('1');
    // const calculatedPenalty = 2 * currentDailyPrice + (dateList[0]?.increasedAmount || 0) + (dateList[1]?.increasedAmount || 0);
    const calculatedPenalty = dayOneAmount + dayTwoAmount;

    if (calculatedPenalty > updatedBillingDetails?.newTotalPrice) {
      penaltyPrice = parseFloat((calculatedPenalty - updatedBillingDetails?.newTotalPrice).toFixed(2));
      const tempBillingDetails = await handleUpdateBillingDetails(
        penaltyPrice,
        updatedBillingDetails,
        updatedBillingDetails?.newTotalPrice,
        paidPrice,
        oldDurationHours
      );
      return tempBillingDetails;
    }

    // console.log({ calculatedPenalty, penaltyPrice });
  }

  // If total duration of current reservation is less than 48 hours but greater than 24 hours, add 1 day payment
  if (!isNewPickupGreater && oldDurationHours < 48 && newDurationHours > 24) {
    // console.log('2');
    // const calculatedPenalty = currentDailyPrice + (dateList[0]?.increasedAmount || 0);
    const calculatedPenalty = dayOneAmount;

    if (calculatedPenalty > updatedBillingDetails?.newTotalPrice) {
      penaltyPrice = parseFloat((calculatedPenalty - updatedBillingDetails?.newTotalPrice).toFixed(2));
      const tempBillingDetails = await handleUpdateBillingDetails(
        penaltyPrice,
        updatedBillingDetails,
        updatedBillingDetails?.newTotalPrice,
        paidPrice,
        oldDurationHours
      );
      return tempBillingDetails;
    }
    // console.log({ calculatedPenalty, penaltyPrice });
  }

  if (!isNewPickupGreater && oldDurationHours < 48 && oldDurationHours < 24 && paidPrice > updatedBillingDetails?.newTotalPrice) {
    // console.log('no refund');
    updatedBillingDetails.refundText =
      'Thanks for updating travel time. Kindly be aware that reservations with a duration of less than 24 hours are ineligible for refunds.';
    return updatedBillingDetails;
  }

  // console.log(updatedBillingDetails);
  return updatedBillingDetails;
};

export const getPeakIncreaseAmount = (storedDailyPrice: number, peakIncList: any) => {
  let incPrice = 0;
  if (peakIncList[0]?.increaseType === 'percentage') {
    incPrice = storedDailyPrice * (peakIncList[0]?.percentage / 100) * peakIncList?.length;
  } else {
    incPrice = peakIncList[0]?.amount * peakIncList?.length;
  }

  return incPrice;
};

export const getRefundOrPenaltyUpdated = async (paramsGetRefundOrPenalty: TParamsGetRefundOrPenalty) => {
  const {
    pickupTime,
    returnTime,
    currentReturnTime,
    currentHourlyPrice,
    storedDailyPrice,
    storedHourlyPrice,
    peakIncrease,
    currentPickupTime,
    currentDailyPrice,
    oldDurationHours,
    newDurationHours,
    updatedBillingDetails,
    matchedDates,
    paidPrice,
  } = paramsGetRefundOrPenalty;

  let dayOneAmount = storedDailyPrice;
  let dayTwoAmount = storedDailyPrice;
  let incPrice = 0;

  if (oldDurationHours >= 48) {
    const after48Hours = dayjs(currentPickupTime).add(48, 'hour');
    const peakIncList = await isDayOfWeekInRange(currentPickupTime, after48Hours, peakIncrease);
    if (peakIncList?.length > 0) {
      if (peakIncList[0]?.increaseType === 'percentage') {
        dayOneAmount = dayOneAmount + storedDailyPrice * (peakIncList[0]?.percentage / 100);
        dayTwoAmount = dayTwoAmount + storedDailyPrice * (peakIncList[0]?.percentage / 100);
      } else {
        dayOneAmount = dayOneAmount + peakIncList[0]?.amount;
        dayTwoAmount = dayTwoAmount + peakIncList[0]?.amount;
      }
    }
  } else if (oldDurationHours >= 24) {
    const after24Hours = dayjs(currentPickupTime).add(24, 'hour');
    const peakIncList = await isDayOfWeekInRange(currentPickupTime, after24Hours, peakIncrease);
    if (peakIncList?.length > 0) {
      if (peakIncList[0]?.increaseType === 'percentage') {
        dayOneAmount = dayOneAmount + storedDailyPrice * (peakIncList[0]?.percentage / 100);
      } else {
        dayOneAmount = dayOneAmount + peakIncList[0]?.amount;
      }
    }
  } else {
    const afterOldDurationHours = dayjs(currentPickupTime).add(oldDurationHours, 'hour');
    const peakIncList = await isDayOfWeekInRange(currentPickupTime, afterOldDurationHours, peakIncrease);
    if (peakIncList?.length > 0) {
      if (peakIncList[0]?.increaseType === 'percentage') {
        dayOneAmount = dayOneAmount + storedDailyPrice * (peakIncList[0]?.percentage / 100);
      } else {
        dayOneAmount = dayOneAmount + peakIncList[0]?.amount;
      }
    }
  }

  // console.log({dayOneAmount, dayTwoAmount})

  // console.log(peakIncrease)
  // const peakDays = peakIncrease?.map((day: any) => day?.dayOfWeek);

  // if (matchedDates && peakDays?.length > 0 && peakDays?.includes(matchedDates[0]?.dayName)) {
  //   const { daily, hourly } = getPeakIncreasedPrices(peakIncrease[0], storedDailyPrice, storedHourlyPrice);
  //   dayOneAmount = daily;
  // }

  // if (matchedDates && peakDays?.length > 0 && peakDays?.includes(matchedDates[1]?.dayName)) {
  //   const { daily, hourly } = getPeakIncreasedPrices(peakIncrease[0], storedDailyPrice, storedHourlyPrice);
  //   dayOneAmount = daily;
  // }

  const currentTime = dayjs();
  const currentStartCurrentTimeHoursDiff = getDurationHours(currentTime, dayjs(currentPickupTime));

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
// export const getRefundOrPenaltyUpdated = async (paramsGetRefundOrPenalty: TParamsGetRefundOrPenalty) => {
//   const {
//     pickupTime,
//     returnTime,
//     currentReturnTime,
//     currentHourlyPrice,
//     storedDailyPrice,
//     storedHourlyPrice,
//     peakIncrease,
//     currentPickupTime,
//     currentDailyPrice,
//     oldDurationHours,
//     newDurationHours,
//     updatedBillingDetails,
//     paidPrice,
//   } = paramsGetRefundOrPenalty;

//   const dateList = await getDateList({
//     pickupTime: currentPickupTime,
//     returnTime: currentReturnTime,
//     currentPickupTime,
//     currentReturnTime,
//     currentDailyPrice,
//     currentHourlyPrice,
//     storedDailyPrice,
//     storedHourlyPrice,
//     peakIncrease,
//   });
//   // console.log(dateList);

//   let dayOneAmount = storedDailyPrice;
//   let dayTwoAmount = storedDailyPrice;

//   if (dateList[0]?.hasPeakIncrease) {
//     const { daily, hourly } = getPeakIncreasedPrices(dateList[0]?.hasPeakIncrease, storedDailyPrice, storedHourlyPrice);
//     dayOneAmount = daily;
//   }

//   if (dateList[1]?.hasPeakIncrease) {
//     const { daily, hourly } = getPeakIncreasedPrices(dateList[1]?.hasPeakIncrease, storedDailyPrice, storedHourlyPrice);
//     dayTwoAmount = daily;
//   }

//   const currentTime = dayjs();
//   const currentStartCurrentTimeHoursDiff = getDurationHours(currentTime, dayjs(currentPickupTime));

//   const newTotal = parseFloat(updatedBillingDetails?.newTotalPrice?.toFixed(2));

//   if (currentStartCurrentTimeHoursDiff > 24) {
//     let penaltyPrice = parseFloat(dayOneAmount?.toFixed(2));
//     let totalWithPenalty = newTotal + penaltyPrice;
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

export const handleUpdateBillingDetails = async (
  penaltyPrice: number,
  updatedBillingDetails: any,
  updatedTotalPrice: number,
  paidPrice: number,
  oldDurationHours: number
) => {
  // console.log({ penaltyPrice, updatedTotalPrice, paidPrice });

  const totalWithPenalty = parseFloat(updatedTotalPrice.toFixed(2)) + parseFloat(penaltyPrice.toFixed(2));
  updatedBillingDetails.totalWithoutPenalty = parseFloat(updatedTotalPrice?.toFixed(2));
  // updatedBillingDetails.newTotalPrice = parseFloat(totalWithPenalty?.toFixed(2));
  updatedBillingDetails.penaltyPrice = parseFloat(penaltyPrice.toFixed(2));

  const tempBillingDetails = handleRefund(updatedBillingDetails, totalWithPenalty, paidPrice, oldDurationHours);

  // if (totalWithPenalty < paidPrice) {
  //   updatedBillingDetails.refundableAmount = parseFloat((parseFloat(paidPrice?.toFixed(2)) - parseFloat(totalWithPenalty?.toFixed(2))).toFixed(2));
  // } else {
  //   updatedBillingDetails.refundText =
  //     'Thank you for updating the end time. Kindly be aware that no refund will be issued due to total price exceeding your paid amount and be informed that you will not have to pay the exceeding amount.';
  // }

  return tempBillingDetails;
};

export const handleRefund = async (updatedBillingDetails: any, updatedTotalPrice: number, paidPrice: number, oldDurationHours: number) => {
  updatedBillingDetails.newTotalPrice = parseFloat(updatedTotalPrice?.toFixed(2));

  if (oldDurationHours >= 24 && updatedTotalPrice < paidPrice) {
    updatedBillingDetails.refundableAmount = parseFloat((parseFloat(paidPrice?.toFixed(2)) - parseFloat(updatedTotalPrice?.toFixed(2))).toFixed(2));
  }

  if (oldDurationHours && oldDurationHours < 24) {
    updatedBillingDetails.refundText =
      'Thank you for updating the end time. Kindly be aware that no refund will be issued due to total price exceeding your paid amount and be informed that you will not have to pay the exceeding amount.';
    // 'Thank you for updating the end time. Kindly be aware that no refund will be issued due to total price exceeding your paid amount and be informed that you will not have to pay the exceeding amount.';
  }

  return updatedBillingDetails;
};

export const updatePayableAmount = async (oldTotal: number, updatedBillingDetails: any, oldDurationHours: number) => {
  const newTotal = updatedBillingDetails?.newTotalPrice;
  let payableAmount = 0;

  if (oldTotal === newTotal) {
    // console.log('no change');
    updatedBillingDetails.paidText = 'There is no change in payment.';
  }

  if (oldTotal < newTotal) {
    // console.log('payable');
    payableAmount = parseFloat((newTotal - oldTotal)?.toFixed(2));
    updatedBillingDetails.payableAmount = payableAmount;
  }

  if (oldTotal > newTotal) {
    // console.log('refundable');
    updatedBillingDetails.refundableAmount = parseFloat((oldTotal - newTotal)?.toFixed(2));
    // updatedBillingDetails = await handleRefund(updatedBillingDetails, newTotal, oldTotal, oldDurationHours);
  }
  return updatedBillingDetails;
};

export const getDateList = async (paramsGetUpcomingDurationPrice: TParamsGetUpcomingDurationPrice) => {
  const {
    pickupTime,
    returnTime,
    currentPickupTime,
    currentReturnTime,
    currentDailyPrice,
    currentHourlyPrice,
    storedDailyPrice,
    storedHourlyPrice,
    peakIncrease,
  } = paramsGetUpcomingDurationPrice;

  // console.log({ pickupTime, returnTime });
  // console.log(peakIncrease);

  let currentDate = dayjs(pickupTime);
  let returnDate = dayjs(returnTime);
  let dateList: TDateInfo[] = [];
  while (currentDate.isBefore(returnTime, 'day') || currentDate.isSame(returnDate, 'day')) {
    // check if the date matches with existing dates
    const isMatched = dayjs(currentDate).isBetween(dayjs(currentPickupTime), dayjs(currentReturnTime), 'day', '[]');
    const dayName = currentDate.format('ddd').toLowerCase();

    // Set pickup time for the first element
    let currentDateTime: TDate = currentDate?.toISOString();
    const isSingleDay = returnDate.isSame(dayjs(pickupTime), 'day');
    if (!isSingleDay && currentDate.isSame(dayjs(pickupTime), 'day')) {
      currentDateTime = combineDateTime(currentDate, dayjs(pickupTime));
    }

    // Set return time for the last element
    if (!isSingleDay && currentDate.isSame(returnDate, 'day')) {
      currentDateTime = combineDateTime(currentDate, returnDate);
    }

    let dailyRate = isMatched ? storedDailyPrice : currentDailyPrice;
    let hourlyRate = isMatched ? storedHourlyPrice : currentHourlyPrice;

    // check if the date has peak increase & update prices with increase
    const hasPeakIncrease = peakIncrease?.find((item: any) => item.dayOfWeek === dayName);

    const dateInfo: TDateInfo = {
      date: currentDateTime,
      dayName,
      isMatched,
      dailyRate,
      hourlyRate,
      hasPeakIncrease,
      increasedAmount: 0,
    };
    dateList.push(dateInfo);

    currentDate = currentDate.add(1, 'day'); // Move to the next day
  }

  return dateList;
};
