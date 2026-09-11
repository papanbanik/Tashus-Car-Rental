'use client';
import CustomDateField from '@/components/Common/DateTimePickers/CustomDateField';
import { useSearchContext } from '@/context/SearchProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { TDate } from '@/types/commonTypes';
import { PickupReturnProps } from '@/types/componentTypes';
import {
  combineDateTime,
  currentDateTime,
  customStyles,
  getDefaultPickupTime,
  getDefaultReturnTime,
  getMinimumEndDate,
  getOneHourRounded,
  getRoundUpStartTime,
  isEndOfDay,
  isSameDay,
  isValidDate,
} from '@/utils/Functions/dateTimeCommonFn';
import { Box, FormControl } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
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

const CustomSearchDateTimePicker = ({ setValue, register, watch, control, classNames, disableBlockDates }: PickupReturnProps) => {
  const defaultSelectedDates = {
    startDate: getDefaultPickupTime(),
    endDate: getDefaultReturnTime(),
    key: 'selection',
  };
  const [isPickerOpen, setPickerOpen] = useState<boolean>(false);
  const [isEndPickerOpen, setEndPickerOpen] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [firstTimePickerOpen, setFirstTimePickerOpen] = useState<boolean>(false);
  const [secondTimePickerOpen, setSecondTimePickerOpen] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState(0);
  const [selectedDates, setSelectedDates] = useState([defaultSelectedDates]);
  const [minEndDate, setMinEndTime] = useState<Date | undefined>(undefined);
  const mainBoxRef = useRef<HTMLDivElement | null>(null);

  const { searchParams, setTimeErrorText, timeErrorText } = useSearchContext();
  const { openSnackBar } = useSnackBarContext();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = customStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    setValue('startDate', selectedDates[0].startDate, { shouldValidate: true });
    setValue('endDate', selectedDates[0].endDate, { shouldValidate: true });
  }, [selectedDates]);

  useEffect(() => {
    const isStartDateValid = isValidDate(watch('startDate'));
    const isStartTimeValid = isValidDate(watch('startTime'));
    const isEndDateValid = isValidDate(watch('endDate'));
    const isEndTimeValid = isValidDate(watch('endTime'));

    if (isStartDateValid && isEndDateValid && isStartTimeValid && isEndTimeValid) {
      const tempMinEndDate = getMinimumEndDate(watch('startDate'), watch('startTime'), watch('endDate'), watch('endTime'));
      setMinEndTime(tempMinEndDate);
    }
  }, [watch('startDate'), watch('endDate'), watch('startTime'), watch('endTime')]);

  useEffect(() => {
    if (searchParams?.pickup && searchParams?.return) {
      const tempSelection = {
        startDate: new Date(searchParams?.pickup),
        endDate: new Date(searchParams?.return),
        key: 'selection',
      };
      setSelectedDates([tempSelection]);
    } else {
      setSelectedDates([defaultSelectedDates]);
    }
  }, [searchParams]);

  const togglePicker = () => {
    setPickerOpen(!isPickerOpen);
  };

  // validates if pickup time is after current time
  const handleStartTimeInputValidation = (timeValue: any) => {
    const start = dayjs(combineDateTime(selectedDates[0]?.startDate, timeValue));
    const isTimeFuture = start.isAfter(currentDateTime);

    return isTimeFuture;
  };

  // validates if return time is after pickup time
  const handleEndTimeInputValidation = (timeValue: Dayjs) => {
    const start = dayjs(combineDateTime(selectedDates[0]?.startDate, watch('startTime')));
    const end = dayjs(combineDateTime(selectedDates[0]?.endDate, timeValue));
    const isTimeFuture = end.isAfter(start);

    return isTimeFuture;
  };

  // Validates pickup and return time whenever pickup or return time changes
  const handleBothTimeChange = (timeValue: Dayjs | null, timeType: string) => {
    // console.log(timeValue, timeType);
    const start = dayjs(combineDateTime(selectedDates[0]?.startDate, watch('startTime')));
    const end = dayjs(combineDateTime(selectedDates[0]?.endDate, watch('endTime')));
    const truncatedStart = start.second(0).millisecond(0);
    const truncatedEnd = end.second(0).millisecond(0);
    const timeDiffMins = truncatedEnd.diff(truncatedStart, 'minute');

    if (timeDiffMins < 30) {
      setTimeErrorText('Duration needs to be minimum 30 mins');
      return;
    }

    // Compare the truncated date-time components
    const areDateTimesEqual = truncatedStart.isSame(truncatedEnd);
    if (areDateTimesEqual) {
      setTimeErrorText('Invalid duration');
      return;
    }

    const isPickupValid = handleStartTimeInputValidation(timeType === 'startTime' ? timeValue : watch('startTime'));
    if (!isPickupValid) {
      setTimeErrorText('Invalid pickup time');
      return;
    }

    const isReturnValid = handleEndTimeInputValidation(timeType === 'endTime' ? timeValue : watch('endTime'));
    if (!isReturnValid) {
      setTimeErrorText('Invalid return time');
      return;
    }

    setTimeErrorText('');
  };

  const handleScrollToPicker = () => {
    if (mainBoxRef.current) {
      mainBoxRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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

    if (isToday) {
      const validStartDate = getRoundUpStartTime(60).second(0).millisecond(0).toDate();
      const validEndDate = dayjs(validStartDate).add(1, 'hour').toDate();
      setSelectedDates([{ ...currentSelection, startDate: validStartDate, endDate: validEndDate }]);
      setValue('startTime', validStartDate);
      setValue('endTime', isStartTimeDayEnd ? getOneHourRounded(validEndDate) : validEndDate);
      return;
    }

    if (isPickupAfterReturn) {
      const oneHourAgo = returnTime.subtract(1, 'hour').second(0).millisecond(0).toDate();
      setSelectedDates([{ ...currentSelection, startDate: oneHourAgo, endDate: endDate }]);
      setValue('startTime', oneHourAgo);
      return;
    }

    if (isPickupBeforeReturn && totalDuration < 60) {
      const validEndDate = dayjs(pickupTime).second(0).millisecond(0).add(1, 'hour').toDate();
      setSelectedDates([{ ...currentSelection, endDate: validEndDate }]);
      setValue('endTime', isStartTimeDayEnd ? getOneHourRounded(validEndDate) : validEndDate);
      return;
    }

    setSelectedDates([{ ...currentSelection, endDate: endDate }]);
  };

  // const [anchorPickupEl, setAnchorPickupEl] = useState<HTMLButtonElement | null>(null);
  // const [anchorReturnEl, setAnchorReturnEl] = useState<HTMLButtonElement | null>(null);
  // const pickupOpen = Boolean(anchorPickupEl);
  // const returnOpen = Boolean(anchorReturnEl);
  // const pickupId = pickupOpen ? 'simple-popover' : undefined;
  // const returnId = returnOpen ? 'simple-popover' : undefined;

  // const handlePickupCalendarOpen = (event: any) => {
  //   setAnchorPickupEl(event.currentTarget);
  // };

  // const handleReturnCalendarOpen = (event: any) => {
  //   setAnchorReturnEl(event.currentTarget);
  // };

  // const handlePickupClose = () => {
  //   setAnchorPickupEl(null);
  // };

  // const handleReturnClose = () => {
  //   setAnchorReturnEl(null);
  // };

  return (
    // <Box display="flex" flexDirection="row" justifyContent="space-between" className="">
    <div>
      <Box className={`${classNames ? classNames : 'lg:flex gap-3'} w-full `}>
        {classNames && <p className="p-0 m-0 font-bold text-md">Pickup</p>}
        <FormControl
          fullWidth
          sx={customSxStyles.commonBoxStyles}
          variant="outlined"
          className={`${classNames ? 'w-full' : 'lg:w-1/2'} grid grid-cols-2 bg-white mx-0 relative`}
        >
          <div className="col-span-1">
            <CustomDateField
              // id={pickupId}
              // anchorElement={anchorReturnEl}
              handleDateField={handleStartDateField}
              selectedDates={selectedDates}
              handleDateChange={handleStartDateChange}
              // isPickerOpen={pickupOpen}
              // togglePicker={handlePickupCalendarOpen}
              // handleClose={handlePickupClose}
              disableBlockDates={disableBlockDates}
              dateValue={selectedDates[0].startDate}
              // togglePicker={handleClick}

              format="d MMM yy"
              //format="d MMM YY" when dayjs
            ></CustomDateField>
          </div>
          <div className="col-span-1">
            <CustomTimeField
              timeValue={watch('startTime')}
              minTime={isSameDay(selectedDates[0]?.startDate, currentDateTime) ? getRoundUpStartTime(60).toDate() : undefined}
              handleTimeChange={handleStartTime}
            ></CustomTimeField>
            {/* <TimeSelection
              control={control}
              registerName="startTime"
              setValue={setValue}
              timePickerOpen={firstTimePickerOpen}
              setTimePickerOpen={setFirstTimePickerOpen}
              disablePast={shouldPastDisable(watch('startDate'))}
              defaultValue={watch('startTime')}
              minTime={isSameDay(selectedDates[0]?.startDate, currentDateTime) ? getRoundUpStartTime(60).toDate() : undefined}
              // manualOnChange={handleBothTimeChange}
            ></TimeSelection> */}
          </div>
        </FormControl>

        {/* to date & time */}
        {classNames && <p className="p-0 m-0 font-bold text-md">Return</p>}
        <FormControl
          fullWidth
          sx={customSxStyles.commonBoxStyles}
          variant="outlined"
          className={`${classNames ? 'w-full' : 'lg:w-1/2'} grid grid-cols-2 bg-white mx-0`}
        >
          <div className="col-span-1">
            <CustomDateField
              // id={returnId}
              // anchorElement={anchorPickupEl}
              handleDateField={handleEndDateField}
              handleDateChange={handleEndDateChange}
              selectedDates={selectedDates}
              // isPickerOpen={returnOpen}
              disableBlockDates={disableBlockDates}
              dateValue={selectedDates[0].endDate}
              // togglePicker={handleReturnCalendarOpen}
              // handleClose={handleReturnClose}
              format="d MMM yy"
              //format="d MMM YY" when dayjs
            ></CustomDateField>
          </div>

          <div className="col-span-1">
            <CustomTimeField
              timeValue={watch('endTime')}
              minTime={minEndDate}
              // minTime={getMinimumEndDate(watch('startDate'), watch('startTime'), watch('endDate'), watch('endTime'))}
              // minTime={
              //   dayjs(selectedDates[0]?.startDate).isSame(dayjs(selectedDates[0]?.endDate), 'day') ? getMinimumEndDate(watch('startTime')) : undefined
              // }
              handleTimeChange={handleEndTime}
            ></CustomTimeField>
            {/* <TimeSelection
              control={control}
              watch={watch}
              registerName="endTime"
              setValue={setValue}
              timePickerOpen={secondTimePickerOpen}
              setTimePickerOpen={setSecondTimePickerOpen}
              disablePast={false}
              defaultValue={watch('endTime')}
              // manualOnChange={handleBothTimeChange}
              minTime={
                dayjs(selectedDates[0]?.startDate).isSame(dayjs(selectedDates[0]?.endDate), 'day') ? getMinimumEndDate(watch('startTime')) : undefined
              }
              // minTime={
              //   dayjs(selectedDates[0]?.startDate).isSame(dayjs(selectedDates[0]?.endDate), 'day') ? getMinTime(watch('startTime')) : undefined
              // }
            ></TimeSelection> */}
          </div>
        </FormControl>
      </Box>
    </div>
  );
};

export default CustomSearchDateTimePicker;
