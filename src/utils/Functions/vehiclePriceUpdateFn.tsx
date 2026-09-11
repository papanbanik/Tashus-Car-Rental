import { DiscountedPriceType, TPeakIncreasePrice } from '@/context/SearchProvider';
import { CarDataCustomPricing } from '@/types/car-listing/carPricingTypes';
import { TSingleCarBlockDate } from '@/types/car-search/availabilityValidationTypes';
import { TDate } from '@/types/commonTypes';
import {
  CustomPricing,
  ICustomPricing,
  IndividualPricing,
  PeakIncreaseType,
  ReservationPriceListType,
  TPeakIncreasedDates,
} from '@/types/user-profile/customPriceTypes';
import dayjs, { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction } from 'react';
import { generateRateChange } from './advancedCalenderFn';
import { formatDateToLocal, getRoundUpStartTime } from './dateTimeCommonFn';
import { parseFloatWithPrecision } from './lodashHelperFn';
import { calculatePeakIncreasePrice, isDayOfWeekInRange, validateBlockDates } from './reservationValidationFn';
import { convertDateToUtc, dayjsUtc, formatDateUtc, utcCurrentTime } from './utcCommonFn';

//Handle All Block Date Time Validation
export const handleAllDayBlockDates = async (
  pickupDateTime: TDate,
  returnDateTime: TDate,
  singleCarBlockDates: TSingleCarBlockDate,
  setAvailabilityErrorText: Dispatch<SetStateAction<string>>
) => {
  const { isCarBlocked, overlappedDate } = await validateBlockDates(singleCarBlockDates?.allDayList, pickupDateTime, returnDateTime);
  if (isCarBlocked) {
    const startDate = formatDateUtc(overlappedDate?.start); //utc
    const endDate = formatDateToLocal(overlappedDate?.end);
    setAvailabilityErrorText(`Blocked all day on ${startDate}`); //utc
    return false;
  }
  return true;
};

//Handle Date Time Validation
export const handleDateTimeValidation = async (pickupTime: Dayjs, returnTime: Dayjs, setTimeErrorText: Dispatch<SetStateAction<string>>) => {
  let isValid = true;
  const updatedPickup = pickupTime?.second(0).millisecond(0);
  const updatedReturn = returnTime?.second(0).millisecond(0);
  const minuteDiff = updatedReturn.diff(updatedPickup, 'minute');
  const isReturnBeforePickup = updatedReturn.isBefore(updatedPickup, 'minute');
  const isPickupReturnSame = updatedReturn.isSame(updatedPickup, 'minute');
  const minimumPickupTime = dayjs(getRoundUpStartTime(15)).second(0).millisecond(0); //set minimum start time
  const isPickupPast = updatedPickup.isBefore(minimumPickupTime, 'minute');

  if (isPickupPast) {
    setTimeErrorText('Pickup time must has to be 15 minutes after current time');
    isValid = false;
    return isValid;
  }

  if (minuteDiff < 60) {
    setTimeErrorText('Duration needs to be minimum 1 hr');
    isValid = false;
    return isValid;
  }

  if (isReturnBeforePickup || isPickupReturnSame) {
    setTimeErrorText('Invalid time');
    isValid = false;
    return isValid;
  }

  setTimeErrorText('');
  return isValid;
};

//Get Reservation Price List
export const getReservationPriceList = async (
  pickupDateTime: TDate,
  returnDateTime: TDate,
  defaultDailyPrice: number,
  defaultHourlyPrice: number,
  customPricing: CarDataCustomPricing[],
  peakIncreaseList: PeakIncreaseType[],
  setReservationCustomPriceList?: Dispatch<SetStateAction<ICustomPricing[]>>
): Promise<{ reservationPriceList: ReservationPriceListType[]; peakIncreasedDates: TPeakIncreasedDates[] }> => {
  const reservationPriceList: ReservationPriceListType[] = [];
  const tempReservationCustomPriceList: ICustomPricing[] = [];
  const peakIncreasedDates: TPeakIncreasedDates[] = [];

  // const pickupDate = dayjs(pickupDateTime);
  // const returnDate = dayjs(returnDateTime);

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
    // Check if the current date matches any date in custom pricing
    const matchedCustomPrice = (customPricing || [])?.find((customPrice: any) => {
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
      dailyPrice = matchedCustomPrice?.updatedDailyRates;
      hourlyPrice = matchedCustomPrice?.updatedHourlyRates;
      rateDailyChange = rateChangeResult?.rateDailyChange;
      rateHourlyChange = rateChangeResult?.rateHourlyChange;
      dailyDiff = rateChangeResult?.dailyDiff;
      hourlyDiff = rateChangeResult?.hourlyDiff;

      // create custom price list to save to DB
      const utcDate = convertDateToUtc(currentDate);
      tempReservationCustomPriceList.push({
        date: utcDate?.formattedDateString,
        dailyRates: defaultDailyPrice,
        hourlyRates: defaultHourlyPrice,
        updatedDailyRates: matchedCustomPrice?.updatedDailyRates,
        updatedHourlyRates: matchedCustomPrice?.updatedHourlyRates,
      });
    } else {
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
        // Track peak increased day
        peakIncreasedDates.push({
          reservationDate: currentDate,
          dailyPrice: parseFloatWithPrecision(dailyPrice),
          hourlyPrice: parseFloatWithPrecision(hourlyPrice),
        });
      }
      const rateChangeResult = generateRateChange(defaultDailyPrice, dailyPrice, defaultHourlyPrice, hourlyPrice);
      rateDailyChange = rateChangeResult?.rateDailyChange;
      rateHourlyChange = rateChangeResult?.rateHourlyChange;
      dailyDiff = rateChangeResult?.dailyDiff;
      hourlyDiff = rateChangeResult?.hourlyDiff;
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
  return {
    reservationPriceList,
    peakIncreasedDates,
  };
};

//Common Function to get Date Range
export const getDatesInRange = async (pickupDateTime: TDate, returnDateTime: TDate) => {
  const startDate = dayjs(pickupDateTime);
  const endDate = dayjs(returnDateTime);

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

//Calculate duration price
export const calculateNewDurationPrice = async (
  timeDiffDays: number,
  remainingHours: number,
  remainingMinutes: number,
  reservationAmount: ReservationPriceListType[]
): Promise<{ tempDurationPrice: number; duration: string; individualPrices: IndividualPricing[] }> => {
  let tempDurationPrice = 0;
  let duration = '';
  let dayIndex = 0;
  let dailyAmount = 0;
  let hourlyAmount = 0;
  //Add for individual prices
  let individualPrices: IndividualPricing[] = [];
  let currentDate = reservationAmount?.length > 0 ? dayjs(reservationAmount[0].date) : dayjs();
  //console.log(reservationAmount);
  // Calculate price for full days
  for (let i = 0; i < timeDiffDays; i++) {
    if (dayIndex < reservationAmount.length) {
      dailyAmount = reservationAmount[dayIndex].dailyPrice;
      tempDurationPrice += dailyAmount;
      //add Individual Price
      individualPrices.push({
        date: dayjsUtc(currentDate),
        price: dailyAmount,
      });
      currentDate = currentDate.add(1, 'day');
      dayIndex++;
    }
  }
  //console.log(tempDurationPrice);
  // Calculate price for remaining hours and minutes
  if (dayIndex < reservationAmount.length) {
    hourlyAmount = reservationAmount[dayIndex].hourlyPrice;
    dailyAmount = reservationAmount[dayIndex].dailyPrice;

    const addedMinsToHours = remainingHours + (remainingMinutes > 0 ? 1 : 0); // Add one hour to remaining hours if remaining mins exist
    const remainingHoursPrice = Math.min(addedMinsToHours * hourlyAmount, dailyAmount);

    tempDurationPrice += remainingHoursPrice;
    //remaining individual hours price
    individualPrices.push({
      date: dayjsUtc(currentDate),
      price: remainingHoursPrice,
    });
  }
  //console.log(tempDurationPrice);

  const minDuration = remainingMinutes > 0 ? `${remainingMinutes} ${remainingMinutes > 1 ? 'mins ' : 'min '}` : '';
  const hourDuration = remainingHours > 0 ? `${remainingHours} ${remainingHours > 1 ? 'hrs ' : 'hr '}` : '';
  const dayDuration = timeDiffDays > 0 ? `${timeDiffDays} ${timeDiffDays > 1 ? 'days ' : 'day '}` : '';

  duration = `${dayDuration}${hourDuration}${minDuration}`;

  return { tempDurationPrice: parseFloat(tempDurationPrice.toFixed(2)), duration, individualPrices };
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

export const calculateTotalPrice = async (
  pickupDateTime: string,
  returnDateTime: string,
  carData: any,
  setReservationPriceList: Dispatch<SetStateAction<ReservationPriceListType[]>>,
  setReservationDuration: Dispatch<SetStateAction<string>>,
  setDurationPrice: Dispatch<SetStateAction<number>>,
  setServiceFee: Dispatch<SetStateAction<number>>,
  setDiscountedPrice: Dispatch<SetStateAction<DiscountedPriceType>>,
  setTotalPrice: Dispatch<SetStateAction<number>>,
  setReservationCustomPriceList: Dispatch<SetStateAction<ICustomPricing[]>>,
  setPeakIncPrice: Dispatch<SetStateAction<TPeakIncreasePrice>>,
  setIndividualPriceList: Dispatch<SetStateAction<IndividualPricing[]>>
) => {
  const {
    longBookingDiscounts,
    advanceBookingDiscounts,
    peakIncrease,
    hourlyRates,
    dailyRates,
    customPricing,
    longBookingDiscountActive = true,
    advanceBookingDiscountActive = true,
  } = carData?.rates;

  // Parse pickup and return date strings into Day.js objects
  const pickupDate = dayjs(pickupDateTime);
  const returnDate = dayjs(returnDateTime);

  const totalDuration = dayjs.duration(returnDate.second(0).millisecond(0).diff(pickupDate.second(0).millisecond(0)));
  // Convert the duration to milliseconds
  const totalMilliseconds = totalDuration.asMilliseconds();

  // Convert milliseconds to days, hours, and minutes
  const timeDiffDays = Math.floor(totalMilliseconds / (24 * 60 * 60 * 1000)); // Days
  const remainingMillisAfterDays = totalMilliseconds % (24 * 60 * 60 * 1000); // Remaining milliseconds after days
  const remainingHours = Math.floor(remainingMillisAfterDays / (60 * 60 * 1000)); // Hours
  const remainingMillisAfterHours = remainingMillisAfterDays % (60 * 60 * 1000); // Remaining milliseconds after hours
  const remainingMinutes = Math.floor(remainingMillisAfterHours / (60 * 1000)); // Minutes
  // create list with applicable reservation price days including custom and peak increase prices
  const { reservationPriceList } = await getReservationPriceList(
    pickupDateTime,
    returnDateTime,
    dailyRates?.amount,
    hourlyRates?.amount,
    customPricing,
    peakIncrease,
    setReservationCustomPriceList
  );
  setReservationPriceList(reservationPriceList);
  // Calculate the time difference between pickup & today in days
  // const advanceDayDiff = pickupDate.diff(currentDateTime, 'day');
  const advanceDayDiff = pickupDate.diff(utcCurrentTime?.formattedTimeDayObj, 'day');
  const convertedLongDiscounts = await convertWeekToDays(longBookingDiscounts);
  const filteredLongDiscounts = convertedLongDiscounts?.filter((dis: any) => timeDiffDays >= dis?.convertedDays);
  // console.log(filteredLongDiscounts);
  const convertedAdvanceDiscounts = await convertWeekToDays(advanceBookingDiscounts);
  const filteredAdvanceDiscounts = convertedAdvanceDiscounts?.filter((dis: any) => advanceDayDiff >= dis?.convertedDays);
  // console.log(filteredAdvanceDiscounts);
  let tempTotalPrice = 0;
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
  // One: calculate base price taking total duration days and hours
  const { tempDurationPrice, duration, individualPrices } = await calculateNewDurationPrice(
    timeDiffDays,
    remainingHours,
    remainingMinutes,
    reservationPriceList
  );
  tempTotalPrice = tempDurationPrice;
  setReservationDuration(duration);
  setDurationPrice(tempDurationPrice);
  setIndividualPriceList(individualPrices); //Set Individual Prices
  //peak increase price set if selected day includes host added peak increased days
  // create list with applicable peak increase price days
  const peakIncList = await isDayOfWeekInRange(pickupDateTime, returnDateTime, peakIncrease);
  if (peakIncList?.length > 0) {
    const peakDays = peakIncList?.map((day) => day?.dayOfWeek);
    const { incPrice } = await calculatePeakIncreasePrice(dailyRates?.amount, tempTotalPrice, peakIncList);
    setPeakIncPrice({
      increaseDays: peakDays,
      increaseType: peakIncList[0]?.increaseType,
      increaseAmount: peakIncList[0]?.percentage || peakIncList[0]?.amount,
      calculatedAmount: incPrice,
    });
  }
  // Two: add service fee for Tashus
  //const serviceFee = parseFloat((tempTotalPrice * (10 / 100))?.toFixed(2));
  const serviceFee = 0; //modify for car rental
  setServiceFee(serviceFee);
  // Three: apply long reservation discount if applicable
  if (filteredLongDiscounts?.length > 0 && longBookingDiscountActive) {
    const { highestData, tempDiscountedPrice, nextHighestData } = await commonDiscountCalculation(
      filteredLongDiscounts,
      convertedLongDiscounts,
      tempTotalPrice,
      'long'
    );
    tempLongDisData = highestData;
    tempNextLongDisData = nextHighestData;
    tempTotalPrice = tempDiscountedPrice;
  }
  // Show minimum long discount price when no long discount is applicable
  if (filteredLongDiscounts?.length === 0 && convertedLongDiscounts?.length > 0) {
    tempNextLongDisData = await calculateNextHighestLongDiscount(convertedLongDiscounts);
  }
  // Four: apply advance reservation discount if applicable
  if (filteredAdvanceDiscounts?.length > 0 && advanceBookingDiscountActive) {
    const { highestData, tempDiscountedPrice } = await commonDiscountCalculation(
      filteredAdvanceDiscounts,
      convertedAdvanceDiscounts,
      tempTotalPrice,
      'advance'
    );
    tempAdvanceDisData = highestData;
    tempTotalPrice = tempDiscountedPrice;
  }
  setDiscountedPrice({ advanceDiscount: tempAdvanceDisData, longDiscount: tempLongDisData, nextLongDiscount: tempNextLongDisData });
  tempTotalPrice = parseFloat((tempTotalPrice + serviceFee).toFixed(2));
  setTotalPrice(tempTotalPrice);
};

// export const getReservationPriceList = async (
//   pickupDateTime: TDate,
//   returnDateTime: TDate,
//   defaultDailyPrice: number,
//   defaultHourlyPrice: number,
//   customPricing: CustomPricing[]
// ): Promise<ReservationPriceListType[]> => {
//   const reservationPriceList: ReservationPriceListType[] = [];
//   const pickupDate = dayjs(pickupDateTime);
//   const returnDate = dayjs(returnDateTime);
//   // Iterate through each day from pickup to return date
//   let currentDate = pickupDate;
//   while (currentDate.isBefore(returnDate, 'day') || currentDate.isSame(returnDate, 'day')) {
//     // Check if the current date matches any date in custom pricing
//     if (customPricing.length > 0) {
//       const matchedCustomPrice = customPricing.find((customPrice: any) => {
//         const customPriceDate = dayjs(customPrice.date);
//         return currentDate.isSame(customPriceDate, 'day');
//       });
//       if (matchedCustomPrice) {
//         // Use the custom rates if available
//         reservationPriceList.push({
//           date: currentDate.toDate(),
//           dailyPrice: matchedCustomPrice.updatedDailyRates,
//           hourlyPrice: matchedCustomPrice.updatedHourlyRates,
//         });
//       } else {
//         // Use the default rates if no custom rate is found
//         reservationPriceList.push({
//           date: currentDate.toDate(),
//           dailyPrice: defaultDailyPrice,
//           hourlyPrice: defaultHourlyPrice,
//         });
//       }
//     } else {
//       reservationPriceList.push({
//         date: currentDate.toDate(),
//         dailyPrice: defaultDailyPrice,
//         hourlyPrice: defaultHourlyPrice,
//       });
//     }
//     // Move to the next day
//     currentDate = currentDate.add(1, 'day');
//   }
//   return reservationPriceList;
// };
//Calculate duration price Current Travel
export const calculateNewDurationPriceUpdated = async (
  startDate: TDate,
  endDate: TDate,
  defaultDailyPrice: number,
  defaultHourlyPrice: number,
  customPricing: CustomPricing[],
  peakIncreaseList: PeakIncreaseType[]
): Promise<{ tempDurationPrice: number; duration: string; individualPrices: IndividualPricing[] }> => {
  // Parse pickup and return date strings into Day.js objects
  const pickupDate = dayjs(startDate);
  const returnDate = dayjs(endDate);
  // // Calculate the time difference between pickup & return in hours, days+
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
  //generate reservation Amount
  const { reservationPriceList: reservationAmount } = await getReservationPriceList(
    startDate,
    endDate,
    defaultDailyPrice,
    defaultHourlyPrice,
    customPricing,
    peakIncreaseList
  );
  let tempDurationPrice = 0;
  let duration = '';
  let dayIndex = 0;
  let dailyAmount = 0;
  let hourlyAmount = 0;
  //Add for individual prices
  let individualPrices: IndividualPricing[] = [];
  let currentDate = reservationAmount?.length > 0 ? dayjs(reservationAmount[0].date) : dayjs();
  //console.log(reservationAmount);
  // Calculate price for full days
  for (let i = 0; i < timeDiffDays; i++) {
    if (dayIndex < reservationAmount?.length) {
      dailyAmount = reservationAmount[dayIndex].dailyPrice;
      tempDurationPrice += dailyAmount;
      //add Individual Price
      individualPrices.push({
        date: dayjsUtc(currentDate),
        price: dailyAmount,
      });
      currentDate = currentDate.add(1, 'day');
      dayIndex++;
    }
  }
  //console.log(tempDurationPrice);
  // Calculate price for remaining hours and minutes
  if (dayIndex < reservationAmount?.length) {
    hourlyAmount = reservationAmount[dayIndex].hourlyPrice;
    dailyAmount = reservationAmount[dayIndex].dailyPrice;

    const addedMinsToHours = remainingHours + (remainingMinutes > 0 ? 1 : 0); // Add one hour to remaining hours if remaining mins exist
    const remainingHoursPrice = Math.min(addedMinsToHours * hourlyAmount, dailyAmount);

    tempDurationPrice += remainingHoursPrice;
    //remaining individual hours price
    individualPrices.push({
      date: dayjsUtc(currentDate),
      price: remainingHoursPrice,
    });
  }
  //console.log(tempDurationPrice);

  const minDuration = remainingMinutes > 0 ? `${remainingMinutes} ${remainingMinutes > 1 ? 'mins ' : 'min '}` : '';
  const hourDuration = remainingHours > 0 ? `${remainingHours} ${remainingHours > 1 ? 'hrs ' : 'hr '}` : '';
  const dayDuration = timeDiffDays > 0 ? `${timeDiffDays} ${timeDiffDays > 1 ? 'days ' : 'day '}` : '';

  duration = `${dayDuration}${hourDuration}${minDuration}`;

  return { tempDurationPrice: parseFloat(tempDurationPrice.toFixed(2)), duration, individualPrices };
};
