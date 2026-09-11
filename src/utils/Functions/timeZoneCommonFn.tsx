import { TDate } from '@/types/commonTypes';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { getFormattedSelectedTime } from './availabilityCommonFn';

// export const carTimeZone = 'Australia/Sydney';
export const carTimeZone = 'UTC';
dayjs.extend(utc);
dayjs.extend(timezone);

export const getValidStartTimeTz = async (endTime: TDate, timezone: string) => {
  const isEnd = await isEndOfDayTz(endTime, timezone);
  console.log(isEnd);

  if (isEnd) {
    // If it's the end of the day, return 12:00 AM in the specified time zone
    return dayjs().tz(timezone).set('hour', 0).set('minute', 0).toDate();
  } else {
    // Otherwise, return the provided endTime
    return endTime;
  }
};

export const getValidEndTimeTz = async (startTime: TDate, timeZone: string) => {
  const tempEnd = dayjs(startTime).tz(timeZone).add(3, 'hours');
  const endTimeSmall = await isEndTimeSmallTz(startTime, tempEnd.toDate(), timeZone);

  // Check if tempEnd is greater than or equal to 12 AM (midnight)
  if (endTimeSmall) {
    tempEnd.hour(23).minute(59).second(0).millisecond(0).toDate();
  }

  return tempEnd.toDate();
};

export const isEndOfDayTz = async (time: TDate, timezone: string) => {
  // Convert the input time to the target time zone (Sydney)
  const convertedTime = dayjs(time).tz(timezone).startOf('minute');

  // Get the end of the day in the specified time zone (considering only up to the minute)
  const endOfDay = convertedTime.endOf('day').startOf('minute');

  console.log(convertedTime, endOfDay);

  // Check if the input time is the same as the calculated end of the day
  const isEndOfDay = convertedTime.isSame(endOfDay);

  return isEndOfDay;
};

export const isEndTimeSmallTz = async (startTime: TDate, endTime: Date, timeZone: string) => {
  const forStart = dayjs(startTime).tz(timeZone);
  const forEnd = dayjs(endTime).tz(timeZone);

  console.log({ forStart, forEnd });

  const startHour = forStart.hour();
  const startMinute = forStart.minute();

  const endHour = forEnd.hour();
  const endMinute = forEnd.minute();

  const endSmall = endHour < startHour || (endHour === startHour && endMinute <= startMinute);

  console.log(endSmall);

  return endSmall;
};

export const formatDateTimeTz = (time: Date, timeZone: string) => {
  const convertedTime = dayjs(time).tz(timeZone);
  const formattedTime = convertedTime.format('ddd, MMM D, YYYY, h:mm A'); // 'h:mm A' represents the 12-hour clock format with AM/PM

  // console.log({ time, convertedTime, formattedTime });

  return formattedTime;
};

export const formatTimeTz = (time: Date, timeZone: string) => {
  const convertedToToday = getFormattedSelectedTimeTz(new Date(), new Date(time));
  const convertedTime = dayjs(convertedToToday).tz(timeZone);
  const formattedTime = convertedTime.format('h:mm A'); // 'h:mm A' represents the 12-hour clock format with AM/PM

  console.log({ time, convertedTime, formattedTime });

  return formattedTime;
};

export const getFormattedSelectedTimeTz = (date: Date, time: Date): Date => {
  const today = date.toISOString().split('T');
  const selectedTime = time.toISOString()?.split('T');

  // console.log(selectedTime);
  // console.log(today);

  const formatted = `${today[0]}T${selectedTime[1]}`;
  // console.log(new Date(formatted));

  return new Date(formatted);
};

export const isTimeInBetweenTz = (startTime: TDate, endTime: TDate, selectedTime: TDate, timeZone: string) => {
  console.log({ startTime, endTime, selectedTime });
  const formattedSelectedTime = dayjs(selectedTime).tz(timeZone);
  const combinedStartTime = dayjs(getFormattedSelectedTimeTz(dayjs(selectedTime)?.toDate(), dayjs(startTime)?.toDate()))
    .tz(timeZone)
    .year(formattedSelectedTime.year())
    .month(formattedSelectedTime.month())
    .date(formattedSelectedTime.date());
  const combinedEndTime = dayjs(getFormattedSelectedTimeTz(dayjs(selectedTime)?.toDate(), dayjs(endTime)?.toDate()))
    .tz(timeZone)
    .year(formattedSelectedTime.year())
    .month(formattedSelectedTime.month())
    .date(formattedSelectedTime.date());

  const isValid = formattedSelectedTime.isBetween(combinedStartTime, combinedEndTime, 'minute', '[]'); //'[]' means start and end days are included

  console.log({ combinedStartTime, combinedEndTime, formattedSelectedTime, isValid });
  return isValid;
};
