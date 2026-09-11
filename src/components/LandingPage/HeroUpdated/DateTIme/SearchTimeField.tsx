import { TDate } from '@/types/commonTypes';
import { customSxStyles } from '@/utils/Functions/commonStyleFn';
import { getPickerTimeLocal, getPickerTimeStringInUtc } from '@/utils/Functions/utcCommonFn';
import IconButton from '@mui/material/IconButton/IconButton';
import Popover from '@mui/material/Popover/Popover';
import { DigitalClock, LocalizationProvider, TimeField, TimeView } from '@mui/x-date-pickers';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns/AdapterDateFns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useState } from 'react';
import { FiClock } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

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
  label?: string;
  showUtc?: boolean;
}

export type TCustomAnchorOrigin = {
  vertical: 'bottom' | 'center' | 'top' | number;
  horizontal: 'center' | 'left' | 'right' | number;
};

const SearchTimeField = ({
  timeValue,
  handleTimeChange,
  minTime,
  maxTime,
  hideButton,
  timeStep,
  shouldDisableTime,
  disabled,
  label,
  showUtc,
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

  const handleClick = (event: any, from: string) => {
    setCustomAnchorOrigin({
      ...customAnchorOrigin,
      horizontal: 'left',
    });
    setCustomTransformOrigin({
      ...customTransformOrigin,
      horizontal: 'left',
    });

    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleCurrentTimeChange = (time: any) => {
  //   handleTimeChange(time);
  //   handleClose();
  // };

  const handleCurrentTimeChange = (time: any) => {
    const { formattedTimeObj } = getPickerTimeStringInUtc(time);
    const formattedTime = getPickerTimeLocal(time);
    handleTimeChange(showUtc ? formattedTimeObj : formattedTime);
    handleClose();
  };

  const renderTimeField = () => {
    if (showUtc) {
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimeField
            value={dayjs.utc(timeValue)}
            readOnly
            onClick={(event) => handleClick(event, 'field')}
            // onChange={handleCurrentTimeChange}
            format="hh:mm a"
            sx={customSxStyles.customDateTimeInputSx}
            disabled={disabled}
            className="pl-0 pt-0"
            label={label}
          />
        </LocalizationProvider>
      );
    } else {
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <TimeField
            value={dayjs(timeValue).toDate()}
            readOnly
            onClick={(event) => handleClick(event, 'field')}
            // onChange={handleCurrentTimeChange}
            format="hh:mm a"
            sx={customSxStyles.customDateTimeInputSx}
            disabled={disabled}
            className="pl-0 pt-0"
            label={label}
          />
        </LocalizationProvider>
      );
    }
  };

  const renderDigitalClock = () => {
    if (showUtc) {
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DigitalClock
            onChange={handleCurrentTimeChange}
            value={dayjs.utc(timeValue)}
            skipDisabled
            minTime={minTime && dayjs.utc(minTime)}
            maxTime={maxTime && dayjs.utc(maxTime)}
            timeStep={timeStep || 15}
            shouldDisableTime={shouldDisableTime}
            disabled={disabled}
          />
        </LocalizationProvider>
      );
    } else {
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DigitalClock
            onChange={handleCurrentTimeChange}
            value={dayjs(timeValue).toDate()}
            skipDisabled
            minTime={minTime}
            maxTime={maxTime}
            timeStep={timeStep || 15}
            shouldDisableTime={shouldDisableTime}
            disabled={disabled}
          />
        </LocalizationProvider>
      );
    }
  };

  return (
    <div className="flex justify-start items-center">
      {!hideButton && (
        <IconButton className="ml-1 pr-0" disabled={disabled} onClick={(event) => handleClick(event, 'button')} edge="start">
          {open ? <IoClose /> : <FiClock />}
        </IconButton>
      )}
      {renderTimeField()}

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        // style={popoverStyle}
        anchorOrigin={customAnchorOrigin}
        transformOrigin={customTransformOrigin}
      >
        {open && <div className="flex gap-4 bg-neutral p-2">{renderDigitalClock()}</div>}
      </Popover>
    </div>
  );
};

export default SearchTimeField;
