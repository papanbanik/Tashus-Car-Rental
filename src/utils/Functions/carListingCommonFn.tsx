import { CarFuelDataInfo } from '@/types/car-listing/carListingTypes';
import { AddressState, PickupHistoryState } from '@/types/car-listing/carLocationTypes';
import { CarDataBookingDiscount } from '@/types/car-listing/carPricingTypes';
import { ReservationLocationState } from '@/types/travels/typeTravels';
import dayjs from 'dayjs';
import { OptionType } from '../Lists/carListInfo';
import { currentDateTime } from './dateTimeCommonFn';
import { toNumber } from './randomCommonFn';
import { convertWeekToDays } from './reservationValidationFn';

export const validateCarName = (value: string) => {
  const trimmedValue = value?.replace(/\s+/g, ' ')?.trim(); // Replace multiple spaces with a single space
  const allSpacesRemoved = trimmedValue?.replaceAll(' ', '');
  const spaceCount = trimmedValue?.split(' ').length - 1;

  return (allSpacesRemoved?.length <= 30 && spaceCount <= 1) || 'Please enter a valid name up to 30 characters (one space allowed)';
};

export const validateOdometer = (value: any) => {
  const parsedValue = parseFloat(value);
  const hasDecimal = value?.toString()?.includes('.');

  if (hasDecimal) {
    return 'Only integer values are allowed';
  }

  return (parsedValue >= 0 && parsedValue <= 200000) || 'Odometer reading must be between 0 to 200,000 km';
};

export const validateYear = (value: string) => {
  const parsedYear = parseInt(value);
  const currentYear = dayjs().year();
  const carAge = currentYear - parsedYear;
  // console.log({ currentYear, parsedYear, carAge });
  return carAge <= 15 || 'The age of the vehicle must fall within a maximum of 15 years';
};

export const validateExpiryDate = (expiryDate: any) => {
  const tempExpiryDate = dayjs(expiryDate);
  const nextDay = dayjs().add(1, 'day');

  // console.log(expiryDate, dayjs(tempExpiryDate).isAfter(nextDay));
  return dayjs(tempExpiryDate).isAfter(nextDay) || 'Expired';
};

export const shouldDisableExpiryDate = (expiryDate: any, storedExpiry: any): boolean => {
  // console.log(expiryDate, storedExpiry);
  //disable logic when verifying registration
  if (expiryDate) {
    const tempExpiryDate = dayjs(expiryDate);
    const nextDay = dayjs().add(1, 'day');

    // return true;
    return process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? true : dayjs(tempExpiryDate).isAfter(nextDay);
  }

  //disable logic for date stored in db
  if (storedExpiry) {
    const tempExpiryDate = dayjs(storedExpiry);
    const thirtyDaysBefore = tempExpiryDate.subtract(30, 'day');

    // console.log(tempExpiryDate, thirtyDaysBefore);
    // const cDate = dayjs().date(25).month(7).year(2025);
    // return dayjs(thirtyDaysBefore).isAfter(cDate, 'day');

    return dayjs(thirtyDaysBefore).isAfter(dayjs(), 'day');
  }

  return false;
};

// returns car name with make model year
export const getCarName = (make: string, model: string, year?: string): string => {
  return `${make} ${model} ${year}`;
};

// generates highest long booking discount text
export const getHighestLongDiscountText = async (longBookingDiscounts: CarDataBookingDiscount[]): Promise<string> => {
  const convertedLongDiscounts = await convertWeekToDays(longBookingDiscounts);
  const highestDiscount: CarDataBookingDiscount = convertedLongDiscounts.sort(
    (a: CarDataBookingDiscount, b: CarDataBookingDiscount) => Number(b.percentage) - Number(a.percentage)
  )[0];
  const _unit = Number(highestDiscount?.value) > 1 ? `${highestDiscount?.unit}` : `${highestDiscount?.unit.slice(0, -1)}`;

  return `Enjoy ${highestDiscount?.percentage}% off for ${highestDiscount?.value}+ ${_unit} of travel`;
};

// generates car short location
export const getCarShortLocation = (pickupAddress: AddressState): string => {
  return `${pickupAddress?.city ?? ''}, ${pickupAddress?.state ?? ''}, ${pickupAddress?.country ?? ''}`;
};

// returns current pickup location
export const getCarPickupLocation = (pickupAddress: AddressState, pickupHistory?: PickupHistoryState[]): ReservationLocationState => {
  if (pickupHistory && pickupHistory?.length > 0) {
    const { coordinates, shortAddress, streetAddress } = pickupHistory?.slice(-1)?.[0];
    return { coordinates, shortAddress, streetAddress };
  } else {
    const shortAddress = getCarShortLocation(pickupAddress);
    const { coordinates, street } = pickupAddress;
    return { coordinates, shortAddress, streetAddress: street };
  }
};

//car information fuel list
export const convertFuelDataToOptions = (data: CarFuelDataInfo[]): OptionType[] => {
  return data.map((item: CarFuelDataInfo, index: number) => ({
    id: index + 1,
    label: item.fuelType,
    value: item.fuelType,
  }));
};

export const getFuelInfo = (fuelType: string, fuelData: CarFuelDataInfo[]) => {
  if (fuelData?.length > 0) {
    const fuel = fuelData.find((fuel: CarFuelDataInfo) => fuel?.fuelType === fuelType);
    return fuel ? { fuelType: fuel.fuelType, unitPrice: fuel.unitPrice, unitName: fuel.unitName } : { fuelType: '', unitPrice: 0, unitName: '' };
  }
  return { fuelType: '', unitPrice: 0, unitName: '' };
};

//distance tab fuel economy
export const calculateCost = async (unitPrice: number, fuelEconomy: any): Promise<number> => {
  const P = toNumber(unitPrice);
  const E = toNumber(fuelEconomy);
  // console.log('unitPrice (P):', P);
  // console.log('fuelEconomy (E):', E);
  const cost = (P * E) / 100;
  // console.log('Calculated Cost:', cost);
  return cost;
};

export const extractRelevantFuelGaugeFields = (fuelGauge: any) => ({
  vehicleKilometersRange: fuelGauge?.vehicleKilometersRange ?? '',
  attachmentOfFuelGauge: {
    imageInfo: {
      secure_url: fuelGauge?.attachmentOfFuelGauge?.imageInfo?.secure_url,
    },
    storageProvider: fuelGauge?.attachmentOfFuelGauge?.storageProvider,
    updatedAt: fuelGauge?.attachmentOfFuelGauge?.updatedAt,
  },
});

export const extractRelevantDistanceFields = (distance: any) => ({
  unlimitedTravel: distance?.unlimitedTravel,
  additionalFeePerKilometer: distance?.additionalFeePerKilometer,
  maximumDailyDistance: distance?.maximumDailyDistance,
});

export const extractServiceInfo = (serviceData: any) => {
  return {
    odometer: serviceData?.odometer ?? '',
    serviceDate: serviceData?.serviceDate ?? '',
    nextServiceDueOdometer: serviceData?.nextServiceDueOdometer ?? '',
    nextServiceDate: serviceData?.nextServiceDate ?? '',
    documentInfo: {
      info: {
        public_id: serviceData?.documentInfo?.info?.public_id ?? '',
        secure_url: serviceData?.documentInfo?.info?.secure_url ?? '',
        format: serviceData?.documentInfo?.info?.format ?? '',
      },
      storageProvider: serviceData?.documentInfo?.storageProvider ?? '',
    },
  };
};

export const validateServiceLogExpiryDate = (expiryDate: any) => {
  const tempExpiryDate = dayjs(expiryDate);
  return dayjs(tempExpiryDate).isAfter(currentDateTime, 'day') || 'Expired';
};
