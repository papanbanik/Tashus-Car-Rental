import { CarRatesValues } from '@/types/car-listing/carListingTypes';
import { TDate } from '@/types/commonTypes';
import { TVoucherRule } from '@/types/voucher-promotion/promotionTypes';
import { TVoucherEvaluationData, TVoucherValidateRequest } from '@/types/voucher-promotion/voucherTypes';
import dayjs from 'dayjs';
import { formatDateUtc } from '../utcCommonFn';

const getRuleValidationData = async (
  voucherRules: TVoucherRule[],
  carRates: CarRatesValues,
  carType: string,
  discountType: string,
  pickupTime: TDate
): Promise<TVoucherEvaluationData | {}> => {
  const data: TVoucherEvaluationData = {} as TVoucherEvaluationData;

  // Get unique fields from voucherRules
  const fields = new Set(voucherRules?.map((rule) => rule.field));

  // Logic for CarListing
  if (fields.has('specificCarType') || fields.has('freeDays') || discountType === 'flat') {
    if (carType || carRates) {
      data.carRates = carRates;
      data.carType = carType;
    }
  }
  // Logic for monthOfTravel
  if (fields.has('monthOfTravel')) {
    data.monthOfTravel = dayjs(pickupTime).format('MMMM');
  }

  return data;
};

const evaluateVoucherRules = async (rules: TVoucherRule[], totalAmount: number, voucherEvaluationData: TVoucherEvaluationData): Promise<boolean> => {
  if (!rules) return true;
  for (const rule of rules) {
    const { operator, value, field } = rule;
    // const operator = originalOperator === '=' ? '===' : originalOperator;

    // console.group(`🧠 Checking Rule [${id}]`);
    // console.log('Field:', field);
    // console.log('Operator:', operator);
    // console.log('Value:', value);
    // console.log('Value Source:', valueSource);
    // console.log('Evaluation Data:', voucherEvaluationData);

    const isValid = await validateRule(field, operator, value, totalAmount, voucherEvaluationData);
    // console.log(`Result → ${isValid ? '✅ PASSED' : '❌ FAILED'}`);
    // console.groupEnd();

    // if (!isValid) {
    //   console.warn(`⚠️ Rule [${id}] "${field}" failed (operator: ${operator}, value: ${value})`);
    //   return false;
    // }
    if (!isValid) return false;
  }
  return true;
};

const validateRule = async (
  field: string,
  operator: string,
  value: string | boolean,
  totalAmount: number,
  voucherEvaluationData: TVoucherEvaluationData
): Promise<boolean> => {
  switch (field) {
    case 'freeDays':
      return eval(`${voucherEvaluationData?.reservationDuration} >= ${value}`);
    case 'travelDate':
      return validateTravelDate(operator, value, voucherEvaluationData?.pickupTime ?? '', voucherEvaluationData?.returnTime ?? '');

    case 'minimumSpendAmount':
      return eval(`${totalAmount} ${operator} ${value}`);

    case 'specificCarType': {
      const carTypes = (value as string).split(',').map((type) => type.trim().toLowerCase());

      return carTypes.includes(voucherEvaluationData?.carType?.toLowerCase() ?? '');
    }
    case 'specificReservationDays':
      return eval(`${voucherEvaluationData?.reservationDuration} ${operator} ${value}`);

    case 'travelsCompleted': //user profile
      return eval(`${voucherEvaluationData?.guestTotalTrips} ${operator} ${value}`);

    case 'travelDateRange':
      return validateTravelDateRange(operator, value, voucherEvaluationData?.pickupTime ?? '', voucherEvaluationData?.returnTime ?? '');

    case 'monthOfTravel': {
      const months = (value as string).split(',').map((month: string) => month.trim().toLowerCase());

      return months.includes(voucherEvaluationData?.monthOfTravel?.toLowerCase() ?? '');
    }
    case 'discountOverDays':
      return eval(`${voucherEvaluationData?.reservationDuration} >= ${value}`);
    // return eval(`${voucherEvaluationData?.reservationDuration} ${operator} ${value}`); //operator for this rule is only =

    case 'specificVehicle': {
      // Format: HYUNDAI-ACCENT-HATCHBACK-2011-1011
      const vehicleValueParts = (value as string)?.split('-') ?? [];
      const extractedListingId = vehicleValueParts[vehicleValueParts.length - 1]; // Get the last part

      const carListingId = voucherEvaluationData?.carListingId?.toString() ?? '';

      return compareValues(extractedListingId, operator, carListingId);
    }

    default:
      return false;
    // throw new Error('Invalid field provided');
  }
};

const compareValues = (leftValue: string, operator: string, rightValue: string): boolean => {
  if (operator === '===' || operator === '=') {
    return leftValue === rightValue;
  }

  return false;
};

const validateTravelDate = (operator: string, value: string | boolean, pickupTime: TDate, returnTime: TDate): boolean => {
  if (!pickupTime || !returnTime) return false;

  const startDate = dayjs.isDayjs(pickupTime) ? pickupTime.toDate() : new Date(pickupTime);
  const endDate = dayjs.isDayjs(returnTime) ? returnTime.toDate() : new Date(returnTime);
  const travelDate = new Date(value as string);

  // Normalize times to 00:00:00
  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(0, 0, 0, 0);
  travelDate.setUTCHours(0, 0, 0, 0);

  if (isNaN(travelDate.getTime())) {
    return false;
  }

  // Check if the travelDate is within the start and end range
  switch (operator) {
    case '=':
      // Travel date must exactly match the startDate (or be within the range)
      return travelDate >= startDate && travelDate <= endDate;
    case '===':
      // Travel date must exactly match the startDate (or be within the range)
      return travelDate >= startDate && travelDate <= endDate;
    case '>':
      // Travel date must be greater than the start date
      return travelDate > startDate;
    case '>=':
      // Travel date must be greater than or equal to the start date
      return travelDate >= startDate;
    case '<':
      // Travel date must be less than the end date
      return travelDate < endDate;
    case '<=':
      // Travel date must be less than or equal to the end date
      return travelDate <= endDate;
    default:
      // If operator is unknown, mark as invalid
      return false;
  }
};

const validateTravelDateRange = (
  operator: string,
  value: string | boolean | string[], // Value can be a string or array
  pickupTime: TDate,
  returnTime: TDate
): boolean => {
  if (!pickupTime || !returnTime) return false;

  // Handle the value as a comma-separated string or array
  let rangeDates: string[];
  if (typeof value === 'string') {
    rangeDates = value.split(',');
  } else if (Array.isArray(value) && value.length === 2) {
    rangeDates = value;
  } else {
    return false; // Invalid value format
  }

  if (rangeDates.length !== 2) return false;

  const startRange = new Date(rangeDates[0]);
  const endRange = new Date(rangeDates[1]);
  const pickupDate = dayjs.isDayjs(pickupTime) ? pickupTime.toDate() : new Date(pickupTime);
  const returnDate = dayjs.isDayjs(returnTime) ? returnTime.toDate() : new Date(returnTime);

  // Validate that dates are valid
  if (isNaN(startRange.getTime()) || isNaN(endRange.getTime()) || isNaN(pickupDate.getTime()) || isNaN(returnDate.getTime())) {
    return false;
  }

  // Normalize all dates to midnight UTC to compare only the date part
  startRange.setUTCHours(0, 0, 0, 0);
  endRange.setUTCHours(0, 0, 0, 0);
  pickupDate.setUTCHours(0, 0, 0, 0);
  returnDate.setUTCHours(0, 0, 0, 0);

  // Ensure the range is valid (startRange <= endRange)
  if (startRange > endRange) return false;

  switch (operator) {
    case 'between':
      // Check if the travel period (pickupDate to returnDate) is fully within the range
      return pickupDate >= startRange && returnDate <= endRange;
    case '===':
      // Exact match: pickupDate and returnDate must exactly match the startRange and endRange
      return pickupDate.getTime() === startRange.getTime() && returnDate.getTime() === endRange.getTime();
    case '>':
      // Travel period must start after the end of the range
      return pickupDate > endRange;
    case '>=':
      // Travel period must start on or after the end of the range
      return pickupDate >= endRange;
    case '<':
      // Travel period must end before the start of the range
      return returnDate < startRange;
    case '<=':
      // Travel period must end on or before the start of the range
      return returnDate <= startRange;
    default:
      // Unknown operator
      return false;
  }
};

const evaluateVoucherRulesWithDiscount = async (
  rules: TVoucherRule[],
  totalAmount: number,
  voucherEvaluationData: TVoucherEvaluationData
): Promise<{ isValid: boolean; selectedDiscount: number | undefined }> => {
  if (!rules) return { isValid: true, selectedDiscount: undefined };

  const reservationDuration = voucherEvaluationData?.reservationDuration ?? 0;
  let selectedDiscount: number | undefined;
  let hasMatch = false; // Track if any specificReservationDays rule matches
  let allOtherRulesValid = true; // Track if all non-specificReservationDays rules are valid

  // First pass: Check specificReservationDays rules
  for (const rule of rules) {
    const { operator: originalOperator, value, field } = rule;
    const operator = originalOperator === '=' ? '===' : originalOperator;

    if (field === 'specificReservationDays' && typeof value === 'string') {
      const [daysThreshold, discount] = value
        .split(',')
        .map((v) => Number(v.trim()))
        .filter((v) => !isNaN(v)); // e.g., "2,20" -> [2, 20]

      if (eval(`${reservationDuration} ${operator} ${daysThreshold}`)) {
        hasMatch = true; // At least one rule matches
        selectedDiscount = discount;
      }
    }
  }

  // If no specificReservationDays rule matches, return false
  if (!hasMatch && rules.some((rule) => rule.field === 'specificReservationDays')) {
    return { isValid: false, selectedDiscount: undefined };
  }

  // Second pass: Validate all non-specificReservationDays rules if a match was found or no specificReservationDays rules exist
  for (const rule of rules) {
    const { operator: originalOperator, value, field } = rule;
    const operator = originalOperator === '=' ? '===' : originalOperator;

    if (field !== 'specificReservationDays') {
      const isValid = await validateRule(field, operator, value, totalAmount, voucherEvaluationData);
      if (!isValid) {
        allOtherRulesValid = false;
        break;
      }
    }
  }

  // Return true only if at least one specificReservationDays rule matches (if present) AND all other rules are valid
  // If no specificReservationDays rules exist, return true only if all other rules are valid
  const hasSpecificReservationDays = rules.some((rule) => rule.field === 'specificReservationDays');
  const isValid = (hasSpecificReservationDays ? hasMatch : true) && allOtherRulesValid;

  return { isValid, selectedDiscount };
};

const evaluateVoucherRulesWithMinimumSpendAmount = async (
  rules: TVoucherRule[],
  totalAmount: number,
  voucherEvaluationData: TVoucherEvaluationData
): Promise<{ isValid: boolean }> => {
  if (!rules || rules.length === 0) {
    return { isValid: true };
  }
  let highestApplicableDiscount = 0;
  let hasMinimumSpendMatch = false;
  let allOtherRulesValid = true;

  const hasMinimumSpendRule = rules.some((rule) => rule.field === 'minimumSpendAmount');
  /**
   * First pass: evaluate minimumSpendAmount rules
   */
  for (const rule of rules) {
    if (rule.field !== 'minimumSpendAmount' || typeof rule.value !== 'string') {
      continue;
    }
    const operator = rule.operator === '=' ? '===' : rule.operator;
    const [minimumAmount, discount] = rule.value.split(',').map((v) => Number(v.trim()));
    if (Number.isNaN(minimumAmount) || Number.isNaN(discount)) {
      continue;
    }
    let conditionMet = false;
    switch (operator) {
      case '>':
        conditionMet = totalAmount > minimumAmount;
        break;
      case '>=':
        conditionMet = totalAmount >= minimumAmount;
        break;
      case '<':
        conditionMet = totalAmount < minimumAmount;
        break;
      case '<=':
        conditionMet = totalAmount <= minimumAmount;
        break;
      case '===':
        conditionMet = totalAmount === minimumAmount;
        break;
      default:
        continue;
    }
    if (conditionMet) {
      hasMinimumSpendMatch = true;
      if (discount > highestApplicableDiscount) {
        highestApplicableDiscount = discount;
      }
    }
  }
  /**
   * If minimumSpendAmount rules exist but none matched → invalid voucher
   */
  if (hasMinimumSpendRule && !hasMinimumSpendMatch) {
    return { isValid: false };
  }
  /**
   * Second pass: validate all other rules
   */
  for (const rule of rules) {
    if (rule.field === 'minimumSpendAmount') {
      continue;
    }
    const operator = rule.operator === '=' ? '===' : rule.operator;
    const isValid = await validateRule(rule.field, operator, rule.value, totalAmount, voucherEvaluationData);
    if (!isValid) {
      allOtherRulesValid = false;
      break;
    }
  }
  return { isValid: allOtherRulesValid };
};

export const checkVoucherValidity = async (checkVoucherAvailabilityRequest: TVoucherValidateRequest): Promise<boolean> => {
  //console.log('Check Voucher Validity', checkVoucherAvailabilityRequest);
  try {
    const { totalAmount, additionalData, voucherInfo } = checkVoucherAvailabilityRequest;

    const { carListingId, travelStartDate: pickupTime, travelEndDate: returnTime, reservationDuration, carRates, carType } = additionalData;

    const { discountType = '', voucherRules = [] } = voucherInfo || {};
    let areRulesValid = true;

    let ruleValidationData: TVoucherEvaluationData = {
      carListingId,
      pickupTime,
      returnTime,
    };

    const hasRules = voucherRules?.length > 0;

    if (hasRules || discountType === 'flat') {
      const additionalRuleValidationData = await getRuleValidationData(
        voucherRules ?? [],
        (carRates ?? {}) as CarRatesValues,
        carType ?? '',
        discountType,
        pickupTime
      );
      //console.log('Additional Rules', additionalRuleValidationData);
      ruleValidationData = { ...ruleValidationData, ...additionalRuleValidationData };
    }

    const multipleSpecificReservationDays = voucherRules.filter((rule) => rule.field === 'specificReservationDays').length > 1;
    const hasMultipleMinSpendAmountsRules = (voucherRules || []).filter((rule) => rule.field === 'minimumSpendAmount').length > 1;

    if (hasRules && discountType === 'percentage' && multipleSpecificReservationDays) {
      const { isValid } = await evaluateVoucherRulesWithDiscount(voucherRules, totalAmount, { ...ruleValidationData, reservationDuration });
      //console.log('Evaluation Result', evaluationResult);
      areRulesValid = isValid;
    } else if (hasRules && discountType === 'percentage' && hasMultipleMinSpendAmountsRules) {
      // Custom logic for percentage discount with multiple minimumSpendAmount values
      const { isValid } = await evaluateVoucherRulesWithMinimumSpendAmount(voucherRules ?? [], totalAmount, {
        ...ruleValidationData,
        reservationDuration,
      });
      areRulesValid = isValid;
    } else if (hasRules && discountType === 'fixed' && hasMultipleMinSpendAmountsRules) {
      // Custom logic for fixed discount with multiple values
      const evaluationResult = await evaluateVoucherRulesWithMinimumSpendAmount(voucherRules ?? [], totalAmount, {
        ...ruleValidationData,
        reservationDuration,
      });
      areRulesValid = evaluationResult.isValid;
    } else if (hasRules) {
      areRulesValid = await evaluateVoucherRules(voucherRules, totalAmount, {
        ...ruleValidationData,
        reservationDuration,
      });
      // console.log('Are Rules Valid', areRulesValid);
    }

    if (!areRulesValid) return false;

    return true;
  } catch (error) {
    console.error(`Voucher validation failed: ${(error as Error).message}`);
    return false;
  }
};

export const formatRuleText = (
  rule: TVoucherRule,
  discountAmount: number,
  discountType: string,
  voucherAmountUsed?: number,
  carName?: string
): string => {
  const { field, operator, value } = rule;
  if (discountType === 'flat' && field === 'discountOverDays') {
    return `Flat <strong>$${discountAmount}</strong> discount for first <strong>${value} days</strong>.`;
  }
  if (discountType === 'free_days' && field === 'freeDays' && (voucherAmountUsed ?? 0) > 0) {
    return `Free <strong>${value} days</strong>, value up to <strong>$${voucherAmountUsed}</strong>.`;
  }
  const fieldMap: { [key: string]: string } = {
    minimumSpendAmount: 'Minimum Spend Amount',
    freeDays: 'Reservation Duration',
    specificReservationDays: 'Reservation Duration',
    travelsCompleted: 'Travels Completed by the user',
    specificCarType: 'Car Type',
    monthOfTravel: 'Month of Travel',
    discountOverDays: 'Reservation Duration',
    travelDate: 'Travel Date',
    travelDateRange: 'Travel Period',
    specificVehicle: 'Specific Vehicle is',
  };

  const operatorMap: { [key: string]: string } = {
    '>': 'is greater than',
    '>=': 'is greater than or equal to',
    '<': 'is less than',
    '<=': 'is less than or equal to',
    '===': 'must be', // Updated for clearer prose
    '=': 'must be', // Updated for clearer prose
    '!=': 'can not be',
    between: 'is between',
  };

  const readableField = fieldMap[field] || field;
  const readableOperator = operatorMap[operator] || operator;
  let formattedValue = value;

  // --- Specialized Formatting Logic ---

  if (field === 'minimumSpendAmount') {
    if (typeof value === 'string' && value.includes(',')) {
      const [spend, reward] = value.split(',');
      const rewardText = discountType === 'percentage' ? `get <strong>${reward}%</strong> discount` : `get <strong>$${reward}</strong> discount`;
      return `${readableField} ${readableOperator} <strong>$${spend}</strong>, ${rewardText}`;
    } else {
      formattedValue = `$${value}`;
    }
  } else if (field === 'specificVehicle' && typeof value === 'string') {
    const parts = value.split('-');
    // Assuming the last part is the ID, e.g., '1011'
    formattedValue = !!carName ? carName : `listing ID <strong>${parts[parts.length - 1]}</strong>`;
  } else if (['freeDays', 'specificReservationDays', 'discountOverDays'].includes(field)) {
    // Appends 'days' to the value
    formattedValue = `<strong>${value} days</strong>`;
  } else if (field === 'travelDate' || (field === 'travelDateRange' && typeof value === 'string')) {
    const datesString = String(value)
      .split(',')
      .map((dateStr) => {
        try {
          return `<strong>${formatDateUtc(dateStr)}</strong>`;
        } catch (e) {
          return `<strong>${dateStr}</strong>`;
        }
      })
      .join(' and ');
    return `${readableField} ${readableOperator} ${datesString}`;
  } else if (['specificCarType', 'monthOfTravel'].includes(field) && typeof value === 'string') {
    const options = value
      .split(',')
      .map((option) => option.trim())
      .map((option) => `<strong>${option}</strong>`)
      .join(' or ');
    return `${readableField} must be one of: ${options}`;
  }
  return `${readableField} ${readableOperator} <strong>${formattedValue}</strong>`;
};
