'use client';
import { useSearchContext } from '@/context/SearchProvider';
import { TDate } from '@/types/commonTypes';
import { PickupReturnProps } from '@/types/componentTypes';
import { customHeroFormSxStyles } from '@/utils/Functions/commonStyleFn';
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
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { FaGripLinesVertical } from 'react-icons/fa';
import SearchDateField from './SearchDateField';
import SearchTimeField from './SearchTimeField';
const SearchDateTimePicker = ({ setValue, register, watch, control, classNames, disableBlockDates }: PickupReturnProps) => {
  const defaultSelectedDates = {
    startDate: getDefaultPickupTime(),
    endDate: getDefaultReturnTime(),
    key: 'selection',
  };
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [selectedDates, setSelectedDates] = useState([defaultSelectedDates]);
  const [minEndDate, setMinEndTime] = useState<Date | undefined>(undefined);
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
      const validDate = getRoundUpStartTime(15).second(0).millisecond(0).toDate(); //set field start time
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
  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center justify-center rounded-md">
      <FormControl fullWidth className=" rounded-md flex items-center justify-center" sx={customHeroFormSxStyles.commonBoxStyles}>
        <div className="flex items-center justify-center translate-y-3">
          <div>
            <SearchDateField
              label="Travel Start Date"
              selectedDates={selectedDates}
              handleDateChange={handleStartDateChange}
              disableBlockDates={disableBlockDates}
              dateValue={selectedDates[0].startDate}
              format="d MMM yy"
              hideButton={true}
            />
          </div>
          <div className="-translate-y-9">
            <Box sx={customHeroFormSxStyles.divider} />
          </div>
          <div>
            <SearchTimeField
              timeValue={watch('startTime')}
              minTime={isSameDay(selectedDates[0]?.startDate, currentDateTime) ? getRoundUpStartTime(15).toDate() : undefined} //set picker start time
              handleTimeChange={handleStartTime}
              hideButton={true}
              label="Travel Start Hour"
            />
          </div>
        </div>
      </FormControl>
      <div className="hidden lg:flex items-center justify-center h-full px-0">
        {/* <Image src="/icons/Vector.png" alt="Icon" width={26} height={20} /> */}
        <FaGripLinesVertical width={26} height={20} />
      </div>
      <FormControl fullWidth variant="outlined" className="bg-white rounded-md" sx={customHeroFormSxStyles.commonBoxStyles}>
        <div className="flex items-center justify-center translate-y-3">
          <SearchDateField
            label="Travel End Date"
            handleDateChange={handleEndDateChange}
            selectedDates={selectedDates}
            disableBlockDates={disableBlockDates}
            dateValue={selectedDates[0].endDate}
            format="d MMM yy"
            hideButton={true}
            isReturnDate={true}
          />
          <div className="-translate-y-9">
            <Box sx={customHeroFormSxStyles.divider} />
          </div>
          <div>
            <SearchTimeField
              label="Travel End Hour"
              timeValue={watch('endTime')}
              minTime={minEndDate}
              handleTimeChange={handleEndTime}
              hideButton={true}
            />
          </div>
        </div>
      </FormControl>
    </div>
  );
};

export default SearchDateTimePicker;
