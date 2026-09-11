'use client';

import { TCarBlockDate } from '@/types/car-search/availabilityValidationTypes';
import { AdditionalFeeReservationDetails } from '@/types/payment/additionalFeeReservation';
import { TDeliveryRequest } from '@/types/reservations/reservationDeliveryTypes';
import { ReservationInvoiceInfoData } from '@/types/reservations/reservationInvoiceTypes';
import { TVerifyGuestInfoByPartner } from '@/types/reservations/typeReservationsActions';
import { TBillingDetails, TUpdatedTravelData } from '@/types/travels/typeEditTravels';
import { ReservationPriceListType, TReservation, TTravelQueryEnableFlags } from '@/types/travels/typeTravels';
import { TPeakIncreasedDates } from '@/types/user-profile/customPriceTypes';
import { formatDateToLocal, getDurationDayHourMin, isSameDay } from '@/utils/Functions/dateTimeCommonFn';
import {
  calculateNextHighestLongDiscount,
  calculatePeakIncreasePrice,
  commonDiscountCalculation,
  convertWeekToDays,
  getDurationPrice,
  isDayOfWeekInRange,
  validateBlockDates,
  validateReservations,
  verifyCustomPickupReturn,
  verifyMaxTravelDays,
  verifyMinTravelDays,
} from '@/utils/Functions/reservationValidationFn';
import { formatDateUtc, formatTimeUtc } from '@/utils/Functions/utcCommonFn';
import dayjs from 'dayjs';
import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';
import { useSearchContext } from './SearchProvider';

type TravelContextType = {
  verifyAvailability: (
    pickupDateTime: string | Date,
    returnDateTime: string | Date,
    carData: any,
    reservationData: any,
    isStartChanging: boolean,
    customBlockDayList: TCarBlockDate[]
  ) => Promise<boolean | undefined>;
  calculateIncreasedEndTotalPrice: (
    pickupDateTime: string | Date,
    returnDateTime: string | Date,
    carPriceData: any,
    oldReturnDate?: string | Date,
    isEndExtended?: boolean,
    oldDurationPrice?: number
  ) => Promise<any>;
  getPreviousReservationData: (travelDetails: any) => Promise<any>;
  updatedTravelData: TUpdatedTravelData;
  setUpdatedTravelData: Dispatch<SetStateAction<TUpdatedTravelData>>;
  reservationList: TReservation[];
  setReservationList: Dispatch<SetStateAction<TReservation[]>>;
  isTravelListLoading: boolean;
  setIsTravelListLoading: Dispatch<SetStateAction<boolean>>;
  isReservationListLoading: boolean;
  setIsReservationListLoading: Dispatch<SetStateAction<boolean>>;
  verifyGuestInfoByPartner: TVerifyGuestInfoByPartner;
  setVerifyGuestInfoByPartner: Dispatch<SetStateAction<TVerifyGuestInfoByPartner>>;
  travelQueryEnableFlags: TTravelQueryEnableFlags;
  setTravelQueryEnableFlags: Dispatch<SetStateAction<TTravelQueryEnableFlags>>;
  billingDetails: TBillingDetails;
  setBillingDetails: Dispatch<SetStateAction<TBillingDetails>>;
  additionalFeeReservationDetails: AdditionalFeeReservationDetails;
  setAdditionalFeeReservationDetails: Dispatch<SetStateAction<AdditionalFeeReservationDetails>>;
  clientSecret: string;
  setClientSecret: Dispatch<SetStateAction<string>>;
  reservationInvoiceInfo: ReservationInvoiceInfoData;
  setReservationInvoiceInfo: Dispatch<SetStateAction<ReservationInvoiceInfoData>>;
  reservationDeliveryDetails: TDeliveryRequest;
  setReservationDeliveryDetails: Dispatch<SetStateAction<TDeliveryRequest>>;
  reservationPriceList: ReservationPriceListType[];
  setReservationPriceList: Dispatch<SetStateAction<ReservationPriceListType[]>>;
  peakIncreasedDates: TPeakIncreasedDates[];
  setPeakIncreasedDates: Dispatch<SetStateAction<TPeakIncreasedDates[]>>;
};

const DTravelQueryEnableFlags: TTravelQueryEnableFlags = {
  useConfirmGuestLicenseInfo: false,
};

type TravelProviderProps = {
  children: ReactNode;
};

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export const useTravelContext = (): TravelContextType => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravelContext must be used within a TravelProvider');
  }
  return context;
};

export const TravelProvider: FC<TravelProviderProps> = ({ children }) => {
  const { queryEnableFlags, setQueryEnableFlags, setAvailabilityErrorText, setReservationDuration, setDurationPrice } = useSearchContext();

  const [updatedTravelData, setUpdatedTravelData] = useState<TUpdatedTravelData>({} as TUpdatedTravelData);
  const [reservationList, setReservationList] = useState<TReservation[]>([]);
  const [isTravelListLoading, setIsTravelListLoading] = useState(true);
  const [isReservationListLoading, setIsReservationListLoading] = useState(true);
  const [verifyGuestInfoByPartner, setVerifyGuestInfoByPartner] = useState<TVerifyGuestInfoByPartner>({} as TVerifyGuestInfoByPartner);
  const [travelQueryEnableFlags, setTravelQueryEnableFlags] = useState<TTravelQueryEnableFlags>(DTravelQueryEnableFlags);
  const [billingDetails, setBillingDetails] = useState<TBillingDetails>({} as TBillingDetails);
  const [additionalFeeReservationDetails, setAdditionalFeeReservationDetails] = useState<AdditionalFeeReservationDetails>(
    {} as AdditionalFeeReservationDetails
  );
  const [clientSecret, setClientSecret] = useState<string>('');
  const [reservationInvoiceInfo, setReservationInvoiceInfo] = useState<ReservationInvoiceInfoData>({} as ReservationInvoiceInfoData);
  const [reservationDeliveryDetails, setReservationDeliveryDetails] = useState<TDeliveryRequest>({} as TDeliveryRequest);
  const [reservationPriceList, setReservationPriceList] = useState<ReservationPriceListType[]>([]);
  const [peakIncreasedDates, setPeakIncreasedDates] = useState<TPeakIncreasedDates[]>([]);
  // validates vehicle's availability
  const verifyAvailability = async (
    pickupDateTime: string | Date,
    returnDateTime: string | Date,
    carData: any,
    reservationData: any,
    isStartChanging: boolean,
    customBlockDayList: TCarBlockDate[]
  ): Promise<boolean | undefined> => {
    // console.log(carData);
    // console.log(reservationData);

    const { noticeInAdvance, minTripDuration, maxTripDuration, pickupReturnHour } = carData?.availability;
    const pickupDate = dayjs(pickupDateTime);
    const returnDate = dayjs(returnDateTime);

    // Calculate the time difference between pickup & return in hours, days
    const timeDiffHours = returnDate.diff(pickupDate, 'hour');
    const timeDiffDays = returnDate.diff(pickupDate, 'day');
    const timeDiffWeek = returnDate.diff(pickupDate, 'week');
    const timeDiffMins = returnDate.diff(pickupDate, 'minute');

    // console.log(timeDiffHours);

    const advanceHourDiff = pickupDate.diff(dayjs(), 'hour');

    const sameDay = isSameDay(pickupDate, returnDate);

    setQueryEnableFlags({ ...queryEnableFlags, enableSingleCarReservations: true });

    // Check reservation data if pickup return hour is available
    const filteredReservations = reservationData?.filter((reservation: any) => {
      const isCancelled: boolean = ['cancelled', 'cancelledByGuest', 'cancelledByHost']?.includes(reservation?.reservationStatus);
      const isTripEnded: boolean =
        reservation?.tripInformation?.tripEndingInfo?.isEndedByGuest ||
        reservation?.tripInformation?.tripEndingInfo?.isEndedByPartner ||
        reservation?.tripInformation?.tripEndingInfo?.isEndedByAdmin;
      return !(isCancelled || isTripEnded);
    });

    if (reservationData?.length > 0 && filteredReservations?.length > 0) {
      const isCarReserved = await validateReservations(filteredReservations, pickupDateTime, returnDateTime);
      // console.log(isCarReserved);
      if (isCarReserved) {
        setAvailabilityErrorText('Reserved on selected time');
        return false;
      }
    }

    // Check custom block dates validity
    if ((customBlockDayList || [])?.length > 0) {
      const { isCarBlocked, overlappedDate } = await validateBlockDates(customBlockDayList, pickupDateTime, returnDateTime);
      // console.log(isCarBlocked);
      if (isCarBlocked) {
        const startDate = formatDateToLocal(overlappedDate?.start);
        const endDate = formatDateToLocal(overlappedDate?.end);
        setAvailabilityErrorText(
          `Unavailable on ${formatDateUtc(overlappedDate?.start)}, from ${formatTimeUtc(overlappedDate?.start)} to ${formatTimeUtc(
            overlappedDate?.end
          )}`
        );
        return false;
      }
    }

    if (
      noticeInAdvance?.alwaysAvailableImmediately &&
      minTripDuration?.noMinimum &&
      maxTripDuration?.noMaximum &&
      pickupReturnHour?.alwaysAvailable
    ) {
      return true;
    }

    if (isStartChanging && !noticeInAdvance?.alwaysAvailableImmediately && advanceHourDiff < noticeInAdvance?.hoursRequired) {
      // console.log(noticeInAdvance);
      const errorText = `${noticeInAdvance?.hoursRequired} hour${noticeInAdvance?.hoursRequired > 1 ? 's' : ''} notice period is required`;
      setAvailabilityErrorText(errorText);
      return false;
    }

    if (!minTripDuration?.noMinimum) {
      // console.log(minTripDuration);
      const isMinDurationValid = await verifyMinTravelDays(
        minTripDuration?.unit,
        minTripDuration?.shortestDuration,
        timeDiffHours,
        timeDiffDays,
        timeDiffMins
      );
      // console.log(isMinDurationValid);

      if (!isMinDurationValid) {
        const errorText = `Reservation needs to be for minimum ${minTripDuration?.shortestDuration} ${
          minTripDuration?.shortestDuration > 1 ? `${minTripDuration?.unit}` : `${minTripDuration?.unit.slice(0, -1)}`
        }`;
        setAvailabilityErrorText(errorText);
        return isMinDurationValid;
      }
    }

    // console.log(maxTripDuration);
    if (!maxTripDuration?.noMaximum) {
      const isMaxDurationValid = await verifyMaxTravelDays(maxTripDuration?.unit, maxTripDuration?.longestDuration, timeDiffMins);
      // console.log(isMaxDurationValid);

      if (!isMaxDurationValid) {
        // Reservations must not exceed 2 weeks
        const errorText = `Reservations must not exceed ${maxTripDuration?.longestDuration} ${
          maxTripDuration?.longestDuration > 1 ? `${maxTripDuration?.unit}` : `${maxTripDuration?.unit.slice(0, -1)}`
        }`;
        setAvailabilityErrorText(errorText);
        return isMaxDurationValid;
      }
    }

    if (!pickupReturnHour?.alwaysAvailable) {
      // console.log(pickupReturnHour?.customAvailability);
      const isCustomAvailabilityValid = await verifyCustomPickupReturn(
        pickupReturnHour?.customAvailability,
        pickupDateTime,
        returnDateTime,
        timeDiffHours,
        sameDay
      );
      if (isCustomAvailabilityValid?.isPickupValid && isCustomAvailabilityValid?.isReturnValid) {
        // console.log('custom');
        return true;
      }
      if (!isCustomAvailabilityValid?.isPickupValid) {
        setAvailabilityErrorText(`Pickup unavailable for selected time on ${isCustomAvailabilityValid?.pickupData?.dayName}`);
        return false;
      }
      if (!isCustomAvailabilityValid?.isReturnValid) {
        setAvailabilityErrorText(`Return unavailable for selected time on ${isCustomAvailabilityValid?.returnData?.dayName}`);
        return false;
      }
    }
    return true;
  };

  // Total Price calculation for new end > current end extension
  const calculateIncreasedEndTotalPrice = async (
    pickupDateTime: string | Date,
    returnDateTime: string | Date,
    carPriceData: any,
    oldReturnDate?: string | Date,
    isEndExtended?: boolean,
    oldDurationPrice?: number
  ) => {
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

  const getPreviousReservationData = async (updatedTravelData: TUpdatedTravelData): Promise<any> => {
    // console.log(updatedTravelData);
    const serviceFee = updatedTravelData?.basePrice?.serviceFeeAmount;
    // console.log(serviceFee);

    const oldData: any = {
      oldDuration: `${getDurationDayHourMin(dayjs(updatedTravelData?.pickupDate), dayjs(updatedTravelData?.returnDate))} rental`,
      oldDurationPrice: updatedTravelData?.basePrice?.durationPrice,
      oldPeakIncPrice: updatedTravelData?.peakIncrease,
      oldTotalPrice: updatedTravelData?.basePrice?.totalPrice,
      oldServiceFee: serviceFee,
      oldCoverageAmount: updatedTravelData?.basePrice?.coverageAmount || 0,
      oldGstAmount: updatedTravelData?.basePrice?.gstAmount || 0,
      oldDepositAmount: updatedTravelData?.depositAmount,
      oldPenaltyPrice: updatedTravelData?.basePrice?.penaltyPrice || 0,
      oldPenaltyReason: updatedTravelData?.basePrice?.penaltyReason ?? '',
    };

    if (updatedTravelData?.discounts?.longBookingDiscounts) {
      const highestDiscount = updatedTravelData?.discounts?.longBookingDiscounts;
      // console.log(highestDiscount);
      if (highestDiscount?.duration) {
        const text = `${highestDiscount?.percentage}% off for ${highestDiscount?.duration}+ ${
          highestDiscount?.duration > 1 ? `${highestDiscount?.durationUnit}` : `${highestDiscount?.durationUnit?.slice(0, -1)}`
        }`;
        oldData.oldLongBookingDis = { ...updatedTravelData?.discounts?.longBookingDiscounts, text };
      }
    }

    if (updatedTravelData?.discounts?.advanceBookingDiscounts) {
      const highestDiscount = updatedTravelData?.discounts?.advanceBookingDiscounts;
      // console.log(highestDiscount);
      const text = `${highestDiscount?.percentage}% off for early reservation`;
      oldData.oldAdvBookingDis = { ...updatedTravelData?.discounts?.advanceBookingDiscounts, text };
    }
    // console.log(oldData);

    return oldData;
  };

  const contextValue: TravelContextType = {
    verifyAvailability,
    calculateIncreasedEndTotalPrice,
    getPreviousReservationData,
    updatedTravelData,
    setUpdatedTravelData,
    reservationList,
    setReservationList,
    isTravelListLoading,
    setIsTravelListLoading,
    isReservationListLoading,
    setIsReservationListLoading,
    verifyGuestInfoByPartner,
    setVerifyGuestInfoByPartner,
    travelQueryEnableFlags,
    setTravelQueryEnableFlags,
    billingDetails,
    setBillingDetails,
    additionalFeeReservationDetails,
    setAdditionalFeeReservationDetails,
    clientSecret,
    setClientSecret,
    reservationInvoiceInfo,
    setReservationInvoiceInfo,
    reservationDeliveryDetails,
    setReservationDeliveryDetails,
    reservationPriceList,
    setReservationPriceList,
    peakIncreasedDates,
    setPeakIncreasedDates,
  };

  return <TravelContext.Provider value={contextValue}>{children}</TravelContext.Provider>;
};
