'use client';
import { useSearchContext } from '@/context/SearchProvider';
import { TDate } from '@/types/commonTypes';
import { PickupReturnProps } from '@/types/componentTypes';
import {
  getCommonMinimumStartTime,
  handleCommonEndDateField,
  handleCommonEndTime,
  handleCommonStartDateField,
  handleCommonStartTime,
} from '@/utils/Functions/createEditTravelCommonFn';
import { customStyles, getDefaultPickupTime, getDefaultReturnTime, getMinimumEndDate, isValidDate } from '@/utils/Functions/dateTimeCommonFn';
import { getPickerDateUtc } from '@/utils/Functions/utcCommonFn';
import { Box, FormControl } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import CustomDateFieldTz from './CustomDateFieldTz';
import { TSelectedDates } from './CustomDateTime';
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

const CustomSearchDateTimePickerTz = ({
  setValue,
  register,
  watch,
  control,
  classNames,
  disableBlockDates,
  showUtc,
  pickupLabel,
  returnLabel,
}: PickupReturnProps) => {
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
  const [selectedDates, setSelectedDates] = useState<[TSelectedDates]>([defaultSelectedDates]);
  const [minEndDate, setMinEndTime] = useState<Date | undefined>(undefined);
  const mainBoxRef = useRef<HTMLDivElement | null>(null);

  const { searchParams } = useSearchContext();

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

  // 1: set date values when date picker changes
  useEffect(() => {
    setValue('startDate', selectedDates[0].startDate, { shouldValidate: true });
    setValue('endDate', selectedDates[0].endDate, { shouldValidate: true });
  }, [selectedDates]);

  // 2: Any date time changes, update minimum end time
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

  // For search and vehicle details page, not for landing
  useEffect(() => {
    if (searchParams?.pickup && searchParams?.return) {
      // console.log(searchParams?.pickup, new Date(searchParams?.pickup));
      // console.log(searchParams?.return, new Date(searchParams?.return));
      const tempSelection = {
        startDate: getPickerDateUtc(searchParams?.pickup),
        endDate: getPickerDateUtc(searchParams?.return),
        key: 'selection',
      };
      // const tempSelection = {
      //   startDate: new Date(searchParams?.pickup),
      //   endDate: new Date(searchParams?.return),
      //   key: 'selection',
      // };
      setSelectedDates([tempSelection]);
    } else {
      setSelectedDates([defaultSelectedDates]);
    }
  }, [searchParams]);

  // For hero section, time will come as local, for others it will be utc
  const handleStartTime = (startTime: TDate, context: any) => {
    handleCommonStartTime({
      selectedDates,
      setSelectedDates,
      startDate: watch('startDate'),
      startTime,
      endDate: watch('endDate'),
      endTime: watch('endTime'),
      setValue,
    });
  };

  const handleEndTime = (endTime: TDate, context: any) => {
    // console.log(endTime);
    // setValue('endTime', endTime);
    handleCommonEndTime(endTime, setValue);
  };

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
    });
  };

  const handleEndDateChange = (ranges: any) => {
    handleEndDateField(ranges.selection.endDate);
  };

  const handleEndDateField = (endDate: any) => {
    handleCommonEndDateField({
      selectedDates,
      setSelectedDates,
      startDate: watch('startDate'),
      startTime: watch('startTime'),
      endDate,
      endTime: watch('endTime'),
      setValue,
    });
  };

  return (
    // <Box display="flex" flexDirection="row" justifyContent="space-between" className="">
    <div>
      <Box className={`${classNames ? classNames : 'lg:flex gap-3'} w-full `}>
        {!!pickupLabel && <p className="p-0 m-0 font-bold text-md">{pickupLabel}</p>}
        <FormControl
          fullWidth
          sx={customSxStyles.commonBoxStyles}
          variant="outlined"
          className={`${classNames ? 'w-full' : 'lg:w-1/2'} grid grid-cols-2 bg-white mx-0 relative`}
        >
          <div className="col-span-1">
            <CustomDateFieldTz
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
            ></CustomDateFieldTz>
            {/* <CustomDateField
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
            ></CustomDateField> */}
          </div>
          <div className="col-span-1">
            <CustomTimeFieldTz
              timeValue={watch('startTime')}
              minTime={getCommonMinimumStartTime(watch('startDate'), 15)} //set picker start time
              handleTimeChange={handleStartTime}
              showUtc={showUtc}
            ></CustomTimeFieldTz>
          </div>
        </FormControl>

        {/* to date & time */}
        {!!returnLabel && <p className="p-0 m-0 font-bold text-md">{returnLabel}</p>}
        <FormControl
          fullWidth
          sx={customSxStyles.commonBoxStyles}
          variant="outlined"
          className={`${classNames ? 'w-full' : 'lg:w-1/2'} grid grid-cols-2 bg-white mx-0`}
        >
          <div className="col-span-1">
            <CustomDateFieldTz
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
            ></CustomDateFieldTz>
          </div>

          <div className="col-span-1">
            <CustomTimeFieldTz
              timeValue={watch('endTime')}
              minTime={minEndDate}
              handleTimeChange={handleEndTime}
              showUtc={showUtc}
            ></CustomTimeFieldTz>
          </div>
        </FormControl>
      </Box>
    </div>
  );
};

export default CustomSearchDateTimePickerTz;
