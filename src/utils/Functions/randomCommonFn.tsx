import { EPaymentStatus } from '@/types/travels/travelEnums';
import { Country, State } from 'country-state-city';
import dayjs, { ManipulateType } from 'dayjs';

interface ValidationRules {
  required?: boolean;
  pattern?: {
    value: RegExp;
    message: string;
  };
  maxLength?: {
    value: number;
    message: string;
  };
}

const validateCommon = (value: string, rules: ValidationRules): string | true => {
  let errorMessage = '';

  if (rules.required && !value) {
    errorMessage = 'This field is required';
  }

  if (rules.pattern && !rules.pattern.value.test(value)) {
    errorMessage = rules.pattern.message;
  }

  if (rules.maxLength && value.length > rules.maxLength.value) {
    errorMessage = rules.maxLength.message;
  }

  return errorMessage || true;
};

export const validateName = (value: string, name?: string): string | true => {
  return validateCommon(value, {
    required: true,
    pattern: {
      value: /^[A-Za-z.\s]+$/,
      message: `Invalid ${name ?? 'Name'}`,
    },
    maxLength: {
      value: 50,
      message: 'Limit is Exceed',
    },
  });
};

export const stateFullName = (stateShortCode: string, countryCode?: string): string => {
  const state = !!countryCode ? State.getStateByCodeAndCountry(stateShortCode, countryCode) : State.getStateByCode(stateShortCode);
  return state ? state.name : '';
};

export const countryFullName = (countryCode: string): string => {
  const country = Country.getCountryByCode(countryCode);
  return country ? country.name : '';
};

export const getCountryCodeByName = (countryName: string) => {
  const countries = Country.getAllCountries();
  const country = countries.find((c) => c.name.toLowerCase() === countryName.toLowerCase());
  return country ? country.isoCode.toUpperCase() : '';
};
export const getStateCodeByName = (countryCode: string, stateName: string) => {
  const states = State.getStatesOfCountry(countryCode);
  const state = states?.find((s) => s.name.toLowerCase() === stateName.toLowerCase());
  return state ? state.isoCode.toUpperCase() : '';
};

export const getFlagUrl = (countryCode: string): string => {
  return `https://flagcdn.com/${countryCode?.toLowerCase()}.svg`;
};

export const isTimeExpired = (createdAt: Date, timeToAdd?: number, manipulateToAdd?: ManipulateType) => {
  if (createdAt) {
    const createdDate = dayjs(createdAt);
    const currentDate = dayjs();
    const expirationDate = createdDate.add(timeToAdd ?? 30, manipulateToAdd ?? 'minutes');
    return currentDate.isAfter(expirationDate);
  }
  return false;
};

export const handleRemoveLastSlashTextFromPath = (pathName: string) => {
  const modifiedPath = pathName.substring(0, pathName.lastIndexOf('/'));
  return modifiedPath;
};
export const formatCategory = (input: string) => {
  return input.replace(/\s+/g, '').replace(/(\b\w)/g, (match) => match.toUpperCase());
};

export const removeCamelCase = (inputString: string) => {
  const formattedString = inputString
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .replace(/^./, (str) => str.toUpperCase());

  return formattedString.length > 14 ? `${formattedString.slice(0, 14)}...` : formattedString;
};

export const TashusTitle = 'Tashus Eco-Friendly Car Rental in Australia';

export const toNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

export const toFormattedNumber = (value: number | string | undefined | null): number => {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return 0;
  }
  return parseFloat(Number(value).toFixed(2));
};

// Coverts a noun to singular or plural
export const getSingularPluralNoun = (word: string, itemNumber: number): string => {
  return itemNumber > 1 ? `${word}s` : word;
};

// generates short text with specified length
export const getShortenText = (text: string, shortenLength: number = 25): { isShorten: boolean; formattedText: string } => {
  const isShorten = text?.length > shortenLength && text?.length > shortenLength + 2;
  const formattedText = isShorten ? `${text?.slice(0, shortenLength)}...` : text;
  return { isShorten, formattedText };
};

export const shortenText = (text: string, shortenLength: number = 25) => {
  const formattedText = text?.length > shortenLength && text?.length > shortenLength + 2 ? `${text?.slice(0, shortenLength)}...` : text;
  return formattedText;
};

// converts meter to km
export const covertMetToKm = (meterValue: number): number => {
  const convertedKm = parseFloat((meterValue / 1000).toFixed(2));
  return convertedKm;
};

export const loadText = 'Loading...';

export const convertToThousandSeparator = (number: number): string => {
  return number?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const photoStorageProvider = 'cloudinary';

export const removeFalsyValues = <T extends Record<string, any>>(obj: T, requiredFields: (keyof T)[] = []): T => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => {
      if (requiredFields.includes(key as keyof T)) return true;
      return value !== undefined && value !== null && value !== '';
    })
  ) as T;
};

export enum ECommonText {
  UndefinedText = 'Not Added',
  RequiredHelpingText = `Fields marked with * are required. Please fill them in to complete your submission.`,
  RequiredSign = `*`,
  OptionalText = `(optional)`,
}

export const separateAndCapitalize = (input: string) => {
  const value = input ?? '';
  const separatedWords = value.split(/(?=[A-Z])/).join(' ');
  const capitalizedWords = separatedWords.replace(/\b\w/g, (char: string) => char.toUpperCase());
  return capitalizedWords;
};

export const isDevelopment = process.env.NEXT_PUBLIC_NODE_ENV === 'development';

export const getPaymentStatusChipColor = (status: string): 'warning' | 'success' | 'info' | 'error' => {
  switch (status) {
    case EPaymentStatus.Pending:
    case EPaymentStatus.PendingCharge:
      return 'warning';
    case EPaymentStatus.Paid:
      return 'success';
    case EPaymentStatus.Expired:
      return 'error';
    default:
      return 'info';
  }
};

export const separateFullName = (fullName?: string): { firstName?: string; lastName?: string } => {
  const trimmedName = fullName?.trim() ?? '';
  const nameParts = trimmedName?.split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  return { firstName, lastName };
};

export const formatCurrency = (amount?: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount ?? 0);

export const getUserFullName = (firstName?: string, middleName?: string, lastName?: string): string => {
  return [firstName, middleName, lastName].filter(Boolean).join(' '); //filter(Boolean) removes any falsy values like null, undefined, or empty strings.
};

export enum ECommonValue {
  HoldDepositAmount = 300,
}
