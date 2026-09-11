'use client';
import { TDate } from '@/types/commonTypes';
import { getMinTime } from '@/utils/Functions/availabilityCommonFn';
import {
  combineDateTime,
  currentDateTime,
  customStyles,
  getOneHourRounded,
  getRoundUpStartTime,
  isEndOfDay,
  isSameDay,
} from '@/utils/Functions/dateTimeCommonFn';
import { Box, FormControl } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction, useEffect } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useFormContext } from 'react-hook-form';
import CustomDateField from './CustomDateField';
import CustomTimeField from './CustomTimeField';

export const customSxStyles = {
  commonBoxStyles: {
    flexGrow: 1,
    m: 1,
    width: '100%',
    position: 'relative',
    '::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '10px',
      backgroundColor: 'purple',
    },
    '::after': {
      content: '""',
      position: 'absolute',
      right: '50%',
      top: 10,
      width: '2px',
      height: '34px',
      backgroundColor: 'black',
    },
  },
  borderLessInputStyles: {
    border: 'none', // Remove border
    '&:hover': {
      border: 'none', // Remove border on hover
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none', // Remove the outline
    },
  },
};

export type TSelectedDates = {
  startDate: Date;
  endDate: Date;
  key: string;
};

export interface ICustomDateTime {
  classNames?: string;
  disableStartDate?: boolean;
  disableEndDate?: boolean;
  disableStartTime?: boolean;
  disableEndTime?: boolean;
  disableStartPastTime?: boolean;
  selectedDates: [TSelectedDates];
  defaultStartTime?: Date;
  defaultEndTime?: Date;
  setSelectedDates: Dispatch<SetStateAction<[TSelectedDates]>>;
  handleDateChange?: (ranges: any) => void;
  handleStartTimeChange?: (timeValue: Dayjs | null, timeType: string) => void;
  handleEndTimeChange?: (timeValue: Dayjs | null, timeType: string) => void;
  getEndMinTime?: () => Date | undefined;
  labelStart?: string | undefined; //Change for Start label
  labelEnd?: string | undefined; //Change for End label
  disabledDates?: any; //disable dates
  toPickerDisabled?: boolean; //disabled EndDate Picker
}

const CustomDateTime = ({
  classNames,
  disableStartDate,
  disableStartTime,
  disableEndDate,
  disableEndTime,
  selectedDates,
  handleDateChange,
  defaultStartTime,
  defaultEndTime,
  handleStartTimeChange,
  handleEndTimeChange,
  disableStartPastTime,
  labelStart,
  labelEnd,
  disabledDates,
  toPickerDisabled,
  setSelectedDates,
}: ICustomDateTime) => {
  const { watch, setValue } = useFormContext();

  // To hide left side bar
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = customStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    handleDateChange && handleDateChange(selectedDates[0]);
    // setValue('startDate', selectedDates[0].startDate, { shouldValidate: true });
    // setValue('endDate', selectedDates[0].endDate, { shouldValidate: true });
  }, [selectedDates]);

  // new
  const handleStartDateChange = (ranges: any) => {
    handleStartDateField(ranges.selection.startDate);
  };

  const handleStartDateField = (startDate: any) => {
    const currentSelection = selectedDates[0];

    const isToday = dayjs(startDate).isSame(dayjs(), 'day');
    const pickupTime = dayjs(combineDateTime(startDate, watch('startTime')));
    const returnTime = dayjs(combineDateTime(watch('endDate'), watch('endTime')));

    const isPickupAfterReturn = pickupTime.isAfter(returnTime, 'minute');
    const isPickupReturnSame = pickupTime.isSame(returnTime, 'minute');

    if (isPickupAfterReturn || isPickupReturnSame) {
      const oneHourLater = pickupTime.add(1, 'hour').toDate();
      setSelectedDates([{ ...currentSelection, startDate: startDate, endDate: oneHourLater }]);
      setValue('endTime', oneHourLater);
      return;
    }

    if (isToday) {
      const validDate = getRoundUpStartTime(60).second(0).millisecond(0).toDate();
      // const validDate = getOneHourRounded(currentDateTime);
      setSelectedDates([{ ...currentSelection, startDate: validDate }]);
      setValue('startTime', validDate);
      return;
    }

    setSelectedDates([{ ...currentSelection, startDate: startDate }]);
  };

  const handleEndDateChange = (ranges: any) => {
    handleEndDateField(ranges.selection.endDate);
  };

  const handleEndDateField = (endDate: any) => {
    const currentSelection = selectedDates[0];

    const isToday = dayjs(endDate).isSame(dayjs(), 'day');

    const pickupTime = dayjs(combineDateTime(watch('startDate'), watch('startTime')))
      .second(0)
      .millisecond(0);
    const returnTime = dayjs(combineDateTime(endDate, watch('endTime')))
      .second(0)
      .millisecond(0);
    const totalDuration = returnTime.diff(pickupTime, 'minute');

    const isPickupAfterReturn = pickupTime.isAfter(returnTime, 'minute');
    const isPickupBeforeReturn = pickupTime.isBefore(returnTime, 'minute');
    const isStartTimeDayEnd = isEndOfDay(pickupTime);

    // if (isToday && !disableStartDate && !disableStartTime) {
    //   const validStartDate = dayjs(pickupTime).second(0).millisecond(0).toDate();
    //   const validEndDate = dayjs(validStartDate).add(1, 'hour').toDate();
    //   setSelectedDates([{ ...currentSelection, startDate: validStartDate, endDate: validEndDate }]);
    //   setValue('startTime', validStartDate);
    //   setValue('endTime', isStartTimeDayEnd ? getOneHourRounded(validEndDate) : validEndDate);
    //   return;
    // }

    // if (isPickupAfterReturn && !disableStartDate && !disableStartTime) {
    //   const oneHourAgo = returnTime.subtract(1, 'hour').second(0).millisecond(0).toDate();
    //   setSelectedDates([{ ...currentSelection, startDate: oneHourAgo, endDate: endDate }]);
    //   setValue('startTime', oneHourAgo);
    //   return;
    // }

    // if (isPickupBeforeReturn && totalDuration < 60) {
    //   const validEndDate = dayjs(pickupTime).second(0).millisecond(0).add(1, 'hour').toDate();
    //   setSelectedDates([{ ...currentSelection, endDate: validEndDate }]);
    //   setValue('endTime', isStartTimeDayEnd ? getOneHourRounded(validEndDate) : validEndDate);
    //   return;
    // }

    setSelectedDates([{ ...currentSelection, endDate: endDate }]);
  };

  const handleStartTime = (startTime: TDate, context: any) => {
    const formattedStartTime = dayjs(startTime).second(0).millisecond(0).toDate();
    setValue('startTime', formattedStartTime);

    const pickupTime = dayjs(combineDateTime(watch('startDate'), formattedStartTime))
      .second(0)
      .millisecond(0);
    const returnTime = dayjs(combineDateTime(watch('endDate'), watch('endTime')))
      .second(0)
      .millisecond(0);

    const isToday = dayjs(pickupTime).isSame(dayjs(), 'day');
    const isSameDay = dayjs(pickupTime).isSame(returnTime, 'day');
    const duration = dayjs(returnTime).diff(pickupTime, 'minute');
    const isStartTimeDayEnd = isEndOfDay(pickupTime);

    if (((isToday || isSameDay) && duration < 60) || duration < 60) {
      const validEndTime = dayjs(pickupTime).add(1, 'hour').toDate();
      setValue('endTime', isStartTimeDayEnd ? getOneHourRounded(validEndTime) : validEndTime);
      setSelectedDates([{ ...selectedDates[0], endDate: validEndTime }]);
      return;
    }
  };

  const handleEndTime = (endTime: TDate, context: any) => {
    // console.log(endTime);
    setValue('endTime', dayjs(endTime).second(0).millisecond(0).toDate());
  };

  return (
    <Box className={`${classNames ? classNames : 'grid grid-cols-1 md:grid-cols-2 gap-4'}`}>
      {classNames && <p className="p-0 m-0 font-bold text-md">{`${labelStart ?? 'Pickup'}`}</p>}
      <FormControl
        fullWidth
        sx={customSxStyles.commonBoxStyles}
        variant="outlined"
        className={`${classNames ? 'w-full' : 'lg:w-1/2'} grid grid-cols-2 bg-white mx-0 relative`}
      >
        <div className="col-span-1">
          <CustomDateField
            handleDateField={handleStartDateField}
            selectedDates={selectedDates}
            handleDateChange={handleStartDateChange}
            disableBlockDates={disabledDates}
            dateValue={selectedDates[0].startDate}
            format="d MMM yy"
            //format="d MMM YY" when dayjs
            disabled={disableStartDate}
          ></CustomDateField>
        </div>
        <div className="col-span-1">
          <CustomTimeField
            timeValue={watch('startTime')}
            minTime={isSameDay(selectedDates[0]?.startDate, currentDateTime) ? getRoundUpStartTime(60).toDate() : undefined}
            handleTimeChange={handleStartTime}
            disabled={disableStartTime}
          ></CustomTimeField>
        </div>
      </FormControl>

      {/* Return date & time */}
      {classNames && <p className="p-0 m-0 font-bold text-md">{`${labelEnd ?? 'Return'}`}</p>}
      <FormControl
        fullWidth
        sx={customSxStyles.commonBoxStyles}
        variant="outlined"
        className={`${classNames ? 'w-full' : 'lg:w-1/2'} grid grid-cols-2 bg-white mx-0`}
      >
        <div className="col-span-1">
          <CustomDateField
            handleDateField={handleEndDateField}
            handleDateChange={handleEndDateChange}
            selectedDates={selectedDates}
            disableBlockDates={disabledDates}
            dateValue={selectedDates[0].endDate}
            format="d MMM yy"
            //format="d MMM YY" when dayjs
          ></CustomDateField>
        </div>

        <div className="col-span-1">
          <CustomTimeField
            timeValue={watch('endTime')}
            minTime={dayjs(selectedDates[0]?.startDate).isSame(dayjs(selectedDates[0]?.endDate), 'day') ? getMinTime(watch('startTime')) : undefined}
            handleTimeChange={handleEndTime}
          ></CustomTimeField>
        </div>
      </FormControl>
    </Box>
  );
};

export default CustomDateTime;
