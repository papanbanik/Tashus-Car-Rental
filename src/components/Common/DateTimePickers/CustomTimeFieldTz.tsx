import { TDate } from '@/types/commonTypes';
import { dayjsUtc, getPickerTimeLocal, getPickerTimeStringInUtc } from '@/utils/Functions/utcCommonFn';
import IconButton from '@mui/material/IconButton/IconButton';
import Popover from '@mui/material/Popover/Popover';
import { DigitalClock, LocalizationProvider, TimeField, TimeView } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs/AdapterDayjs';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useState } from 'react';
import { FiClock } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { customSxStyles } from './CustomSearchDateTimePicker';

dayjs.extend(timezone);
dayjs.extend(utc);

export interface ICustomTimeField {
  timeValue: TDate;
  handleTimeChange: (value: TDate, context?: any) => void;
  minTime?: Date;
  maxTime?: Date;
  hideButton?: boolean;
  timeStep?: number;
  shouldDisableTime?: (value: TDate, view: TimeView) => boolean;
  disabled?: boolean;
  showUtc?: boolean;
  isTimeReadOnly?: boolean;
}

export type TCustomAnchorOrigin = {
  vertical: 'bottom' | 'center' | 'top' | number;
  horizontal: 'center' | 'left' | 'right' | number;
};

const CustomTimeFieldTz = ({
  timeValue,
  handleTimeChange,
  minTime,
  maxTime,
  hideButton,
  timeStep,
  shouldDisableTime,
  disabled,
  showUtc,
  isTimeReadOnly = true,
}: ICustomTimeField) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [customAnchorOrigin, setCustomAnchorOrigin] = useState<TCustomAnchorOrigin>({
    vertical: 'bottom',
    horizontal: 'left',
  });
  const [customTransformOrigin, setCustomTransformOrigin] = useState<TCustomAnchorOrigin>({
    vertical: 'top',
    horizontal: 'left',
  });
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event: any, from: 'button' | 'field') => {
    // if (from === 'button') {
    //   setCustomAnchorOrigin({
    //     ...customAnchorOrigin,
    //     horizontal: 'right',
    //   });
    //   setCustomTransformOrigin({
    //     ...customTransformOrigin,
    //     horizontal: 'right',
    //   });
    // } else {
    //   setCustomAnchorOrigin({
    //     ...customAnchorOrigin,
    //     horizontal: 'left',
    //   });
    //   setCustomTransformOrigin({
    //     ...customTransformOrigin,
    //     horizontal: 'left',
    //   });
    // }
    if (from === 'button' || (from === 'field' && isTimeReadOnly)) {
      setCustomAnchorOrigin({
        ...customAnchorOrigin,
        horizontal: 'left',
      });
      setCustomTransformOrigin({
        ...customTransformOrigin,
        horizontal: 'left',
      });
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCurrentTimeChange = (time: any, from: 'field' | 'combo') => {
    const { formattedTimeString, formattedTimeObj } = getPickerTimeStringInUtc(time);
    // console.log({ formattedTimeString, formattedTimeObj });
    const formattedTime = getPickerTimeLocal(time);
    handleTimeChange(showUtc ? formattedTimeObj : formattedTime);
    // handleTimeChange(dayjsUtc(time).toDate());
    handleClose();
  };

  const handleCurrentTimeBlur = (time: any) => {
    const timeString = time?.target?.value;
    const timeWithDate = dayjsUtc().hour(dayjs(timeString, 'hh:mm A').hour()).minute(dayjs(timeString, 'hh:mm A').minute()).second(0).millisecond(0);
    const { formattedTimeString, formattedTimeObj } = getPickerTimeStringInUtc(timeWithDate);
    // console.log({ formattedTimeString, formattedTimeObj });
    const formattedTime = getPickerTimeLocal(timeWithDate);
    handleTimeChange(showUtc ? formattedTimeObj : formattedTime);
  };

  // if (minTime) {
  //   console.log({ timeValue, minTime });
  // }

  return (
    <div className={`flex items-center`}>
      {!hideButton && isTimeReadOnly && (
        <IconButton className="ml-1 pr-0" disabled={disabled} onClick={(event) => handleClick(event, 'button')} edge="start">
          {open ? <IoClose /> : <FiClock />}
        </IconButton>
      )}
      {/* For car listing custom availability */}
      {!hideButton && !isTimeReadOnly && (
        <IconButton
          className="ml-1 px-1 py-4 bg-gray-200 lg:w-12 w-auto rounded-l-lg rounded-r-none"
          disabled={disabled}
          onClick={(event) => handleClick(event, 'button')}
          edge="start"
        >
          {open ? <IoClose /> : <FiClock size={24} />}
        </IconButton>
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimeField
          // value={dayjs.utc('2022-04-17T15:30:00Z')}
          value={showUtc ? dayjs.utc(timeValue) : dayjs(timeValue)}
          readOnly={isTimeReadOnly}
          onClick={(event) => handleClick(event, 'field')}
          // onChange={(time) => handleCurrentTimeChange(time, 'field')}
          format="hh:mm A"
          // format="hh:mm a"
          sx={!hideButton && isTimeReadOnly ? customSxStyles.borderLessInputStyles : {}}
          disabled={disabled}
          onBlur={!isTimeReadOnly ? (time) => handleCurrentTimeBlur(time) : undefined}

          // timezone={carTimeZone}
        />
      </LocalizationProvider>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        // style={popoverStyle}
        anchorOrigin={customAnchorOrigin}
        transformOrigin={customTransformOrigin}
      >
        {open && (
          <div className="flex gap-4 bg-neutral p-2">
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DigitalClock
                onChange={(time) => handleCurrentTimeChange(time, 'combo')}
                value={showUtc ? dayjs.utc(timeValue) : dayjs(timeValue)}
                skipDisabled
                minTime={minTime && (showUtc ? dayjs.utc(minTime) : dayjs(minTime))}
                // maxTime={dayjs.utc(maxTime)}
                timeStep={timeStep || 15}
                shouldDisableTime={shouldDisableTime}
                disabled={disabled}
                // timezone={'utc'}
              />
            </LocalizationProvider>
          </div>
        )}
      </Popover>
    </div>
  );
};

export default CustomTimeFieldTz;
