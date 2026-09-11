import dayjs from 'dayjs';

import { TPeakIncreasePrice } from '@/context/SearchProvider';
import { CarDataCustomPricing } from '@/types/car-listing/carPricingTypes';
import { TDate } from '@/types/commonTypes';
import { ICustomPricing, ReservationPriceListType, TPeakIncreasedDates } from '@/types/user-profile/customPriceTypes';
import { generateRateChange } from './advancedCalenderFn';
import { getIsEditPaymentExpired } from './travelCommonFn';
import { convertDateToUtc, dayjsUtc } from './utcCommonFn';

export const getPaymentStatus = (reservationAt: TDate, paymentStatus: string, reservationStatus: string): string => {
  const isExpired = getIsEditPaymentExpired(reservationAt);

  if (isExpired && paymentStatus === 'pending' && !['cancelled', 'cancelledByGuest', 'cancelledByHost'].includes(reservationStatus || '')) {
    return 'expired';
  }

  return paymentStatus || '';
};

export const getReservationPriceListUpdated = async (
  pickupDateTime: TDate,
  returnDateTime: TDate,
  defaultDailyPrice: number,
  defaultHourlyPrice: number,
  customPricing: CarDataCustomPricing[],
  peakIncrease: TPeakIncreasePrice,
  initialPickupDateTime: TDate,
  initialReturnDateTime: TDate,
  initialDailyPrice: number,
  initialHourlyPrice: number,
  initialCustomPricing: CarDataCustomPricing[],
  peakIncreasedDates?: TPeakIncreasedDates[]
): Promise<ReservationPriceListType[]> => {
  const reservationPriceList: ReservationPriceListType[] = [];
  const tempReservationCustomPriceList: ICustomPricing[] = [];
  const pickupDate = dayjsUtc(pickupDateTime);
  const returnDate = dayjsUtc(returnDateTime);
  const initialPickupDate = dayjsUtc(initialPickupDateTime);
  const initialReturnDate = dayjsUtc(initialReturnDateTime).subtract(1, 'day');

  let currentDate = pickupDate;
  while (currentDate.isBefore(returnDate, 'day') || currentDate.isSame(returnDate, 'day')) {
    let dailyPrice = defaultDailyPrice;
    let hourlyPrice = defaultHourlyPrice;

    // Determine if the date falls within one day before initial pickup to one day after initial return
    const isWithinInitialPeriod =
      (currentDate.isSame(initialPickupDate, 'day') || currentDate.isAfter(initialPickupDate, 'day')) &&
      currentDate.isBefore(initialReturnDate, 'day');

    if (isWithinInitialPeriod) {
      dailyPrice = initialDailyPrice;
      hourlyPrice = initialHourlyPrice;
    }

    let rateDailyChange = 'ND';
    let rateHourlyChange = 'NH';
    let dailyDiff = 0;
    let hourlyDiff = 0;

    // Check if the current date matches any date in custom pricing (use initial or new based on period)
    const matchedCustomPrice = (isWithinInitialPeriod ? initialCustomPricing : customPricing)?.find((customPrice: any) => {
      const customPriceDate = dayjs(customPrice.date);
      return currentDate.isSame(customPriceDate, 'day');
    });

    if (matchedCustomPrice) {
      const rateChangeResult = generateRateChange(
        isWithinInitialPeriod ? initialDailyPrice : defaultDailyPrice,
        matchedCustomPrice?.updatedDailyRates,
        isWithinInitialPeriod ? initialHourlyPrice : defaultHourlyPrice,
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
        dailyRates: isWithinInitialPeriod ? initialDailyPrice : defaultDailyPrice,
        hourlyRates: isWithinInitialPeriod ? initialHourlyPrice : defaultHourlyPrice,
        updatedDailyRates: matchedCustomPrice?.updatedDailyRates,
        updatedHourlyRates: matchedCustomPrice?.updatedHourlyRates,
      });
    } else {
      const matchedPeakIncreaseDate = (peakIncreasedDates || []).find((peakDate) => dayjs(peakDate.reservationDate).isSame(currentDate, 'day'));
      if (matchedPeakIncreaseDate) {
        dailyPrice = matchedPeakIncreaseDate?.dailyPrice;
        hourlyPrice = matchedPeakIncreaseDate?.hourlyPrice;
      } else {
        const currentDayOfWeek = currentDate.format('ddd').toLowerCase();

        // const validPeakIncreaseList = Array.isArray(peakIncreaseList) ? peakIncreaseList : [];
        // const peakIncrease = validPeakIncreaseList.find((peak) => peak.dayOfWeek === currentDayOfWeek);
        // if (peakIncrease) {
        //   if (peakIncrease.increaseType === 'percentage') {
        //     dailyPrice += dailyPrice * (peakIncrease?.percentage! / 100);
        //     hourlyPrice += hourlyPrice * (peakIncrease?.percentage! / 100);
        //   } else if (peakIncrease.increaseType === 'amount') {
        //     dailyPrice += peakIncrease?.amount!;
        //     hourlyPrice += peakIncrease?.amount!;
        //   }
        // }
        const validPeakIncreaseDays = peakIncrease?.increaseDays || [];
        // Check if the current day falls under the peak increase days
        if (validPeakIncreaseDays.includes(currentDayOfWeek)) {
          if (peakIncrease.increaseType === 'percentage') {
            // Apply percentage increase to daily and hourly price
            dailyPrice += dailyPrice * (peakIncrease?.increaseAmount! / 100);
            hourlyPrice += hourlyPrice * (peakIncrease?.increaseAmount! / 100);
          } else if (peakIncrease.increaseType === 'amount') {
            // Apply fixed amount increase to daily and hourly price
            dailyPrice += peakIncrease?.increaseAmount!;
            hourlyPrice += peakIncrease?.increaseAmount!;
          }
        }
        const rateChangeResult = generateRateChange(
          isWithinInitialPeriod ? initialDailyPrice : defaultDailyPrice,
          dailyPrice,
          isWithinInitialPeriod ? initialHourlyPrice : defaultHourlyPrice,
          hourlyPrice
        );
        rateDailyChange = rateChangeResult?.rateDailyChange;
        rateHourlyChange = rateChangeResult?.rateHourlyChange;
        dailyDiff = rateChangeResult?.dailyDiff;
        hourlyDiff = rateChangeResult?.hourlyDiff;
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

  return reservationPriceList;
};
