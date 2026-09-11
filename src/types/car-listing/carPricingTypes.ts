import { TDate } from '../commonTypes';

export type CarDataBookingUnitValues = 'days' | 'weeks' | '';

export type CarDataCustomPricing = {
  date: TDate;
  hourlyRates: number;
  dailyRates: number;
  rateType?: string;
  rateChange?: string;
  updatedHourlyRates: number;
  updatedDailyRates: number;
};

export type CarRate = {
  currency: string;
  amount: number;
};

export type CarDataPeakIncrease = {
  dayOfWeek: string;
  increaseType: string;
  amount?: number;
  percentage?: number;
};

export type CarDataBookingDiscount = {
  value: string | number;
  unit: CarDataBookingUnitValues;
  percentage: string | number;
};
