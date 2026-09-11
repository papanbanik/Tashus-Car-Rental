import { TDate } from '../commonTypes';

export type CarNoticeInAdvance = {
  alwaysAvailableImmediately: boolean;
  hoursRequired?: number;
};

export type CarMinTripDuration = {
  unit: string;
  shortestDuration: number;
  noMinimum: boolean;
};

export type CarMaxTripDuration = {
  unit: string;
  longestDuration: number;
  noMaximum: boolean;
};

export type CarPickupReturnHour = {
  alwaysAvailable: boolean;
  customAvailability?: CarCustomAvailability[];
};

export type CarCustomAvailability = {
  checked: boolean; //extra for checking day selected. Remove before saving
  dayOfWeek: string | undefined; // Day of the week (e.g., "mon", "tue")
  allDay: boolean; // extra for checking always. Remove before saving
  availability: string; //['always', 'never', 'custom'] //may not needed
  customHours: CarCustomHourState[];
};

export type CarCustomHourState = {
  startTime: Date;
  endTime: Date;
  status: string;
};
