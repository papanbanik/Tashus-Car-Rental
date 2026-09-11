import { TSelectedDates } from '@/components/Common/DateTimePickers/CustomDateTime';
import { TDate } from '@/types/commonTypes';
import dayjs, { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { currentDateTime, getOneHourRounded, isEndOfDay, isSameDay } from './dateTimeCommonFn';
import { combineDateTimeUtc, convertDateToUtc, dayjsUtc, getCombinedPickReturnUtc, getPickerDateUtc, getRoundUpStartTimeUtc } from './utcCommonFn';

interface ICommonDateTimeFn {
  selectedDates: [TSelectedDates];
  setSelectedDates: Dispatch<SetStateAction<[TSelectedDates]>>;
  startDate: any;
  startTime: TDate;
  endDate: any;
  endTime: TDate;
  setValue: UseFormSetValue<any>;
  minuteDifference?: number;
  minuteAfterNow?: number;
}

export const handleCommonStartDateField = (params: ICommonDateTimeFn) => {
  const { selectedDates, setSelectedDates, setValue, startDate, startTime, endDate, endTime, minuteDifference = 60, minuteAfterNow = 60 } = params;
  const currentSelection = selectedDates[0];

  const { combinedPickup, combinedReturn } = getCombinedPickReturnUtc(startDate, startTime, endDate, endTime, 'search-sDate');
  const pickupTime = combinedPickup?.combinedDayObj;
  const returnTime = combinedReturn?.combinedDayObj;

  const isToday = dayjs(pickupTime).isSame(currentDateTime, 'day');
  const isPickupAfterReturnDay = pickupTime.isAfter(returnTime, 'day');
  let isPickupAfterReturnMin = pickupTime.isAfter(returnTime, 'minute');
  const isPickupReturnSame = pickupTime.isSame(returnTime, 'minute');
  const isStartTimeDayEnd = isEndOfDay(pickupTime);
  const validStartTime = getRoundUpStartTimeUtc(minuteAfterNow);
  const isPickupAfterValidStart = pickupTime.isAfter(validStartTime);

  // console.log({ pickupTime, returnTime, isToday, currentDateTimeUtc, currentDateTime });

  if (isPickupAfterReturnDay || isPickupReturnSame) {
    const tempEndTime = pickupTime.add(minuteDifference, 'minute').toDate();
    const tempEndDate = getPickerDateUtc(tempEndTime);
    const { combinedDayObj } = combineDateTimeUtc(tempEndDate, dayjsUtc(combinedReturn?.combinedDateTimeString));
    isPickupAfterReturnMin = pickupTime.isAfter(combinedDayObj, 'minute');
    const isPickupBeforeReturn = pickupTime.isBefore(combinedDayObj, 'minute');
    if (!isPickupBeforeReturn) {
      setValue('endTime', isStartTimeDayEnd ? getOneHourRounded(tempEndTime, minuteDifference) : tempEndTime);
    }
    setSelectedDates([{ ...currentSelection, startDate: startDate, endDate: tempEndDate }]);
    return;
  }

  if (isToday && !isPickupAfterValidStart) {
    setSelectedDates([{ ...currentSelection, startDate: startDate }]);
    setValue('startTime', validStartTime);
    return;
  }

  setSelectedDates([{ ...currentSelection, startDate: startDate }]);
};

export const handleCommonStartTime = (params: ICommonDateTimeFn) => {
  const { selectedDates, setSelectedDates, setValue, startDate, startTime, endDate, endTime, minuteDifference = 60 } = params;
  // console.log(startTime);
  setValue('startTime', startTime);

  const { combinedPickup, combinedReturn } = getCombinedPickReturnUtc(startDate, startTime, endDate, endTime, 'search-sDate');
  const pickupTime = combinedPickup?.combinedDayObj;
  const returnTime = combinedReturn?.combinedDayObj;

  // const pickupTime = dayjsUtc(combineDateTimeUtc(watch('startDate'), startTime));
  // const returnTime = dayjsUtc(combineDateTimeUtc(watch('endDate'), watch('endTime')));

  // console.log({ pickupTime, returnTime, currentDateTimeUtc, currentDateTime });

  const isToday = pickupTime.isSame(currentDateTime, 'day');
  const isSameDay = pickupTime.isSame(returnTime, 'day');
  const duration = returnTime.diff(pickupTime, 'minute');
  const isStartTimeDayEnd = isEndOfDay(pickupTime);

  if (((isToday || isSameDay) && duration < minuteDifference) || duration < minuteDifference) {
    const validEndTime = pickupTime.add(minuteDifference, 'minute').toDate();
    setValue('endTime', isStartTimeDayEnd ? getOneHourRounded(validEndTime, minuteDifference) : validEndTime);
    setSelectedDates([{ ...selectedDates[0], endDate: getPickerDateUtc(validEndTime) }]);
    return;
  }
};

export const handleCommonEndDateField = (params: ICommonDateTimeFn) => {
  const { selectedDates, setSelectedDates, setValue, startDate, startTime, endDate, endTime, minuteDifference = 60, minuteAfterNow = 60 } = params;
  const currentSelection = selectedDates[0];

  const { combinedPickup, combinedReturn } = getCombinedPickReturnUtc(startDate, startTime, endDate, endTime, 'search-sDate');
  const pickupTime = combinedPickup?.combinedDayObj;
  const returnTime = combinedReturn?.combinedDayObj;
  const totalDuration = returnTime.diff(pickupTime, 'minute');

  // console.log({ pickupTime, returnTime });

  const isToday = dayjs(returnTime).isSame(currentDateTime, 'day');
  let isPickupAfterReturnMin = pickupTime.isAfter(returnTime, 'minute');
  const isPickupAfterReturnDay = pickupTime.isAfter(returnTime, 'day');
  const isPickupBeforeReturn = pickupTime.isBefore(returnTime, 'minute');
  const isStartTimeDayEnd = isEndOfDay(pickupTime);

  const validStartDate = getRoundUpStartTimeUtc(minuteAfterNow);
  const validEndDate = dayjs(validStartDate).add(minuteDifference, 'minute').toDate();
  let isPickupAfterValidStart: boolean = pickupTime.isAfter(validStartDate, 'minute');
  const isReturnAfterValidEnd: boolean = returnTime.isAfter(validEndDate, 'minute');

  const tempStartDate = returnTime.subtract(minuteDifference, 'minute').second(0).millisecond(0).toDate();

  // console.log({ validStartDate, validEndDate });
  // console.log(isPickupAfterReturnMin, isPickupAfterValidStart, !!isReturnAfterValidEnd, isReturnAfterValidEnd);

  if (isToday) {
    if (isPickupAfterReturnDay) {
      const { combinedDayObj } = combineDateTimeUtc(validStartDate, dayjsUtc(combinedPickup?.combinedDateTimeString));
      isPickupAfterReturnMin = combinedDayObj.isAfter(returnTime, 'minute');
      isPickupAfterValidStart = combinedDayObj.isAfter(validStartDate, 'minute');
      // console.log(!isPickupAfterValidStart, isPickupAfterReturnMin && isReturnAfterValidEnd, !isReturnAfterValidEnd);
      if (!isPickupAfterValidStart) {
        setValue('startTime', validStartDate);
      } else if (isPickupAfterReturnMin && isReturnAfterValidEnd) {
        setValue('startTime', tempStartDate);
      }
    }

    if (!isReturnAfterValidEnd) {
      setValue('endTime', isStartTimeDayEnd ? getOneHourRounded(validEndDate, minuteDifference) : validEndDate);
    }
    setSelectedDates([{ ...currentSelection, endDate, startDate: getPickerDateUtc(validStartDate) }]);
    return;
  }

  // if (isToday) {
  //   console.log('in');
  //   const validEndDate = dayjs(validStartDate).add(minuteDifference, 'minute').toDate();
  //   setSelectedDates([{ ...currentSelection, startDate: validStartDate, endDate: validEndDate }]);
  //   setValue('startTime', validStartDate);
  //   setValue('endTime', isStartTimeDayEnd ? getOneHourRounded(validEndDate, minuteDifference) : validEndDate);
  //   return;
  // }

  if (isPickupAfterReturnMin) {
    const oneHourAgo = returnTime.subtract(minuteDifference, 'minute').second(0).millisecond(0).toDate();
    const { formattedDateObj } = convertDateToUtc(endDate);
    setSelectedDates([{ ...currentSelection, startDate: getPickerDateUtc(oneHourAgo), endDate: formattedDateObj }]);
    // console.log({ oneHourAgo, pickupTime });
    setValue('startTime', oneHourAgo);
    return;
  }

  if (isPickupBeforeReturn && totalDuration < minuteDifference) {
    const validEndDate = dayjs(pickupTime).second(0).millisecond(0).add(minuteDifference, 'minute').toDate();
    setSelectedDates([{ ...currentSelection, endDate: validEndDate }]);
    setValue('endTime', isStartTimeDayEnd ? getOneHourRounded(validEndDate, minuteDifference) : validEndDate);
    return;
  }

  setSelectedDates([{ ...currentSelection, endDate }]);
};

export const handleCommonEndTime = (endTime: TDate, setValue: UseFormSetValue<any>) => {
  setValue('endTime', dayjsUtc(endTime).second(0).millisecond(0).toDate());
};

const updateStartTime = (isPickupAfterValidStart: boolean, newStartTime: Date, setValue: UseFormSetValue<any>) => {
  if (!isPickupAfterValidStart) {
    setValue('startTime', newStartTime);
  }
};

const updateEndTime = (newEndTime: Date, setValue: UseFormSetValue<any>) => {
  setValue('endTime', newEndTime);
};

export const handleCommonDateTimeValidation = async (
  pickupTime: Dayjs,
  returnTime: Dayjs,
  setErrorText: Dispatch<SetStateAction<string>>,
  from: 'current-edit' | 'upcoming-edit' | 'vehicle-details'
) => {
  let isValid = true;
  const updatedPickup = pickupTime?.second(0).millisecond(0);
  const updatedReturn = returnTime?.second(0).millisecond(0);
  const minuteDiff = updatedReturn.diff(updatedPickup, 'minute');
  const isReturnBeforePickup = updatedReturn.isBefore(updatedPickup, 'minute');
  const isPickupReturnSame = updatedReturn.isSame(updatedPickup, 'minute');
  const minimumPickupTime = dayjs(getRoundUpStartTimeUtc(15)).second(0).millisecond(0); //set minimum start time
  const isPickupPast = updatedPickup.isBefore(minimumPickupTime, 'minute');

  if (from !== 'current-edit' && isPickupPast) {
    setErrorText('Pickup time must has to be 15 minutes after current time');
    isValid = false;
    return isValid;
  }

  if (isReturnBeforePickup || isPickupReturnSame) {
    setErrorText('Invalid time');
    isValid = false;
    return isValid;
  }

  if (minuteDiff < 60) {
    setErrorText('Duration needs to be minimum 1 hr');
    isValid = false;
    return isValid;
  }

  setErrorText('');
  return isValid;
};

export const getCommonMinimumStartTime = (startDate: Date, minuteAfterNow?: number) => {
  const minStartTime = isSameDay(startDate, currentDateTime) ? getRoundUpStartTimeUtc(minuteAfterNow ?? 60) : undefined;
  return minStartTime;
};
