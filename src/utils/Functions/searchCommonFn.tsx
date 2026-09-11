import { CarNoticeInAdvance } from '@/types/car-listing/carAvailabilityTypes';
import { TSearchedCar } from '@/types/car-search/carSearchType';
import { TCommonDateRange } from '@/types/commonTypes';
import dayjs, { Dayjs } from 'dayjs';
import { IGuestInsuranceList, guestInsuranceList } from '../Lists/insuranceInfo';
import { currentDateTime, getDefaultPickupTime, getDefaultReturnTime } from './dateTimeCommonFn';
import { getSingularPluralNoun, toFormattedNumber, toNumber } from './randomCommonFn';
import { verifyMaxTravelDays, verifyMinTravelDays } from './reservationValidationFn';
import { combineDateTimeUtc, dayjsUtc, getPickerTimeStringInUtc } from './utcCommonFn';

export const filterByPrice = (car: any, priceRangeByDay: number[] | undefined, priceRangeByHour: number[] | undefined) => {
  const { hourlyRates, dailyRates } = car.rates;
  const hourlyRateAmount = hourlyRates.amount;
  const dailyRateAmount = dailyRates.amount;

  // Check if daily rate is within the price range by day
  const isDailyRateWithinRange = priceRangeByDay ? dailyRateAmount >= priceRangeByDay[0] && dailyRateAmount <= priceRangeByDay[1] : false;
  // priceRangeByDay && console.log(priceRangeByDay[0], dailyRateAmount, priceRangeByDay[1], isDailyRateWithinRange);

  // Check if hourly rate is within the price range by hour
  const isHourlyRateWithinRange = priceRangeByHour ? hourlyRateAmount >= priceRangeByHour[0] && hourlyRateAmount <= priceRangeByHour[1] : false;
  // priceRangeByHour && console.log(priceRangeByHour[0], hourlyRateAmount, priceRangeByHour[1], isHourlyRateWithinRange);

  // Return true if both hourly and daily rates are within their respective ranges
  if (priceRangeByDay && priceRangeByDay?.length > 0 && priceRangeByHour && priceRangeByHour?.length > 0) {
    // console.log(isHourlyRateWithinRange, isDailyRateWithinRange);
    return isHourlyRateWithinRange && isDailyRateWithinRange;
  }

  // console.log(isHourlyRateWithinRange, isDailyRateWithinRange);

  // Return true if hourly or daily rates are within their respective ranges
  return isHourlyRateWithinRange || isDailyRateWithinRange;
};
// export const getCarTypeFromParams = (carTypeParam: string | null): string[] => {
//   if (!carTypeParam) return [];

//   const carTypeArray = carTypeParam
//     .split(',')
//     .map((type) => type.trim())
//     .map((type) => mapSliderTitleToCarType(type));

//   return carTypeArray;
// };
export const filterByCarType = (car: any, carTypes: string[] | undefined) => {
  const carType = car?.car?.carType?.toLowerCase();
  const isCarTypeMatched = carTypes ? carTypes.some((type) => type?.toLowerCase() === carType) : false;
  return isCarTypeMatched;
};

export const filterByTransmissionType = (car: any, transmissionTypes: string[] | undefined) => {
  const { transmissionType } = car.car;
  const isTransmissionTypeMatched = transmissionTypes ? transmissionTypes.includes(transmissionType) : false;
  return isTransmissionTypeMatched;
};

export const filterBySeats = (car: any, numberOfSeats: string) => {
  const { seats } = car.car;
  const parsedSeatNumber = parseInt(numberOfSeats);
  const isNumberOfSeatMatched = numberOfSeats ? seats >= parsedSeatNumber : false;
  return isNumberOfSeatMatched;
};

export const searchedAvailabilityValidation = async (carDetails: TSearchedCar, pickupDateTime: string, returnDateTime: string) => {
  // console.log(carDetails);
  const { noticeInAdvance, minTripDuration, maxTripDuration, pickupReturnHour } = carDetails?.availability;
  const pickupDate = dayjs(pickupDateTime);
  const returnDate = dayjs(returnDateTime);

  // Calculate the time difference between pickup & return in hours, days
  const timeDiffHours = returnDate.diff(pickupDate, 'hour');
  const timeDiffDays = returnDate.diff(pickupDate, 'day');
  const timeDiffWeek = returnDate.diff(pickupDate, 'week');
  const timeDiffMins = returnDate.diff(pickupDate, 'minute');

  const advanceTimeDiffInMin = getAdvanceTimeDiffInMin(pickupDate);
  // Vehicle available: If there's no availability restriction
  if (noticeInAdvance?.alwaysAvailableImmediately && minTripDuration?.noMinimum && maxTripDuration?.noMaximum) {
    // console.log(carDetails?.listingId);
    return true;
  }

  let isNoticePeriodValid: boolean = true;
  let isMinDurationValid: boolean | undefined = true;
  let isMaxDurationValid: boolean | undefined = true;

  // Validate Notice period
  if (
    !noticeInAdvance?.alwaysAvailableImmediately &&
    noticeInAdvance?.hoursRequired &&
    getIsNoticePeriodRequired(noticeInAdvance?.hoursRequired, advanceTimeDiffInMin)
  ) {
    // console.log('notice');
    isNoticePeriodValid = false;
  }

  // console.log(minTripDuration);
  // Validate Minimum trip duration
  if (!minTripDuration?.noMinimum) {
    // console.log('min duration');
    isMinDurationValid = await verifyMinTravelDays(
      minTripDuration?.unit,
      minTripDuration?.shortestDuration,
      timeDiffHours,
      timeDiffDays,
      timeDiffMins
    );
    // console.log(isMinDurationValid);
  }

  // console.log(maxTripDuration);
  if (!maxTripDuration?.noMaximum) {
    // console.log('max duration');
    isMaxDurationValid = await verifyMaxTravelDays(maxTripDuration?.unit, maxTripDuration?.longestDuration, timeDiffMins);
    // console.log(isMaxDurationValid);
  }

  const carValid = isNoticePeriodValid && isMinDurationValid && isMaxDurationValid;

  return carValid;
};

export const getReservationDateList = async (reservationList: TCommonDateRange[]) => {
  let reservationDateList: any = [];

  reservationList?.map((reservation) => {
    let pickupTime = dayjsUtc(reservation?.startDate);
    let currentDate = dayjsUtc(reservation?.startDate);
    let returnDate = dayjsUtc(reservation?.endDate);
    const utcCurrentTime = getPickerTimeStringInUtc(dayjs());

    let dateList: any = [];
    // while (currentDate.isBefore(returnDate, 'day') || currentDate.isSame(returnDate, 'day')) {
    //   let start = dayjs().toDate();
    //   let end = dayjs().toDate();
    //   let allDay = false;

    //   const isSingleDay = returnDate.isSame(pickupTime, 'day');

    //   if (isSingleDay) {
    //     // Set data for single day travel
    //     start = pickupTime.toDate();
    //     end = returnDate.endOf('day').toDate();
    //     allDay = isStartOfDay(start) && isEndOfDay(end);
    //   } else if (!isSingleDay && currentDate.isSame(pickupTime, 'day')) {
    //     // Set data for pickup date for multiple day travel
    //     start = pickupTime.toDate();
    //     end = currentDate.endOf('day').toDate();
    //     console.log({ pickupTime, currentDate, returnDate, end });
    //     allDay = isStartOfDay(start) && isEndOfDay(end);
    //   } else if (!isSingleDay && currentDate.isSame(returnDate, 'day')) {
    //     // Set data for return date for multiple day travel
    //     start = currentDate.startOf('day').toDate();
    //     end = returnDate.toDate();
    //     allDay = isStartOfDay(start) && isEndOfDay(end);
    //   } else {
    //     // Set data for all mid days
    //     start = currentDate.startOf('day').toDate();
    //     end = currentDate.endOf('day').toDate();
    //     allDay = isStartOfDay(start) && isEndOfDay(end);
    //   }

    //   const dateInfo: any = {
    //     start,
    //     end,
    //     allDay,
    //     title: 'Unavailable',
    //     // title: 'Reserved',
    //   };
    //   dateList.push(dateInfo);

    //   currentDate = currentDate.add(1, 'day'); // Move to the next day
    // }

    if (returnDate?.isAfter(utcCurrentTime?.formattedTimeDayObj, 'minute')) {
      const dateInfo: any = {
        start: pickupTime?.toDate(),
        end: returnDate?.toDate(),
        // allDay,
        title: 'Unavailable',
        // title: 'Reserved',
      };
      dateList.push(dateInfo);
    }

    reservationDateList = [...reservationDateList, ...dateList];
  });

  // console.log(reservationDateList);
  return reservationDateList;
};

// export const reservationDepositMessage = (reservationDepositAmount: number) => {
//   return (
//     <>
//       To complete your booking, we will place a hold of <span className="font-extrabold">${reservationDepositAmount?.toFixed(2)}</span> on your
//       payment card for the insurance excess fee or any incidental charges. This hold covers any costs incurred or potential damage during the rental
//       period. The amount will be reserved on your card but not charged unless necessary. Please ensure your card has sufficient funds to cover this
//       hold.
//     </>
//   );
// };

export const reservationDepositMessage = async (reservationDepositAmount: number, guestCoverageType: string): Promise<JSX.Element> => {
  const fetchGuestCoveragePackage = async () => {
    return guestInsuranceList.find((insurance: IGuestInsuranceList) => insurance?.id === guestCoverageType);
  };

  const guestCoveragePackage = await fetchGuestCoveragePackage();
  const defaultExcessFee = toNumber(guestCoveragePackage?.excessFee);
  // Determine the appropriate message based on the reservation deposit amount
  let message: JSX.Element;
  if (reservationDepositAmount === 0) {
    message = (
      <>{`We are pleased to inform you that, as a valued guest, we will not be holding any security deposit for this reservation. Please note that the insurance excess, based on your chosen coverage, will still apply in the event of any incident. Enjoy your time with us!`}</>
    );
  } else if (reservationDepositAmount === defaultExcessFee) {
    message = (
      <>
        {`To complete your booking, we will place a hold of`} <span className="font-extrabold">${reservationDepositAmount?.toFixed(2)}</span>{' '}
        {`on your payment card for the insurance excess fee or any incidental charges. This hold covers any costs incurred or potential damage during the rental period. The amount will be reserved on your card but not charged unless necessary. Please ensure your card has sufficient funds to cover this hold.`}
      </>
    );
  } else if (reservationDepositAmount < defaultExcessFee) {
    message = (
      <>
        {'To complete your booking, we will place a hold of '}
        <span className="font-extrabold">${reservationDepositAmount.toFixed(2)}</span>{' '}
        {`on your payment card as a security deposit for incidental charges. As a valued guest, we’re pleased to inform you that this security hold amount is lower than our standard charge. Rest assured, if there are no incidents, this amount will be fully refunded to you. We hope you enjoy your travel with Tashus!`}
      </>
    );
  } else if (reservationDepositAmount > defaultExcessFee) {
    message = (
      <>
        {`To complete your booking, we will place a hold of`} <span className="font-extrabold">${reservationDepositAmount.toFixed(2)}</span>{' '}
        {`on your payment card as a security deposit for incidental charges. This will cover insurance excess fees and any other incidental costs that may arise. Rest assured, if there are no incidents, this amount will be fully refunded to you. We hope you enjoy your travel with Tashus!`}
      </>
    );
  } else {
    message = <>{''}</>;
  }

  return message;
};

export const initialHoldAmountMessage = async (reservationDepositAmount: number, setByAdmin?: boolean): Promise<JSX.Element> => {
  let message: JSX.Element;
  if (reservationDepositAmount === 0) {
    message = (
      <>
        {`We are pleased to inform you that, as a valued guest, we will not be holding any security deposit for this reservation. Please note that the insurance excess, based on your chosen coverage, will still apply in the event of any incident. Enjoy your time with
        us!`}
      </>
    );
  } else if (reservationDepositAmount > 0) {
    message = (
      <>
        {`Dear valued guest! For this reservation, we will hold `}{' '}
        <span className="font-extrabold">${toFormattedNumber(reservationDepositAmount)}</span>{' '}
        {`as a deposit for incidental charges. Any remaining amount, or the full deposit if no charges apply, will be refunded after the successful completion of your reservation.${
          setByAdmin ? '' : ` Please note, this is a one-time charge and won't be applied to any of your future reservations.`
        } Thank you for your understanding!`}
      </>
    );
  } else {
    message = <>{''}</>;
  }
  return message;
};

type HandleFooterRedirectionParams = {
  city: string;
  country?: string;
  address?: string;
  source?: 'footer';
};

export const handleFooterRedirectionOld = ({ city, country, address = '', source }: HandleFooterRedirectionParams) => {
  return `${process.env.NEXT_PUBLIC_DOMAIN}/search?country=${country ?? 'au'}&city=${city}&address=${address ?? city}&source=${source}`;
};

export const handleFooterRedirection = ({
  city,
  country = 'au',
  region,
  lat,
  long,
  address = '',
  source,
  vehicleType,
}: {
  city: string;
  country?: string;
  region?: string;
  lat?: string;
  long?: string;
  address?: string;
  source: string;
  vehicleType?: string;
}) => {
  const { combinedDateTimeString: defaultPickupTimeString } = combineDateTimeUtc(getDefaultPickupTime(), getDefaultPickupTime(), 'footer default');

  const { combinedDateTimeString: defaultReturnTimeString } = combineDateTimeUtc(getDefaultReturnTime(), getDefaultReturnTime(), 'footer default');

  const pickupTime = defaultPickupTimeString;
  const returnTime = defaultReturnTimeString;

  const queryParams = buildQueryParams({
    lat,
    long,
    pickup: pickupTime,
    return: returnTime,
    city,
    region,
    country,
    address,
    source,
    vehicleType,
  });

  return `/search?${queryParams.toString()}`;
};

export const buildQueryParams = (params: Record<string, string | undefined>) => {
  return Object.keys(params)
    .filter((key) => params[key])
    .map((key) => `${key}=${encodeURIComponent(params[key] as string)}`)
    .join('&');
};

export const defaultCoordinate = [151.21310699999998, -33.866275];

export const getAdvanceTimeDiffInMin = (pickupDate: Dayjs): number => {
  const { formattedTimeDayObj: formattedCurrentDateTime } = getPickerTimeStringInUtc(currentDateTime);
  const pickupDateUtc = dayjsUtc(pickupDate);
  const advanceTimeDiffInMin = pickupDateUtc.diff(formattedCurrentDateTime, 'minute');
  return advanceTimeDiffInMin;
};

export const getIsNoticePeriodRequired = (noticeHours: number, advanceTimeDiffInMin: number) => {
  const noticePeriodInMin = noticeHours * 60;
  const isRequired = advanceTimeDiffInMin < noticePeriodInMin;
  // console.log({ noticeHours, advanceTimeDiffInMin, noticePeriodInMin, isRequired });
  return isRequired;
};

export const getSearchCardNoticeHourText = (noticeInAdvance: CarNoticeInAdvance): string => {
  const { alwaysAvailableImmediately, hoursRequired } = noticeInAdvance;
  if (!alwaysAvailableImmediately && hoursRequired) {
    const hourText = getSingularPluralNoun('hr', hoursRequired);
    return `${hoursRequired} ${hourText} notice`;
  }
  return '';
};
