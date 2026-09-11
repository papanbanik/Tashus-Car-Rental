import { TDiscountedPrice } from '@/context/SearchProvider';
import { CarDataBookingDiscount, CarDataBookingUnitValues } from '@/types/car-listing/carPricingTypes';
import { TDate } from '@/types/commonTypes';
import { TDiscountInfo } from '@/types/travels/typeEditTravels';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { calculateWithPrecision, parseFloatWithPrecision } from '../lodashHelperFn';
import { getSingularPluralNoun, isDevelopment } from '../randomCommonFn';
import { utcCurrentTime } from '../utcCommonFn';
import { calculateNextHighestLongDiscount, commonDiscountCalculation, convertWeekToDays } from '../vehiclePriceUpdateFn';
dayjs.extend(isBetween);

export const getLongDiscountTooltip = (appliedPrice: number, additionalDays: number, unit: string): string => {
  // const dayText = getSingularPluralNoun('Day', additionalDays);
  const longInfoMessage = `Discount applied on $${appliedPrice} for ${additionalDays} ${getSingularPluralNoun('day', additionalDays)} reservation`;
  return longInfoMessage;
};

export const getNextLongDiscountInfo = (discountAmount: number, discountInfo: string): string => {
  const nextLongInfoMessage = `Enjoy $${discountAmount}% off for ${discountInfo} of travel`;
  return nextLongInfoMessage;
};

//!Will Not Used
export const getLongDiscountTooltipOld = (appliedPrice: number, additionalDays: number, unit: string): string => {
  // const dayText = getSingularPluralNoun('Day', additionalDays);
  const longInfoMessage = isDevelopment
    ? `Discount applied on $${appliedPrice} for ${additionalDays} ${unit}`
    : `Discount applied to the price for ${additionalDays} ${unit}`;
  return longInfoMessage;
};

//!Will Not Used
export const getAdvanceDiscountTooltip = (appliedPrice: number, advanceDays: number, unit: string): string => {
  // const dayText = getSingularPluralNoun('Day', advanceDays);
  const advInfoMessage = isDevelopment
    ? `Discount applied to $${appliedPrice} for booking ${advanceDays} ${unit} in advance`
    : `Discount applied for booking ${advanceDays} ${unit} in advance`;
  return advInfoMessage;
};

//!Will Not Used
//TODO: Need to remove getEditTravelDiscountsM Fn later
export const getEditTravelDiscountsM = async ({
  totalPrice,
  pickupDate: newPickupDate,
  returnDate: newReturnDate,
  oldPickupDate,
  oldReturnDate,
  longBookingDiscounts,
  advanceBookingDiscounts,
  longBookingDiscountActive = true,
  advanceBookingDiscountActive = true,
}: {
  totalPrice: number;
  pickupDate: TDate;
  returnDate: TDate;
  oldPickupDate: TDate;
  oldReturnDate: TDate;
  longBookingDiscounts: CarDataBookingDiscount[];
  advanceBookingDiscounts?: CarDataBookingDiscount[];
  longBookingDiscountActive?: boolean;
  advanceBookingDiscountActive?: boolean;
}) => {
  // Calculate old and new durations
  const oldDurationDays = dayjs(oldReturnDate).diff(dayjs(oldPickupDate), 'day');
  const newDurationDays = dayjs(newReturnDate).diff(dayjs(newPickupDate), 'day');
  const additionalDays = newDurationDays - oldDurationDays;
  // Calculate old and new advance booking periods
  //const oldAdvanceDays = dayjs(oldPickupDate).diff(utcCurrentTime?.formattedTimeDayObj, 'day'); // Days in advance for old pickup date
  const newAdvanceDays = dayjs(newReturnDate).diff(utcCurrentTime?.formattedTimeDayObj, 'day'); // Days in advance for new pickup date
  // Convert and filter discounts
  const convertedLongDiscounts = await convertWeekToDays(longBookingDiscounts);
  const convertedAdvanceDiscounts = await convertWeekToDays(advanceBookingDiscounts);

  const filteredLongDiscounts = convertedLongDiscounts?.filter(
    (dis: any) => newDurationDays >= dis?.convertedDays // Ensure new booking matches discount duration
  );

  const filteredAdvanceDiscounts = convertedAdvanceDiscounts?.filter(
    (dis: any) => newAdvanceDays >= dis?.convertedDays // Ensure new advance days match discount thresholds
  );

  // Initialize discount data
  let tempAdvanceDisData = { calculatedAmount: 0, text: '' };
  let tempLongDisData = { calculatedAmount: 0, text: '' };
  let tempNextLongDisData = { amount: 0, text: '' };
  let tempTotalPrice = totalPrice;

  // Apply long booking discount
  if (filteredLongDiscounts?.length > 0 && longBookingDiscountActive) {
    const applicableLongDiscounts = filteredLongDiscounts.filter(
      (dis: any) => dis?.convertedDays <= additionalDays // Ensure new days align with extended duration
    );
    if (applicableLongDiscounts.length > 0) {
      const { highestData, tempDiscountedPrice, nextHighestData } = await commonDiscountCalculation(
        applicableLongDiscounts,
        convertedLongDiscounts,
        totalPrice,
        'long'
      );
      tempLongDisData = highestData;
      tempNextLongDisData = nextHighestData;
      tempTotalPrice = tempDiscountedPrice;
    }
  }

  // Show next long discount if no long discount is applicable
  if (filteredLongDiscounts?.length === 0 && convertedLongDiscounts?.length > 0 && longBookingDiscountActive) {
    tempNextLongDisData = await calculateNextHighestLongDiscount(convertedLongDiscounts);
  }

  // Apply advance booking discount
  if (filteredAdvanceDiscounts?.length > 0 && advanceBookingDiscountActive) {
    const applicableAdvanceDiscounts = filteredAdvanceDiscounts.filter(
      (dis: any) => dis?.convertedDays <= newAdvanceDays // Ensure advance booking matches updated conditions
    );

    if (applicableAdvanceDiscounts.length > 0) {
      const { highestData, tempDiscountedPrice } = await commonDiscountCalculation(
        applicableAdvanceDiscounts,
        convertedAdvanceDiscounts,
        tempTotalPrice,
        'advance'
      );
      tempAdvanceDisData = highestData;
      tempTotalPrice = tempDiscountedPrice;
    }
  }

  return {
    advanceDiscount: tempAdvanceDisData,
    longDiscount: tempLongDisData,
    nextLongDiscount: tempNextLongDisData,
    tempTotalPrice,
  };
};

//!Will Not Used
//TODO: Need to remove either getEditTravelDiscountsConsiderPrevious or getEditTravelDiscountsExtended Fn later based on decision
//Discount Considering Extended Days
export const getEditTravelDiscountsExtended = async ({
  totalPrice,
  previousDurationPrice,
  pickupDate: newPickupDate,
  returnDate: newReturnDate,
  oldPickupDate,
  oldReturnDate,
  longBookingDiscounts,
  advanceBookingDiscounts,
  longBookingDiscountActive = true,
  advanceBookingDiscountActive = true,
}: {
  totalPrice: number;
  previousDurationPrice: number;
  pickupDate: TDate;
  returnDate: TDate;
  oldPickupDate: TDate;
  oldReturnDate: TDate;
  longBookingDiscounts: CarDataBookingDiscount[];
  advanceBookingDiscounts?: CarDataBookingDiscount[];
  longBookingDiscountActive?: boolean;
  advanceBookingDiscountActive?: boolean;
}) => {
  //*Step 1: Calculate Rent Difference
  //const { difference: rentPrice } = compareValuesWithDetails(totalPrice, previousDurationPrice);
  const rentPrice = calculateWithPrecision('subtract', [totalPrice, previousDurationPrice]); //As compare checking would lead to huge discount when previousPrice is greater than total price
  //*Step 2: Calculate Updated Days Difference
  const oldDurationDays = dayjs(oldReturnDate).diff(dayjs(oldPickupDate), 'day');
  const newDurationDays = dayjs(newReturnDate).diff(dayjs(newPickupDate), 'day');
  const additionalDays = newDurationDays - oldDurationDays;
  // console.log('Days Difference', additionalDays);
  //*Step 3: Calculate Advance Days
  const newAdvanceDays = dayjs(newPickupDate).diff(utcCurrentTime?.formattedTimeDayObj, 'day'); // Days in advance for new pickup date
  // console.log('Advance Booking Days', newAdvanceDays);
  //*Step 4: Convert and filter discounts
  const convertedLongDiscounts = await convertWeekToDays(longBookingDiscounts);
  const convertedAdvanceDiscounts = await convertWeekToDays(advanceBookingDiscounts);
  const filteredLongDiscounts = convertedLongDiscounts?.filter(
    (dis: any) => newDurationDays >= dis?.convertedDays // Ensure new booking matches discount duration
  );
  const filteredAdvanceDiscounts = convertedAdvanceDiscounts?.filter(
    (dis: any) => newAdvanceDays >= dis?.convertedDays // Ensure new advance days match discount thresholds
  );
  //*Step 5: Initialize discount data
  let tempAdvanceDisData = { calculatedAmount: 0, text: '' };
  let tempLongDisData = { calculatedAmount: 0, text: '' };
  let tempNextLongDisData = { amount: 0, text: '' };
  let tempTotalDiscount = 0;
  let longDiscountToolTip = '';
  let advDiscountToolTip = '';
  const discountsInfo: TDiscountInfo = {
    longAppliedPrice: 0,
    advAppliedPrice: 0,
    dayDiff: additionalDays,
    advancedDays: newAdvanceDays,
  };

  let tempTotalPrice = rentPrice > 0 ? rentPrice : totalPrice; // condition applied because if the rentPrice 0 then the percentage discount got 0

  // console.log('Rental Price Difference', rentPrice);

  //*Step 6: Apply long booking discount
  if (filteredLongDiscounts?.length > 0 && longBookingDiscountActive) {
    // console.log('Filtered Long Days', filteredLongDiscounts);
    const applicableLongDiscounts = filteredLongDiscounts.filter(
      (dis: any) => dis?.convertedDays <= additionalDays // Ensure new days align with extended duration
    );
    // console.log('Applicable Long Days', applicableLongDiscounts);
    if (applicableLongDiscounts?.length > 0) {
      const { highestData, tempDiscountedPrice, nextHighestData } = await commonDiscountCalculation(
        applicableLongDiscounts,
        convertedLongDiscounts,
        tempTotalPrice,
        'long'
      );
      discountsInfo.longAppliedPrice = tempTotalPrice ?? 0;
      const discountUnit = `${highestData?.duration > 1 ? `${highestData?.durationUnit}` : `${highestData?.durationUnit.slice(0, -1)}`}`;
      longDiscountToolTip = getLongDiscountTooltip(tempTotalPrice, additionalDays, discountUnit);
      tempLongDisData = highestData;
      tempNextLongDisData = nextHighestData;
      tempTotalPrice = tempDiscountedPrice;
      tempTotalDiscount = highestData?.calculatedAmount ?? 0;
      // console.log('Long Discounted Price', tempDiscountedPrice);
    }
  }

  //*Step 7: Show next long discount if no long discount is applicable
  if (filteredLongDiscounts?.length === 0 && convertedLongDiscounts?.length > 0 && longBookingDiscountActive) {
    tempNextLongDisData = await calculateNextHighestLongDiscount(convertedLongDiscounts);
  }

  //*Step 8: Apply advance booking discount
  if (filteredAdvanceDiscounts?.length > 0 && advanceBookingDiscountActive) {
    // console.log('Filtered Advance Days', filteredAdvanceDiscounts);
    const applicableAdvanceDiscounts = filteredAdvanceDiscounts.filter(
      (dis: any) => dis?.convertedDays <= newAdvanceDays // Ensure advance booking matches updated conditions
    );
    //  console.log('Applicable Advance Days', applicableAdvanceDiscounts);
    if (applicableAdvanceDiscounts.length > 0) {
      const { highestData } = await commonDiscountCalculation(applicableAdvanceDiscounts, convertedAdvanceDiscounts, tempTotalPrice, 'advance');
      discountsInfo.advAppliedPrice = tempTotalPrice ?? 0;
      const discountUnit = `${highestData?.duration > 1 ? `${highestData?.durationUnit}` : `${highestData?.durationUnit.slice(0, -1)}`}`;
      advDiscountToolTip = getAdvanceDiscountTooltip(tempTotalPrice, highestData?.duration, discountUnit);
      tempAdvanceDisData = highestData;
      tempTotalDiscount += highestData?.calculatedAmount ?? 0;
      //   console.log('Advanced Discounted Price', tempDiscountedPrice);
    }
  }
  tempTotalPrice = calculateWithPrecision('subtract', [totalPrice, tempTotalDiscount]);

  return {
    advanceDiscount: tempAdvanceDisData,
    longDiscount: tempLongDisData,
    nextLongDiscount: tempNextLongDisData,
    tempTotalPrice,
    longDiscountToolTip,
    advDiscountToolTip,
    discountsInfo,
  };
};

//!Will Not Used
const convertPreviousLongDiscount = (previousLongDiscount?: TDiscountedPrice): CarDataBookingDiscount[] => {
  if (!previousLongDiscount?.duration || !previousLongDiscount?.durationUnit || !previousLongDiscount?.percentage) {
    return []; // Return an empty array if required fields are missing
  }

  return [
    {
      value: previousLongDiscount.duration,
      unit: previousLongDiscount.durationUnit as CarDataBookingUnitValues,
      percentage: previousLongDiscount.percentage,
    },
  ];
};
//!Will Not Used
export const getEditTravelDiscountsConsiderPrevious = async ({
  totalPrice,
  previousDurationPrice,
  pickupDate: newPickupDate,
  returnDate: newReturnDate,
  oldPickupDate,
  oldReturnDate,
  longBookingDiscounts,
  advanceBookingDiscounts,
  longBookingDiscountActive = true,
  advanceBookingDiscountActive = true,
  previousLongDiscount,
}: {
  totalPrice: number;
  previousDurationPrice: number;
  pickupDate: TDate;
  returnDate: TDate;
  oldPickupDate: TDate;
  oldReturnDate: TDate;
  longBookingDiscounts: CarDataBookingDiscount[];
  advanceBookingDiscounts?: CarDataBookingDiscount[];
  longBookingDiscountActive?: boolean;
  advanceBookingDiscountActive?: boolean;
  previousLongDiscount?: TDiscountedPrice;
}) => {
  //*Step 1: Calculate Rent Difference
  //const { difference: rentPrice } = compareValuesWithDetails(totalPrice, previousDurationPrice);
  const rentPrice = calculateWithPrecision('subtract', [totalPrice, previousDurationPrice]); //As compare checking would lead to huge discount when previousPrice is greater than total price
  //*Step 2: Calculate Updated Days Difference
  const oldDurationDays = dayjs(oldReturnDate).diff(dayjs(oldPickupDate), 'day');
  const newDurationDays = dayjs(newReturnDate).diff(dayjs(newPickupDate), 'day');
  const additionalDays = newDurationDays - oldDurationDays;
  // console.log('Days Difference', additionalDays);
  //*Step 3: Calculate Advance Days
  const newAdvanceDays = dayjs(newPickupDate).diff(utcCurrentTime?.formattedTimeDayObj, 'day'); // Days in advance for new pickup date
  // console.log('Advance Booking Days', newAdvanceDays);
  //*Step 4: Convert and filter discounts
  const convertedLongDiscounts = await convertWeekToDays(longBookingDiscounts);
  const convertedAdvanceDiscounts = await convertWeekToDays(advanceBookingDiscounts);
  const filteredLongDiscounts = convertedLongDiscounts?.filter(
    (dis: any) => newDurationDays >= dis?.convertedDays // Ensure new booking matches discount duration
  );
  const filteredAdvanceDiscounts = convertedAdvanceDiscounts?.filter(
    (dis: any) => newAdvanceDays >= dis?.convertedDays // Ensure new advance days match discount thresholds
  );
  //*Step 5: Initialize discount data
  let tempAdvanceDisData = { calculatedAmount: 0, text: '' };
  let tempLongDisData = { calculatedAmount: 0, text: '' };
  let tempNextLongDisData = { amount: 0, text: '' };
  let tempTotalDiscount = 0;

  let tempTotalPrice = rentPrice > 0 ? rentPrice : totalPrice; // condition applied because if the rentPrice 0 then the percentage discount got 0

  // console.log('Rental Price Difference', rentPrice);

  //*Step 6: Apply long booking discount
  if (filteredLongDiscounts?.length > 0 && longBookingDiscountActive) {
    // console.log('Filtered Long Days', filteredLongDiscounts);
    const applicableLongDiscounts = filteredLongDiscounts.filter(
      (dis: any) => dis?.convertedDays <= additionalDays // Ensure new days align with extended duration
    );
    // console.log('Applicable Long Days', applicableLongDiscounts);
    if (applicableLongDiscounts?.length > 0) {
      const { highestData, tempDiscountedPrice, nextHighestData } = await commonDiscountCalculation(
        applicableLongDiscounts,
        convertedLongDiscounts,
        tempTotalPrice,
        'long'
      );
      tempLongDisData = highestData;
      tempNextLongDisData = nextHighestData;
      tempTotalPrice = tempDiscountedPrice;
      tempTotalDiscount = highestData?.calculatedAmount ?? 0;
      // console.log('Long Discounted Price', tempDiscountedPrice);
    } else if (previousLongDiscount && longBookingDiscountActive) {
      const convertedPreviousLongDiscount = convertPreviousLongDiscount(previousLongDiscount);
      const convertedLongDiscounts = await convertWeekToDays(convertedPreviousLongDiscount);
      const filteredPreviousLongDiscounts = convertedLongDiscounts?.filter(
        (dis: any) => newDurationDays >= dis?.convertedDays // Ensure new booking matches discount duration
      );
      const applicablePreviousLongDiscounts = filteredPreviousLongDiscounts.filter(
        (dis: any) => dis?.convertedDays <= newDurationDays // Ensure new days align with extended duration
      );
      // Check from the previous long discount if no new long discounts are found
      const { highestData, tempDiscountedPrice, nextHighestData } = await commonDiscountCalculation(
        applicablePreviousLongDiscounts, // Use the previous long discount as the fallback
        convertedLongDiscounts,
        tempTotalPrice,
        'long'
      );
      tempLongDisData = highestData;
      tempNextLongDisData = nextHighestData;
      tempTotalPrice = tempDiscountedPrice;
      tempTotalDiscount = highestData?.calculatedAmount ?? 0;
    }
  }

  //*Step 7: Show next long discount if no long discount is applicable
  if (filteredLongDiscounts?.length === 0 && convertedLongDiscounts?.length > 0 && longBookingDiscountActive) {
    tempNextLongDisData = await calculateNextHighestLongDiscount(convertedLongDiscounts);
  }

  //*Step 8: Apply advance booking discount
  if (filteredAdvanceDiscounts?.length > 0 && advanceBookingDiscountActive) {
    // console.log('Filtered Advance Days', filteredAdvanceDiscounts);
    const applicableAdvanceDiscounts = filteredAdvanceDiscounts.filter(
      (dis: any) => dis?.convertedDays <= newAdvanceDays // Ensure advance booking matches updated conditions
    );
    //  console.log('Applicable Advance Days', applicableAdvanceDiscounts);
    if (applicableAdvanceDiscounts.length > 0) {
      const { highestData } = await commonDiscountCalculation(applicableAdvanceDiscounts, convertedAdvanceDiscounts, tempTotalPrice, 'advance');
      tempAdvanceDisData = highestData;
      tempTotalDiscount += highestData?.calculatedAmount ?? 0;
      //   console.log('Advanced Discounted Price', tempDiscountedPrice);
    }
  }
  tempTotalPrice = calculateWithPrecision('subtract', [totalPrice, tempTotalDiscount]);

  return {
    advanceDiscount: tempAdvanceDisData,
    longDiscount: tempLongDisData,
    nextLongDiscount: tempNextLongDisData,
    tempTotalPrice,
  };
};

//# Updated Discounts Function After Discussion
//Discount Only When Travel Extend
export const getEditTravelDiscount = async ({
  totalPrice,
  previousDurationPrice,
  pickupDate: newPickupDate,
  returnDate: newReturnDate,
  oldPickupDate,
  oldReturnDate,
  longBookingDiscounts,
  longBookingDiscountActive = true,
  hasVoucher = false,
}: {
  totalPrice: number;
  previousDurationPrice: number;
  pickupDate: TDate;
  returnDate: TDate;
  oldPickupDate: TDate;
  oldReturnDate: TDate;
  longBookingDiscounts: CarDataBookingDiscount[];
  longBookingDiscountActive?: boolean;
  hasVoucher?: boolean;
}) => {
  //*Step 1: Calculate Rent Difference
  //const { difference: rentPrice } = compareValuesWithDetails(totalPrice, previousDurationPrice);
  const rentPrice = calculateWithPrecision('subtract', [totalPrice, previousDurationPrice]); //As compare checking would lead to huge discount when previousPrice is greater than total price
  //*Step 2: Calculate Updated Days Difference
  // const oldDurationDays = dayjs(oldReturnDate).diff(dayjs(oldPickupDate), 'day');
  // const newDurationDays = dayjs(newReturnDate).diff(dayjs(newPickupDate), 'day');
  // const additionalDays = newDurationDays - oldDurationDays;
  // Get the milliseconds
  const oldDurationMilliseconds = dayjs(oldReturnDate).valueOf() - dayjs(oldPickupDate).valueOf();
  const newDurationMilliseconds = dayjs(newReturnDate).valueOf() - dayjs(newPickupDate).valueOf();
  // Calculate the difference in milliseconds
  const additionalMilliseconds = newDurationMilliseconds - oldDurationMilliseconds;
  const newDurationDays = Math.floor(newDurationMilliseconds / (1000 * 60 * 60 * 24));
  const additionalDays = Math.floor(additionalMilliseconds / (1000 * 60 * 60 * 24));
  //*Step 3: Convert and filter discounts
  const convertedLongDiscounts = await convertWeekToDays(longBookingDiscounts);
  const filteredLongDiscounts = convertedLongDiscounts?.filter(
    (dis: any) => newDurationDays >= dis?.convertedDays // Ensure new booking matches discount duration
  );
  //*Step 4: Initialize discount data
  let tempLongDisData = { calculatedAmount: 0, text: '' };
  let tempNextLongDisData = { amount: 0, text: '' };
  let tempTotalDiscount = 0;
  let longDiscountToolTip = '';
  const discountsInfo: TDiscountInfo = {
    longAppliedPrice: 0,
    dayDiff: additionalDays,
  };
  let tempTotalPrice = rentPrice > 0 ? rentPrice : totalPrice; // condition applied because if the rentPrice 0 then the percentage discount got 0

  //*Step 5: Apply long booking discount
  if (filteredLongDiscounts?.length > 0 && longBookingDiscountActive && !hasVoucher) {
    // console.log('Filtered Long Days', filteredLongDiscounts);
    const applicableLongDiscounts = filteredLongDiscounts.filter(
      (dis: any) => dis?.convertedDays <= additionalDays // Ensure new days align with extended duration
    );
    // console.log('Applicable Long Days', applicableLongDiscounts);
    if (applicableLongDiscounts?.length > 0) {
      const { highestData, tempDiscountedPrice, nextHighestData } = await commonDiscountCalculation(
        applicableLongDiscounts,
        convertedLongDiscounts,
        tempTotalPrice,
        'long'
      );
      discountsInfo.longAppliedPrice = tempTotalPrice ?? 0;
      const discountUnit = `${highestData?.duration > 1 ? `${highestData?.durationUnit}` : `${highestData?.durationUnit.slice(0, -1)}`}`;
      longDiscountToolTip = getLongDiscountTooltip(tempTotalPrice, additionalDays, discountUnit);
      tempLongDisData = highestData;
      tempNextLongDisData = nextHighestData;
      tempTotalPrice = tempDiscountedPrice;
      tempTotalDiscount = highestData?.calculatedAmount ?? 0;
      // console.log('Long Discounted Price', tempDiscountedPrice);
    }
  }

  //*Step 6: Show next long discount if no long discount is applicable
  if (filteredLongDiscounts?.length === 0 && convertedLongDiscounts?.length > 0 && longBookingDiscountActive && !hasVoucher) {
    tempNextLongDisData = await calculateNextHighestLongDiscount(convertedLongDiscounts);
  }

  tempTotalPrice = calculateWithPrecision('subtract', [totalPrice, tempTotalDiscount]);

  return {
    longDiscount: tempLongDisData,
    nextLongDiscount: tempNextLongDisData,
    tempTotalPrice,
    longDiscountToolTip,
    discountsInfo,
  };
};

//# Updated Discounts
//Discount Only When Travel Extend or Reduced
export const getEditTravelDiscountNew = async ({
  totalPrice,
  previousDurationPrice,
  pickupDate: newPickupDate,
  returnDate: newReturnDate,
  oldPickupDate,
  oldReturnDate,
  longBookingDiscounts,
  longBookingDiscountActive = true,
  hasVoucher = false,
  previousLongDiscount,
  customLongDiscountAmount = 0,
}: {
  totalPrice: number;
  previousDurationPrice: number;
  pickupDate: TDate;
  returnDate: TDate;
  oldPickupDate: TDate;
  oldReturnDate: TDate;
  longBookingDiscounts: CarDataBookingDiscount[];
  longBookingDiscountActive?: boolean;
  hasVoucher?: boolean;
  previousLongDiscount?: TDiscountedPrice;
  customLongDiscountAmount?: number;
}) => {
  //*Step 1: Calculate Rent Difference
  const rentPrice = calculateWithPrecision('subtract', [totalPrice, previousDurationPrice]);

  //*Step 2: Calculate Updated Days Difference
  const oldDurationMilliseconds = dayjs(oldReturnDate).valueOf() - dayjs(oldPickupDate).valueOf();
  const newDurationMilliseconds = dayjs(newReturnDate).valueOf() - dayjs(newPickupDate).valueOf();
  const additionalMilliseconds = newDurationMilliseconds - oldDurationMilliseconds;
  const newDurationDays = Math.floor(newDurationMilliseconds / (1000 * 60 * 60 * 24));
  const additionalDays = Math.floor(additionalMilliseconds / (1000 * 60 * 60 * 24));
  const oldDurationDays = Math.floor(oldDurationMilliseconds / (1000 * 60 * 60 * 24));

  //*Step 3: Convert and filter discounts
  const convertedLongDiscounts = await convertWeekToDays(longBookingDiscounts);
  const filteredLongDiscounts = convertedLongDiscounts?.filter(
    (dis: any) => newDurationDays >= dis?.convertedDays // Ensure new booking matches discount duration
  );

  //*Step 4: Initialize discount data
  let tempLongDisData = { calculatedAmount: 0, text: '' };
  let tempNextLongDisData = { amount: 0, text: '' };
  let tempTotalDiscount = 0;
  let longDiscountToolTip = '';
  const discountsInfo: TDiscountInfo = {
    longAppliedPrice: 0,
    dayDiff: additionalDays,
  };
  let tempTotalPrice = rentPrice > 0 ? rentPrice : totalPrice;
  let previousDiscountAmount = 0;

  //*Step 5: Apply previous discount if applicable
  if ((previousLongDiscount || customLongDiscountAmount) && newDurationMilliseconds > oldDurationMilliseconds) {
    previousDiscountAmount = parseFloatWithPrecision((previousLongDiscount?.calculatedAmount ?? 0) + customLongDiscountAmount);
  } else if (
    (previousLongDiscount || customLongDiscountAmount) &&
    newDurationMilliseconds <= oldDurationMilliseconds &&
    parseFloatWithPrecision(totalPrice ?? 0) === parseFloatWithPrecision(previousDurationPrice ?? 0)
  ) {
    previousDiscountAmount = parseFloatWithPrecision((previousLongDiscount?.calculatedAmount ?? 0) + customLongDiscountAmount);
  }

  //*Step 6: Apply long booking discount for extended days
  const previousDiscountDays = previousLongDiscount?.duration
    ? previousLongDiscount?.durationUnit === 'weeks'
      ? previousLongDiscount?.duration * 7
      : previousLongDiscount?.duration
    : 0;
  if (((filteredLongDiscounts?.length > 0 && longBookingDiscountActive) || previousLongDiscount) && !hasVoucher) {
    const applicableLongDiscounts = filteredLongDiscounts.filter(
      (dis: any) => dis?.convertedDays <= additionalDays // Ensure new days align with extended duration
    );

    if (applicableLongDiscounts?.length > 0 && longBookingDiscountActive) {
      const { highestData, tempDiscountedPrice, nextHighestData } = await commonDiscountCalculation(
        applicableLongDiscounts,
        convertedLongDiscounts,
        tempTotalPrice,
        'long'
      );
      discountsInfo.longAppliedPrice = tempTotalPrice ?? 0;
      const discountUnit = `${highestData?.duration > 1 ? `${highestData?.durationUnit}` : `${highestData?.durationUnit.slice(0, -1)}`}`;
      longDiscountToolTip = getLongDiscountTooltip(tempTotalPrice, additionalDays, discountUnit);
      tempLongDisData = highestData;
      tempNextLongDisData = nextHighestData;
      tempTotalPrice = tempDiscountedPrice;
      tempTotalDiscount = highestData?.calculatedAmount ?? 0;
    } else if (
      previousLongDiscount &&
      previousDiscountDays > 0 &&
      previousLongDiscount?.percentage &&
      previousDiscountDays <= newDurationDays &&
      newDurationMilliseconds < oldDurationMilliseconds &&
      parseFloatWithPrecision(totalPrice ?? 0) !== parseFloatWithPrecision(previousDurationPrice ?? 0)
    ) {
      const { highestData, tooltip, tempDiscountedPrice } = await getPreviousLongDiscountCalculation(
        previousLongDiscount,
        newDurationDays,
        totalPrice
      );
      tempLongDisData = highestData;
      tempTotalPrice = tempDiscountedPrice;
      tempTotalDiscount = highestData?.calculatedAmount ?? 0;
      discountsInfo.longAppliedPrice = totalPrice ?? 0;
      longDiscountToolTip = tooltip;
    }
  }

  //*Step 7: Show next long discount if no long discount is applicable
  if (filteredLongDiscounts?.length === 0 && convertedLongDiscounts?.length > 0 && longBookingDiscountActive && !hasVoucher) {
    tempNextLongDisData = await calculateNextHighestLongDiscount(convertedLongDiscounts);
  }

  tempTotalPrice = calculateWithPrecision('subtract', [totalPrice, tempTotalDiscount, previousDiscountAmount]);

  return {
    longDiscount: tempLongDisData,
    nextLongDiscount: tempNextLongDisData,
    tempTotalPrice,
    longDiscountToolTip,
    discountsInfo,
    previousDiscountAmount,
  };
};

const getPreviousLongDiscountCalculation = async (previousLongDiscount: TDiscountedPrice, newDurationDays: number, totalPrice: number) => {
  // Calculate discounted amount
  const discountedAmount = parseFloat((totalPrice * ((previousLongDiscount?.percentage ?? 0) / 100)).toFixed(2));
  const tempDiscountedPrice = parseFloatWithPrecision(totalPrice - discountedAmount);
  // Prepare text
  const durationUnitText =
    (previousLongDiscount.duration ?? 0) > 1 ? previousLongDiscount?.durationUnit : previousLongDiscount?.durationUnit?.slice(0, -1) ?? '';
  const text = `${previousLongDiscount?.percentage}% off for ${previousLongDiscount?.duration}+ ${durationUnitText}`;
  // Prepare highest data
  const highestData = {
    calculatedAmount: discountedAmount,
    text: text,
    duration: previousLongDiscount.duration,
    durationUnit: previousLongDiscount.durationUnit,
    percentage: previousLongDiscount.percentage,
  };
  // Prepare tooltip
  const discountUnit = `${(highestData?.duration ?? 0) > 1 ? highestData?.durationUnit : highestData?.durationUnit?.slice(0, -1)}`;
  const tooltip = getLongDiscountTooltip(totalPrice, newDurationDays, discountUnit);

  return {
    highestData,
    tempDiscountedPrice,
    tooltip,
  };
};
