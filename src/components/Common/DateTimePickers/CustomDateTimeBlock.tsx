'use client';
import TimeSelection from '@/components/LandingPage/Hero/Date/TimeSelection';
import { useSearchContext } from '@/context/SearchProvider';
import { getMinTime } from '@/utils/Functions/availabilityCommonFn';
import { combineDateTime, currentDateTime, customStyles, formatDate } from '@/utils/Functions/dateTimeCommonFn';
import { Box, Button, FormControl, IconButton, InputAdornment, Modal, OutlinedInput, useMediaQuery, useTheme } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useFormContext } from 'react-hook-form';
import { FaCalendarDay } from 'react-icons/fa';

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
}: ICustomDateTime) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { control, watch, setValue } = useFormContext();
  const defaultSelectedDates = {
    startDate: dayjs().add(1, 'day').toDate(),
    endDate: dayjs().add(3, 'day').toDate(),
    key: 'selection',
  };
  const [isPickerOpen, setPickerOpen] = useState<boolean>(false);
  const [firstTimePickerOpen, setFirstTimePickerOpen] = useState<boolean>(false);
  const [secondTimePickerOpen, setSecondTimePickerOpen] = useState<boolean>(false);
  const { searchParams, setTimeErrorText, timeErrorText } = useSearchContext();

  // To hide left side bar
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = customStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const togglePicker = () => {
    setPickerOpen(!isPickerOpen);
  };

  const handleModalClose = () => {
    setPickerOpen(false);
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

  return (
    <Box className={`${classNames ? classNames : 'grid grid-cols-1 md:grid-cols-2 gap-4'}`}>
      {classNames && <p className="p-0 m-0 font-bold text-md">{`${labelStart ?? 'Pickup'}`}</p>}
      <FormControl fullWidth sx={customSxStyles.commonBoxStyles} className="grid grid-cols-2 bg-white mx-0">
        <OutlinedInput
          disabled={disableStartDate}
          id="start-date-picker"
          className=""
          value={formatDate(selectedDates[0].startDate)}
          readOnly
          onClick={togglePicker}
          startAdornment={
            <InputAdornment position="start" className="pl-4">
              <IconButton onClick={togglePicker} edge="start" disabled={disableStartDate}>
                <FaCalendarDay />
              </IconButton>
            </InputAdornment>
          }
          sx={customSxStyles.borderLessInputStyles}
        />

        <TimeSelection
          control={control}
          registerName="startTime"
          setValue={setValue}
          timePickerOpen={firstTimePickerOpen}
          setTimePickerOpen={setFirstTimePickerOpen}
          disablePast={disableStartPastTime || false}
          defaultValue={defaultStartTime || new Date()}
          disabled={disableStartTime}
        ></TimeSelection>
      </FormControl>

      {/* Return date & time */}
      {classNames && <p className="p-0 m-0 font-bold text-md">{`${labelEnd ?? 'Return'}`}</p>}
      <FormControl fullWidth sx={customSxStyles.commonBoxStyles} variant="outlined" className="grid grid-cols-2 bg-white mx-0">
        <OutlinedInput
          id="end-date-picker"
          disabled={disableEndDate}
          value={formatDate(selectedDates[0].endDate)}
          readOnly
          // onClick={togglePicker}
          onClick={() => {
            if (!toPickerDisabled) {
              togglePicker();
            }
          }}
          startAdornment={
            <InputAdornment position="start" className="pl-4">
              <IconButton
                onClick={() => {
                  if (!toPickerDisabled) {
                    togglePicker();
                  }
                }}
                edge="start"
                disabled={disableEndDate}
              >
                <FaCalendarDay />
              </IconButton>
            </InputAdornment>
          }
          sx={customSxStyles.borderLessInputStyles}
        />

        <TimeSelection
          control={control}
          registerName="endTime"
          setValue={setValue}
          timePickerOpen={secondTimePickerOpen}
          setTimePickerOpen={setSecondTimePickerOpen}
          disablePast={false}
          disabled={disableEndTime}
          defaultValue={defaultEndTime || new Date()}
          manualOnChange={handleEndTimeChange}
          minTime={dayjs(selectedDates[0]?.startDate).isSame(dayjs(selectedDates[0]?.endDate), 'day') ? getMinTime(watch('startTime')) : undefined}
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
              onChange={handleDateChange}
              months={isSmallScreen ? 1 : 2}
              direction="horizontal"
              showMonthAndYearPickers={false}
              showDateDisplay={false}
              showMonthArrow={true}
              minDate={new Date()}
              rangeColors={['#800080']}
              disabledDates={disabledDates}
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
    </Box>
  );
};

export default CustomDateTime;
