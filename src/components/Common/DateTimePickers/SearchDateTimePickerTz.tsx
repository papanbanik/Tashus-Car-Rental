'use client';
import SearchDateField from '@/components/LandingPage/HeroUpdated/DateTIme/SearchDateField';
import SearchTimeField from '@/components/LandingPage/HeroUpdated/DateTIme/SearchTimeField';
import { useSearchContext } from '@/context/SearchProvider';
import { TDate } from '@/types/commonTypes';
import { PickupReturnProps } from '@/types/componentTypes';
import { customHeroFormSxStyles } from '@/utils/Functions/commonStyleFn';
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
import { useEffect, useState } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { FaGripLinesVertical } from 'react-icons/fa';
import { TSelectedDates } from './CustomDateTime';
const SearchDateTimePickerTz = ({ setValue, watch, disableBlockDates, showUtc }: PickupReturnProps) => {
  const defaultSelectedDates = {
    startDate: getDefaultPickupTime(),
    endDate: getDefaultReturnTime(),
    key: 'selection',
  };
  const [selectedDates, setSelectedDates] = useState<[TSelectedDates]>([defaultSelectedDates]);
  const [minEndDate, setMinEndTime] = useState<Date | undefined>(undefined);

  const { searchParams } = useSearchContext();

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
      const tempSelection = {
        startDate: getPickerDateUtc(searchParams?.pickup),
        endDate: getPickerDateUtc(searchParams?.return),
        key: 'selection',
      };
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
              showUtc={showUtc}
            />
          </div>
          <div className="-translate-y-9">
            <Box sx={customHeroFormSxStyles.divider} />
          </div>
          <div>
            <SearchTimeField
              timeValue={watch('startTime')}
              minTime={getCommonMinimumStartTime(watch('startDate'), 15)} //set picker start time
              handleTimeChange={handleStartTime}
              hideButton={true}
              label="Travel Start Hour"
              showUtc={showUtc}
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
            showUtc={showUtc}
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
              showUtc={showUtc}
            />
          </div>
        </div>
      </FormControl>
    </div>
  );
};

export default SearchDateTimePickerTz;
