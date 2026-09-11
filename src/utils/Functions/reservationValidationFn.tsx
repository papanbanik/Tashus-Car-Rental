import { TCarBlockDate } from '@/types/car-search/availabilityValidationTypes';
import { TCommonDateRange, TDate } from '@/types/commonTypes';
import { combineDateTime } from '@/utils/Functions/dateTimeCommonFn';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import { dayjsUtc, getPickerTimeStringInUtc, isTimeInBetweenUtc } from './utcCommonFn';
import { getIsEditPaymentExpired, getLastPaidRevisedReservation } from './travelCommonFn';
import { TVehicleReservation } from '@/types/vehicle-details/vehicle-details';

dayjs.extend(duration);

export interface IUpdatedReservationDates {
  startDate: TDate;
  endDate: TDate;
  reservationId: number;
}

// Price Functions ---------------------------

// generates days between pickup return range and checks if generated days falls in peak increase days
export const isDayOfWeekInRange = async (pickupDateTime: TDate, returnDateTime: TDate, peakIncrease: any) => {
  const peakIncreaseDayList = [];
  if (peakIncrease?.length > 0) {
    // Parse pickup and return date strings into Day.js objects
    const pickupDate = dayjs(pickupDateTime);
    const returnDate = dayjs(returnDateTime);

    // Iterate through the days within the date range
    let currentDate = pickupDate;
    while (currentDate.isBefore(returnDate, 'day') || currentDate.isSame(returnDate, 'day')) {
      // Check if the current day's dayOfWeek matches any in the list
      const currentDayOfWeek = currentDate.format('ddd').toLowerCase();
      const foundDay = peakIncrease.find((item: any) => item.dayOfWeek === currentDayOfWeek);
      if (foundDay?.dayOfWeek) {
        peakIncreaseDayList.push(foundDay);
      }
      currentDate = currentDate.add(1, 'day'); // Move to the next day
    }
  }
  return peakIncreaseDayList;
};

// converts the week values to days of advance and long reservation list
export const convertWeekToDays = async (prevList: any) => {
  const convertedList = prevList?.map((item: any) => {
    let convertedDays = 0;
    if (item?.unit === 'weeks') {
      convertedDays = dayjs.duration({ weeks: item?.value }).as('days');
      // console.log(convertedDays);
    } else {
      convertedDays = item?.value;
    }
    return { ...item, convertedDays };
  });
  // console.log(convertedList);

  return convertedList;
};

// calculates price based on duration of travel
export const calculateDurationPrice = async (
  timeDiffMins: number,
  timeDiffHours: number,
  timeDiffDays: number,
  remainingHours: number,
  remainingMinutes: number,
  dailyAmount: number,
  hourlyAmount: number
) => {
  // console.log(hourlyAmount, dailyAmount);
  // console.log(timeDiffDays, remainingHours, remainingMinutes);
  let tempDurationPrice = 0;
  let duration = '';

  const addedMinsToHours = remainingHours + (remainingMinutes > 0 ? 1 : 0); //Add one hour to remaining hours if remaining mins exist
  const remainingHoursPrice = addedMinsToHours * hourlyAmount > dailyAmount ? dailyAmount : addedMinsToHours * hourlyAmount;
  const dayPrice = timeDiffDays * dailyAmount;

  const minDuration = remainingMinutes > 0 ? `${remainingMinutes} ${remainingMinutes > 1 ? 'mins ' : 'min '}` : '';
  const hourDuration = remainingHours > 0 ? `${remainingHours} ${remainingHours > 1 ? 'hrs ' : 'hr '}` : '';
  const dayDuration = timeDiffDays > 0 ? `${timeDiffDays} ${timeDiffDays > 1 ? 'days ' : 'day '}` : '';

  tempDurationPrice = parseFloat((dayPrice + remainingHoursPrice)?.toFixed(2));
  // console.log(addedMinsToHours);
  // console.log(dayPrice, remainingHoursPrice);
  // console.log(tempDurationPrice);

  duration = `${dayDuration}${hourDuration}${minDuration}`;
  // Calculate price for less than a hr duration
  // if (timeDiffHours === 0 && timeDiffMins !== 0) {
  //   tempDurationPrice = hourlyAmount > dailyAmount ? dailyAmount : hourlyAmount;
  //   duration = `${timeDiffMins} ${timeDiffMins > 1 ? 'mins' : 'min'}`;
  // }

  // // Calculate price for less than 24 hrs duration
  // if (timeDiffHours > 0 && timeDiffHours < 24) {
  //   const hourlyPrice = timeDiffHours * hourlyAmount;
  //   // if total hourlyAmount exceeds dailyAmount then take daily amount
  //   tempDurationPrice = hourlyPrice > dailyAmount ? dailyAmount : hourlyPrice;
  //   duration = `${timeDiffHours} ${timeDiffHours > 1 ? 'hrs' : 'hr'}`;
  //   // console.log(dailyAmount, timeDiffHours * hourlyAmount, tempDurationPrice);
  // }

  // // Calculate price based on daily rate
  // if (timeDiffDays > 0) {
  //   const remainingHoursPrice = remainingHours * hourlyAmount > dailyAmount ? dailyAmount : remainingHours * hourlyAmount;
  //   const hourString = remainingHours > 0 ? ` ${remainingHours} ${remainingHours > 1 ? 'hrs' : 'hr'}` : '';
  //   // console.log(dailyAmount, remainingHours * hourlyAmount, remainingHoursPrice);
  //   duration = `${timeDiffDays} ${timeDiffDays > 1 ? 'days' : 'day'}${hourString}`;
  //   // console.log(duration);
  //   tempDurationPrice = timeDiffDays * dailyAmount + remainingHoursPrice;
  // }

  return { tempDurationPrice, duration };
};

// calculates price based on duration of travel
export const calculateDurationPrice2 = async (
  timeDiffDays: number,
  remainingHours: number,
  remainingMinutes: number,
  dailyAmount: number,
  hourlyAmount: number
) => {
  // console.log(hourlyAmount, dailyAmount);
  // console.log(timeDiffDays, remainingHours, remainingMinutes);

  const addedMinsToHours = remainingHours + (remainingMinutes > 0 ? 1 : 0); //Add one hour to remaining hours if remaining mins exist
  const remainingHoursPrice = addedMinsToHours * hourlyAmount > dailyAmount ? dailyAmount : addedMinsToHours * hourlyAmount;
  const dayPrice = timeDiffDays * dailyAmount;

  const tempDurationPrice = dayPrice + remainingHoursPrice;
  // console.log(tempDurationPrice);
  return tempDurationPrice;
};

// Get total duration price using daily and hourly rates
export const getDurationPrice = async (startTime: string | Date | Dayjs, endTime: string | Date | Dayjs, dailyRates: number, hourlyRates: number) => {
  const timeDiffMins = dayjs(endTime).diff(dayjs(startTime), 'minute');
  const timeDiffHours = dayjs(endTime).diff(dayjs(startTime), 'hour');
  const timeDiffDays = dayjs(endTime).diff(dayjs(startTime), 'day');

  // Calculate remaining hours
  const remainingHours = timeDiffHours % 24;
  const remainingMinutes = timeDiffMins % 60;
  // console.log(timeDiffHours, timeDiffDays, timeDiffWeek, remainingHours);

  const durationPrice = await calculateDurationPrice2(timeDiffDays, remainingHours, remainingMinutes, dailyRates, hourlyRates);

  return durationPrice;
};

// calculates peak increase discount
export const calculatePeakIncreasePrice = async (dailyRate: number, currentPrice: number, peakIncreaseList: any) => {
  // console.log(currentPrice);
  // console.log(peakIncreaseList);
  let tempPeakIncreasePrice = 0;
  let incPrice = 0;

  if (peakIncreaseList[0]?.increaseType === 'percentage') {
    // console.log(peakIncreaseList[0]?.increaseType);
    // incPrice = currentPrice * (peakIncreaseList[0]?.percentage / 100) * peakIncreaseList?.length;
    incPrice = parseFloat((dailyRate * (peakIncreaseList[0]?.percentage / 100) * peakIncreaseList?.length).toFixed(2));
    // console.log(incPrice);
    tempPeakIncreasePrice = parseFloat((currentPrice + incPrice).toFixed(2));
  } else {
    incPrice = parseFloat((peakIncreaseList[0]?.amount * peakIncreaseList?.length).toFixed(2));
    tempPeakIncreasePrice = parseFloat((currentPrice + incPrice).toFixed(2));
  }

  return { tempPeakIncreasePrice, incPrice };
};

// calculates discount for advance reservation & long reservation
export const commonDiscountCalculation = async (discountList: any, convertedList: any, currentPrice: number, discountType: string) => {
  const sortedList = discountList.sort((a: any, b: any) => a.convertedDays - b.convertedDays);
  const highestDiscount = sortedList[sortedList?.length - 1];
  // console.log(sortedList, highestDiscount);

  const discountedAmount = parseFloat((currentPrice * (highestDiscount?.percentage / 100)).toFixed(2));
  // console.log(currentPrice, discountedAmount);
  const tempDiscountedPrice = parseFloat((currentPrice - discountedAmount).toFixed(2));
  const text =
    discountType === 'advance'
      ? `${highestDiscount?.percentage}% off for early reservation`
      : `${highestDiscount?.percentage}% off for ${highestDiscount?.value}+ ${
          highestDiscount?.value > 1 ? `${highestDiscount?.unit}` : `${highestDiscount?.unit.slice(0, -1)}`
        }`;
  const highestData = {
    calculatedAmount: discountedAmount,
    text: text,
    duration: highestDiscount?.value,
    durationUnit: highestDiscount?.unit,
    percentage: highestDiscount?.percentage,
  };

  let nextHighestData = {
    amount: 0,
    text: '',
  };

  // calculate next highest discount for long reservation
  if (discountType === 'long') {
    const nextHighestDiscountList = await convertedList?.filter((dis: any) => dis?.convertedDays > highestDiscount?.convertedDays);
    nextHighestData = await calculateNextHighestLongDiscount(nextHighestDiscountList);
    // console.log(nextHighestData);
  }

  return { highestData, tempDiscountedPrice, nextHighestData };
};

export const calculateNextHighestLongDiscount = async (nextHighestDiscountList: any) => {
  let nextHighestData = {
    amount: 0,
    text: '',
  };

  if (nextHighestDiscountList?.length > 0) {
    const nextHighestDiscount = nextHighestDiscountList.sort((a: any, b: any) => a.convertedDays - b.convertedDays)[0];
    nextHighestData = {
      amount: nextHighestDiscount?.percentage,
      text: `${nextHighestDiscount?.value}+ ${
        nextHighestDiscount?.value > 1 ? `${nextHighestDiscount?.unit}` : `${nextHighestDiscount?.unit.slice(0, -1)}`
      }`,
    };
  }
  return nextHighestData;
};

// Availability functions------------------------------------
export const verifyMinTravelDays = async (
  unit: string,
  shortestDuration: number,
  timeDiffHours: number,
  timeDiffDays: number,
  timeDiffMins: number
) => {
  // console.log(shortestDuration, unit);
  // console.log(timeDiffHours, timeDiffDays, timeDiffWeek);
  if (unit === 'hours') {
    return timeDiffHours >= shortestDuration;
  }

  if (unit === 'days') {
    return timeDiffDays >= shortestDuration;
  }

  if (unit === 'weeks') {
    const convertedMinutes = dayjs.duration({ weeks: shortestDuration }).as('minutes');
    return timeDiffMins >= convertedMinutes;
  }
};

export const verifyMaxTravelDays = async (unit: string, longestDuration: number, timeDiffMins: number) => {
  if (unit === 'days') {
    const convertedMinutes = dayjs.duration({ days: longestDuration }).as('minutes');
    return timeDiffMins <= convertedMinutes;
  }

  if (unit === 'weeks') {
    const convertedMinutes = dayjs.duration({ weeks: longestDuration }).as('minutes');
    return timeDiffMins <= convertedMinutes;
  }
};

export const verifyCustomAvailability = async (
  customAvailability: any,
  pickupDateTime: string,
  returnDateTime: string,
  timeDiffHours: number,
  sameDay: boolean
) => {
  const allDates = await getDatesInRange(pickupDateTime, returnDateTime);
  const selectedDays = await getSelectedDaysAvailability(allDates, customAvailability);
  // console.log(allDates);
  // console.log(selectedDays);
  console.log(sameDay);

  const alwaysAvailableDaysList = selectedDays?.filter((day: any) => day?.availability === 'always');

  // Duration is valid when all selected day is available all day
  if (alwaysAvailableDaysList?.length === selectedDays?.length) {
    return true;
  }

  // Duration is invalid when any selected day is unavailable
  const neverAvailableDayList = selectedDays?.filter((day: any) => day?.availability === 'never');
  // console.log(neverAvailableDayList);
  // Duration is invalid when any selected day is unavailable
  if (neverAvailableDayList?.length > 0) {
    return false;
  }

  const customDaysList = selectedDays?.filter((day: any) => day?.availability === 'custom');
  // console.log(customDaysList);

  // Duration is invalid when duration is more than a day & any selected day has custom time slots
  // if (timeDiffHours > 24 && customDaysList?.length > 0) {
  if (!sameDay && customDaysList?.length > 0) {
    return false;
  }

  // if (timeDiffHours <= 24) {
  if (sameDay) {
    const isValid = validateSingleReservationDay(selectedDays, pickupDateTime, returnDateTime);
    console.log(isValid);
    return isValid;
  }
};

// --- Validate custom availability
export const verifyCustomPickupReturn = async (
  customAvailability: any,
  pickupDateTime: string | Date,
  returnDateTime: string | Date,
  timeDiffHours: number,
  sameDay: boolean
) => {
  const allDates = await getDatesInRange(pickupDateTime, returnDateTime);
  const selectedDays = await getSelectedDaysAvailability(allDates, customAvailability);
  // console.log(selectedDays);
  const pickupData = { ...allDates[0], dateTime: pickupDateTime };
  const returnData = { ...allDates[allDates?.length - 1], dateTime: returnDateTime };

  const isPickupValid = validateSinglePickupReturn(selectedDays, pickupData);
  const isReturnValid = validateSinglePickupReturn(selectedDays, returnData);
  // console.log(isPickupValid, isReturnValid);
  return { isPickupValid, isReturnValid, pickupData, returnData };
};

// --- Pickup / return date validation with host given custom availability
export const validateSinglePickupReturn = (selectedDayList: any, selectedDateTimeData: any) => {
  const selectedDayAvailability = selectedDayList?.find(
    (selected: any) => selected?.dayName === selectedDateTimeData?.dayName && selected?.date === selectedDateTimeData?.date
  );
  // console.log(selectedDayAvailability);

  if (selectedDayAvailability?.availability === 'never') {
    // console.log('never');
    return false;
  }

  if (selectedDayAvailability?.availability === 'always') {
    // console.log('always');
    return true;
  }

  if (selectedDayAvailability?.availability === 'custom') {
    // console.log('custom');
    const isBetweenFreeHours = selectedDayAvailability?.customHours?.some(
      (hours: any) => hours.status === 'free' && isTimeInBetweenUtc(hours.startTime, hours.endTime, selectedDateTimeData?.dateTime)
    );
    // console.log(isBetweenFreeHours);
    return isBetweenFreeHours;
  }
};

export const isTimeInBetween = (startTime: TDate, endTime: TDate, selectedTime: TDate) => {
  const combinedStartTime = combineDateTime(dayjs(selectedTime), dayjs(startTime));
  const combinedEndTime = combineDateTime(dayjs(selectedTime), dayjs(endTime));

  const isValid = dayjs(selectedTime).isBetween(dayjs(combinedStartTime), dayjs(combinedEndTime), 'minute', '[]'); //'[]' means start and end days are included

  return isValid;
};

export const getDatesInRange = async (pickupDateTime: TDate, returnDateTime: TDate) => {
  const startDate = dayjsUtc(pickupDateTime);
  const endDate = dayjsUtc(returnDateTime);

  const dateArray = [];
  let currentDate = startDate;

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
    dateArray.push({
      date: currentDate.format('YYYY-MM-DD'),
      dayName: currentDate.format('ddd'), // 'ddd' for abbreviated names, 'dddd' for full names
    });
    currentDate = currentDate.add(1, 'day');
  }

  return dateArray;
};

export const getSelectedDaysAvailability = async (selectedDayList: any, availability: any) => {
  const updatedAllDates = selectedDayList?.map((dateInfo: any) => {
    const matchingAvailability = availability.find((avail: any) => avail.dayOfWeek.toLowerCase() === dateInfo.dayName.toLowerCase());

    if (matchingAvailability) {
      // If there is a match, add availability and customHours to the dateInfo
      return {
        ...dateInfo,
        availability: matchingAvailability.availability,
        customHours: matchingAvailability.customHours,
      };
    } else {
      // If there is no match, leave availability and customHours undefined
      return dateInfo;
    }
  });

  return updatedAllDates;
};

export const validateSingleReservationDay = (selectedDayList: any, pickupDateTime: string, returnDateTime: string) => {
  const selectedDate = selectedDayList[0];
  const isBetweenFreeHours = selectedDate?.customHours?.some(
    (hours: any) => hours.status === 'free' && isTimeInRange(hours.startTime, hours.endTime, pickupDateTime, returnDateTime)
  );
  return isBetweenFreeHours;
};

export const isTimeInRange = (startTime: string, endTime: string, pickupTime: string, returnTime: string) => {
  const startTimeOfDay = dayjs(startTime).format('HH:mm');
  const endTimeOfDay = dayjs(endTime).format('HH:mm');
  const pickupTimeOfDay = dayjs(pickupTime).format('HH:mm');
  const returnTimeOfDay = dayjs(returnTime).format('HH:mm');
  // console.log(pickupTimeOfDay, startTimeOfDay);
  // console.log(returnTimeOfDay, endTimeOfDay);

  return pickupTimeOfDay >= startTimeOfDay && returnTimeOfDay <= endTimeOfDay;
};

// --- Validate selected dates with existing confirmed / pending reservations
export const validateReservations = async (reservationList: any, pickupDate: string | Date, returnDate: string | Date) => {
  // console.log(reservationList);
  const updatedReservationList = await getUpdatedReservationDates(reservationList);
  // console.log(updatedReservationList);

  const modifiedReservations = updatedReservationList?.map((reservation: any) => {
    const tempStartDate = dayjs(reservation.startDate);
    const tempEndDate = dayjs(reservation.endDate);

    // Add 30 minutes to the endDate and subtract 30 minutes from the startDate
    const modifiedStartDate = tempStartDate.subtract(29, 'minutes').startOf('minute');
    const modifiedEndDate = tempEndDate.add(29, 'minutes').startOf('minute');

    return {
      startDate: modifiedStartDate.toISOString(),
      endDate: modifiedEndDate.toISOString(),
    };
  });

  // console.log(modifiedReservations);

  // const isPickupBetween = dayjs(pickupDate).isBetween(dayjs(reservationList[1]?.startDate), dayjs(reservationList[1].endDate), 'minute', '[]');
  // const isReturnBetween = dayjs(returnDate).isBetween(dayjs(reservationList[1]?.startDate), dayjs(reservationList[1].endDate), 'minute', '[]');
  // const isReservationStartBetween = dayjs(reservationList[1]?.startDate).isBetween(dayjs(pickupDate), dayjs(returnDate), 'minute', '[]');
  // const isReservationEndBetween = dayjs(reservationList[1].endDate).isBetween(dayjs(pickupDate), dayjs(returnDate), 'minute', '[]');
  // console.log(isPickupBetween, isReturnBetween);
  // console.log(isReservationStartBetween, isReservationEndBetween);

  const areDatesBetween = modifiedReservations?.some((reservation: any) => {
    const isPickupBetween = dayjs(pickupDate).isBetween(dayjs(reservation?.startDate), dayjs(reservation.endDate), 'minute');
    const isReturnBetween = dayjs(returnDate).isBetween(dayjs(reservation?.startDate), dayjs(reservation.endDate), 'minute');
    const isReservationStartBetween = dayjs(reservation?.startDate).isBetween(dayjs(pickupDate), dayjs(returnDate), 'minute');
    const isReservationEndBetween = dayjs(reservation.endDate).isBetween(dayjs(pickupDate), dayjs(returnDate), 'minute');
    // console.log(isPickupBetween, isReturnBetween, isReservationStartBetween, isReservationEndBetween);

    const isBetween = isPickupBetween || isReturnBetween || isReservationStartBetween || isReservationEndBetween;
    return isBetween;
  });
  // console.log(areDatesBetween);

  return areDatesBetween;
};

export const getUpdatedReservationDates = async (reservationList: any): Promise<[TCommonDateRange]> => {
  // console.log(reservationList);
  const updatedList = reservationList?.map((reservation: any) => {
    const { revisedReservations, startDate, endDate, reservationId } = reservation;
    let lastRevision = revisedReservations?.slice(-1)?.[0];
    let isEditPaymentExpired: boolean = false;

    if (lastRevision?.paymentStatus === 'pending') {
      isEditPaymentExpired = getIsEditPaymentExpired(lastRevision?.createdAt);
      // isEditPaymentExpired = dayjs().diff(dayjs(lastRevision?.createdAt), 'minute') > 30;
    }

    // if last revision payment is expired, take the last not pending revision
    if (isEditPaymentExpired) {
      lastRevision = getLastPaidRevisedReservation(revisedReservations);
      // lastRevision = revisedReservations?.filter((revised: any) => revised?.paymentStatus !== 'pending').slice(-1)?.[0];
    }

    return {
      startDate: lastRevision?.newStartDate || startDate,
      endDate: lastRevision?.newEndDate || endDate,
      reservationId,
    };
  });

  return updatedList;
};

// Total Price calculation for new end > current end extension
export const calculateUpcomingTravelTotalPrice = async (
  pickupDateTime: string | Date,
  returnDateTime: string | Date,
  carPriceData: any,
  oldReturnDate?: string | Date,
  isEndExtended?: boolean,
  oldDurationPrice?: number
): Promise<any> => {
  const { longBookingDiscounts, peakIncrease, hourlyRates, dailyRates, currentDailyRates, currentHourlyRates } = carPriceData;
  // console.log(longBookingDiscounts);
  // console.log(peakIncrease);
  // console.log(hourlyRates);
  // console.log(dailyRates);
  // Parse pickup and return date strings into Day.js objects
  const pickupDate = dayjs(pickupDateTime);
  const returnDate = dayjs(returnDateTime);
  const tempOldReturnDate = dayjs(oldReturnDate);

  // Calculate the time difference between pickup & return in hours, days
  const timeDiffMins = returnDate.diff(pickupDate, 'minute');
  const timeDiffHours = returnDate.diff(pickupDate, 'hour');
  const timeDiffDays = returnDate.diff(pickupDate, 'day');

  // Calculate remaining hours
  const remainingHours = timeDiffHours % 24;
  const remainingMinutes = timeDiffMins % 60;
  // console.log(timeDiffHours, timeDiffDays, timeDiffWeek, remainingHours);

  // create list with applicable peak increase price days
  const matchedPeakIncList = await isDayOfWeekInRange(pickupDateTime, returnDateTime, peakIncrease);
  // console.log(peakIncList);

  const convertedLongDiscounts = await convertWeekToDays(longBookingDiscounts);
  const filteredLongDiscounts = convertedLongDiscounts?.filter((dis: any) => timeDiffDays >= dis?.convertedDays);
  // console.log(filteredLongDiscounts);

  let tempTotalPrice = 0;
  let tempLongDisData = {
    calculatedAmount: 0,
    text: '',
  };
  let tempNextLongDisData = {
    amount: 0,
    text: '',
  };
  let tempPeakIncPrice = {};
  let tempDiscountedPrice = {};

  // One: calculate base price taking total duration days and hours
  // const tempDurationPrice = await calculateDurationPrice2(timeDiffDays, remainingHours, remainingMinutes, dailyRates, hourlyRates);

  let tempNewDurationPrice = 0;
  let tempMatchedDurationPrice = 0;

  // new end date > old: take stored matched day price and calculate extended day price
  if (isEndExtended && oldDurationPrice && oldReturnDate) {
    // console.log({ isEndExtended });
    tempNewDurationPrice = await getDurationPrice(oldReturnDate, returnDate, currentDailyRates, currentHourlyRates);
    tempMatchedDurationPrice = oldDurationPrice;
  }

  // new end date < old: calculate matched day price with stored data
  if (!isEndExtended) {
    // console.log({ isEndExtended });
    tempMatchedDurationPrice = await getDurationPrice(pickupDate, returnDate, dailyRates, hourlyRates);
  }

  // console.log({ tempMatchedDurationPrice, tempNewDurationPrice });

  // tempTotalPrice = tempDurationPrice;
  const tempDurationPrice = tempMatchedDurationPrice + tempNewDurationPrice;
  tempTotalPrice = tempDurationPrice;
  // setReservationDuration(duration);
  // setDurationPrice(tempDurationPrice);
  // console.log(tempTotalPrice);

  // Two: add peak increase price if selected day includes host added peak increased days
  if (matchedPeakIncList?.length > 0) {
    const peakDays = matchedPeakIncList?.map((day) => day?.dayOfWeek);
    const { tempPeakIncreasePrice, incPrice } = await calculatePeakIncreasePrice(currentDailyRates, tempTotalPrice, matchedPeakIncList);
    // const { tempPeakIncreasePrice, incPrice } = await calculatePeakIncreasePrice(dailyRates, tempTotalPrice, matchedPeakIncList);
    tempTotalPrice = tempPeakIncreasePrice;
    tempPeakIncPrice = {
      increaseDays: peakDays,
      increaseType: matchedPeakIncList[0]?.increaseType,
      increaseAmount: matchedPeakIncList[0]?.percentage || matchedPeakIncList[0]?.amount,
      calculatedAmount: incPrice,
    };
  }

  const serviceFee = tempTotalPrice * (10 / 100);
  // setServiceFee(serviceFee);

  // Four: apply long reservation discount if applicable
  if (filteredLongDiscounts?.length > 0) {
    const { highestData, tempDiscountedPrice, nextHighestData } = await commonDiscountCalculation(
      filteredLongDiscounts,
      convertedLongDiscounts,
      tempTotalPrice,
      'long'
    );
    tempLongDisData = highestData;
    tempNextLongDisData = nextHighestData;
    tempTotalPrice = tempDiscountedPrice;
    // console.log(tempLongDisData);
    // console.log(tempTotalPrice);
  }

  // Show minimum long discount price when no long discount is applicable
  if (filteredLongDiscounts?.length === 0 && convertedLongDiscounts?.length > 0) {
    tempNextLongDisData = await calculateNextHighestLongDiscount(convertedLongDiscounts);
    // console.log(tempNextLongDisData);
  }

  tempDiscountedPrice = { advanceDiscount: {}, longDiscount: tempLongDisData, nextLongDiscount: tempNextLongDisData };
  // tempTotalPrice = tempTotalPrice + serviceFee;

  // setDiscountedPrice({ advanceDiscount: tempAdvanceDisData, longDiscount: tempLongDisData, nextLongDiscount: tempNextLongDisData });
  // setTotalPrice(tempTotalPrice);
  return { tempDurationPrice, tempPeakIncPrice, tempDiscountedPrice, tempTotalPrice, serviceFee };
};

export const validateBlockDates = async (blockDatesList: TCarBlockDate[], pickupDateTime: TDate, returnDateTime: TDate) => {
  const futureDates = blockDatesList?.filter((blockDate) => !dayjsUtc(blockDate?.start).isBefore(dayjsUtc(pickupDateTime), 'day'));
  let overlappedDate: TCarBlockDate = {} as TCarBlockDate;
  const isCarBlocked = futureDates?.some((blockDate) => {
    const isPickupBetween = dayjsUtc(pickupDateTime).isBetween(dayjsUtc(blockDate?.start), dayjsUtc(blockDate?.end), 'minute', '[]');
    const isReturnBetween = dayjsUtc(returnDateTime).isBetween(dayjsUtc(blockDate?.start), dayjsUtc(blockDate?.end), 'minute', '[]');
    const isBlockStartBetween = dayjsUtc(blockDate?.start).isBetween(dayjsUtc(pickupDateTime), dayjsUtc(returnDateTime), 'minute', '[]');
    const isBlockEndBetween = dayjsUtc(blockDate?.end).isBetween(dayjsUtc(pickupDateTime), dayjsUtc(returnDateTime), 'minute', '[]');
    // console.log(isPickupBetween, isReturnBetween, isBlockStartBetween, isBlockEndBetween);

    const isBetween = isPickupBetween || isReturnBetween || isBlockStartBetween || isBlockEndBetween;
    overlappedDate = isBetween ? blockDate : ({} as TCarBlockDate);
    return isBetween;
  });

  return { isCarBlocked, overlappedDate };
};

// get future reservation of the selected return date time
export const getFutureReservations = (sortedDates: TCommonDateRange[], returnDateTime: TDate) => {
  const returnDateTimeUtc = getPickerTimeStringInUtc(returnDateTime);
  return sortedDates.filter((reservation) => dayjsUtc(reservation.startDate).isAfter(returnDateTimeUtc.formattedTimeDayObj, 'minute')) ?? [];
};

// sort reservations
export const handleSortReservations = async (singleCarReservationList: TVehicleReservation[]) => {
  const updatedDates = await getUpdatedReservationDates(singleCarReservationList);
  return updatedDates.sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate));
};