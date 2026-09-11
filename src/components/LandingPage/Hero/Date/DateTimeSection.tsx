'use client';
import { useSearchContext } from '@/context/SearchProvider';
import { PickupReturnProps } from '@/types/componentTypes';
import { getMinTime } from '@/utils/Functions/availabilityCommonFn';
import {
  combineDateTime,
  currentDateTime,
  customStyles,
  formatDate,
  getRoundUpStartTime,
  isSameDay,
  isValidDate,
  shouldPastDisable,
} from '@/utils/Functions/dateTimeCommonFn';
import { Box, Button, FormControl, IconButton, InputAdornment, Modal, OutlinedInput } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { FaCalendarDay } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import TimeSelection from './TimeSelection';

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

const DateTimeSection = ({ setValue, register, watch, control, classNames, disableBlockDates }: PickupReturnProps) => {
  const defaultSelectedDates = {
    startDate: dayjs().toDate(),
    endDate: dayjs().add(3, 'day').toDate(),
    key: 'selection',
  };
  const [isPickerOpen, setPickerOpen] = useState<boolean>(false);
  const [isEndPickerOpen, setEndPickerOpen] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [firstTimePickerOpen, setFirstTimePickerOpen] = useState<boolean>(false);
  const [secondTimePickerOpen, setSecondTimePickerOpen] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState(0);
  const [selectedDates, setSelectedDates] = useState([defaultSelectedDates]);
  const { searchParams, setTimeErrorText, timeErrorText } = useSearchContext();

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
    const isStartDateValid = isValidDate(watch('startTime'));
    if (selectedDates[0]?.startDate && selectedDates[0]?.endDate && isStartDateValid) {
      const isToday = isSameDay(selectedDates[0]?.startDate, currentDateTime);
      const sameDay = isSameDay(selectedDates[0]?.startDate, selectedDates[0]?.endDate);
      setValue('startDate', selectedDates[0].startDate, { shouldValidate: true });
      setValue('endDate', selectedDates[0].endDate, { shouldValidate: true });
      // console.log(selectedDates[0]?.startDate, watch('startTime'), isStartDateValid);
      const pickupTime = combineDateTime(selectedDates[0]?.startDate, watch('startTime'), 'DT 1');
      const isPickupPast = dayjs(pickupTime).isBefore(currentDateTime);
      // console.log(isPickupPast);

      // Calculate the time 30 minutes later when pickup date is today
      if (isPickupPast) {
        const startTime = getRoundUpStartTime(60);
        setValue('startTime', startTime?.toISOString());
        handleBothTimeChange(startTime, 'startTime');
      }

      if (!isToday && sameDay) {
        handleBothTimeChange(dayjs(watch('startTime')), 'startTime');
      }

      !isToday && !sameDay && setTimeErrorText('');
    }
  }, [selectedDates]);

  useEffect(() => {
    const isStartDateValid = isValidDate(watch('startDate'));
    const isStartTimeValid = isValidDate(watch('startTime'));
    const isEndDateValid = isValidDate(watch('endDate'));
    const isEndTimeValid = isValidDate(watch('endTime'));

    if (isStartDateValid && isStartTimeValid && isEndDateValid && isEndTimeValid) {
      const pickupTime = dayjs(combineDateTime(watch('startDate'), watch('startTime'), 'DT 11'));
      const returnTime = dayjs(combineDateTime(watch('endDate'), watch('endTime'), 'DT 12'));

      // const duration = getDurationHours(pickupTime, returnTime);
      const duration = returnTime.diff(pickupTime, 'minute');

      const isPickupAfterReturn = pickupTime.isAfter(returnTime, 'minute');
      if (isPickupAfterReturn) {
        setTimeErrorText('Invalid time');
      } else if (duration < 30) {
        setTimeErrorText('Duration needs to be minimum 30 minutes');
      } else {
        setTimeErrorText('');
      }
    }
  }, [watch('startDate'), watch('startTime'), watch('endDate'), watch('endTime')]);

  useEffect(() => {
    const isStartDateValid = isValidDate(watch('startTime'));
    if (selectedDates[0]?.startDate && selectedDates[0]?.endDate && isStartDateValid) {
      const isToday = isSameDay(selectedDates[0]?.startDate, currentDateTime);
      const sameDay = isSameDay(selectedDates[0]?.startDate, selectedDates[0]?.endDate);
      setValue('startDate', selectedDates[0].startDate, { shouldValidate: true });
      setValue('endDate', selectedDates[0].endDate, { shouldValidate: true });
      // console.log(selectedDates[0]?.startDate, watch('startTime'), isStartDateValid);
      const pickupTime = combineDateTime(selectedDates[0]?.startDate, watch('startTime'), 'DT 1');
      const isPickupPast = dayjs(pickupTime).isBefore(currentDateTime);
      // console.log(isPickupPast);

      // Calculate the time 30 minutes later when pickup date is today
      if (isPickupPast) {
        const startTime = getRoundUpStartTime(60);
        setValue('startTime', startTime?.toISOString());
        handleBothTimeChange(startTime, 'startTime');
      }

      if (!isToday && sameDay) {
        handleBothTimeChange(dayjs(watch('startTime')), 'startTime');
      }

      !isToday && !sameDay && setTimeErrorText('');
    }
  }, [selectedDates]);

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

  const calculateMonths = () => {
    return isSmallScreen ? 1 : 2;
  };

  const handleTimePickerAccept1 = () => {
    setFirstTimePickerOpen(false);
  };

  const handleTimePickerAccept2 = () => {
    setSecondTimePickerOpen(false);
  };

  const handleTimePickerClose1 = () => {
    setFirstTimePickerOpen(false);
  };

  const handleTimePickerClose2 = () => {
    setSecondTimePickerOpen(false);
  };

  const handleStartDateChange = (ranges: any) => {
    // handleStartDateField(ranges.selection.startDate);
    // setSelectedDates([{ ...currentSelection, startDate: ranges.selection.startDate }]);

    setSelectedDates([{ ...ranges.selection, key: 'selection' }]);
    // setClickCount(clickCount + 1);

    // if (clickCount % 2 === 0) {
    //   setSelectedDates([ranges.selection]);
    //   setPickerOpen(false);
    // } else {
    //   setSelectedDates([{ ...ranges.selection, key: 'selection' }]);
    // }
  };

  const handleStartDateField = (startDate: any) => {
    const currentSelection = selectedDates[0];
    const pickupTime = combineDateTime(dayjs(startDate), watch('startTime'), 'DT 2');
    const returnTime = combineDateTime(watch('endDate'), watch('endTime'), 'DT 3');
    const isPickupPast = dayjs(pickupTime).isBefore(dayjs(), 'minute');
    if (isPickupPast) {
      setSelectedDates([{ ...currentSelection }]);
      // setSelectedDates([{ ...currentSelection, startDate: dayjs().toDate() }]);
    } else if (dayjs(returnTime).isBefore(dayjs(pickupTime))) {
      setSelectedDates([{ ...currentSelection, startDate: startDate, endDate: dayjs(startDate).add(3, 'day').toDate() }]);
    } else {
      setSelectedDates([{ ...currentSelection, startDate: startDate }]);
    }
  };

  const handleEndDateChange = (ranges: any) => {
    handleEndDateField(ranges.selection.endDate);
  };

  const handleEndDateField = (endDate: any) => {
    const currentSelection = selectedDates[0];
    const pickupTime = combineDateTime(watch('startDate'), watch('startTime'), 'DT 4');
    const returnTime = combineDateTime(endDate, watch('endTime'), 'DT 5');
    const isEndAfterStart = dayjs(endDate).isAfter(dayjs(pickupTime), 'minute');
    const isEndBeforeStart = dayjs(returnTime).isBefore(dayjs(pickupTime), 'minute');
    const isReturnPast = dayjs(returnTime).isBefore(currentDateTime, 'minute');
    // if (isReturnPast) {
    //   setSelectedDates([{ ...currentSelection }]);
    // } else {
    setSelectedDates([{ ...currentSelection, endDate: endDate }]);
    // }
    // if (dayjs(endDate).isSame(dayjs(), 'day')) {
    //   console.log('same');
    //   setSelectedDates([{ ...currentSelection, endDate: endDate, startDate: endDate }]);
    // } else if (dayjs(endDate).isBefore(dayjs(watch('startDate')))) {
    //   setSelectedDates([{ ...currentSelection, endDate: endDate, startDate: dayjs(endDate).subtract(3, 'day').toDate() }]);
    // } else {
    //   setSelectedDates([{ ...currentSelection, endDate: endDate }]);
    // }
  };

  const togglePicker = () => {
    setPickerOpen(!isPickerOpen);
  };

  const toggleEndPicker = () => {
    setEndPickerOpen(!isEndPickerOpen);
  };

  const handleModalOpen = () => {
    setPickerOpen(true);
  };

  const handleModalClose = () => {
    setPickerOpen(false);
    setEndPickerOpen(false);
  };

  // validates if pickup time is after current time
  const handleStartTimeInputValidation = (timeValue: any) => {
    const start = dayjs(combineDateTime(selectedDates[0]?.startDate, timeValue, 'DT 6'));
    const isTimeFuture = start.isAfter(currentDateTime);

    return isTimeFuture;
  };

  // validates if return time is after pickup time
  const handleEndTimeInputValidation = (timeValue: Dayjs) => {
    const start = dayjs(combineDateTime(selectedDates[0]?.startDate, watch('startTime')), 'DT 7');
    const end = dayjs(combineDateTime(selectedDates[0]?.endDate, timeValue), 'DT 8');
    const isTimeFuture = end.isAfter(start);

    return isTimeFuture;
  };

  // Validates pickup and return time whenever pickup or return time changes
  const handleBothTimeChange = (timeValue: Dayjs | null, timeType: string) => {
    console.log(timeValue, timeType);
    const start = dayjs(combineDateTime(selectedDates[0]?.startDate, watch('startTime')), 'DT 9');
    const end = dayjs(combineDateTime(selectedDates[0]?.endDate, watch('endTime')), 'DT 10');
    const truncatedStart = start.second(0).millisecond(0);
    const truncatedEnd = end.second(0).millisecond(0);
    const timeDiffMins = truncatedEnd.diff(truncatedStart, 'minute');

    console.log({ truncatedStart, truncatedEnd, timeDiffMins });

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

  return (
    // <Box display="flex" flexDirection="row" justifyContent="space-between" className="">
    <Box className={`${classNames ? classNames : 'grid grid-cols-1 md:grid-cols-2 md:gap-4 gap-0 '}`}>
      {classNames && <p className="p-0 m-0 font-bold text-md">Pickup</p>}
      <FormControl fullWidth sx={customSxStyles.commonBoxStyles} className="grid grid-cols-2 bg-white mx-0">
        {/* <CustomDateField
          handleDateField={handleStartDateField}
          isPickerOpen={isPickerOpen}
          dateValue={selectedDates[0].startDate}
          togglePicker={togglePicker}
          format="d MMM yy"
        ></CustomDateField> */}
        {/* <div className="flex">
          <IconButton onClick={togglePicker} edge="end" className="ml-1">
            {isPickerOpen ? <IoClose /> : <FaCalendarDay />}
          </IconButton>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateField
              value={dayjs(selectedDates[0].startDate).toDate()}
              onChange={(newValue) => handleStartDateField(newValue)}
              format="dd-MM-yy"
              // format="MMM d"
              sx={customSxStyles.borderLessInputStyles}
            />
          </LocalizationProvider>
        </div> */}
        <OutlinedInput
          id="start-date-picker"
          className=""
          value={formatDate(selectedDates[0].startDate)}
          // value={watch('startDate') ? formatDate(watch('startDate')) : formatDate(selectedDates[0].startDate)}
          readOnly
          onClick={togglePicker}
          // {...register('startDate', {
          //   required: true,
          // })}
          startAdornment={
            <InputAdornment position="start" className="pl-4">
              <IconButton onClick={togglePicker} edge="start">
                {isPickerOpen ? <IoClose /> : <FaCalendarDay />}
              </IconButton>
            </InputAdornment>
          }
          sx={customSxStyles.borderLessInputStyles}
          // style={{ border: 'none', outline: 'none' }}
        />

        <TimeSelection
          control={control}
          registerName="startTime"
          setValue={setValue}
          timePickerOpen={firstTimePickerOpen}
          setTimePickerOpen={setFirstTimePickerOpen}
          disablePast={shouldPastDisable(watch('startDate'))}
          defaultValue={watch('startTime')}
          minTime={isSameDay(selectedDates[0]?.startDate, currentDateTime) ? getRoundUpStartTime(60).toDate() : undefined}
          manualOnChange={handleBothTimeChange}
          // defaultValue={searchParams?.pickup ? new Date(searchParams?.pickup) : getDefaultStartTime()}
        ></TimeSelection>
      </FormControl>

      <Modal
        open={isPickerOpen}
        onClose={handleModalClose}
        aria-labelledby="date-range-picker-modal"
        aria-describedby="date-range-picker-modal-description"
      >
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <Box className="bg-white p-4 rounded-lg">
            <DateRangePicker
              ranges={selectedDates}
              onChange={handleStartDateChange}
              // moveRangeOnFirstSelection={false}
              // months={2}
              months={calculateMonths()}
              direction="horizontal"
              showMonthAndYearPickers={false}
              showDateDisplay={false}
              showMonthArrow={true}
              minDate={new Date()}
              rangeColors={['#800080']}
              disabledDates={disableBlockDates}
            />
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={handleModalClose}
                className="border-primary bg-white text-primary hover:text-white hover:bg-primary"
              >
                OK
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      {/* <Modal
        open={isEndPickerOpen}
        onClose={handleModalClose}
        aria-labelledby="date-range-picker-modal"
        aria-describedby="date-range-picker-modal-description"
      >
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <Box className="bg-white p-4 rounded-lg">
            <DateRangePicker
              ranges={selectedDates}
              onChange={handleEndDateChange}
              // moveRangeOnFirstSelection={false}
              // months={2}
              months={calculateMonths()}
              direction="horizontal"
              showMonthAndYearPickers={false}
              showDateDisplay={false}
              showMonthArrow={true}
              minDate={new Date()}
              rangeColors={['#800080']}
              disabledDates={disableBlockDates}
            />
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={handleModalClose}
                className="border-primary bg-white text-primary hover:text-white hover:bg-primary"
              >
                OK
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal> */}

      {/* to date & time */}
      {classNames && <p className="p-0 m-0 font-bold text-md">Return</p>}
      <FormControl fullWidth sx={customSxStyles.commonBoxStyles} variant="outlined" className="grid grid-cols-2 bg-white mx-0">
        {/* <CustomDateField
          handleDateField={handleEndDateField}
          // isPickerOpen={isEndPickerOpen}
          isPickerOpen={isPickerOpen}
          dateValue={selectedDates[0].endDate}
          togglePicker={togglePicker}
          // togglePicker={toggleEndPicker}
          format="d MMM yy"
          // format="MMM d"
        ></CustomDateField> */}

        <OutlinedInput
          id="end-date-picker"
          value={formatDate(selectedDates[0].endDate)}
          readOnly
          onClick={togglePicker}
          // onClick={toggleEndPicker}
          // {...register('endDate', {
          //   required: true,
          // })}
          // startAdornment={
          //   <InputAdornment position="start" className="pl-4">
          //     <IconButton edge="start">
          //       <FaCalendarDay />
          //     </IconButton>
          //   </InputAdornment>
          // }
          startAdornment={
            <InputAdornment position="start" className="pl-4">
              <IconButton onClick={toggleEndPicker} edge="start">
                {isPickerOpen ? <IoClose /> : <FaCalendarDay />}
              </IconButton>
            </InputAdornment>
          }
          sx={customSxStyles.borderLessInputStyles}
        />

        <TimeSelection
          control={control}
          watch={watch}
          registerName="endTime"
          setValue={setValue}
          timePickerOpen={secondTimePickerOpen}
          setTimePickerOpen={setSecondTimePickerOpen}
          disablePast={false}
          defaultValue={searchParams?.return ? new Date(searchParams?.return) : watch('endTime')}
          // defaultValue={searchParams?.return ? new Date(searchParams?.return) : getDefaultEndTime()}
          manualOnChange={handleBothTimeChange}
          // defaultValue={searchParams?.return ? new Date(searchParams?.return) : currentDateTime}
          minTime={dayjs(selectedDates[0]?.startDate).isSame(dayjs(selectedDates[0]?.endDate), 'day') ? getMinTime(watch('startTime')) : undefined}
          // defaultValue={getDefaultTime(searchParams?.return)}
          // defaultValue={searchParams?.return ? searchParams?.return : dayjs()}
        ></TimeSelection>
        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div onClick={() => setSecondTimePickerOpen(true)}>
            <TimePicker
              defaultValue={currentDateTime}
              open={secondTimePickerOpen}
              onClose={handleTimePickerClose2}
              onAccept={handleTimePickerAccept2}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              slotProps={{
                layout: {},
                actionBar: {
                  actions: ['accept'],
                },
              }}
            />
          </div>
        </LocalizationProvider> */}
      </FormControl>
    </Box>
  );
};

export default DateTimeSection;
