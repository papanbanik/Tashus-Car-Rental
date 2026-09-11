import { TDate } from '@/types/commonTypes';
import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { getRoundUpStartTime, roundToNearest15Minutes } from './dateTimeCommonFn';

dayjs.extend(utc);
dayjs.extend(timezone);

export const dayjsUtc = dayjs.utc;
export const currentDateTimeUtc = dayjsUtc();

export const launchDate = new Date(2024, 5, 5); // June 4th, 2024 (new Date(2024, 5, 4);)

export const getMinSelectableDate = (): Date => {
  if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') {
    const currentDate = new Date();
    return currentDate > launchDate ? currentDate : launchDate;
  } else {
    return new Date(); // No restriction in non-production environments
  }
};

export const getValidStartTimeUtc = async (endTime: TDate) => {
  const isEnd = await isEndOfDayUtc(endTime);
  // console.log(isEnd);

  if (isEnd) {
    // If it's the end of the day, return 12:00 AM in the specified time zone
    return dayjsUtc().set('hour', 0).set('minute', 0).toDate();
  } else {
    // Otherwise, return 30 minutes after provided endTime
    return dayjsUtc(endTime).add(30, 'minute').toDate();
  }
};

export const getValidEndTimeUtc = async (startTime: TDate, addMinute: number) => {
  let tempEnd = dayjsUtc(startTime).add(addMinute, 'minute').toDate();
  const endTimeSmall = await isEndTimeSmallUtc(startTime, tempEnd);

  // Check if tempEnd is greater than or equal to 12 AM (midnight)
  if (endTimeSmall) {
    tempEnd = dayjsUtc(startTime).hour(23).minute(59).second(0).millisecond(0).toDate();
    // console.log(tempEnd);
  }

  return tempEnd;
};

export const isEndOfDayUtc = (time: TDate) => {
  // Convert the input time to the target time zone (Sydney)
  const convertedTime = dayjs(time).utc().startOf('minute');

  // Get the end of the day in the specified time zone (considering only up to the minute)
  const endOfDay = convertedTime.endOf('day').startOf('minute');

  // console.log(convertedTime, endOfDay);

  // Check if the input time is the same as the calculated end of the day
  const isEndOfDay = convertedTime.isSame(endOfDay);

  return isEndOfDay;
};

export const isEndTimeSmallUtc = async (startTime: TDate, endTime: Date) => {
  // console.log(startTime, endTime);
  const forStart = dayjsUtc(startTime);
  const forEnd = dayjsUtc(endTime);

  const startHour = forStart.hour();
  const startMinute = forStart.minute();

  const endHour = forEnd.hour();
  const endMinute = forEnd.minute();

  const endSmall = endHour < startHour || (endHour === startHour && endMinute <= startMinute);
  return endSmall;
};

export const formatDateTimeUtc = (dateTime: TDate) => {
  const formattedTime = dayjsUtc(dateTime).format('ddd, MMM D, YYYY, h:mm A'); // 'h:mm A' represents the 12-hour clock format with AM/PM
  return formattedTime;
};

// format DD MMM YYYY | h:mm A
export const formatFullDateTimeUtc = (dateTime: TDate) => {
  const formattedDate = dayjsUtc(dateTime).format('DD MMM YYYY | h:mm A');
  return formattedDate;
};

export const formatTimeUtc = (time: TDate) => {
  const formattedTime = dayjsUtc(time).format('h:mm A'); // 'h:mm A' represents the 12-hour clock format with AM/PM

  // console.log({ time, formattedTime });

  return formattedTime;
};

export const formatDateUtc = (time: TDate) => {
  const formattedDate = dayjsUtc(time).format('DD MMM YYYY');
  return formattedDate;
};

export const getFormattedSelectedTimeUtc = (date: string, time: string): Date => {
  // console.log({ date, time });
  const today = new Date(date).toISOString().split('T');
  const selectedTime = new Date(time).toISOString().split('T');

  // console.log(selectedTime);
  // console.log(today);

  const formatted = `${today[0]}T${selectedTime[1]}`;
  // console.log(new Date(formatted));

  return new Date(formatted);
};

export const isTimeInBetweenUtc = (startTime: string, endTime: string, selectedTime: string) => {
  // console.log({ startTime, endTime, selectedTime });
  const formattedSelectedTime = dayjs(selectedTime).utc();
  const combinedStartTime = dayjs(getFormattedSelectedTimeUtc(selectedTime, startTime))
    .utc()
    .year(formattedSelectedTime.year())
    .month(formattedSelectedTime.month())
    .date(formattedSelectedTime.date());
  const combinedEndTime = dayjs(getFormattedSelectedTimeUtc(selectedTime, endTime))
    .utc()
    .year(formattedSelectedTime.year())
    .month(formattedSelectedTime.month())
    .date(formattedSelectedTime.date());

  const isValid = formattedSelectedTime.isBetween(combinedStartTime, combinedEndTime, 'minute', '[]'); //'[]' means start and end days are included

  // console.log({ combinedStartTime, combinedEndTime, formattedSelectedTime, isValid });
  return isValid;
};

export const getMinimumEndDateUtc = (startDate: string, startTime: string, endDate: string, endTime: string) => {
  const pickupTime = dayjs(getFormattedSelectedTimeUtc(startDate, startTime)).utc();
  const returnTime = dayjs(getFormattedSelectedTimeUtc(endDate, endTime)).utc();

  const isPickupReturnSame = pickupTime.isSame(returnTime, 'day');
  const diffMins = returnTime.diff(pickupTime, 'minute');
  const isPickupEndOfDay = isEndOfDayUtc(pickupTime);
  const pickupNextDay = pickupTime.add(1, 'day');
  const isReturnNextDay = pickupNextDay.isSame(returnTime, 'day');

  // console.log({ isPickupEndOfDay, isPickupReturnSame, diffMins });

  // if (isPickupReturnSame || diffMins < 60) {
  if (isPickupReturnSame || (isPickupEndOfDay && isReturnNextDay)) {
    const minEndTime = dayjs(pickupTime).add(1, 'hour');
    return minEndTime.toDate();
  }

  return undefined;
};

export const getRoundUpStartTimeUtc = (addMin: number) => {
  const targetTime = dayjs().add(addMin, 'minute');
  const startTime = roundToNearest15Minutes(targetTime);
  const { formattedTimeObj } = getPickerTimeStringInUtc(startTime);
  return formattedTimeObj;
};

export const startEndValidationUtc = async (selectedStart: Date, selectedEnd: Date, setError: any, name: string) => {
  const isEndSmall = await isEndTimeSmallUtc(selectedStart, selectedEnd);

  if (isEndSmall) {
    setError &&
      setError(name, {
        message: 'Invalid End Time',
      });
    return false;
  }
  return true;
};

export const getFormattedSelectedTimeForDbUtc = (time: Date): Date => {
  const selectedTime = time.toISOString()?.split('T');

  const formatted = `2000-12-31T${selectedTime[1]}`;
  return new Date(formatted);
};

export const validateTimeSlotUtc = async (
  selectedStart: Date,
  selectedEnd: Date,
  otherSlots: any,
  index: number,
  name: string,
  setError: any,
  clearErrors: any
) => {
  // console.log(selectedStart, selectedEnd);
  // console.log('otherSlots', otherSlots);
  let isValidTime = true;
  for (let i = 0; i < otherSlots.length; i++) {
    // check if start & end time have any inconsistencies
    const isStartEndValid = await startEndValidationUtc(selectedStart, selectedEnd, setError, name);
    if (!isStartEndValid) {
      isValidTime = false;
      break;
    }

    // check if the new time slot overlaps any old slots
    let isStartTimeBetween = isTimeInBetweenUtc(otherSlots[i].startTime, otherSlots[i].endTime, selectedStart?.toISOString());
    let isEndTimeBetween = isTimeInBetweenUtc(otherSlots[i].startTime, otherSlots[i].endTime, selectedEnd?.toISOString());

    // check if the old time slots overlap the new slot
    let isOldStartTimBetween = isTimeInBetweenUtc(selectedStart?.toISOString(), selectedEnd?.toISOString(), otherSlots[i].startTime);
    let isOldEndTimeBetween = isTimeInBetweenUtc(selectedStart?.toISOString(), selectedEnd?.toISOString(), otherSlots[i].endTime);

    // console.log({ isStartTimeBetween, isEndTimeBetween, isOldStartTimBetween, isOldEndTimeBetween });

    // time invalid when start or end is between
    if (isStartTimeBetween || isEndTimeBetween || isOldStartTimBetween || isOldEndTimeBetween) {
      isValidTime = false;
      setError &&
        setError(name, {
          message: 'Overlapped Time',
        });
      break;
    }

    if (isValidTime) {
      clearErrors && clearErrors(name);
    }
  }
  return isValidTime;
};

export const combineDateTimeUtc = (
  date: TDate,
  time: TDate,
  from?: string
): { combinedDateTimeString: string; combinedDateTimeObj: Date; combinedDayObj: Dayjs } => {
  try {
    const combinedDateTime = dayjsUtc(date)
      .date(dayjs(date)?.date())
      .month(dayjs(date)?.month())
      .year(dayjs(date)?.year())
      .hour(dayjs(time).hour())
      .minute(dayjs(time).minute())
      // .hour(dayjsUtc(time).hour())
      // .minute(dayjsUtc(time).minute())
      .second(0)
      .millisecond(0);
    // console.log(combinedDateTime.toISOString());
    return {
      combinedDateTimeString: combinedDateTime.toISOString(),
      combinedDateTimeObj: combinedDateTime.toDate(),
      combinedDayObj: combinedDateTime,
    };
  } catch (error) {
    console.error('Error combining date and time:', error, from);
    return { combinedDateTimeString: '', combinedDateTimeObj: new Date(), combinedDayObj: dayjs() };
  }
};

export const getPickerDateUtc = (selectedDate: TDate) => {
  const formattedDate = dayjsUtc(selectedDate).minute(0).hour(0).second(0).toDate();
  return formattedDate;
};

export const getPickerTimeUtc = (selectedTime: TDate) => {
  const formattedTime = dayjsUtc(selectedTime).second(0).millisecond(0).toDate();
  return formattedTime;
};

export const getPickerTimeLocal = (selectedTime: TDate) => {
  const formattedTime = dayjs(selectedTime).second(0).millisecond(0).toDate();
  return formattedTime;
};

export const getPickerTimeStringInUtc = (selectedTime: TDate, addSecond?: boolean) => {
  const tempHr = dayjs(selectedTime).hour();
  const tempMin = dayjs(selectedTime).minute();
  const tempSec = dayjs(selectedTime).second();
  const formattedTimeDayObj = dayjsUtc(selectedTime)
    .hour(tempHr)
    .minute(tempMin)
    .second(addSecond ? tempSec : 0)
    .millisecond(0);
  const formattedTimeString = dayjsUtc(selectedTime)
    .hour(tempHr)
    .minute(tempMin)
    .second(addSecond ? tempSec : 0)
    .millisecond(0)
    .toISOString();
  const formattedTimeObj = dayjsUtc(selectedTime)
    .hour(tempHr)
    .minute(tempMin)
    .second(addSecond ? tempSec : 0)
    .millisecond(0)
    .toDate();

  // console.log({ tempHr, tempMin, formattedTimeString, formattedTimeObj });
  return { formattedTimeString, formattedTimeObj, formattedTimeDayObj };
};

export const getPickerTimeStringLocal = (selectedTime: TDate) => {
  const tempHr = dayjs(selectedTime).hour();
  const tempMin = dayjs(selectedTime).minute();
  const formattedTimeDayObj = dayjs(selectedTime).hour(tempHr).minute(tempMin).second(0).millisecond(0);

  // console.log({ tempHr, tempMin, formattedTimeDayObj });
  return { formattedTimeDayObj, formattedTimeString: formattedTimeDayObj?.toISOString(), formattedTimeObj: formattedTimeDayObj?.toDate() };
};

export const convertDateToUtc = (selectedDate: TDate) => {
  try {
    const tempDate = dayjs(selectedDate).date();
    const tempMonth = dayjs(selectedDate).month();
    const tempYear = dayjs(selectedDate).year();
    const formattedDateString = dayjsUtc(selectedDate).date(tempDate).month(tempMonth).year(tempYear).minute(0).hour(0).second(0).toISOString();
    const formattedDateObj = dayjsUtc(selectedDate).date(tempDate).month(tempMonth).year(tempYear).minute(0).hour(0).second(0).toDate();

    // console.log(selectedDate, tempDate, tempMonth, tempYear, formattedDateString, formattedDateObj);
    return { formattedDateString, formattedDateObj };
  } catch (error) {
    console.error('Error converting date to UTC:', error);
    return { formattedDateString: '', formattedDateObj: new Date() };
  }
};

export const getCombinedPickReturnUtc = (
  startDate: TDate,
  startTime: TDate,
  endDate: TDate,
  endTime: TDate,
  from?: 'vehicle-details' | 'search-bar' | 'search-sDate' | 'edit-upcoming' | 'edit-current' | 'block-date'
) => {
  const { formattedDateObj: utcStartDate } = convertDateToUtc(startDate);
  const { formattedDateObj: utcEndDate } = convertDateToUtc(endDate);
  const combinedPickup = combineDateTimeUtc(utcStartDate, dayjsUtc(startTime));
  const combinedReturn = combineDateTimeUtc(utcEndDate, dayjsUtc(endTime));
  return { combinedPickup, combinedReturn };
};

export const getDefaultPickupTimeUtc = () => {
  const currentRoundedTime = getRoundUpStartTime(60);
  const { formattedTimeObj: nextDay } = getPickerTimeStringInUtc(currentRoundedTime.add(1, 'day'));
  // console.log(nextDay);
  return nextDay;
};

export const getDefaultReturnTimeUtc = () => {
  const defaultPickupTime = dayjsUtc(getDefaultPickupTimeUtc());
  const { formattedTimeObj: threeDaysLater } = getPickerTimeStringInUtc(defaultPickupTime.add(3, 'day'));
  return threeDaysLater;
};

export const isStartOfDayUtc = (time: TDate) => {
  const startOfDay = dayjsUtc(time).startOf('day');
  return dayjsUtc(time).startOf('minute').isSame(startOfDay.startOf('minute'));
};

// export const isEndOfDayUtc = (time: TDate) => {
//   const endOfDay = dayjs(time).endOf('day');
//   return dayjs(time).startOf('minute').isSame(endOfDay.startOf('minute'));
// };

export const utcCurrentTime = getPickerTimeStringInUtc(dayjs());

export const getMinTimeUtc = (time: Date, endTime?: Date) => {
  const utcTime = dayjsUtc(time);
  let tempMinTime = dayjs(time).add(60, 'minute').toDate();
  if (utcTime?.hour() === 23) {
    tempMinTime = dayjsUtc(time).hour(23).minute(59).second(0).millisecond(0).toDate();
  }

  return tempMinTime;
};
