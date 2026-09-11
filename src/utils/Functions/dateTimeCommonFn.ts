import { TDate } from '@/types/commonTypes';
import { launchDate } from '@/utils/Functions/utcCommonFn';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const customStyles = `
.rdrStaticRangesWrapper,
.rdrInputRange,
.rdrDefinedRangesWrapper {
  display: none;
}
.rdrDayToday .rdrDayNumber span:after {
  background:#800080;
  }
`;

export const formatDate = (date: Date): string => {
  // console.log(date);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('en-US', options)?.format(date);
};

export const currentDateTime = dayjs();

// Checks if given date is today
export const isSameDay = (dateOne: Date | Dayjs | null, dateTwo: Date | Dayjs | null) => {
  return dayjs(dateOne).isSame(dayjs(dateTwo), 'day');
};

export const shouldPastDisable = (date: Date | null): boolean => {
  const startDate = dayjs(date);
  const isStartDateToday = startDate.isSame(dayjs(), 'day');
  // console.log(isStartDateToday);
  return isStartDateToday;
};

// export const combineDateTime = (date: Date | Dayjs, time: Date | Dayjs): string => {
//   console.log(date, time);
//   const combinedDateTime = dayjs(date).set('hour', dayjs(time).hour()).set('minute', dayjs(time).minute()).set('second', dayjs(time).second());
//   console.log('combinedDateTime', combinedDateTime);
//   return combinedDateTime?.toISOString();
// };

export const combineDateTime = (date: TDate, time: TDate, from?: string): string => {
  // console.log(from);
  // console.log('date', date, 'time', time);
  // if (!(date instanceof Date || dayjs.isDayjs(date)) || !(time instanceof Date || dayjs.isDayjs(time))) {
  //   console.error('Invalid date or time input');
  //   return null;
  // }

  try {
    const combinedDateTime = dayjs(date).set('hour', dayjs(time).hour()).set('minute', dayjs(time).minute()).set('second', dayjs(time).second());
    return combinedDateTime.toISOString();
  } catch (error) {
    console.error('Error combining date and time:', error, from);
    return '';
    // return null;
  }
};

// Default start and end time for searching
export const getDefaultStartTime = () => getRoundUpStartTime(60);
export const getDefaultEndTime = () => getRoundUpStartTime(60);
// export const getDefaultEndTime = () => dayjs().set('hour', 21).set('minute', 0);

// Function to round up to the nearest 15 minutes
export const roundToNearest15Minutes = (time: Dayjs) => {
  const minutes = time.minute();
  const roundedMinutes = Math.ceil(minutes / 15) * 15;
  return time.set('minute', roundedMinutes).set('second', 0).set('millisecond', 0);
};

export const getRoundUpStartTime = (addMin: number) => {
  const currentRealTime = dayjs();
  const targetTime = currentRealTime.add(addMin, 'minute');
  // const targetTime = currentDateTime.add(addMin, 'minute'); // currentDateTime doesn't consider the real time
  const startTime = roundToNearest15Minutes(targetTime);
  return startTime;
};

// Format in 5:00Pm
// export const formatTime = (time: Date): Date => {
//   const formattedTime = dayjs(time).format('h:mmA');
//   return combinedDateTime.toDate();
// };

// Get duration of a time range in day + hour + min;
export const getDurationDayHourMin = (startTime: Dayjs | Date | string, endTime: Dayjs | Date | string): string => {
  const totalDuration = dayjs.duration(dayjs(endTime).second(0).millisecond(0).diff(dayjs(startTime).second(0).millisecond(0)));

  // Convert the duration to milliseconds
  const totalMilliseconds = totalDuration.asMilliseconds();

  // Convert milliseconds to days, hours, and minutes
  const timeDiffDays = Math.floor(totalMilliseconds / (24 * 60 * 60 * 1000)); // Days
  const remainingMillisAfterDays = totalMilliseconds % (24 * 60 * 60 * 1000); // Remaining milliseconds after days
  const remainingHours = Math.floor(remainingMillisAfterDays / (60 * 60 * 1000)); // Hours
  const remainingMillisAfterHours = remainingMillisAfterDays % (60 * 60 * 1000); // Remaining milliseconds after hours
  const remainingMinutes = Math.floor(remainingMillisAfterHours / (60 * 1000)); // Minutes

  // Format durations
  const dayDuration = timeDiffDays > 0 ? `${timeDiffDays} ${timeDiffDays > 1 ? 'days ' : 'day '}` : '';
  const hourDuration = remainingHours > 0 ? `${remainingHours} ${remainingHours > 1 ? 'hrs ' : 'hr '}` : '';
  const minDuration = remainingMinutes > 0 ? `${remainingMinutes} ${remainingMinutes > 1 ? 'mins ' : 'min '}` : '';

  const duration = `${dayDuration}${hourDuration}${minDuration}`;
  // console.log(duration);

  return duration;
};

// Get duration of a time range in hours, remaining minutes add up 1 hour
export const getDurationHours = (startTime: Dayjs | Date | string, endTime: Dayjs | Date | string): number => {
  // console.log(startTime, endTime);
  const updatedStartTime = dayjs(startTime).second(0).millisecond(0);
  const updatedEndTime = dayjs(endTime).second(0).millisecond(0);
  const timeDiffHours = updatedEndTime.diff(updatedStartTime, 'hour');
  const remainingMinutes = updatedEndTime.diff(updatedStartTime, 'minute') % 60;

  const totalDurationHours = timeDiffHours + (remainingMinutes > 0 ? 1 : 0); //Add 1 hour if remaining minutes exist

  return totalDurationHours;
};

// Convert to local time
export const formatToLocalTime = (timeString: string | Date) => {
  const localTime = dayjs(timeString); // Set the locale for 'AM' and 'PM' display
  const date = new Date(timeString);
  const minutes = date.getMinutes();
  // const minutes = localTime.minute();
  // console.log(minutes);
  const localTime2 = dayjs(timeString).locale('en'); // Set the locale for 'AM' and 'PM' display
  return localTime.format('hh:mm A');
  // const utcTime = dayjs(timeString);
  // const localTime = utcTime.utc().local().format('HH:mm');
  // return localTime;
};

// format MM-YY
export const formatToMonthYear = (dateString: string | Date | Dayjs) => {
  const formattedDate = dayjs(dateString).format('MMM YYYY');
  return formattedDate;
};

// format DD MMM YYYY | h:mm A
export const formatFullDateTime = (dateString: string | Date | Dayjs) => {
  const formattedDate = dayjs(dateString).format('DD MMM YYYY | h:mm A');
  return formattedDate;
};

export const formatDateToLocal = (dateString: TDate) => {
  const localDateString = dayjs(dateString).locale('en');
  const localDate = localDateString.format('DD MMM YYYY');
  const localTime = localDateString.format('hh:mm A');

  return { localDate, localTime };
};

// Returns live duration in day - hour - min - sec
export const calculateLiveDuration = (countStartTime: Dayjs, countEndTime: Dayjs): string => {
  const duration = countEndTime.diff(countStartTime);
  const days = Math.floor(duration / (24 * 60 * 60 * 1000));
  const hours = Math.floor((duration % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((duration % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((duration % (60 * 1000)) / 1000);

  let timeRemainingText = '';

  if (days > 0) {
    timeRemainingText += `${days} day${days > 1 ? 's' : ''} | `;
  }
  if (hours > 0 || minutes > 0 || seconds > 0) {
    timeRemainingText += `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return timeRemainingText.trim();
};

export const isStartOfDay = (time: TDate) => {
  const startOfDay = dayjs(time).startOf('day');
  return dayjs(time).startOf('minute').isSame(startOfDay.startOf('minute'));
};

export const isEndOfDay = (time: TDate) => {
  const endOfDay = dayjs(time).endOf('day');
  return dayjs(time).startOf('minute').isSame(endOfDay.startOf('minute'));
};

export const isDrivingAgeValid = (dateOfBirth: TDate) => {
  const diffYears = dayjs().diff(dayjs(dateOfBirth), 'year');
  const isAgeValid = diffYears >= 21 && diffYears < 75;
  return isAgeValid;
};

export const isLicenseExpired = (expiryDate: TDate) => {
  const isExpired = dayjs(expiryDate).isBefore(dayjs(), 'date') || dayjs(expiryDate).isSame(dayjs(), 'date');
  return isExpired;
};

// Check if dateString is a valid date
export const isValidDate = (dateString: any) => {
  const parsedDate = new Date(dateString);
  return !isNaN(parsedDate.getTime());
};

export const getMinimumEndDate = (startDate: TDate, startTime: TDate, endDate: TDate, endTime: TDate, minDiff?: number) => {
  const pickupTime = dayjs(combineDateTime(startDate, startTime));
  const returnTime = dayjs(combineDateTime(endDate, endTime));

  const isPickupReturnSame = pickupTime.isSame(returnTime, 'day');
  const diffMins = returnTime.diff(pickupTime, 'minute');
  const isPickupEndOfDay = isEndOfDay(pickupTime);
  const pickupNextDay = pickupTime.add(1, 'day');
  const isReturnNextDay = pickupNextDay.isSame(returnTime, 'day');

  // console.log({ isPickupEndOfDay, isPickupReturnSame, diffMins });

  // if (isPickupReturnSame || diffMins < 60) {
  if (isPickupReturnSame || (isPickupEndOfDay && isReturnNextDay)) {
    const minEndTime = dayjs(pickupTime).add(minDiff ?? 60, 'minute');
    return minEndTime.toDate();
  }

  return undefined;
};

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView();
    // element.scrollIntoView({ behavior: 'instant' });
    // element.scrollIntoView({ behavior: 'smooth' });
  }
};

export const isSelectedTimeExist = async (startDate: TDate, startTime: TDate, endDate: TDate, endTime: TDate) => {
  const isStartDateValid = isValidDate(startDate);
  const isStartTimeValid = isValidDate(startTime);
  const isEndDateValid = isValidDate(endDate);
  const isEndTimeValid = isValidDate(endTime);

  const allValid = isStartDateValid && isStartTimeValid && isEndDateValid && isEndTimeValid;
  return allValid;
};

export const getDefaultPickupTime = () => {
  const currentRoundedTime = getRoundUpStartTime(15); //modify start time

  const currentDate = new Date();
  const day = process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? (currentDate > launchDate ? 1 : 3) : 1; // 3 == from today, 2nd june to 5th june = 3

  const nextDay = currentRoundedTime.add(day, 'day');
  return currentRoundedTime.toDate();
};

export const getDefaultReturnTime = () => {
  const defaultPickupTime = dayjs(getDefaultPickupTime());
  const threeDaysLater = defaultPickupTime.add(3, 'day');
  return threeDaysLater.toDate();
};

export const getOneHourRounded = (time: TDate, minuteDifference?: number) => {
  return dayjs(time)
    .add(minuteDifference ?? 60, 'minute')
    .startOf('hour')
    .toDate();
};

export const formatTimer = (time: number) => {
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export const formatToDayMonth = (date: TDate) => {
  return dayjs.utc(date).format('D MMMM');
};
