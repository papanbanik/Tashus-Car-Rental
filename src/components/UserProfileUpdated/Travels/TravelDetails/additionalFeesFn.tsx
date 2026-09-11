import { EPriceAdjustment, ReservationPaymentStatusEnum } from '@/types/commonTypes';
import { AdditionalCharges, ReservationAdditionalFees, TAdditionalPaymentInfo, TBasePrice } from '@/types/travels/typeTravels';
import { dayjsUtc } from '@/utils/Functions/utcCommonFn';
import dayjs from 'dayjs';

export const calculateFinalSubtotal = (feeList: ReservationAdditionalFees[]): number => {
  return feeList.reduce((acc, fee) => acc + fee.subtotal, 0);
};

// Calculates additional fee due amount
export const calculateAdditionalFeeDueAmount = (feeList: ReservationAdditionalFees[]): number => {
  return feeList
    .filter((fee) => fee.paymentStatus === 'pending' || fee.paymentStatus === 'partiallyPaid') // Filter fees with relevant statuses
    .reduce((acc, fee) => {
      // Add currentDueAmount if partiallyPaid, otherwise add subtotal
      return acc + (fee.paymentStatus === 'partiallyPaid' ? fee?.currentDueAmount : fee?.subtotal);
    }, 0);
};

type CombineAllFeeItemsResponse = {
  itemType?: EPriceAdjustment;
  itemName: string;
  cost?: number;
  additionalCharges?: AdditionalCharges[];
};

export const combineAllFeeItems = (
  feesList: ReservationAdditionalFees[],
  basePrice: TBasePrice,
  additionalPaymentInfo: TAdditionalPaymentInfo
): CombineAllFeeItemsResponse[] | [] => {
  // Use reduce to flatten all feeItems arrays into one combined array
  if (feesList?.length > 0 || basePrice?.totalPrice > 0) {
    // Combine feeItems from feesList
    const feeItems: CombineAllFeeItemsResponse[] = feesList.reduce((combined, currentFeeBody) => {
      const currentFeeItems = currentFeeBody?.feeItems.map((item) => ({
        itemName: item.itemName,
        cost: item.cost,
        additionalCharges: item.additionalCharges,
      }));
      return combined.concat(currentFeeItems ?? []);
    }, [] as CombineAllFeeItemsResponse[]);

    const rentFee = basePrice?.totalPrice - (basePrice?.coverageAmount ?? 0) - (basePrice?.gstAmount ?? 0) - (basePrice?.penaltyPrice ?? 0);

    // Add basePrice fields as separate items with space-separated names
    const basePriceItems: CombineAllFeeItemsResponse[] = [
      {
        itemName: 'Rent Fee',
        cost: rentFee,
      },
      basePrice?.coverageAmount !== undefined && {
        itemName: 'Coverage Amount',
        cost: basePrice?.coverageAmount,
      },
      basePrice?.gstAmount !== undefined &&
        basePrice?.gstAmount > 0 && {
          itemName: 'GST Amount',
          cost: basePrice?.gstAmount,
        },
      basePrice?.penaltyPrice !== undefined &&
        basePrice?.penaltyPrice > 0 && {
          itemName: 'Inconvenience Fee',
          cost: basePrice?.penaltyPrice,
        },
    ].filter(Boolean) as CombineAllFeeItemsResponse[];

    // Add additional fee amounts as separate items with space-separated names
    // const additionalFeeItems: CombineAllFeeItemsResponse[] = [
    //   additionalPaymentInfo?.voucherAmountUsed !== undefined &&
    //     additionalPaymentInfo?.voucherAmountUsed > 0 && {
    //       itemName: 'Voucher Discount',
    //       cost: additionalPaymentInfo?.voucherAmountUsed,
    //     },
    // additionalPaymentInfo?.creditAmountUsed !== undefined &&
    //   additionalPaymentInfo?.creditAmountUsed > 0 && {
    //     itemName: 'Credit Used',
    //     cost: additionalPaymentInfo?.creditAmountUsed,
    //   },
    // ].filter(Boolean) as CombineAllFeeItemsResponse[];

    // Combine both feeItems and basePriceItems
    return [...basePriceItems, ...feeItems];
    // return feesList
    //   .map((feeBody) => feeBody.feeItems) // Map to get an array of feeItems arrays
    //   .reduce((acc, feeItems) => [...acc, ...feeItems], [] as ReservationAdditionalFeeItems[]); // Flatten the array
    // return feesList.reduce((combined, currentFeeBody) => {
    //   return combined.concat(currentFeeBody?.feeItems);
    // }, [] as ReservationAdditionalFeeItems[]);
  } else {
    return [];
  }
};

// Travel Billing
export const getDueRentFee = (paymentStatus: ReservationPaymentStatusEnum, basePrice: TBasePrice, additionalPaymentInfo: TAdditionalPaymentInfo) => {
  const _payable = basePrice?.payableAmount ?? 0;
  const _cardAmount = additionalPaymentInfo?.cardAmountUsed ?? 0;
  if (paymentStatus === 'pending' && _payable > 0) {
    return _payable;
  }

  if (paymentStatus === 'pending' && _cardAmount > 0) {
    return _cardAmount;
  }

  return 0;
};

export const calculateTotalPaidAdditionalFee = (feeList: ReservationAdditionalFees[]): number => {
  return feeList.filter((fee) => fee.paymentStatus === 'paid').reduce((acc, fee) => acc + fee.subtotal, 0);
};

interface FormatDateRangeOptions {
  fromDate?: string | Date;
  toDate?: string | Date;
  showTime?: boolean;
  separator?: string;
}

/**
 * Formats a date range with time display
 */

// Helper function to check if a date string is date-only format (YYYY-MM-DD)
const isDateOnlyFormat = (dateString: string): boolean => {
  if (!dateString) return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
};

// Helper function to check if date has meaningful time component
const hasTimeComponent = (dateString: string): boolean => {
  if (!dateString) return false;

  // If it's already in date-only format, no time component
  if (isDateOnlyFormat(dateString)) return false;

  // Check if it has time component other than midnight
  const date = dayjsUtc(dateString);
  return date.hour() !== 0 || date.minute() !== 0 || date.second() !== 0;
};

// Smart date formatter that handles both date-only and datetime strings
const formatDateWithTimeControl = (date: string | Date, showTime?: boolean): string => {
  if (!date) return '';

  const dateString = typeof date === 'string' ? date : date.toISOString();

  // If it's date-only format (YYYY-MM-DD), format directly without UTC conversion
  if (isDateOnlyFormat(dateString)) {
    return dayjs(dateString).format('DD MMM YYYY');
  }

  // If showTime is false, always show date only
  if (showTime === false) {
    return dayjsUtc(dateString).format('DD MMM YYYY');
  }

  // If showTime is true, always show date and time
  if (showTime === true) {
    return dayjsUtc(dateString).format('DD MMM YYYY, hh:mm A');
  }

  // Default behavior: If it's a full datetime but has no meaningful time (midnight), show date only
  if (!hasTimeComponent(dateString)) {
    return dayjsUtc(dateString).format('DD MMM YYYY');
  }

  // If it has meaningful time, show date and time
  return dayjsUtc(dateString).format('DD MMM YYYY, hh:mm A');
};

export const formatDateRangeForDisplay = ({ fromDate, toDate, showTime, separator = ' - ' }: FormatDateRangeOptions): string => {
  if (!fromDate) return '';

  // For comparison, normalize both dates to date-only strings
  const fromDateNormalized =
    typeof fromDate === 'string'
      ? isDateOnlyFormat(fromDate)
        ? fromDate
        : dayjsUtc(fromDate).format('YYYY-MM-DD')
      : dayjsUtc(fromDate).format('YYYY-MM-DD');

  const toDateNormalized = toDate
    ? typeof toDate === 'string'
      ? isDateOnlyFormat(toDate)
        ? toDate
        : dayjsUtc(toDate).format('YYYY-MM-DD')
      : dayjsUtc(toDate).format('YYYY-MM-DD')
    : null;

  // Check if dates are the same (comparing normalized date-only versions)
  const isSameDate = fromDate && toDate && fromDateNormalized === toDateNormalized;

  // If same date, check if times are also the same
  if (isSameDate) {
    const shouldCheckTimeMatch =
      showTime === true ||
      (showTime === undefined &&
        (hasTimeComponent(typeof fromDate === 'string' ? fromDate : fromDate.toISOString()) ||
          hasTimeComponent(typeof toDate === 'string' ? toDate : toDate.toISOString())));

    if (shouldCheckTimeMatch) {
      const fromTime = dayjsUtc(fromDate).format('HH:mm');
      const toTime = dayjsUtc(toDate).format('HH:mm');

      if (fromTime === toTime) {
        // Same date AND same time - show only once
        const fromDateFormatted = formatDateWithTimeControl(fromDate, showTime).replace(',', ' |');
        return fromDateFormatted;
      } else {
        // Same date but DIFFERENT times - show date once with both times
        const dateOnly = formatDateWithTimeControl(fromDate, false);
        const fromTimeOnly = dayjsUtc(fromDate).format('hh:mm A');
        const toTimeOnly = dayjsUtc(toDate).format('hh:mm A');

        return `${dateOnly} | ${fromTimeOnly}${separator}${toTimeOnly}`;
      }
    } else {
      // Same date, no time to show
      const fromDateFormatted = formatDateWithTimeControl(fromDate, showTime).replace(',', ' |');
      return fromDateFormatted;
    }
  }

  // If no end date, format normally
  if (!toDate) {
    const fromDateFormatted = formatDateWithTimeControl(fromDate, showTime).replace(',', ' |');
    return fromDateFormatted;
  }

  // Different dates - check if times are the same
  const shouldCheckTimeMatch =
    showTime === true ||
    (showTime === undefined &&
      (hasTimeComponent(typeof fromDate === 'string' ? fromDate : fromDate.toISOString()) ||
        hasTimeComponent(typeof toDate === 'string' ? toDate : toDate.toISOString())));

  if (shouldCheckTimeMatch) {
    const fromTime = dayjsUtc(fromDate).format('HH:mm');
    const toTime = dayjsUtc(toDate).format('HH:mm');

    if (fromTime === toTime) {
      // Same time - show dates with time for both
      const fromDateFormatted = formatDateWithTimeControl(fromDate, true).replace(',', ' |');
      const toDateFormatted = formatDateWithTimeControl(toDate, true).replace(',', ' |');

      return `${fromDateFormatted}${separator}${toDateFormatted}`;
    }
  }

  // Different dates and different times - format normally
  const fromDateFormatted = formatDateWithTimeControl(fromDate, showTime).replace(',', ' |');
  const toDateFormatted = formatDateWithTimeControl(toDate, showTime).replace(',', ' |');

  return `${fromDateFormatted}${separator}${toDateFormatted}`;
};
