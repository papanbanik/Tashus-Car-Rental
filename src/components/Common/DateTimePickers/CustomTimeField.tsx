import { TDate } from '@/types/commonTypes';
import IconButton from '@mui/material/IconButton/IconButton';
import Popover from '@mui/material/Popover/Popover';
import { DigitalClock, LocalizationProvider, TimeField, TimeView } from '@mui/x-date-pickers';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns/AdapterDateFns';
import dayjs from 'dayjs';
import { useState } from 'react';
import { FiClock } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { customSxStyles } from './CustomSearchDateTimePicker';

export interface ICustomTimeField {
  timeValue: TDate;
  handleTimeChange: (value: TDate, context?: any) => void;
  minTime?: Date;
  maxTime?: Date;
  hideButton?: boolean;
  timeStep?: number;
  shouldDisableTime?: (value: TDate, view: TimeView) => boolean;
  disabled?: boolean;
}

export type TCustomAnchorOrigin = {
  vertical: 'bottom' | 'center' | 'top' | number;
  horizontal: 'center' | 'left' | 'right' | number;
};

const CustomTimeField = ({ timeValue, handleTimeChange, minTime, maxTime, hideButton, timeStep, shouldDisableTime, disabled }: ICustomTimeField) => {
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

  const handleCurrentTimeChange = (time: any) => {
    handleTimeChange(time);
    handleClose();
  };

  return (
    <div className="flex justify-start items-center">
      {!hideButton && (
        <IconButton className="ml-1 pr-0" disabled={disabled} onClick={(event) => handleClick(event, 'button')} edge="start">
          {open ? <IoClose /> : <FiClock />}
        </IconButton>
      )}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimeField
          value={dayjs(timeValue).toDate()}
          readOnly
          onClick={(event) => handleClick(event, 'field')}
          // onChange={handleCurrentTimeChange}
          format="hh:mm a"
          sx={!hideButton ? customSxStyles.borderLessInputStyles : {}}
          disabled={disabled}
          className="pl-0"
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
          </div>
        )}
      </Popover>
    </div>
  );
};

export default CustomTimeField;
