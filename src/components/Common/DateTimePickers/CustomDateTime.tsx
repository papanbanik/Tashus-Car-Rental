'use client';
import { TDate } from '@/types/commonTypes';
import {
  getCommonMinimumStartTime,
  handleCommonEndDateField,
  handleCommonEndTime,
  handleCommonStartDateField,
  handleCommonStartTime,
} from '@/utils/Functions/createEditTravelCommonFn';
import { customStyles, getMinimumEndDate, isValidDate } from '@/utils/Functions/dateTimeCommonFn';
import { Box, FormControl } from '@mui/material';
import { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useFormContext } from 'react-hook-form';
import CustomDateFieldTz from './CustomDateFieldTz';
import CustomTimeFieldTz from './CustomTimeFieldTz';

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
  minuteDifferenceBetweenPickers?: number; //minimum minute difference between start and end date
  minuteAfterNow?: number; //minimum minute difference between current time and start date
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
  setSelectedDates,
  minuteDifferenceBetweenPickers = 60, // when undefined, use 60 minutes
  minuteAfterNow = 60, // when undefined, use 60 minutes
}: ICustomDateTime) => {
  const [minEndDate, setMinEndTime] = useState<Date | undefined>(undefined);
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

  // Any date time changes, update minimum end time
  useEffect(() => {
    const isStartDateValid = isValidDate(watch('startDate'));
    const isStartTimeValid = isValidDate(watch('startTime'));
    const isEndDateValid = isValidDate(watch('endDate'));
    const isEndTimeValid = isValidDate(watch('endTime'));

    if (isStartDateValid && isEndDateValid && isStartTimeValid && isEndTimeValid) {
      const tempMinEndDate = getMinimumEndDate(
        watch('startDate'),
        watch('startTime'),
        watch('endDate'),
        watch('endTime'),
        minuteDifferenceBetweenPickers
      );
      setMinEndTime(tempMinEndDate);
    }
  }, [watch('startDate'), watch('endDate'), watch('startTime'), watch('endTime')]);

  // new
  const handleStartDateChange = (ranges: any) => {
    handleStartDateField(ranges.selection.startDate);
  };

  const handleStartDateField = (startDate: any) => {
    handleCommonStartDateField({
      selectedDates,
      setSelectedDates,
      startDate,
      startTime: watch('startTime'),
      endDate: watch('endDate'),
      endTime: watch('endTime'),
      setValue,
      minuteDifference: minuteDifferenceBetweenPickers,
      minuteAfterNow,
    });
  };

  const handleEndDateChange = (ranges: any) => {
    handleEndDateField(ranges.selection.endDate);
  };

  const handleEndDateField = (endDate: any) => {
    const currentSelection = selectedDates[0];

    // if upcoming travel edit, validate end date with start date
    if (!disableStartDate && !disableStartTime) {
      handleCommonEndDateField({
        selectedDates,
        setSelectedDates,
        startDate: watch('startDate'),
        startTime: watch('startTime'),
        endDate,
        endTime: watch('endTime'),
        setValue,
        minuteDifference: minuteDifferenceBetweenPickers,
        minuteAfterNow,
      });
    } else {
      // if current travel edit, just change end date
      setSelectedDates([{ ...currentSelection, endDate: endDate }]);
    }
  };

  const handleStartTime = (startTime: TDate, context: any) => {
    handleCommonStartTime({
      selectedDates,
      setSelectedDates,
      startDate: watch('startDate'),
      startTime,
      endDate: watch('endDate'),
      endTime: watch('endTime'),
      setValue,
      minuteDifference: minuteDifferenceBetweenPickers,
    });
  };

  const handleEndTime = (endTime: TDate, context: any) => {
    handleCommonEndTime(endTime, setValue);
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
          <CustomDateFieldTz
            handleDateField={handleStartDateField}
            selectedDates={selectedDates}
            handleDateChange={handleStartDateChange}
            disableBlockDates={disabledDates}
            dateValue={selectedDates[0].startDate}
            format="d MMM yy"
            //format="d MMM YY" when dayjs
            disabled={disableStartDate}
          ></CustomDateFieldTz>
        </div>
        <div className="col-span-1">
          <CustomTimeFieldTz
            timeValue={watch('startTime')}
            minTime={getCommonMinimumStartTime(watch('startDate'), minuteAfterNow)}
            handleTimeChange={handleStartTime}
            disabled={disableStartTime}
            showUtc={true}
          ></CustomTimeFieldTz>
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
          <CustomDateFieldTz
            handleDateField={handleEndDateField}
            handleDateChange={handleEndDateChange}
            selectedDates={selectedDates}
            disableBlockDates={disabledDates}
            dateValue={selectedDates[0].endDate}
            format="d MMM yy"
            isReturnDate={true}
            //format="d MMM YY" when dayjs
          ></CustomDateFieldTz>
        </div>

        <div className="col-span-1">
          <CustomTimeFieldTz
            timeValue={watch('endTime')}
            minTime={minEndDate}
            handleTimeChange={handleEndTime}
            showUtc={true}
            disabled={disableEndTime}
          ></CustomTimeFieldTz>
        </div>
      </FormControl>
    </Box>
  );
};

export default CustomDateTime;
