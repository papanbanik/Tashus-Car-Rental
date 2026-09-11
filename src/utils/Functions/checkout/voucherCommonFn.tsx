import { IDiscountAdditionalData } from '@/components/Search/ReservationCheckout/ReservationCheckout';
import { TReservationInfo } from '@/context/SearchProvider';
import { CarDataState } from '@/types/car-listing/carListingTypes';
import { PriceItem } from '@/types/checkout/checkoutTypes';
import { IndividualPricing } from '@/types/user-profile/customPriceTypes';
import { differenceInDays } from 'date-fns';
import dayjs from 'dayjs';
import { TVoucherValidationAdditionalData } from '../../../hooks/reservation/voucher/useCheckVoucherValidation';
import { convertWeekToDays } from '../reservationValidationFn';
import { utcCurrentTime } from '../utcCommonFn';
import { calculateNewDurationPrice, commonDiscountCalculation, getReservationPriceList } from '../vehiclePriceUpdateFn';

export function getMonthName(isoDateString: string) {
  const date = new Date(isoDateString);
  const monthIndex = date.getMonth(); // Months are zero-indexed (0-11)
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return monthNames[monthIndex];
}

export function sumPricesForDays(priceList: PriceItem[], days: number) {
  const daysToSum = Math.min(days, priceList.length);
  const totalPrice = priceList.slice(0, daysToSum).reduce((sum, item) => sum + item.price, 0);
  return totalPrice;
}

export const getIndividualPriceList = async (reservationInfo: TReservationInfo, carData: CarDataState) => {
  const { peakIncrease, hourlyRates, dailyRates, customPricing } = carData?.rates;
  const { pickupTime: pickupDateTime, returnTime: returnDateTime } = reservationInfo;
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
    pickupDate,
    returnDate,
    dailyRates?.amount,
    hourlyRates?.amount,
    customPricing,
    peakIncrease
  );
  //calculate base price taking total duration days and hours
  const { individualPrices } = await calculateNewDurationPrice(timeDiffDays, remainingHours, remainingMinutes, reservationPriceList);

  return individualPrices;
};

export async function calculateVoucherDiscountForDays(days: number, carData: CarDataState, reservationInfo: TReservationInfo): Promise<number> {
  // Step 1: Get the individual price list based on the reservation information
  const priceList: IndividualPricing[] = await getIndividualPriceList(reservationInfo, carData);

  // Step 2: Determine the number of days to sum up the price
  const daysToSum = Math.min(days, priceList?.length);
  // console.log('Days to sum', daysToSum);
  // Step 3: Sum up the total price for the applicable days
  const totalPrice = priceList.slice(0, daysToSum).reduce((sum, item) => sum + item.price, 0);

  // Step 4: Extract long and advance booking discounts
  const { longBookingDiscounts, advanceBookingDiscounts, longBookingDiscountActive = true, advanceBookingDiscountActive = true } = carData?.rates;
  const convertedLongDiscounts = await convertWeekToDays(longBookingDiscounts);
  // console.log('Converted long discount', convertedLongDiscounts);
  const filteredLongDiscounts = convertedLongDiscounts?.filter((dis: any) => daysToSum >= dis?.convertedDays);
  // console.log('Filtered long discount', filteredLongDiscounts);
  const convertedAdvanceDiscounts = await convertWeekToDays(advanceBookingDiscounts);
  // console.log('Converted Advance discount', convertedAdvanceDiscounts);
  const pickupDate = dayjs(reservationInfo?.pickupTime);
  // const advanceDayDiff = pickupDate.diff(currentDateTime, 'day');
  const advanceDayDiff = pickupDate.diff(utcCurrentTime?.formattedTimeDayObj, 'day');
  const filteredAdvanceDiscounts = convertedAdvanceDiscounts?.filter((dis: any) => advanceDayDiff >= dis?.convertedDays);
  // console.log('Filtered Advanced discount', filteredAdvanceDiscounts);

  let tempTotalPrice = totalPrice;
  // Step 5: Apply long or advance booking discount if applicable
  if (filteredLongDiscounts?.length > 0 && longBookingDiscountActive) {
    const { tempDiscountedPrice } = await commonDiscountCalculation(filteredLongDiscounts, convertedLongDiscounts, tempTotalPrice, 'long');
    tempTotalPrice = tempDiscountedPrice;
    // console.log('The Price After Long Discount', tempTotalPrice);
  }
  if (filteredAdvanceDiscounts?.length > 0 && advanceBookingDiscountActive) {
    const { tempDiscountedPrice } = await commonDiscountCalculation(filteredAdvanceDiscounts, convertedAdvanceDiscounts, tempTotalPrice, 'advance');
    tempTotalPrice = tempDiscountedPrice;
    // console.log('The Price After Advanced Discount', tempTotalPrice);
  }
  //console.log('The Price', tempTotalPrice);
  // Step 6: Return the final discounted price
  return tempTotalPrice;
}

export const additionalDataProcessingForVoucher = async (
  listingId: number,
  guestEmail: string,
  discountAdditionalData: IDiscountAdditionalData
): Promise<TVoucherValidationAdditionalData> => {
  // Extract pickup and return times
  const { pickupTime, returnTime } = discountAdditionalData?.reservationInfo;
  // Parse the pickup and return times into Date objects
  const pickupDate = new Date(pickupTime);
  const returnDate = new Date(returnTime);
  // Calculate the difference in days using date-fns
  const durationInDays = differenceInDays(returnDate, pickupDate);
  // Round up the duration to the nearest whole day if it's a fraction
  const reservationDuration = Math.ceil(durationInDays);

  return { reservationDuration, travelStartDate: pickupTime, travelEndDate: returnTime, carListingId: listingId, guestEmail };
};
// export const additionalDataProcessingForVoucher = async (
//   carData: CarDataState,
//   discountAdditionalData: IDiscountAdditionalData,
//   userProfileInfo: UserProfileInfo
// ): Promise<{
//   carType: string;
//   reservationDuration: number;
//   completedReservations: number;
//   monthOfTravel: string;
//   travelStartDate: TDate;
//   travelEndDate: TDate;
// }> => {
//   const carType = carData?.car?.carType;
//   // Extract pickup and return times
//   const { pickupTime, returnTime } = discountAdditionalData?.reservationInfo;
//   // Parse the pickup and return times into Date objects
//   const pickupDate = new Date(pickupTime);
//   const returnDate = new Date(returnTime);
//   // Calculate the difference in days using date-fns
//   const durationInDays = differenceInDays(returnDate, pickupDate);
//   // Round up the duration to the nearest whole day if it's a fraction
//   const reservationDuration = Math.ceil(durationInDays);
//   // Get the total number of completed reservations
//   const completedReservations = userProfileInfo?.guestTotalTrips ?? 0;
//   // Get the month of travel
//   const monthOfTravel = getMonthName(pickupTime);
//   // Return processed data
//   return { carType, reservationDuration, completedReservations, monthOfTravel, travelStartDate: pickupTime, travelEndDate: returnTime };
// };
