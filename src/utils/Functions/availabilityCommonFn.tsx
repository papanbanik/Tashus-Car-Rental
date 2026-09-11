import dayjs from 'dayjs';
import moment from 'moment';
import { isEndOfDay } from './dateTimeCommonFn';

export const isEndTimeSmall = async (startTime: Date, endTime: Date) => {
  // const formatStart = moment(new Date(startTime)).format('HH:mm');
  // const formatEnd = moment(new Date(endTime)).format('HH:mm');
  // const start = moment(formatStart, 'H:mm');
  // const end = moment(formatEnd, 'H:mm');

  // console.log(start, end);

  // if (start >= end) {
  //   console.log('in');
  //   return true;
  // }

  // return false;
  const forStart = getFormattedSelectedTime(new Date(startTime));
  const forEnd = getFormattedSelectedTime(new Date(endTime));
  const formatStart = moment(forStart).format('HH:mm');
  const formatEnd = moment(forEnd).format('HH:mm');

  // console.log(formatStart, formatEnd);

  const endSmall = moment(formatEnd, 'HH:mm').isSameOrBefore(moment(formatStart, 'HH:mm'));

  // console.log(x);

  return endSmall;
};

export const getValidEndTime = async (startTime: Date) => {
  const tempEnd = new Date(new Date(startTime).getTime() + 3 * 60 * 60 * 1000);
  const endTimeSmall = await isEndTimeSmall(startTime, tempEnd);

  // Check if tempEnd is greater than or equal to 12 AM (midnight)
  if (endTimeSmall) {
    tempEnd.setHours(23, 59, 0, 0);
  }
  return tempEnd;
};

export const getValidStartTime = async (endTime: Date) => {
  const endOfDay = isEndOfDay(endTime);
  if (endOfDay) {
    return dayjs(endTime).startOf('day').toDate();
  } else {
    return endTime;
  }
};

export const getMinTime = (time: Date, endTime?: Date) => {
  let tempMinTime = dayjs(time).add(60, 'minute').toDate();
  if (endTime) {
    const forEndTime = dayjs(endTime).toISOString().split('T');
    const selectedTime = time.toISOString()?.split('T');

    const formatted = `${forEndTime[0]}T${selectedTime[1]}`;
    tempMinTime = dayjs(formatted).add(60, 'minute').toDate();
  }

  // const tempMinTime = new Date(new Date(time).getTime() + 30 * 60 * 1000);
  return tempMinTime;
};
// export const getMinTime = (time: Date, endTime?: Date) => {
//   let tempMinTime = dayjs(time).add(30, 'minute').toDate();
//   if (endTime) {
//     const forEndTime = dayjs(endTime).toISOString().split('T');
//     const selectedTime = time.toISOString()?.split('T');

//     const formatted = `${forEndTime[0]}T${selectedTime[1]}`;
//     tempMinTime = dayjs(formatted).add(30, 'minute').toDate();
//   }

//   // const tempMinTime = new Date(new Date(time).getTime() + 30 * 60 * 1000);
//   return tempMinTime;
// };

export const isTimeBetween = (startTime: string, endTime: string, selectedTime?: string, type?: string) => {
  let start = moment(startTime, 'H:mm');
  let end = moment(endTime, 'H:mm');
  let selected = moment(selectedTime, 'H:mm');

  if (type === 'start') {
    return selected >= start && selected < end;
  }
  if (type === 'end') {
    return selected <= end && selected > start;
  }
};

export const validateTimeSlot = async (
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
    let otherStart = moment(new Date(otherSlots[i].startTime)).format('HH:mm');
    let otherEnd = moment(new Date(otherSlots[i].endTime)).format('HH:mm');
    let selectedStartSlot = moment(selectedStart).format('HH:mm');
    let selectedEndSlot = moment(selectedEnd).format('HH:mm');

    // check if start & end time have any inconsistencies
    const isStartEndValid = await startEndValidation(selectedStart, selectedEnd, setError, name);
    // console.log(isStartEndValid);
    if (!isStartEndValid) {
      isValidTime = false;
      break;
    }

    // check if the new time slot overlaps any old slots
    let isStartTimeBetween = isTimeBetween(otherStart, otherEnd, selectedStartSlot, 'start');
    let isEndTimeBetween = isTimeBetween(otherStart, otherEnd, selectedEndSlot, 'end');

    // check if the old time slots overlap the new slot
    let isOldStartTimBetween = isTimeBetween(selectedStartSlot, selectedEndSlot, otherStart, 'start');
    let isOldEndTimeBetween = isTimeBetween(selectedStartSlot, selectedEndSlot, otherEnd, 'end');

    // time invalid when start or end is between
    if (isStartTimeBetween || isEndTimeBetween || isOldStartTimBetween || isOldEndTimeBetween) {
      isValidTime = false;
      setError &&
        setError(name, {
          message: 'Overlapped Time',
        });
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

export const getFormattedSelectedTime = (time: Date): Date => {
  const today = new Date().toISOString().split('T');
  const selectedTime = time.toISOString()?.split('T');

  // console.log(selectedTime);
  // console.log(today);

  const formatted = `${today[0]}T${selectedTime[1]}`;
  // console.log(new Date(formatted));

  return new Date(formatted);
};

export const getFormattedSelectedTimeForDb = (time: Date): Date => {
  const selectedTime = time.toISOString()?.split('T');

  const formatted = `1899-12-31T${selectedTime[1]}`;

  return new Date(formatted);
};

export const startEndValidation = async (selectedStart: Date, selectedEnd: Date, setError: any, name: string) => {
  let selectedStartSlot = moment(selectedStart).format('HH:mm');
  let selectedEndSlot = moment(selectedEnd).format('HH:mm');

  const startTime = moment(selectedStart, 'HH:mm');
  const endTime = moment(selectedEnd, 'HH:mm');
  const timeDifferenceInMinutes = endTime.diff(startTime, 'minutes');

  const isEndSmall = await isEndTimeSmall(selectedStart, selectedEnd);

  // Invalid: When end time is not small than start but has difference less than 30 mins
  // if (!isEndSmall && timeDifferenceInMinutes < 30) {
  //   setError &&
  //     setError(name, {
  //       message: 'Minimum 30 mins difference',
  //     });
  //   return false;
  // }

  // Invalid: When end time is small than start and end is anything except 12:00 am
  // console.log(startTime, endTime, isEndSmall, selectedEndSlot !== '00:00');
  // console.log({  });
  if (isEndSmall && selectedEndSlot !== '00:00') {
    setError &&
      setError(name, {
        message: 'Invalid End Time',
      });
    return false;
  }

  return true;
};
